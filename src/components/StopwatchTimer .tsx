"use client";

type Props = {
  formatTime: (time: number) => string;
  elapsedTime: number;
};

const StopwatchTimer = ({ formatTime, elapsedTime }: Props) => {
  return <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>;
};

export default StopwatchTimer;
