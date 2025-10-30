import "dotenv/config";
const REDIS_URL = process.env.REDIS_URL as string | undefined;

import Redis from "ioredis";
import type { WebSocket } from "ws";
import { db } from "../utils/db";

// If REDIS_URL is missing (e.g. local dev without Docker), provide a lightweight
// in-memory fallback so the server can run without a Redis instance.
class InMemoryRedis {
  private set = new Set<string>();
  private messageHandlers: Array<(channel: string, message: string) => void> = [];

  async sadd(_key: string, member: string) {
    this.set.add(member);
    return 1;
  }

  async srem(_key: string, member: string) {
    this.set.delete(member);
    return 1;
  }

  async sismember(_key: string, member: string) {
    return this.set.has(member) ? 1 : 0;
  }

  duplicate() {
    return this;
  }

  // channel subscribe no-op for compatibility
  subscribe(_channel: string) {
    return Promise.resolve();
  }

  on(event: string, handler: any) {
    if (event === "message") {
      this.messageHandlers.push(handler);
    }
  }

  publish(channel: string, message: string) {
    // deliver to registered handlers synchronously to emulate Redis pub/sub
    for (const h of this.messageHandlers) {
      try {
        h(channel, message);
      } catch (e) {
        // swallow handler errors to avoid crashing
        // eslint-disable-next-line no-console
        console.error("InMemoryRedis handler error:", e);
      }
    }
    return Promise.resolve(1);
  }
}

const redisClient: any = REDIS_URL ? new Redis(REDIS_URL) : new InMemoryRedis();
const redisPub: any = redisClient.duplicate();
const redisSub: any = redisClient.duplicate();

interface Message {
  type: string;
  chatId: string;
  receiverId: string;
  userId: string;
  text: string;
}

const localOnlineUsers: { [userId: string]: WebSocket } = {};

redisSub.subscribe("chat-messages");

redisSub.on("message", (channel: string, message: string) => {
  if (channel === "chat-messages") {
    const parsedMessage = JSON.parse(message);
    const rSocket = localOnlineUsers[parsedMessage.receiverId];

    console.log(rSocket);
    if (rSocket) {
      rSocket.send(
        JSON.stringify({
          event: "new_message",
          newMessage: parsedMessage.newMessage,
        })
      );
    }
  }
});

export class UserManager {
  constructor(userId: string, socket: WebSocket) {
    localOnlineUsers[userId] = socket;
    redisClient.sadd("online-users", userId);

    socket.on("close", async () => {
      delete localOnlineUsers[userId];
      await redisClient.srem("online-users", userId);
    });
  }

  async removeUser(userId: string) {
    delete localOnlineUsers[userId];
    await redisClient.srem("online-users", userId);
  }

  async isUserOnline(userId: string) {
    const result = (await redisClient.sismember("online-users", userId)) === 1;
    return result;
  }

  async sendMessage(message: Message) {
    const newMessage = await db.message.create({
      data: {
        type: "TEXT",
        chatId: message.chatId,
        senderId: message.userId,
        text: message.text,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (localOnlineUsers[message.userId]) {
      localOnlineUsers[message.userId].send(
        JSON.stringify({ event: "new_message", newMessage })
      );
    }

    const isReceiverOnline = await this.isUserOnline(message.receiverId);
    if (isReceiverOnline) {
      redisPub.publish(
        "chat-messages",
        JSON.stringify({
          receiverId: message.receiverId,
          userId: message.userId,
          newMessage,
        })
      );
    }
  }
}
