"use client";
import React, { useEffect, useState } from "react";
import "./AnimatedText.css";
import { twMerge } from "tailwind-merge";

const texts = [
  "a better platform",
  "smooth ticketing",
  "an analytics dashboard",
  "customizable branding",
];

const AnimatedText: React.FC<{ className: string }> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<string[]>([texts[0]!, texts[1]!]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : texts.length - 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextIndex = (currentIndex + 1) % texts.length;
    setItems((prev) => {
      const [, ...rest] = prev;
      return [...rest, texts[nextIndex] ?? "oops"];
    });
  }, [currentIndex]);

  return (
    <div className={twMerge("animated-text-container", className)}>
      {items.map((item, index) => (
        <h1
          key={index}
          className={`${currentIndex % 2 === 0 ? "animated-text-2" : "animated-text"}`}
        >
          {item}
        </h1>
      ))}
    </div>
  );
};

export default AnimatedText;
