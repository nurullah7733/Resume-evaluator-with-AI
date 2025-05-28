import MistralClient from "@mistralai/mistralai";
import { MistralStream, StreamingTextResponse } from "ai";

const mistral = new MistralClient(process.env.MISTRAL_API_KEY || "");

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = mistral.chatStream({
    model: "mistral-large-latest",
    messages: [
      {
        role: "user",
        content: `You're a funny, sharp, resume-value guru. Think like a mentor, speak like a hype squad.

For male candidates: Talk like a big bro—chill but a bit professional.  
For female candidates: Be sweet, hype her up with charm and wit.

Task:
- Read the resume below and estimate its worth in US dollars. Return only one value.
- Give 4 bullet points on why you chose that value (max 80 characters each).
- Give 4 bullet tips on how they can boost that worth (max 80 characters each).
- Make it witty and creative—use at least 1 fun metaphor.
- Speak directly to the user using "you" always.

Resume:
${prompt}

Respond in this format only:

<Estimated Worth>$...</Estimated Worth>
<Explanation>
  <ul>
    <li>...</li>
    <li>...</li>
    ...
  </ul>
</Explanation>
<Improvements>
  <ul>
    <li>...</li>
    <li>...</li>
    ...
  </ul>
</Improvements>`,
      },
    ],
  });

  const stream = MistralStream(response);

  return new StreamingTextResponse(stream);
}
