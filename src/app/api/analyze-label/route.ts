import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this alcohol label for compliance. Return only valid JSON with:
{
  "status": "PASS, WARNING, or FAIL",
  "brandName": "",
  "productType": "",
  "alcoholContent": "",
  "governmentWarning": "",
  "healthOrMisleadingClaims": "",
  "missingItems": [],
  "recommendation": ""
}`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const content = response.choices[0].message.content || "{}";

const cleaned = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return NextResponse.json(JSON.parse(cleaned));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Analysis failed. Check your API key and server logs." },
      { status: 500 }
    );
  }
}