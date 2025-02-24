"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import { Game, Question } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const { toast } = useToast();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [userInput, setUserInput] = useState("");

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: checkAnswer, isPending } = useMutation({
    mutationFn: async () => {
      const data = {
        questionId: currentQuestion.id,
        userInput: userInput,
      };
      const response = await axios.post("/api/checkAnswer", data);
      return response.data;
    },
  });

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: (data) => {
        if (data.isCorrect) {
          toast({
            variant: "success",
            title: "Correct Answer",
            description: "You got it right!",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Incorrect Answer",
            description: `The answer is ${game.questions[questionIndex].answer}`,
          });
        }
        setUserInput("");
        setQuestionIndex((index) => index + 1);
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
        }
      },
    });
  }, [checkAnswer, questionIndex, toast, game.questions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Enter") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in{" "}
          {/* {formatTimeDelta(differenceInSeconds(now, game.timeStarted))} */}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-2")}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* topic */}
          <p>
            <span className="text-slate-400">Topic</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {/* {formatTimeDelta(differenceInSeconds(now, game.timeStarted))} */}
          </div>
        </div>
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <textarea
          className="w-full p-3 text-lg bg-white rounded-md"
          placeholder="Type your answer here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Button
          variant="default"
          className="mt-2"
          size="lg"
          disabled={isPending || hasEnded}
          onClick={() => {
            handleNext();
          }}
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <p>Next</p>
          <ChevronRight
            className=" ml-2 align-middle"
            strokeWidth={3}
            width={26}
          />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;
