import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req) {
  const { prompt } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "You will be provided daly journaling by user, and your task is to give reflection for user from the given text.\n\n#Rules:\n- Maximum is 40-80 words",
      },
      { role: "user", content: prompt },
    ],
  });

  return NextResponse.json({ status: "success", data: completion.choices[0].message.content });
}
