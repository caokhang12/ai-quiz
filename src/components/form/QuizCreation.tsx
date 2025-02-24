"use client";

import LoadingQuestions from "@/components/LoadingQuestions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BookOpen, CopyCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = () => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const { mutate: getQuestion, isPending } = useMutation({
    mutationFn: async (data: Input) => {
      setShowLoader(true);
      const response = await axios.post("/api/game", data);
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: "",
      type: "MULTI_CHOICE",
    },
  });

  const onSubmit = (data: Input) => {
    // alert(JSON.stringify(data));
    getQuestion(
      {
        amount: data.amount,
        topic: data.topic,
        type: data.type,
      },
      {
        onSuccess: ({ gameId }) => {
          if (form.getValues("type") === "MULTI_CHOICE") {
            router.push(`/play/mc/${gameId}`);
          } else {
            router.push(`/play/oe/${gameId}`);
          }
        },
        onError: () => {
          setShowLoader(false);
        },
      }
    );
  };

  if (showLoader) {
    return <LoadingQuestions />;
  }

  return (
    <div className="absolute shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>
            Choose a topic and start creating your quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter topic here" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please specify the topic of your quiz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter amount here"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Please specify the number of questions for your quiz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  variant={
                    form.watch("type") === "MULTI_CHOICE"
                      ? "secondary"
                      : "default"
                  }
                  className="w-1/2 rounded-none rounded-l-lg"
                  type="button"
                  onClick={() => form.setValue("type", "MULTI_CHOICE")}
                >
                  <CopyCheck className="w-4 h-4 mr-2 " /> Multiple Choice
                </Button>
                <Button
                  variant={
                    form.watch("type") === "OPEN_ENDED"
                      ? "secondary"
                      : "default"
                  }
                  className="w-1/2 rounded-none rounded-r-lg"
                  type="button"
                  onClick={() => form.setValue("type", "OPEN_ENDED")}
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>
              <Button disabled={isPending} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
