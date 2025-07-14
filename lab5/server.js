const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const todosFile = path.join(__dirname, 'todos.json');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/todos') {
      fs.readFile(todosFile, 'utf8', (err, data) => {
        if (err) return res.end('[]');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data || '[]');
      });
    } else {
      // Serve static files
      const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'text/plain';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    }
  } else if (req.method === 'POST' && req.url === '/todos') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
  fs.writeFile(todosFile, JSON.stringify(JSON.parse(body), null, 2), 'utf8', err => {

        if (err) {
          res.writeHead(500);
          res.end('Error saving todos');
        } else {
          res.writeHead(200);
          res.end('Saved');
        }
      });
    });
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
