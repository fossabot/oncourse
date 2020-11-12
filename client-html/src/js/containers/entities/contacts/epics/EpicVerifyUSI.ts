/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Epic } from "redux-observable";

import * as EpicUtils from "../../../../common/epics/EpicUtils";
import ContactsService from "../services/ContactsService";
import { VERIFY_USI, VERIFY_USI_FULFILLED } from "../actions";
import FetchErrorHandler from "../../../../common/api/fetch-errors-handlers/FetchErrorHandler";
import { UsiVerificationResult } from "@api/model";

const request: EpicUtils.Request<
  any,
  any,
  { firstName: string; lastName: string; birthDate: string; usiCode: string }
> = {
  type: VERIFY_USI,
  getData: ({ firstName, lastName, birthDate, usiCode }) =>
    ContactsService.verifyUSI(firstName, lastName, birthDate, usiCode),
  processData: (usiVerificationResult: UsiVerificationResult) => {
    return [
      {
        type: VERIFY_USI_FULFILLED,
        payload: { usiVerificationResult }
      }
    ];
  },
  processError: response => FetchErrorHandler(response, "Failed to verify USI")
};

export const EpicVerifyUSI: Epic<any, any> = EpicUtils.Create(request);
