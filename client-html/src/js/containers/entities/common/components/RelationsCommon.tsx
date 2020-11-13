/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import React, { useCallback, useMemo } from "react";
import { change } from "redux-form";
import {
  Course, EntityRelationType, Qualification, Sale, Module
} from "@api/model";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { State } from "../../../../reducers/state";
import NestedList, { NestedListItem } from "../../../../common/components/form/nestedList/NestedList";
import { formatRelatedSalables, formattedEntityRelationTypes, salesSort } from "../utils";
import { getPlainCourses, setPlainCourses, setPlainCoursesSearch } from "../../courses/actions";
import { BooleanArgFunction, StringArgFunction } from "../../../../model/common/CommonFunctions";
import NestedListRelationCell from "./NestedListRelationCell";
import { clearSales, getSales } from "../../sales/actions";
import {
  clearPlainQualificationItems,
  getPlainQualifications,
  setPlainQualificationSearch
} from "../../qualifications/actions";
import { clearModuleItems, getModules, setModuleSearch } from "../../modules/actions";
import { PLAIN_LIST_MAX_PAGE_SIZE } from "../../../../constants/Config";

interface Props {
  values: any;
  dispatch: Dispatch;
  submitSucceeded: boolean;
  form: string;
  rootEntity: string;
  courses?: Course[];
  coursesPending?: boolean;
  searchCourses?: StringArgFunction;
  clearCoursesSearch?: BooleanArgFunction;
  entityRelationTypes?: EntityRelationType[];
  clearSalesSearch?: BooleanArgFunction;
  clearModuleSearch?: BooleanArgFunction;
  clearQualificationsSearch?: BooleanArgFunction;
  searchSales?: StringArgFunction;
  searchModules?: StringArgFunction;
  searchQualifications?: StringArgFunction;
  sales?: Sale[];
  salesPending?: boolean;
  qualifications?: Qualification[];
  qualificationsPending?: boolean;
  modules?: Module[];
  modulesPending?: boolean;
}

const RelationsCommon: React.FC<Props> = (
  {
    values,
    dispatch,
    form,
    submitSucceeded,
    searchCourses,
    clearCoursesSearch,
    entityRelationTypes,
    clearSalesSearch,
    clearModuleSearch,
    clearQualificationsSearch,
    searchSales,
    searchModules,
    searchQualifications,
    courses,
    coursesPending,
    sales,
    salesPending,
    qualifications,
    qualificationsPending,
    modules,
    modulesPending,
    rootEntity
  }
) => {
  const relationTypes = useMemo(() => formattedEntityRelationTypes(entityRelationTypes), [entityRelationTypes]);

  const listValues = useMemo(() => (values && values.relatedSellables ? formatRelatedSalables(values.relatedSellables) : []), [
    values.relatedSellables
  ]);

  const searchValues = useMemo(() => [
    ...courses
      ? formatRelatedSalables(rootEntity === "Course" ? courses.filter(c => c.id !== values.id) : courses)
      : [],
    ...sales
      ? formatRelatedSalables(["VoucherProduct", "MembershipProduct", "ArticleProduct"].includes(rootEntity)
        ? sales.filter(c => c.id !== values.id && c.type !== rootEntity)
        : sales)
      : [],
    ...qualifications
      ? formatRelatedSalables(rootEntity === "Qualification"
        ? qualifications.filter(c => c.id !== values.id)
        : qualifications, "Qualification")
      : [],
    ...modules
      ? formatRelatedSalables(rootEntity === "Module" ? modules.filter(c => c.id !== values.id) : modules, "Module")
      : []
  ], [
    courses,
    sales,
    qualifications,
    modules,
    values.id
  ]);

  const onAdd = (salesToAdd: NestedListItem[]) => {
    const newSalesList = values.relatedSellables.concat(
      salesToAdd.map(s => ({
        id: s.entityId,
        tempId: s.entityId,
        name: s.primaryText,
        code: s.secondaryText,
        active: s.active,
        type: s.entityName,
        expiryDate: null,
        entityFromId: s.entityId,
        entityToId: null,
        relationId: -1
        }))
    );
    newSalesList.sort(salesSort);
    dispatch(change(form, "relatedSellables", newSalesList));
  };

  const onDeleteAll = useCallback(() => {
    dispatch(change(form, "relatedSellables", []));
  }, [form]);

  const onDelete = useCallback(
    saleToDelete => {
      dispatch(
        change(
          form,
          "relatedSellables",
          values.relatedSellables.filter(
            item => item.id !== saleToDelete.id
          )
        )
      );
    },
    [form, values.relatedSellables]
  );

  const relationCell = props => (
    <NestedListRelationCell
      {...props}
      relationTypes={relationTypes}
      dispatch={dispatch}
      form={form}
    />
  );

  return (
    <NestedList
      title={`${listValues.length || ""} relations`}
      formId={values.id}
      values={listValues}
      searchValues={searchValues}
      pending={coursesPending || salesPending || qualificationsPending || modulesPending}
      onAdd={onAdd}
      onDelete={onDelete}
      onDeleteAll={onDeleteAll}
      onSearch={(search, entity) => {
        switch (entity) {
          case "Course":
            searchCourses(search);
            break;
          case "Product":
            searchSales(search);
            break;
          case "Module":
            searchModules(search);
            break;
          case "Qualification":
            searchQualifications(search);
            break;
        }
      }}
      clearSearchResult={(pending, entity) => {
        switch (entity) {
          case "Course":
            clearCoursesSearch(pending);
            break;
          case "Product":
            clearSalesSearch(pending);
            break;
          case "Module":
            clearModuleSearch(pending);
            break;
          case "Qualification":
            clearQualificationsSearch(pending);
            break;
        }
      }}
      sort={salesSort}
      resetSearch={submitSucceeded}
      dataRowClass="grid-temp-col-3-fr"
      aqlEntities={["Course", "Product", "Module", "Qualification"]}
      CustomCell={relationCell}
    />
);
};

const mapStateToProps = (state: State) => ({
  courses: state.courses.items,
  coursesPending: state.courses.loading,
  sales: state.sales.items,
  salesPending: state.sales.pending,
  qualifications: state.qualification.items,
  qualificationsPending: state.qualification.loading,
  modules: state.modules.items,
  modulesPending: state.modules.loading,
  entityRelationTypes: state.preferences.entityRelationTypes
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  searchQualifications: search => {
    dispatch(setPlainQualificationSearch(search));
    dispatch(getPlainQualifications(null, "", true, PLAIN_LIST_MAX_PAGE_SIZE));
  },
  clearQualificationsSearch: (loading?: boolean) => dispatch(clearPlainQualificationItems(loading)),
  searchModules: search => {
    dispatch(setModuleSearch(search));
    dispatch(getModules(null, "nationalCode,title,nominalHours,isOffered", true));
  },
  clearModuleSearch: (loading?: boolean) => dispatch(clearModuleItems(loading)),
  searchSales: (search: string) => {
    if (search) {
      dispatch(getSales(search));
    }
  },
  clearSalesSearch: (loading?: boolean) => dispatch(clearSales(loading)),
  searchCourses: (search: string) => {
    dispatch(setPlainCoursesSearch(search));
    dispatch(getPlainCourses(null, null, true));
  },
  clearCoursesSearch: (loading?: boolean) => {
    dispatch(setPlainCourses([], null, null, loading));
  }
});

export default connect<any, any, Props>(mapStateToProps, mapDispatchToProps)(RelationsCommon);