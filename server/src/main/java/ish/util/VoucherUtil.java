/*
 * Copyright ish group pty ltd 2020.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 */
package ish.util;

import ish.math.Money;

import java.math.BigDecimal;

public class VoucherUtil {

	private static final int PRECISION_SCALE = Money.DEFAULT_SCALE * 4;

	/**
	 * Calculates money voucher remaining liability for specific remaining value.<br>
	 *
	 *     remainingLiability = remainingValue * voucherPrice / voucherInitialValue
	 */
	public static Money calculateMoneyVoucherRemainingLiability(Money remainingValue, Money voucherPrice, Money voucherInitialValue) {

		// using BigDecimal for calculations here to preserve precision until final conversion to Money

		BigDecimal remaining = remainingValue.toBigDecimal();
		BigDecimal price = voucherPrice.toBigDecimal();
		BigDecimal valueOnPurchase = voucherInitialValue.toBigDecimal();

		return Money.valueOf(remaining.multiply(price.divide(valueOnPurchase, PRECISION_SCALE, Money.DEFAULT_ROUND)));
	}

	/**
	 * Calculates course voucher remaining liability for specific amount of remaining redemptions.<br>
	 *
	 *     remainingLiability = voucherPrice * remainingRedemptions / maxRedemptions
	 */
	public static Money calculateCourseVoucherRemainingLiability(Money voucherPrice, int remainingRedemptions, int maxRedemptions) {
		return voucherPrice.multiply(remainingRedemptions).divide(BigDecimal.valueOf(maxRedemptions));
	}
}
