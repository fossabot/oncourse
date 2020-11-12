/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Epic } from "redux-observable";

import * as EpicUtils from "../../../../common/epics/EpicUtils";
import {
  GET_CORPORATE_PASS_ITEM,
  UPDATE_CORPORATE_PASS_ITEM,
  UPDATE_CORPORATE_PASS_ITEM_FULFILLED
} from "../actions/index";
import { FETCH_SUCCESS } from "../../../../common/actions/index";
import FetchErrorHandler from "../../../../common/api/fetch-errors-handlers/FetchErrorHandler";
import { initialize } from "redux-form";
import { CorporatePass } from "@api/model";
import { GET_RECORDS_REQUEST } from "../../../../common/components/list-view/actions";
import { updateEntityItemById } from "../../common/entityItemsService";
import { LIST_EDIT_VIEW_FORM_NAME } from "../../../../common/components/list-view/constants";

const request: EpicUtils.Request<any, any, { id: number; corporatePass: CorporatePass }> = {
  type: UPDATE_CORPORATE_PASS_ITEM,
  getData: ({ id, corporatePass }) => updateEntityItemById("CorporatePass", id, corporatePass),
  processData: (v, s, { id }) => {
    return [
      {
        type: UPDATE_CORPORATE_PASS_ITEM_FULFILLED
      },
      {
        type: FETCH_SUCCESS,
        payload: { message: "CorporatePass Record updated" }
      },
      {
        type: GET_RECORDS_REQUEST,
        payload: { entity: "CorporatePass", listUpdate: true, savedID: id }
      },
      {
        type: GET_CORPORATE_PASS_ITEM,
        payload: id
      }
    ];
  },
  processError: (response, { corporatePass }) => {
    return [...FetchErrorHandler(response), initialize(LIST_EDIT_VIEW_FORM_NAME, corporatePass)];
  }
};

export const EpicUpdateCorporatePass: Epic<any, any> = EpicUtils.Create(request);
