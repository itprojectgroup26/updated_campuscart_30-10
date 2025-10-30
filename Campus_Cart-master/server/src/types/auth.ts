import { z } from "zod";

// Email pattern: allow either a my.richfield.ac.za address or gmail.com
const emailPattern = /^[^\s@]+@(my\.richfield\.ac\.za|gmail\.com)$/i;

// Password pattern: at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and 6-10 characters long
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;

export const Signup = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid @my.richfield.ac.za or @gmail.com email" })
    .regex(emailPattern, {
      message: "Email must be a valid @my.richfield.ac.za or @gmail.com address",
    }),
  name: z
    .string()
    .min(5, { message: "Name must be minimum 5 characters long" }),
  // Combine password checks into one refine so validation reports a single clear message
  password: z
    .string()
    .refine(
      (val) => {
        if (typeof val !== "string") return false;
        if (val.length < 6 || val.length > 10) return false;
        return passwordPattern.test(val);
      },
      {
        message:
          "Password must be 6–10 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }
    ),
  college: z
    .string()
    .min(5, { message: "College name must be minimum 5 characters long" }),
  phoneNo: z.coerce.string().refine((val) => /^\d{10}$/.test(val), {
    message: "Phone no. must be exactly 10 digits and contain only numbers",
  }),
  image: z.string(),
});

export const Login = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid @my.richfield.ac.za or @gmail.com email" })
    .regex(emailPattern, {
      message: "Email must be a valid @my.richfield.ac.za or @gmail.com address",
    }),
  password: z.string(),
});
