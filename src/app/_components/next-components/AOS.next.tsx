"use client";

import { type ReactNode } from "react";
import useAOS from "../../hooks/useAOS";

export default function AOS({ children }: { children: ReactNode }) {
  useAOS();
  return children;
}
