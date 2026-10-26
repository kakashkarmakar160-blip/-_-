// Node.js/Express server scaffold. Set secrets in hosting environment, never in client files.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req,res) => res.json({ ok:true, service:'durga-samiti' }));
app.use(express.static(path.resolve(__dirname, '..')));
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Durga Samiti server listening on ${port}`));
