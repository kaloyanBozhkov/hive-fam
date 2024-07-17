"use client";

import { twMerge } from "tailwind-merge";
import { Button } from "../shadcn/Button.shadcn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Group from "../layouts/Group.layout";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

const BuyTickets = ({ className = "" }: { className?: string }) => {
  return (
    <div className={twMerge("", className)}>
      <Button
        className="w-full"
        onClick={() => alert("Upcoming stripe checkout feature")}
      >
        <Group className="items-center gap-[12px]">
          <FontAwesomeIcon icon={faCreditCard} />
          <span>Buy Tickets</span>
        </Group>
      </Button>
    </div>
  );
};

export default BuyTickets;
