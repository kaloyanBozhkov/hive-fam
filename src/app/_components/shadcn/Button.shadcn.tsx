import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import DotsLoader from "../atoms/DotsLoader.atom";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "[background:var(--theme-primary-bg,hsl(var(--primary)))] [color:var(--theme-primary-text,hsl(var(--primary-foreground)))] hover:[background:var(--theme-primary-hover-bg,hsl(var(--primary)/0.9))]",
        destructive:
          "[background:var(--theme-destructive-bg,hsl(var(--destructive)))] [color:var(--theme-destructive-text,hsl(var(--destructive-foreground)))] hover:[background:var(--theme-destructive-hover-bg,hsl(var(--destructive)/0.9))]",
        outline:
          "border border-input [background:var(--theme-outline-bg,hsl(var(--background)))] [color:var(--theme-outline-text,inherit)] hover:[background:var(--theme-outline-hover-bg,hsl(var(--accent)))] hover:[color:var(--theme-outline-text,hsl(var(--accent-foreground)))]",
        secondary:
          "[background:var(--theme-secondary-bg,hsl(var(--secondary)))] [color:var(--theme-secondary-text,hsl(var(--secondary-foreground)))] hover:[background:var(--theme-secondary-hover-bg,hsl(var(--secondary)/0.8))]",
        ghost:
          "[background:var(--theme-ghost-bg,transparent)] [color:var(--theme-ghost-text,inherit)] hover:[background:var(--theme-ghost-hover-bg,hsl(var(--accent)))] hover:[color:var(--theme-ghost-text,hsl(var(--accent-foreground)))]",
        link: "[background:var(--theme-link-bg,transparent)] [color:var(--theme-link-text,hsl(var(--primary)))] underline-offset-4 hover:underline hover:[background:var(--theme-link-hover-bg,transparent)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? <DotsLoader modifier="primary" /> : props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
