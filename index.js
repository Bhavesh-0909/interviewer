import { config } from "dotenv";
import readlineSync from "readline-sync";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { SYSTEM_PROMPT } from "./constant.js";
import { getDSAProblem } from "./tools.js";

config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
}).bindTools([getDSAProblem]);

const toolNode = new ToolNode([getDSAProblem]);

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("llm", async (state) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  })
  .addNode("tools", toolNode)
  .addEdge("__start__", "llm")
  .addConditionalEdges("llm", (state) => {
    const last = state.messages[state.messages.length - 1];
    if (last?.tool_calls?.length) {
      return "tools";
    }
    return END;
  })
  .addEdge("tools", "llm")
  .addEdge("llm", END);

const app = workflow.compile();

while (true) {
  const userInput = readlineSync.question(">> ");

  const result = await app.invoke({
    messages: [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(userInput),
    ],
  });

  const botMessage = result.messages[result.messages.length - 1];
  console.log("🤖 Bot:", botMessage.content);
}
