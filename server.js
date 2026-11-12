const http = require('http');
const fs = require('fs');
const path = require('path');
const brain = require('./lib/orbiex-brain');

const PORT = process.env.PORT || 3333;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(JSON.stringify(data));
}

function parseJSONBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Limite de segurança: 1MB
      if (body.length > 1e6) {
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];

  // =========================================================================
  // API ROUTES (Backend Inteligente Orbiex AI + Gemini)
  // =========================================================================
  if (reqPath.startsWith('/api/')) {
    if (reqPath === '/api/status' && req.method === 'GET') {
      return sendJSON(res, 200, brain.getSystemStatus());
    }

    if (reqPath === '/api/chat' && req.method === 'POST') {
      const payload = await parseJSONBody(req);
      const message = payload.message || payload.prompt || '';
      const history = payload.history || [];
      const reply = await brain.chat(message, history);
      return sendJSON(res, 200, reply);
    }

    if (reqPath === '/api/scanner' && req.method === 'POST') {
      const payload = await parseJSONBody(req);
      const niche = payload.niche || payload.product || 'TikTok Shop Geral';
      const scanResult = await brain.scanProduct(niche);
      return sendJSON(res, 200, scanResult);
    }

    if ((reqPath === '/api/faceless' || reqPath === '/api/sem-aparecer') && req.method === 'POST') {
      const payload = await parseJSONBody(req);
      const product = payload.product || 'Mini Selador Térmico';
      const format = payload.format || 'pov_hands';
      const facelessResult = await brain.generateFacelessScript(product, format);
      return sendJSON(res, 200, facelessResult);
    }

    if (reqPath === '/api/audit-shop' && req.method === 'POST') {
      const payload = await parseJSONBody(req);
      const auditResult = brain.auditShop(payload);
      return sendJSON(res, 200, auditResult);
    }

    if (reqPath === '/api/appeal' && req.method === 'POST') {
      const payload = await parseJSONBody(req);
      const type = payload.type || payload.violationType || 'Misleading Content';
      const details = payload.details || '';
      const appealResult = brain.appealViolation(type, details);
      return sendJSON(res, 200, appealResult);
    }

    if (reqPath === '/api/affiliate' && req.method === 'POST') {
      const payload = await parseJSONBody(req);
      const product = payload.product || 'Produto Vencedor';
      const commission = payload.commission || '20%';
      const pitchResult = brain.affiliatePitch(product, commission);
      return sendJSON(res, 200, pitchResult);
    }

    if (reqPath === '/api/modelagem' && req.method === 'POST') {
      const payload = await parseJSONBody(req);
      const target = payload.competitor || payload.target || 'Concorrente em alta';
      const modelResult = await brain.modelCompetitor(target);
      return sendJSON(res, 200, modelResult);
    }

    if (reqPath === '/api/hooks' && req.method === 'POST') {
      const payload = await parseJSONBody(req);
      const product = payload.product || 'Produto Selecionado';
      const hookResult = await brain.generateHooks(product);
      return sendJSON(res, 200, hookResult);
    }

    return sendJSON(res, 404, { error: 'Endpoint não encontrado', path: reqPath });
  }

  // =========================================================================
  // STATIC FILES SERVING
  // =========================================================================
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Sanitize path to prevent directory traversal
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found: ' + reqPath);
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';
    if (filePath.includes("pega.webp") || filePath.includes("salve4.webp") || filePath.includes("salve3.webp") || filePath.includes("cooud-app-screen-lossless.webp")) {
      contentType = 'image/jpeg';
    }

    // Support range requests for video streaming
    const range = req.headers.range;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      file.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': fileSize,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Orbiex AI Backend Core ativo em http://localhost:${PORT}`);
  console.log(`Modo: ${brain.getSystemStatus().mode}`);
});
