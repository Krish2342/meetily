const http = require('http');

const url = 'http://127.0.0.1:3118/';

function checkAndFetch() {
  http.get(url, (res) => {
    console.log(`[Precompile] Successfully triggered Next.js compilation: Status ${res.statusCode}`);
  }).on('error', (err) => {
    // Port not open yet, retry in 1 second
    setTimeout(checkAndFetch, 1000);
  });
}

console.log('[Precompile] Waiting for Next.js dev server on port 3118...');
setTimeout(checkAndFetch, 1000);
