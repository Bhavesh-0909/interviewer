import { db } from './db.js';
import { problems } from './schema.js';
import {tool} from '@langchain/core/tools';

export const getDSAProblem = tool({
  name: "getDSAProblem",
  description: "Fetch a new DSA coding interview problem",
  func: async () => {
    const results = await db.select().from(problems).then(rows => rows[Math.floor(Math.random() * rows.length)]);
    return results;
  },
});