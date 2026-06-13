import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  temperature = 0.3
): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature,
    max_tokens: 2000,
  })

  return completion.choices[0]?.message?.content || ""
}
