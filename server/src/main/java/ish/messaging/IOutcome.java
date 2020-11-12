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
package ish.messaging;

import ish.common.types.DeliveryMode;
import ish.common.types.OutcomeStatus;
import ish.oncourse.cayenne.PersistentObjectI;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 */
public interface IOutcome extends PersistentObjectI {

	String CODE = "code";
	String NAME = "name";

	Map<DeliveryMode, String> DELIVERY_MODES_AVETMISS_EXPORT_MAP = new EnumMap<DeliveryMode, String>(DeliveryMode.class) {{
		put(DeliveryMode.CLASSROOM, "10");
		put(DeliveryMode.CLASSROOM_AND_ONLINE, "10");
		put(DeliveryMode.ONLINE, "20");
		put(DeliveryMode.WORKPLACE, "30");
		put(DeliveryMode.CLASSROOM_AND_WORKSPACE, "30");
		put(DeliveryMode.ONLINE_AND_WORKSPACE, "30");
		put(DeliveryMode.CLASSROOM_ONLINE_AND_WORKSPACE, "30");
		put(DeliveryMode.OTHER, "40");
		put(DeliveryMode.NA, "90");

	}};

	IModule getModule();

	IEnrolment getEnrolment();

	IPriorLearning getPriorLearning();

	List<? extends ICertificateOutcome> getCertificateOutcomes();

	OutcomeStatus getStatus();

	LocalDate getStartDate();

	LocalDate getEndDate();

	BigDecimal getReportableHours();

	DeliveryMode getDeliveryMode();
}
