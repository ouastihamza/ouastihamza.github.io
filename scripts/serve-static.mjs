import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../out/', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.pdf':'application/pdf', '.xml':'application/xml', '.txt':'text/plain', '.woff2':'font/woff2' };
createServer(async (req, res) => {
 try {
  const url = new URL(req.url, 'http://127.0.0.1');
  let path = resolve(root, '.' + decodeURIComponent(url.pathname));
  if (path !== resolve(root) && !path.startsWith(resolve(root) + sep)) { res.writeHead(403).end(); return; }
  const info = await stat(path);
  if (info.isDirectory()) {
   if (!url.pathname.endsWith('/')) { res.writeHead(301, { Location: url.pathname + '/' + url.search }).end(); return; }
   path = resolve(path, 'index.html');
  }
  const data = await readFile(path);
  res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }); res.end(data);
 } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('Static preview: http://127.0.0.1:' + (process.env.PORT || 4173)));
