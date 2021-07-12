/*
 * Copyright ish group pty ltd 2021.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { Dispatch } from "redux";
import { Lead } from "@api/model";
import ListView from "../../../common/components/list-view/ListView";
import SendMessageEditView from "../messages/components/SendMessageEditView";
import {
  clearListState,
  getFilters,
  setListEditRecord,
} from "../../../common/components/list-view/actions";
import { getEntityTags, getListTags } from "../../tags/actions";
import {
  createLead,
  getLead,
  removeLead,
  updateLead
} from "./actions";
import { getManualLink } from "../../../common/utils/getManualLink";
import { State } from "../../../reducers/state";
import LeadCogWheel from "./components/LeadCogWheel";
import { LIST_EDIT_VIEW_FORM_NAME } from "../../../common/components/list-view/constants";
import { checkPermissions } from "../../../common/actions";
import LeadEditView from "./components/LeadEditView";

const Initial: Lead = {
  id: null,
  // privateNotes: null,
  studentNotes: null,
  studentCount: 1,
  tags: [],
  sites: [],
  customFields: {}
};

const findRelatedGroup: any[] = [
  { title: "Audits", list: "audit", expression: "entityIdentifier == Lead and entityId" },
  { title: "Contacts", list: "contact", expression: "student.leads.id" }
];

const nestedEditFields = {
  SendMessage: props => <SendMessageEditView {...props} />
};

const manualLink = getManualLink("leads");

// const nameCondition = (value: Lead) => value.courseName;

const Leads = props => {
  useEffect(() => {
    props.getTags();
    props.getFilters();
    props.getQePermissions();
    props.getTagsForSitesSearch();

    return () => props.clearListState();
  }, []);

  const {
    getLeadRecord, onCreate, onDelete, onSave, updateTableModel, onInit
  } = props;

  return (
    <div>
      <ListView
        listProps={{
          primaryColumn: "student.contact.fullName",
          secondaryColumn: "course.name"
        }}
        editViewProps={{
          manualLink,
          // nameCondition
        }}
        updateTableModel={updateTableModel}
        nestedEditFields={nestedEditFields}
        EditViewContent={LeadEditView}
        getEditRecord={getLeadRecord}
        rootEntity="Lead"
        onInit={onInit}
        onCreate={onCreate}
        onDelete={onDelete}
        onSave={onSave}
        findRelated={findRelatedGroup}
        CogwheelAdornment={LeadCogWheel}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  customFieldTypesUpdating: state.customFieldTypes.updating,
  customFieldTypes: state.customFieldTypes.types["Lead"]
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  onInit: () => {
    dispatch(setListEditRecord(Initial));
    dispatch(initialize(LIST_EDIT_VIEW_FORM_NAME, Initial));
  },
  getQePermissions: () => {
    dispatch(checkPermissions({ keyCode: "ENROLMENT_CREATE" }));
  },
  getTagsForSitesSearch: () => {
    dispatch(getEntityTags("Site"));
  },
  getFilters: () => dispatch(getFilters("Lead")),
  getTags: () => dispatch(getListTags("Lead")),
  clearListState: () => dispatch(clearListState()),
  getLeadRecord: (id: string) => dispatch(getLead(id)),
  onSave: (id: string, lead: Lead) => dispatch(updateLead(id, lead)),
  onCreate: (lead: Lead) => dispatch(createLead(lead)),
  onDelete: (id: string) => dispatch(removeLead(id))
});

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Leads);