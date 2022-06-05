import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const README = resolve(__dirname, './homepage.html')

export function homepage(req, res) {
  res.sendFile(README)
};
