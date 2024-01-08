import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req) {
    const { prompt } = await req.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    messages: [
        {role: "system", content: "You will be provided text by user, and your task is to classify its sentiment as happy, exited, angry, calm, confused, bored, chill, sad, embrassed, uncomfortable, and worried. \n\nRules:\n- Just answer with: happy, exited, angry, calm, confused, bored, chill, sad, embrassed, uncomfortable, or worried\n- Don't add any more words"},
        {role: "user", content: prompt},
    ],
  });

  return NextResponse.json({ status: "success", data: completion.choices[0].message.content });
}
