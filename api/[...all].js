const brain = require('../lib/orbiex-brain');

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
      if (body.length > 1e6) req.destroy();
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

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  let reqPath = req.url.split('?')[0];

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
};
