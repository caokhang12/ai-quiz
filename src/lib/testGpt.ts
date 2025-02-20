import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

export const strict_output = async (
  systemMessage: string,
  userMessages: string[],
  outputSchema: Record<string, any>
) => {
  const messages = [
    { role: "system", content: systemMessage },
    ...userMessages.map((msg) => ({ role: "user", content: msg })),
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.7,
    response_format: { type: "json_schema" },
    functions: [
      {
        name: "generate_quiz",
        description: "Generate a quiz with questions and answers",
        parameters: {
          type: "object",
          properties: outputSchema,
          required: Object.keys(outputSchema),
        },
      },
    ],
    function_call: { name: "generate_quiz" }, // ✅ Bắt buộc gọi hàm
  });

  // Lấy kết quả trả về từ OpenAI
  const rawResponse = response.choices[0]?.message?.content?.trim();
  if (!rawResponse) throw new Error("Empty response from OpenAI");

  try {
    return JSON.parse(rawResponse);
  } catch (error) {
    console.error("Invalid JSON detected:", rawResponse);
    throw new Error("AI response is not valid JSON");
  }
};
