import { db } from "./db.js";
import { problems } from "./schema.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const getDSAProblem = tool(
  async () => {
    const rows = await db.select().from(problems);
    return rows[Math.floor(Math.random() * rows.length)];
  },
  {
    name: "getDSAProblem",
    description: "Fetch a random DSA coding interview problem from the database",
    schema: z.object({}),  
  }
);