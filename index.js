import { config } from "dotenv";
import readlineSync from "readline-sync";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SYSTEM_PROMPT } from "./constant.js";
import { getDSAProblem } from "./tools.js";

config();

const run = async (userInput) => {
  
  const chat = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY,
    tools: [
      {
        name: "getDSAProblem",
        description: "Fetch a new DSA coding interview problem",
        func: getDSAProblem,
      },
    ],
  });

  const response = await chat.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(userInput),
  ]);

  return response.content;
};

while (true) {
  const userInput = readlineSync.question(">> ");
  const botResponse = await run(userInput);
  console.log("🤖 Bot:", botResponse);
}
