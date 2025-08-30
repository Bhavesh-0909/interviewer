import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
config();
import cors from "cors";
import { app } from "./index.js";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { SYSTEM_PROMPT } from "./constant.js";

const server = express();
server.use(bodyParser.json());
server.use(cors({
    origin: '*',
}));

server.post("/chat", async (req, res) => {
  const { input } = req.body; 
  const messages = [];
  messages.push(new SystemMessage(SYSTEM_PROMPT));
  messages.push(new HumanMessage(input));
  try {
    const result = await app.invoke({ messages });
    const lastMessage = result.messages[result.messages.length - 1];

    res.json({ reply: lastMessage.content });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message });
  }
});

server.get("/", (req, res) => {
  res.send("LangGraph interviewer agent is running 🚀");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
