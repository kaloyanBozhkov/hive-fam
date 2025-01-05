"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Group from "../layouts/Group.layout";
import { Button, type ButtonProps } from "../shadcn/Button.shadcn";
import { useEffect, useRef, useState } from "react";
import { faShare } from "@fortawesome/free-solid-svg-icons";

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
      <Group className="items-center justify-center gap-2">
        <FontAwesomeIcon icon={faShare} />
        <span>{copied ? "Link Copied" : "Share"}</span>
      </Group>
    </Button>
  );
};
