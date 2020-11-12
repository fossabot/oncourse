/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { Epic } from "redux-observable";

import * as EpicUtils from "../../../../common/epics/EpicUtils";
import TransactionService from "../services/TransactionService";
import { CREATE_TRANSACTION_ITEM } from "../actions/index";
import { FETCH_SUCCESS } from "../../../../common/actions/index";
import FetchErrorHandler from "../../../../common/api/fetch-errors-handlers/FetchErrorHandler";
import { initialize } from "redux-form";
import { Transaction } from "@api/model";
import {
  clearListNestedEditRecord,
  GET_RECORDS_REQUEST,
  setListSelection
} from "../../../../common/components/list-view/actions";
import { LIST_EDIT_VIEW_FORM_NAME } from "../../../../common/components/list-view/constants";

let savedItem: Transaction;

const request: EpicUtils.Request<any, any, any> = {
  type: CREATE_TRANSACTION_ITEM,
  getData: payload => {
    savedItem = payload.transaction;
    return TransactionService.createTransaction(payload.transaction);
  },
  processData: () => {
    return [
      {
        type: FETCH_SUCCESS,
        payload: { message: "Transaction Record created" }
      },
      {
        type: GET_RECORDS_REQUEST,
        payload: { entity: "AccountTransaction", listUpdate: true }
      },
      setListSelection([]),
      clearListNestedEditRecord(0),
      initialize(LIST_EDIT_VIEW_FORM_NAME, {})
    ];
  },
  processError: response => [
    ...FetchErrorHandler(response, "Transaction Record was not created"),
    initialize(LIST_EDIT_VIEW_FORM_NAME, savedItem)
  ]
};

export const EpicCreateTransaction: Epic<any, any> = EpicUtils.Create(request);
