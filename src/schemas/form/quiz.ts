import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, { message: "Topic must be at least 4 characters long" })
    .max(255),
  type: z.enum(["MULTI_CHOICE", "OPEN_ENDED"]),
  amount: z.number().int().min(1).max(20),
});

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userInput: z.string().min(1).max(255),
});
