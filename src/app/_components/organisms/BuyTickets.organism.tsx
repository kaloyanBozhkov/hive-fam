"use client";

import { twMerge } from "tailwind-merge";
import { Button } from "../shadcn/Button.shadcn";

const BuyTickets = ({ className = "" }: { className?: string }) => {
  return (
    <div className={twMerge("", className)}>
      <Button
        className="w-full"
        onClick={() => alert("Upcoming stripe checkout feature")}
      >
        Buy Tickets
      </Button>
    </div>
  );
};

export default BuyTickets;
