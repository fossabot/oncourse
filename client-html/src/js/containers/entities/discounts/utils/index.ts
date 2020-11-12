/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Discount, DiscountType, MoneyRounding } from "@api/model";
import Decimal from "decimal.js-light";
import { NestedListItem } from "../../../../common/components/form/nestedList/NestedList";

export const getRoundingByType = (type: MoneyRounding, value: Decimal): number => {
  switch (type) {
    default:
    case "No Rounding":
      return value.toDecimalPlaces(2).toNumber();
    case "Nearest 10 cents":
      return value.toDecimalPlaces(1, Decimal.ROUND_UP).toNumber();
    case "Nearest 50 cents": {
      // @ts-ignore
      const cents = new Decimal(value.d[1] || 0).div(100000).toNumber();

      switch (true) {
        case [0, 50].includes(cents):
          return value.toNumber();
        case cents < 25:
          return value.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
        case cents >= 25 && cents < 75:
          return value
            .toDecimalPlaces(0, Decimal.ROUND_DOWN)
            .plus(0.5)
            .toNumber();
        case cents >= 75:
          return value.toDecimalPlaces(0, Decimal.ROUND_UP).toNumber();
      }
      return value.toNumber();
    }
    case "Nearest dollar":
      return value.toDecimalPlaces(0).toNumber();
  }
};

const secondaryDiscountText = (discountType: DiscountType, discountValue: number, discountPercent: number) => {
  switch (discountType) {
    case "Percent":
      return `${discountPercent * 100}% discount`;
    case "Dollar":
      return `$${discountValue} discount`;
    case "Fee override":
      return `Fix price to $${discountValue}`;
    default: {
      throw Error("Unknown discountType");
    }
  }
};

export const transformDiscountForNestedList = (discount: Discount): NestedListItem => ({
  id: discount.id.toString(),
  entityId: discount.id,
  primaryText: discount.name,
  secondaryText: secondaryDiscountText(discount.discountType, discount.discountValue, discount.discountPercent),
  link: `/discount/${discount.id}`,
  active: true
});

export const discountSort = (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
