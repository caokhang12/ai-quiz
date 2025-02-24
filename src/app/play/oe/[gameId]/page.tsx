import OpenEnded from "@/components/OpenEnded";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const OpenEndedPage = async ({ params }: Props) => {
  const { gameId } = await params;
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          answer: true,
        },
      },
    },
  });
  if (!game || game.gameType === "MULTI_CHOICE") {
    return redirect("/quiz");
  }
  return <OpenEnded game={game} />;
};

export default OpenEndedPage;
