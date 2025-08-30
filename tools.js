import { db } from './db.js';
import { problems } from './schema.js';

export const getDSAProblem = async () => {
  const results = await db.select().from(problems).then(rows => rows[Math.floor(Math.random() * rows.length)]);
  return results;
};