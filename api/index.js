import app from '../backend/app.js';
import { connectDb } from '../backend/db.js';

export default async function handler(req, res) {
  await connectDb();
  return app(req, res);
}
