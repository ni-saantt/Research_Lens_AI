/**
 * ResearchLens AI - Full-Stack Server Entry Point
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Runs on Port 3000 as required by the runtime environment.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response } from 'express';
import { app } from './src/serverApp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ResearchLens AI Engine] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[ResearchLens AI Engine] Developer: Nishant Choudhary`);
  });
}

startServer().catch((err) => {
  console.error('[ResearchLens AI Engine] Server start failure:', err);
});
