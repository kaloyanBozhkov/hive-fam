"use client";

import { Button, ButtonProps } from "../shadcn/Button.shadcn";
import { useEffect, useRef, useState } from "react";

export const ButtonCopy = ({
  value,
  ...btnProps
}: { value: string } & Partial<ButtonProps>) => {
  const [copied, setCopied] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      // Reset the copied state after 2 seconds
      timeoutId.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId.current);
  }, []);

  return (
    <Button onClick={handleCopy} {...btnProps}>
      {copied ? "Link Copied" : "Share"}
    </Button>
  );
};