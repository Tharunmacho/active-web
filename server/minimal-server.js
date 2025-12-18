import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Test works!' });
});

app.get('/api/health', (req, res) => {
    console.log('Health endpoint hit');
    res.json({ success: true, message: 'Server running' });
});

console.log('About to call app.listen...');
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Minimal server running on port ${PORT}`);
    console.log(`Server address:`, server.address());
    console.log(`Try: http://localhost:${PORT}/test`);
});

server.on('error', (err) => {
    console.error('❌ Server error:', err);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
});

setInterval(() => {
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] Server alive, listening: ${server.listening}`);
}, 10000);
