import { strict_output } from "@/lib/gpt";
import { getQuestionsSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { amount, type, topic } = getQuestionsSchema.parse(body);
    let questions: {
      question: string;
      answer: string;
      option1?: string;
      option2?: string;
      option3?: string;
    }[] = [];
    if (type === "OPEN_ENDED") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answer, store all the pairs of answers and questions in a JSON array",
        new Array(amount).fill(
          `You are going to generate one random easy open-ended question about ${topic}`
        ),
        {
          question: "question should be clear and fact-based",
          answer:
            "The answer should be a single short phrase or name, not a full sentence with max length of 3 words.",
        }
      );
    } else if (type === "MULTI_CHOICE") {
      //// taọ nhiều câu hỏi hơn amount
      questions = await strict_output(
        "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
        new Array(amount).fill(
          `You are going to generate one random easy mcq question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 10 words(correct answer)",
          option1: "option1 with max length of 10 words (incorrect answer)",
          option2: "option2 with max length of 10 words(incorrect answer)",
          option3: "option3 with max length of 10 words(incorrect answer)",
        }
      );
    }
    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred:", error.message);
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    } else {
      console.error("Unexpected error occurred:", error);
      return NextResponse.json(
        {
          message: "An unexpected error occurred.",
        },
        {
          status: 500,
        }
      );
    }
  }
};
