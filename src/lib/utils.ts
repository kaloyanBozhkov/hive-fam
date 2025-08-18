import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ReactNode, isValidElement, Fragment } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks whether a given ReactNode is "empty" — meaning:
 * - null, undefined, false
 * - empty or whitespace-only string
 * - an array or fragment containing only empty children
 *
 * @param node - The ReactNode to evaluate
 * @returns boolean indicating if it is considered "empty"
 */
export function isEmptyRender(node: ReactNode): boolean {
  if (node === null || node === undefined || node === false) {
    return true;
  }

  if (typeof node === "string") {
    return node.trim().length === 0;
  }

  if (typeof node === "number") {
    return false;
  }

  if (Array.isArray(node)) {
    return node.every(isEmptyRender);
  }

  if (isValidElement(node)) {
    if (node.type === Fragment) {
      return isEmptyRender(node.props.children);
    }

    // Optionally recurse into element's children
    if ("children" in node.props) {
      return isEmptyRender(node.props.children);
    }

    return false;
  }

  // If it's anything else (e.g., a symbol), treat it as non-empty
  return false;
}
