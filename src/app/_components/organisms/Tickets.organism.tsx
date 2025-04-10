"use client";
import { z } from "zod";
import Group from "../layouts/Group.layout";
import Stack from "../layouts/Stack.layout";
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
import {
  faCreditCard,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment, useCallback, useMemo, useState } from "react";
import DotsLoader from "../atoms/DotsLoader.atom";
import { cartCheckout } from "@/utils/stripe/checkout.helpers";
import type { Currency } from "@prisma/client";
import type { EventTicketType } from "@/utils/types.common";

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
  isModalMode = false,
}: {
  eventId: string;
  eventName: string;
  ticketTypes: EventTicketType[];
  className?: string;
  eventCurrency: Currency;
  isModalMode?: boolean;
}) => {
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const defaultValues = useMemo(
    () =>
      ticketTypes.reduce(
        (acc, ticketType) => ({
          ...acc,
          [ticketType.id]: 0,
        }),
        {},
      ),
    [ticketTypes],
  );
  const form = useForm<z.infer<typeof cart>>({
    resolver: zodResolver(cart),
    defaultValues,
  });
  const total = ticketTypes.reduce((acc, ticketType) => {
    return acc + form.watch(ticketType.id) * ticketType.price;
  }, 0);

  const onSubmit = useCallback(
    (values: z.infer<typeof cart>) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
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
    [eventName, form, eventId, ticketTypes, eventCurrency],
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
          <Stack
            className={twMerge(
              "gap-[20px] pb-[20px]",
              isModalMode ? "max-h-[50vh] overflow-auto " : "",
            )}
          >
            {ticketTypes
              .filter((d) => d.is_visible)
              .map((ticketType, index, self) => {
                const ticketTypeCount = form.watch(ticketType.id);
                const TicketTypeTotalPrice = (
                  <p
                    className={twMerge(
                      "text-nowrap text-[14px] leading-[120%] text-gray-500",
                      ticketTypeCount <= 0 ? "font-light" : "font-semibold",
                    )}
                  >
                    {eventCurrency}{" "}
                    <span className="notranslate">
                      {(ticketTypeCount * ticketType.price).toFixed(2)}
                    </span>
                  </p>
                );

                const PriceControls = (
                  <>
                    <FormControl>
                      <Stack className="items-end gap-2">
                        <div className=" md:hidden">{TicketTypeTotalPrice}</div>
                        <Group className="!mt-0 ml-auto gap-[12px] -sm:ml-[unset]">
                          <Button
                            onClick={() => {
                              const newVal = form.getValues(ticketType.id) - 1;
                              form.setValue(
                                ticketType.id,
                                newVal < 0 ? 0 : newVal,
                              );
                            }}
                            type="button"
                            className="size-[24px] rounded-full p-0"
                            disabled={ticketTypeCount <= 0}
                          >
                            <FontAwesomeIcon
                              icon={faMinus}
                              className="size-[14px]"
                            />
                          </Button>
                          <p className="w-[24px] select-none text-center text-[24px] font-bold leading-[24px]">
                            {ticketTypeCount}
                          </p>
                          <Button
                            onClick={() => {
                              const newVal = form.getValues(ticketType.id) + 1;
                              form.setValue(
                                ticketType.id,
                                newVal > 99 ? 99 : newVal,
                              );
                            }}
                            type="button"
                            disabled={ticketTypeCount >= 99}
                            className="size-[24px] rounded-full p-0 leading-[100%]"
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="size-[14px]"
                            />
                          </Button>
                        </Group>
                      </Stack>
                    </FormControl>
                    <Stack className={"hidden select-none md:block "}>
                      {ticketTypeCount > 0 && (
                        <p className="notranslate text-nowrap text-right text-[14px] font-light leading-[120%] text-gray-500">
                          {ticketTypeCount} x {ticketType.price.toFixed(2)}
                        </p>
                      )}
                      <div>{TicketTypeTotalPrice}</div>
                    </Stack>
                  </>
                );

                return (
                  <Fragment key={ticketType.id}>
                    {
                      <FormField
                        control={form.control}
                        name={ticketType.id}
                        render={() => (
                          <FormItem className="mt-0 flex flex-col items-center gap-[20px] -sm:grid-cols-1 -sm:items-start -sm:pt-2">
                            <div className="grid w-full grid-cols-2 items-center justify-between gap-2 md:grid-cols-[1fr_min-content_min-content] md:gap-3">
                              <FormLabel className="mr-auto -sm:-mb-2">
                                <Stack className="items-start gap-1 text-left">
                                  <p className="text-[18px] font-normal capitalize leading-[120%]">
                                    {ticketType.label}
                                  </p>
                                  {ticketType.description && (
                                    <p className="text-[14px] leading-[120%]">
                                      {ticketType.description}
                                    </p>
                                  )}
                                  <p className="text-[14px] font-light leading-[120%] text-gray-500">
                                    {eventCurrency}{" "}
                                    <span className="notranslate">
                                      {ticketType.price.toFixed(2)}
                                    </span>
                                  </p>
                                </Stack>
                              </FormLabel>
                              {ticketType.is_sold_out ? (
                                <p className="ml-auto text-nowrap text-right font-bold">
                                  Sold Out
                                </p>
                              ) : (
                                PriceControls
                              )}
                            </div>
                            <FormMessage className="col-span-2 w-full" />
                          </FormItem>
                        )}
                      />
                    }
                    {index < self.length - 1 && (
                      <div className="h-[1px] w-full border-b-[1px] border-solid border-gray-500/15 " />
                    )}
                  </Fragment>
                );
              })}
          </Stack>
          <div className="-mt-[20px] h-[1px] w-full border-b-[1px] border-solid border-gray-500/15" />
          <div className="grid w-full select-none grid-cols-2 gap-[20px]">
            <p className="mr-auto font-rex-bold text-[20px]">Total</p>
            <p className="ml-auto font-rex-bold text-[20px]">
              {eventCurrency}{" "}
              <span className="notranslate">{total.toFixed(2)}</span>
            </p>
          </div>
          <Button disabled={total <= 0} type="submit">
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
