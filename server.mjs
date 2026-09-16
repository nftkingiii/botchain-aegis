import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.json':'application/json; charset=utf-8', '.woff2':'font/woff2' };
export function createAppServer({ staticRoot = root, revision = process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GIT_COMMIT || 'local' } = {}) {
  const base = resolve(staticRoot);
  return createServer(async (request, response) => {
    const headers = { 'x-content-type-options':'nosniff', 'x-frame-options':'DENY', 'referrer-policy':'strict-origin-when-cross-origin', 'permissions-policy':'camera=(), microphone=(), geolocation=()', 'content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://rpc.bohr.life; frame-ancestors 'none'; base-uri 'self'" };
    const send = (status, type, body) => { response.writeHead(status, { ...headers, 'content-type':type, 'cache-control':'no-store' }); response.end(body); };
    let url;
    try { url = new URL(request.url, 'http://localhost'); } catch { return send(400, 'application/json', '{"error":"invalid_url"}'); }
    if (request.method !== 'GET' && request.method !== 'HEAD') return send(405, 'application/json', '{"error":"method_not_allowed"}');
    if (url.pathname === '/healthz') return send(200, 'application/json; charset=utf-8', JSON.stringify({ ok:true, app:'aegis', revision }));
    let decoded;
    try { decoded = decodeURIComponent(url.pathname); } catch { return send(400, 'application/json', '{"error":"invalid_path"}'); }
    const candidate = resolve(base, `.${decoded}`);
    if (candidate !== base && !candidate.startsWith(base + sep)) return send(400, 'application/json', '{"error":"invalid_path"}');
    let file = candidate;
    try {
      const data = await readFile(file);
      return send(200, types[extname(file)] || 'application/octet-stream', request.method === 'HEAD' ? '' : data);
    } catch { /* History routes intentionally resolve to the app shell. */ }
    if (!extname(decoded) || decoded.endsWith('/')) {
      try { const data = await readFile(resolve(base, 'index.html')); return send(200, types['.html'], request.method === 'HEAD' ? '' : data); }
      catch { return send(503, 'application/json; charset=utf-8', '{"error":"build_not_found","hint":"Run npm run build before npm start."}'); }
    }
    send(404, 'application/json; charset=utf-8', '{"error":"not_found"}');
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number.parseInt(process.env.PORT || '4314', 10);
  createAppServer().listen(port, '0.0.0.0', () => process.stdout.write(`Aegis listening on 0.0.0.0:${port}\n`));
}
