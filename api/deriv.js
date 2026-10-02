export default async function handler(req, res) {
  const token = req.query.token;
  if(!token) return res.status(400).json({error:'no token'});
  const WebSocket = (await import('ws')).default;
  const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
  ws.on('open', ()=> ws.send(JSON.stringify({authorize: token})));
  ws.on('message', (data)=>{
    const d = JSON.parse(data);
    if(d.msg_type==='authorize' && !d.error){
      ws.send(JSON.stringify({balance:1}));
    }
    if(d.balance){
      res.json({ok:true, balance:d.balance.balance});
      ws.close();
    }
    if(d.error){
      res.json({ok:false, error:d.error.message});
      ws.close();
    }
  });
  ws.on('error', (e)=> res.json({ok:false, error:e.message}));
}
