import { z } from "zod";

export const getQuestionsSchema = z.object({
  topic: z.string(),
  amount: z.number().int().positive().min(1).max(10),
  type: z.enum(["MULTI_CHOICE", "OPEN_ENDED"]),

});

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userInput: z.string().min(1).max(255),
});

export const endGameSchema = z.object({
  gameId: z.string(),
  endedTime: z.number(),
});
