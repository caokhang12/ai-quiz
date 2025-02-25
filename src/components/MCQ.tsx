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
import MCQCounter from "@/components/MCQCounter";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn, formatTime } from "@/lib/utils";
import StopwatchTimer from "@/components/StopwatchTimer ";
import { endGameSchema } from "@/schemas/questions";
import { z } from "zod";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "options">[] };
};

const MCQ = ({ game }: Props) => {
  const { toast } = useToast();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [stats, setStats] = useState({
    correct_answers: 0,
    wrong_answers: 0,
  });

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isPending } = useMutation({
    mutationFn: async () => {
      const data = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice as number],
      };
      const response = await axios.post("/api/checkAnswer", data);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
        endedTime: elapsedTime,
      };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  const handleNext = useCallback(() => {
    if (selectedChoice === null) {
      toast({
        variant: "destructive",
        title: "Please select an answer before proceeding!",
      });
      return;
    }
    checkAnswer(undefined, {
      onSuccess: (data) => {
        if (data.isCorrect) {
          toast({
            variant: "success",
            title: "Correct!",
          });
          setStats((stats) => ({
            ...stats,
            correct_answers: stats.correct_answers + 1,
          }));
        } else {
          toast({
            variant: "destructive",
            title: "Incorrect!",
          });
          setStats((stats) => ({
            ...stats,
            wrong_answers: stats.wrong_answers + 1,
          }));
        }
        setTimeout(() => {
          setQuestionIndex((index) => index + 1);
          if (questionIndex === game.questions.length - 1) {
            setHasEnded(true);
            endGame();
          }
          setSelectedChoice(null);
        }, 800);
      },
    });
  }, [
    checkAnswer,
    toast,
    questionIndex,
    game.questions.length,
    selectedChoice,
    endGame,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "1") {
        setSelectedChoice(0);
      } else if (key === "2") {
        setSelectedChoice(1);
      } else if (key === "3") {
        setSelectedChoice(2);
      } else if (key === "4") {
        setSelectedChoice(3);
      } else if (key === "Enter") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (hasEnded) {
        clearInterval(timer);
        return;
      }
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hasEnded]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in {formatTime(elapsedTime)} seconds! 🎉
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
          <div className="flex self-start mt-3 text-slate-400 items-center">
            <Timer className="mr-2" />
            <StopwatchTimer elapsedTime={elapsedTime} formatTime={formatTime} />
          </div>
        </div>
        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />
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
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              variant={selectedChoice === index ? "default" : "outline"}
              className="justify-start w-full py-8 mb-4"
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
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

export default MCQ;
