"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const QuizMeCard = () => {
  const router = useRouter();
  return (
    <Card
      className="bg-white dark:bg-gray-900 shadow-lg cursor-pointer hover:opacity-70"
      onClick={() => {
        router.push("/quiz");
      }}
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-bold capitalize">
          Quiz me!
        </CardTitle>
        <Brain strokeWidth={2} size={24} />
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Challenge yourself to a quiz with a topic of your choice.
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizMeCard;
