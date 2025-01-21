"use client";

import { ButtonCopy } from "../molecules/CopyButton.moleule";
import type { ButtonProps } from "../shadcn/Button.shadcn";

export const CopyUrlButton = ({
  value = typeof window !== "undefined" ? window.location.href : "",
  ...props
}: {
  value?: string;
} & ButtonProps) => {
  return <ButtonCopy value={value} {...props} />;
};
