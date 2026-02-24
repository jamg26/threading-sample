const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

function sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {
        // Busy wait to block the event loop
    }
}

const server = http.createServer((req, res) => {
    // Log incoming requests
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else if (req.url === '/blocking') {
        console.log('Starting blocking operation...');
        sleep(10000); // Blocks the event loop for 10 seconds
        console.log('Blocking operation finished.');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Blocking operation complete');
    } else if (req.url === '/non-blocking') {
        console.log('Starting non-blocking operation...');
        setTimeout(() => {
            console.log('Non-blocking operation finished.');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Non-blocking operation complete');
        }, 10000); // Does NOT block the event loop
    } else if (req.url === '/ping') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Pong');
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
