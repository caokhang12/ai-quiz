import { getAuthSession } from "@/lib/nexthauth";
import { prisma } from "@/lib/prisma";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { redirect } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session) {
      return redirect("/");
    }

    const body = await req.json();
    const { amount, type, topic } = quizCreationSchema.parse(body);
    const newGame = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
    const data = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      type,
      topic,
    });
    if (type === "MULTI_CHOICE") {
      type mcQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };
      const mc_data = data.data.questions.map((question: mcQuestion) => {
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          gameId: newGame.id,
          question: question.question,
          options: JSON.stringify(options),
          questionType: "MULTI_CHOICE",
        };
      });
      await prisma.question.createMany({
        data: mc_data,
      });
    }
    if (type === "OPEN_ENDED") {
      type oeQuestion = {
        question: string;
        answer: string;
      };
      const oe_data = data.data.questions.map((question: oeQuestion) => {
        return {
          gameId: newGame.id,
          question: question.question,
          answer: question.answer,
          questionType: "OPEN_ENDED",
        };
      });
      await prisma.question.createMany({
        data: oe_data,
      });
    }
    return NextResponse.json({ gameId: newGame.id }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
};
