"use client";
import { z } from "zod";
import Group from "../layouts/Group.layout";
import Stack from "../layouts/Stack.layout";
import { Input } from "../shadcn/Input.shadcn";
import { Button } from "../shadcn/Button.shadcn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/shadcn/Form.shadcn";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTicket } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import DotsLoader from "../atoms/DotsLoader.atom";
import { claimFreeTickets } from "@/server/actions/claimFreeTIckets";
import { useRouter } from "next/navigation";

const MAX_FREE_TICKETS_AT_ONCE = 30;

const cart = z.object({
  quantity: z.number(),
  email: z.string().email("Must provide a vlaid email"),
  name: z.string().min(2),
});

const FreeTickets = ({
  eventName,
  className,
  eventId,
}: {
  eventId: string;
  eventName: string;
  className?: string;
}) => {
  const router = useRouter();
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const form = useForm<z.infer<typeof cart>>({
    resolver: zodResolver(cart),
    defaultValues: {
      quantity: 0,
      email: "",
      name: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof cart>) => {
      setCheckoutProcessing(true);
      claimFreeTickets({ eventId, ...values })
        .then(({ success, reason, sessionId }) => {
          if (success) {
            router.push(`/order/${sessionId}`);
            return;
          }

          if (reason === "ALREADY_CLAIMED_WITH_THAT_EMAIL") {
            form.setError("email", {
              message:
                "This email has already been used to claim one or more tickets.",
            });
            setCheckoutProcessing(false);
          }
        })
        .catch((error) => {
          console.warn(error);
          setCheckoutProcessing(false);
        });
    },
    [eventName, form, eventId, router],
  );

  const ticketQuantity = form.watch("quantity");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={twMerge("w-full space-y-8", className)}
      >
        <Stack className="gap-[20px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel className="w-full text-left">
                  <Stack>
                    <p>Full name</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder="John Doe" />
                </FormControl>
                <FormMessage className="col-span-2 w-full text-left" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel className="w-full text-left">
                  <Stack>
                    <p>Email</p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="john.doe@gmail.com"
                  />
                </FormControl>
                <FormMessage className="col-span-2 w-full text-left" />
              </FormItem>
            )}
          />
          <div className="mt-2 h-[1px] w-full border-b-[1px] border-solid border-gray-500/15" />
          <FormField
            control={form.control}
            name="quantity"
            render={() => (
              <FormItem className="grid grid-cols-2 items-center gap-[20px] -sm:grid-cols-1 -sm:items-start -sm:pt-2">
                <FormLabel className="mr-auto -sm:-mb-2">
                  <Stack className="gap-[4px]">
                    <p className="text-[18px] font-normal capitalize leading-[120%]">
                      Regular Ticket
                    </p>
                    <p className="text-[14px] font-light leading-[120%] text-gray-500">
                      FREE
                    </p>
                  </Stack>
                </FormLabel>
                <FormControl>
                  <Group className="!mt-0 ml-auto gap-[12px] -sm:ml-[unset]">
                    <Button
                      className="size-[24px] rounded-full p-0 leading-[100%]"
                      disabled={ticketQuantity <= 0}
                      onClick={() => {
                        const newVal = form.getValues("quantity") - 1;
                        form.setValue("quantity", newVal < 0 ? 0 : newVal);
                      }}
                      type="button"
                    >
                      <FontAwesomeIcon icon={faMinus} className="size-[14px]" />
                    </Button>
                    <p className="w-[24px] select-none text-center text-[24px] font-bold leading-[24px]">
                      {ticketQuantity}
                    </p>
                    <Button
                      className="size-[24px] rounded-full p-0 leading-[100%]"
                      onClick={() => {
                        const newVal = form.getValues("quantity") + 1;
                        form.setValue(
                          "quantity",
                          newVal > MAX_FREE_TICKETS_AT_ONCE
                            ? MAX_FREE_TICKETS_AT_ONCE
                            : newVal,
                        );
                      }}
                      type="button"
                      disabled={ticketQuantity >= MAX_FREE_TICKETS_AT_ONCE}
                    >
                      <FontAwesomeIcon icon={faPlus} className="size-[14px]" />
                    </Button>
                  </Group>
                </FormControl>
                <FormMessage className="col-span-2 w-full" />
              </FormItem>
            )}
          />
          <div className="mt-2 h-[1px] w-full border-b-[1px] border-solid border-gray-500/15" />
          <Button type="submit" disabled={ticketQuantity < 1}>
            {checkoutProcessing ? (
              <DotsLoader modifier="primary" />
            ) : (
              <Group className="items-center gap-[12px]">
                <FontAwesomeIcon icon={faTicket} />
                <span>CLAIM TICKET{ticketQuantity > 1 ? "S" : ""}</span>
              </Group>
            )}
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default FreeTickets;
