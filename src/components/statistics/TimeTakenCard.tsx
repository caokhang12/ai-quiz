import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { formatTime } from "@/lib/utils";

type Props = {
  timeEnded: number;
};



const TimeTakenCard = ({ timeEnded }: Props) => {
  return (
    <Card className="md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Time Taken</CardTitle>
        <Hourglass />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          {formatTime(timeEnded)} seconds
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTakenCard;
