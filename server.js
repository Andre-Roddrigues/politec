const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Define custom routes here
  server.get('/custom-route', (req, res) => {
    return res.send('This is a custom route!');
  });

  // Handle all other routes with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3003, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3003');
  });
});
