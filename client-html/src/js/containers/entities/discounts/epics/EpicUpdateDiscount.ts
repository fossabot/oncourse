/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Epic } from "redux-observable";

import * as EpicUtils from "../../../../common/epics/EpicUtils";
import { GET_DISCOUNT_ITEM, UPDATE_DISCOUNT_ITEM, UPDATE_DISCOUNT_ITEM_FULFILLED } from "../actions";
import { FETCH_SUCCESS } from "../../../../common/actions";
import FetchErrorHandler from "../../../../common/api/fetch-errors-handlers/FetchErrorHandler";
import { Discount } from "@api/model";
import { GET_RECORDS_REQUEST } from "../../../../common/components/list-view/actions";
import { updateEntityItemById } from "../../common/entityItemsService";

const request: EpicUtils.Request<any, any, { id: number; discount: Discount }> = {
  type: UPDATE_DISCOUNT_ITEM,
  getData: ({ id, discount }) => updateEntityItemById("Discount", id, discount),
  processData: (v, s, { id }) => {
    return [
      {
        type: UPDATE_DISCOUNT_ITEM_FULFILLED
      },
      {
        type: FETCH_SUCCESS,
        payload: { message: "Discount Record updated" }
      },
      {
        type: GET_RECORDS_REQUEST,
        payload: { entity: "Discount", listUpdate: true, savedID: id }
      },
      {
        type: GET_DISCOUNT_ITEM,
        payload: id
      }
    ];
  },
  processError: response => {
    return [...FetchErrorHandler(response)];
  }
};

export const EpicUpdateDiscount: Epic<any, any> = EpicUtils.Create(request);
