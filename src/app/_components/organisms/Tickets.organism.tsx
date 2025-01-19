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
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useMemo, useState } from "react";
import DotsLoader from "../atoms/DotsLoader.atom";
import { cartCheckout } from "@/utils/stripe/checkout.helpers";
import type { Currency, event_ticket_type } from "@prisma/client";

const cart = z.record(z.number());
type TicketAddedToCard = {
  eventName: string;
  eventId: string;
  ticketPrice: number;
  ticketTypeId: string;
};

const Tickets = ({
  eventName,
  className,
  eventId,
  ticketTypes,
  eventCurrency,
}: {
  eventId: string;
  eventName: string;
  ticketTypes: event_ticket_type[];
  className?: string;
  eventCurrency: Currency;
}) => {
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const form = useForm<z.infer<typeof cart>>({
    resolver: zodResolver(cart),
    defaultValues: ticketTypes.reduce(
      (acc, ticketType) => ({
        ...acc,
        [ticketType.id]: 0,
      }),
      {},
    ),
  });
  const total = Object.entries(ticketTypes).reduce((acc, [key, value]) => {
    return acc + form.watch(key) * value.price;
  }, 0);

  const onSubmit = useCallback(
    (values: z.infer<typeof cart>) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values);

      setCheckoutProcessing(true);
      const formVals = form.getValues();
      const total = ticketTypes.reduce((acc, ticketOfType) => {
        const ticketTypeCount = formVals[ticketOfType.id]!;
        return acc + ticketTypeCount * ticketOfType.price;
      }, 0);

      const items: TicketAddedToCard[] = Object.entries(formVals).flatMap(
        ([ticketTypeId, ticketCount]) => {
          const ticketsOfTypeInCart: TicketAddedToCard[] = [];
          for (let i = 0; i < ticketCount; i++) {
            ticketsOfTypeInCart.push({
              eventName,
              eventId,
              ticketPrice: ticketTypes.find(
                (ticketType) => ticketType.id === ticketTypeId,
              )!.price,
              ticketTypeId: ticketTypes.find(
                (ticketType) => ticketType.id === ticketTypeId,
              )!.id,
            });
          }
          return ticketsOfTypeInCart;
        },
      );

      cartCheckout({
        total,
        productsInCart: items,
        currency: eventCurrency,
      })
        .catch(() => {
          console.error("failed to checkout");
        })
        .finally(() => setCheckoutProcessing(false));
    },
    [eventName, form, eventId, ticketTypes],
  );

  if (!ticketTypes.length)
    return (
      <p>
        No ticket types found. Check with event organiser or contact support.{" "}
      </p>
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={twMerge("w-full space-y-8", className)}
      >
        <Stack className="gap-[20px]">
          {ticketTypes.map((ticketType) => (
            <FormField
              key={ticketType.id}
              control={form.control}
              name={ticketType.id}
              render={({ field }) => (
                <FormItem className="mt-0 grid grid-cols-2 items-center gap-[20px] -sm:grid-cols-1 -sm:items-start -sm:pt-2">
                  <FormLabel className="mr-auto -sm:-mb-2">
                    <Stack>
                      <p className="text-[18px] leading-[120%]">
                        {ticketType.label}
                      </p>
                    </Stack>
                  </FormLabel>
                  <FormControl>
                    <Group className="!mt-0 ml-auto gap-[12px] -sm:ml-[unset]">
                      <Button
                        onClick={() => {
                          const newVal = form.getValues(ticketType.id) - 1;
                          form.setValue(ticketType.id, newVal < 0 ? 0 : newVal);
                        }}
                        type="button"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        {...field}
                        className="w-[62px] -sm:w-full"
                        min={0}
                        max={99}
                        onChange={({ currentTarget: { value } }) => {
                          field.onChange(+value);
                        }}
                      />
                      <Button
                        onClick={() => {
                          const newVal = form.getValues(ticketType.id) + 1;
                          form.setValue(
                            ticketType.id,
                            newVal > 99 ? 99 : newVal,
                          );
                        }}
                        type="button"
                      >
                        +
                      </Button>
                    </Group>
                  </FormControl>
                  <FormMessage className="col-span-2 w-full" />
                </FormItem>
              )}
            />
          ))}
          <div className="h-[1px] w-full border-b-[1px] border-dashed border-black " />
          <div className="grid w-full grid-cols-2 gap-[20px]">
            <p className="mr-auto font-rex-bold text-[20px]">Total</p>
            <p className="ml-auto font-rex-bold text-[20px]">
              {total} {eventCurrency}
            </p>
          </div>
          <Button disabled={form.watch("regularQuantity") <= 0} type="submit">
            {checkoutProcessing ? (
              <DotsLoader modifier="primary" />
            ) : (
              <Group className="items-center gap-[12px]">
                <FontAwesomeIcon icon={faCreditCard} />
                <span>CHECKOUT</span>
              </Group>
            )}
          </Button>
        </Stack>
      </form>
    </Form>
  );
};

export default Tickets;
