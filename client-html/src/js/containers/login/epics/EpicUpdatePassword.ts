/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Epic } from "redux-observable";

import * as EpicUtils from "../../../common/epics/EpicUtils";
import LoginService from "../services/LoginService";
import { POST_UPDATE_PASSWORD_REQUEST, POST_UPDATE_PASSWORD_FULFILLED, FETCH_SUCCESS } from "../../../common/actions";
import LoginServiceErrorsHandler from "../services/LoginServiceErrorsHandler";

const request: EpicUtils.Request<any, any, any> = {
  type: POST_UPDATE_PASSWORD_REQUEST,
  getData: payload => LoginService.updatePassword(payload.value),
  processData: () => {
    return [
      {
        type: POST_UPDATE_PASSWORD_FULFILLED
      },
      {
        type: FETCH_SUCCESS,
        payload: { message: "Password has been successfully updated" }
      }
    ];
  },
  processError: response => LoginServiceErrorsHandler(response, "Failed to update password")
};

export const EpicUpdatePassword: Epic<any, any> = EpicUtils.Create(request);
