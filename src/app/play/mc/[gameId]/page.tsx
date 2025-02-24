import MCQ from "@/components/MCQ";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type Props = {
  params: {
    gameId: string;
  };
};

const MCPage = async ({ params }: Props) => {
  const { gameId } = await params;
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const gameData = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });
  if (!gameData || gameData.gameType === "OPEN_ENDED") {
    return redirect("/quiz");
  }
  return <MCQ game={gameData} />;
};

export default MCPage;
