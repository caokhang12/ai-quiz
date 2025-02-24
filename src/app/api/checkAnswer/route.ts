import { prisma } from "@/lib/prisma";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { questionId, userInput } = checkAnswerSchema.parse(body);
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });
    if (!question) {
      return NextResponse.json(
        {
          message: "Question not found",
        },
        {
          status: 404,
        }
      );
    }
    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        userAnswer: userInput,
      },
    });
    if (question.questionType === "MULTI_CHOICE") {
      const isCorrect =
        question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();
      await prisma.question.update({
        where: { id: questionId },
        data: { isCorrect },
      });
      return NextResponse.json(
        {
          isCorrect,
          message: isCorrect ? "Correct answer" : "Incorrect answer",
        },
        {
          status: 200,
        }
      );
    } else if ((question.questionType = "OPEN_ENDED")) {
      const answer = question.answer.toLowerCase().trim();
      const userAnswer = userInput.toLowerCase().trim();
      const percentageSimilar =
        stringSimilarity.compareTwoStrings(answer, userAnswer) * 100;
      const isCorrect = percentageSimilar >= 85;
      await prisma.question.update({
        where: { id: questionId },
        data: { percentageCorrect: percentageSimilar, isCorrect },
      });
      return NextResponse.json(
        {
          isCorrect,
          answer: question.answer,
          message: isCorrect ? "Correct answer" : "Incorrect answer",
        },
        {
          status: 200,
        }
      );
    }
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
