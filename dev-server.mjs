import { createServer } from 'vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = parseInt(process.env.PORT || '5173');

const server = await createServer({
  root: __dirname,
  server: {
    host: true,
    port,
    strictPort: false,
  },
});

await server.listen();
server.printUrls();
