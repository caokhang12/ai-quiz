"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const HistoryCard = () => {
  const router = useRouter();
  return (
    <Card
      className="bg-white dark:bg-gray-900 shadow-lg cursor-pointer hover:opacity-70"
      onClick={() => {
        router.push("/history");
      }}
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-bold capitalize">History</CardTitle>
        <HistoryIcon strokeWidth={2} size={24} />
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">View past quiz attempts.</p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
