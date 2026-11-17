import {createServer} from 'node:http';
const port = Number(process.env.PORT ?? 3000);
createServer((req, res) => {
  res.writeHead(req.url === '/health' ? 200 : 404, {'content-type': 'application/json'});
  res.end(JSON.stringify(req.url === '/health' ? {status: 'UP'} : {error: 'NOT_FOUND'}));
}).listen(port, '0.0.0.0', () => console.log('API didática pronta na porta ' + port));
