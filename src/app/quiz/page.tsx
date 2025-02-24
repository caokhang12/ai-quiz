import QuizCreation from "@/components/form/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Quiz | AI Quiz",
  description: "Quiz yourself on anything!",
};

const Quiz = async () => {
  const session = await getAuthSession();
  if (!session) {
    redirect("/");
  }
  return <QuizCreation />;
};

export default Quiz;
