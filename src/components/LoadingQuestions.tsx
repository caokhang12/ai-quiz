import Image from "next/image";
import React, { useEffect, useState } from "react";

const loadingTexts = [
  "Generating questions...",
  "Unleashing the power of curiosity...",
  "Diving deep into the ocean of questions..",
  "Harnessing the collective knowledge of the cosmos...",
  "Igniting the flame of wonder and exploration...",
];

const LoadingQuestions = () => {
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingTexts.indexOf(prev);
        return loadingTexts[(currentIndex + 1) % loadingTexts.length];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
      <Image src={"/loading.gif"} width={400} height={400} alt="loading" />
      {/* <Progress value={progress} className="w-full mt-4" /> */}
      <h1 className="mt-2 text-xl">{loadingText}</h1>
    </div>
  );
};

export default LoadingQuestions;
