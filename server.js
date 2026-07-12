const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    // TODO: Replace this stub with your real authentication backend.
    const payload = await parseJsonBody(req).catch(() => ({}));
    sendJson(res, 200, {
      ok: true,
      message: 'Login endpoint received your request. Connect your real backend here.',
      received: payload,
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    // TODO: Replace this stub with your real registration backend.
    const payload = await parseJsonBody(req).catch(() => ({}));
    sendJson(res, 200, {
      ok: true,
      message: 'Registration endpoint received your request. Connect your real backend here.',
      received: payload,
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/forgot-password') {
    // TODO: Replace this stub with your real password reset backend.
    const payload = await parseJsonBody(req).catch(() => ({}));
    sendJson(res, 200, {
      ok: true,
      message: 'Password reset endpoint received your request. Connect your real backend here.',
      received: payload,
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/google') {
    // TODO: Replace this stub with your Google OAuth flow integration.
    sendJson(res, 200, {
      ok: true,
      message: 'Google OAuth route is ready for backend wiring.',
    });
    return;
  }

  // Serve static files.
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const safePath = path.normalize(requestedPath).replace(/^\/+/, '');
  const filePath = path.join(rootDir, safePath);

  if (filePath.startsWith(rootDir) && fs.existsSync(filePath)) {
    serveFile(res, filePath);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(port, () => {
  console.log(`Carzzy Apps local server running at http://localhost:${port}`);
});
