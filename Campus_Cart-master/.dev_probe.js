(async ()=>{
  try{
    const urls = [
      'http://localhost:3002/login',
      'http://127.0.0.1:3002/login',
      'http://localhost:3002/signup',
      'http://127.0.0.1:3002/signup',
      'http://localhost:4010/',
    ];
    for (const u of urls){
      try{
        const res = await fetch(u, { cache: 'no-store' });
        console.log('\nURL:', u, 'STATUS', res.status);
        const text = await res.text();
        console.log('SNIPPET:\n', text.slice(0,800));
      }catch(e){
        console.error('\nURL:', u, 'ERROR', e && e.message ? e.message : e);
      }
    }
  }catch(e){
    console.error('FAILED',e && e.message ? e.message : e);
  }
})();
