import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  // default_category: string = "",
  // output_value_only: boolean = false,
  model: string = "gpt-4o-mini",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
): Promise<
  {
    question: string;
    answer: string;
    option1?: string;
    option2?: string;
    option3?: string;
  }[]
> {
  const list_input: boolean = Array.isArray(user_prompt);
  const list_output: boolean = Array.isArray(output_format);

  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output the following in JSON format: ${JSON.stringify(
      output_format
    )}. \nEnsure that all keys and values are properly enclosed in double quotes.`;

    if (list_output) {
      output_format_prompt += `\nReturn a JSON array of objects matching the format.`;
    }

    if (list_input) {
      output_format_prompt += `\nEach input in the list should generate a corresponding JSON object.`;
    }

    const response = await openai.chat.completions.create({
      temperature: temperature,
      model: model,
      messages: [
        {
          role: "system",
          content: system_prompt + output_format_prompt + error_msg,
        },
        { role: "user", content: JSON.stringify(user_prompt) },
      ],
    });

    let rawResponse = response.choices[0].message?.content ?? "";
    if (verbose) {
      console.log("\nGPT raw response:", rawResponse);
    }

    try {
      // Xử lý JSON không hợp lệ bằng cách thử sửa lỗi chuỗi
      rawResponse = rawResponse.replace(/'/g, '"'); // Chuyển nháy đơn thành nháy kép

      let parsedOutput = JSON.parse(rawResponse);

      if (list_input && !Array.isArray(parsedOutput)) {
        throw new Error("Output format is not a list of JSON objects.");
      }

      if (!list_input && !Array.isArray(parsedOutput)) {
        parsedOutput = [parsedOutput];
      }

      for (let index = 0; index < parsedOutput.length; index++) {
        for (const key in output_format) {
          if (!(key in parsedOutput[index])) {
            throw new Error(`Missing key '${key}' in response`);
          }
        }
      }

      return parsedOutput;
    } catch (e) {
      error_msg = `\n\nError parsing JSON: ${e}\n\nRaw Response: ${rawResponse}`;
      console.error("Error parsing JSON:", e);
    }
  }

  return [];
}
