import { TaxCalculationType } from "@prisma/client";

export const calcualteTicketPrice = (
  ticketPrice: number,
  taxPercentage: number,
  taxCalculationType: TaxCalculationType,
) => {
  if (taxCalculationType !== TaxCalculationType.TAX_IS_PART_OF_PRICE) {
    return ticketPrice;
  }
  return ticketPrice + (ticketPrice * taxPercentage) / 100;
};

export const TaxCalculationTypeToLabel = (
  taxCalculationType: TaxCalculationType,
) => {
  switch (taxCalculationType) {
    case TaxCalculationType.TAX_IS_PART_OF_PRICE:
      return "Tax is a portion of ticket price";
    case TaxCalculationType.TAX_ADDED_TO_PRICE_ON_CHECKOUT:
      return "Tax added to total at checkout";
    case TaxCalculationType.TAX_HIDDEN_IN_PRICE:
      return "Tax is hidden";
  }
};
