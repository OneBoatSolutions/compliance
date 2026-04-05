"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck } from "lucide-react";

const messages = [
  "Analyzing your requirements...",
  "Matching frameworks...",
  "Optimizing recommendations...",
];

export default function LoadingScreen() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 700);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
      {/* Icon / AI Pulse */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-purple-200 blur-xl opacity-60 animate-pulse" />
        <div className="relative p-4 bg-purple-100 rounded-full">
          <ShieldCheck className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      {/* Message */}
      <p className="text-lg font-medium text-gray-700 transition">{messages[index]}</p>

      {/* Progress */}
      <div className="w-64">
        <Progress value={progress} />
      </div>

      {/* Optional subtle text */}
      <p className="text-xs text-gray-400">This may take a few seconds...</p>
    </div>
  );
}
