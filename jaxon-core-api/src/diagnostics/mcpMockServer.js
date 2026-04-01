import http from 'http';
const port = Number(process.env.MCP_MOCK_PORT || 9000);
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/mcp/predict') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                prediction: 'PREVENTIVE',
                confidence: 0.75,
                recommendedDate: null,
            }));
        });
        return;
    }
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', service: 'mcp-mock' }));
        return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
});
server.listen(port, () => {
    console.log(`[MCP MOCK] listening on http://localhost:${port}`);
});
//# sourceMappingURL=mcpMockServer.js.map