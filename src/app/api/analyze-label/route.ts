import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided." },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this alcohol label for compliance. Return ONLY valid JSON with this exact structure:
{
  "status": "PASS, WARNING, or FAIL",
  "brandName": "",
  "productType": "",
  "alcoholContent": "",
  "governmentWarning": "",
  "healthOrMisleadingClaims": "",
  "missingItems": [],
  "recommendation": ""
}

If something is not clearly visible, write "Needs human review".`,
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
    const parsed = JSON.parse(content);

    return NextResponse.json({
      result: JSON.stringify(parsed),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      result: JSON.stringify({
        status: "WARNING",
        brandName: "Needs human review",
        productType: "Needs human review",
        alcoholContent: "Needs human review",
        governmentWarning: "Needs human review",
        healthOrMisleadingClaims: "Needs human review",
        missingItems: ["AI analysis could not be completed"],
        recommendation:
          "Human compliance review recommended because some label details could not be confidently verified.",
      }),
    });
  }
}