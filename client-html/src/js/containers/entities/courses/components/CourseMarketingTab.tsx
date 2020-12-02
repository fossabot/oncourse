/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { change, FieldArray } from "redux-form";
import Grid from "@material-ui/core/Grid";
import { Sale } from "@api/model";
import DocumentsRenderer from "../../../../common/components/form/documents/DocumentsRenderer";
import { FormEditorField } from "../../../../common/components/markdown-editor/FormEditor";
import { State } from "../../../../reducers/state";
import { clearSales, getSales } from "../../sales/actions";
import NestedList, { NestedListItem } from "../../../../common/components/form/nestedList/NestedList";
import { getPlainCourses, setPlainCourses, setPlainCoursesSearch } from "../actions";
import { formatRelatedSalables, formattedEntityRelationTypes } from "../utils";
import EditInPlaceField from "../../../../common/components/form/form-fields/EditInPlaceField";
import { stubFunction } from "../../../../common/utils/common";

const salesSort = (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

const RelationCellBase = ({
  relationTypes, item, dispatch, form, index
}) => {
  const onRelationChange = rel => {
    const entityId = item.entityFromId || item.entityToId;
    const changed: Sale & { tempId: any } = {
      id: item.id,
      name: item.name,
      code: item.code,
      active: item.active,
      type: item.type,
      expiryDate: item.expiryDate,
      entityFromId: rel.combined ? entityId : rel.isReverseRelation ? null : entityId,
      entityToId: rel.isReverseRelation ? entityId : null,
      relationId: rel.id,
      tempId: item.tempId
    };
    dispatch(change(form, `relatedlSalables[${index}]`, changed));
  };

  const getSelectedRelation = () => {
    if (!relationTypes.length || typeof item.relationId !== "number") {
      return null;
    }
    return relationTypes.find(t => t.id === item.relationId && (t.combined || (
      typeof item.entityToId === "number"
        ? t.isReverseRelation
        : !t.isReverseRelation
    )));
  };

  return (
    <div className="ml-2">
      {relationTypes.length && (
        <EditInPlaceField
          meta={{}}
          items={relationTypes}
          input={{
            onChange: onRelationChange,
            onFocus: stubFunction,
            onBlur: stubFunction,
            value: getSelectedRelation()
          }}
          formatting="inline"
          returnType="object"
          placeholder="Select relation"
          select
        />
      )}
    </div>
  );
};

const CourseMarketingTab: React.FC<any> = props => {
  const {
    twoColumn,
    classes,
    dispatch,
    form,
    showConfirm,
    values,
    sales,
    getSearchResult,
    clearSearchResult,
    pending,
    submitSucceeded,
    courses,
    coursesPending,
    setCoursesSearch,
    getCourses,
    clearCoursesSearch,
    entityRelationTypes
  } = props;

  const onDeleteAll = useCallback(() => {
    dispatch(change(form, "relatedlSalables", []));
  }, [form]);

  const onDelete = useCallback(
    (saleToDelete: NestedListItem) => {
      dispatch(
        change(
          form,
          "relatedlSalables",
          values.relatedlSalables.filter(
            sale => String(sale.id) !== String(saleToDelete.id) || sale.type !== saleToDelete.entityName
          )
        )
      );
    },
    [form, values.relatedlSalables]
  );

  const onAdd = useCallback(
    (salesToAdd: NestedListItem[]) => {
      const salesCombined = (sales || []).concat(courses || []);

      const newSalesList = values.relatedlSalables.concat(
        salesToAdd.map(v1 => {
          const sale = salesCombined.find(v2 => String(v2.id) === String(v1.entityId) && v2.type === v1.entityName);
          return {
            ...sale, tempId: sale.id, entityFromId: sale.id, relationId: -1
          };
        })
      );
      newSalesList.sort(salesSort);
      dispatch(change(form, "relatedlSalables", newSalesList));
    },
    [form, sales, courses, values.relatedlSalables]
  );

  const searchCourses = useCallback(search => {
    setCoursesSearch(search);
    getCourses();
  }, []);

  const listValues = useMemo(() => (values && values.relatedlSalables ? formatRelatedSalables(values.relatedlSalables) : []), [
    values.relatedlSalables
  ]);

  const searchValues = useMemo(() => [...(sales ? formatRelatedSalables(sales) : []), ...formatRelatedSalables(courses.filter(c => c.id !== values.id))], [
    sales,
    courses,
    values.id
  ]);

  const relationTypes = useMemo(() => formattedEntityRelationTypes(entityRelationTypes), [entityRelationTypes]);

  const relationCell = props => (
    <RelationCellBase
      {...props}
      relationTypes={relationTypes}
      dispatch={dispatch}
      form={form}
    />
  );

  return (
    <Grid container className="pl-3 pr-3">
      <Grid item xs={12}>
        <div className="heading mt-2 mb-2">Marketing</div>
      </Grid>

      <Grid item xs={12}>
        <FormEditorField name="webDescription" label="Web description" />
      </Grid>

      <Grid item xs={12} className="pb-3">
        <FieldArray
          name="documents"
          label="Documents"
          entity="Course"
          classes={classes}
          component={DocumentsRenderer}
          xsGrid={12}
          mdGrid={twoColumn ? 4 : 12}
          lgGrid={twoColumn ? 3 : 12}
          dispatch={dispatch}
          form={form}
          showConfirm={showConfirm}
          rerenderOnEveryChange
        />
      </Grid>

      <Grid item xs={twoColumn ? 10 : 12}>
        <NestedList
          title={`${listValues.length} Related courses / products`}
          searchPlaceholder="Find products"
          additionalSearchPlaceholder="Find courses"
          formId={values.id}
          values={listValues}
          searchValues={searchValues}
          pending={pending || coursesPending}
          onAdd={onAdd}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
          onSearch={getSearchResult}
          onAdditionalSearch={searchCourses}
          clearSearchResult={clearSearchResult}
          clearAdditionalSearchResult={clearCoursesSearch}
          sort={salesSort}
          resetSearch={submitSucceeded}
          dataRowClass={classes.dataRowClass}
          aqlEntity="Product"
          additionalAqlEntity="Course"
          additionalAqlEntityTags={["Course"]}
          CustomCell={relationCell}
        />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state: State) => ({
  sales: state.sales.items,
  pending: state.sales.pending,
  courses: state.courses.items,
  coursesPending: state.courses.loading,
  entityRelationTypes: state.preferences.entityRelationTypes
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    getSearchResult: (search: string) => {
      if (search) {
        dispatch(getSales(search));
      }
    },
    clearSearchResult: (pending: boolean) => dispatch(clearSales(pending)),
    getCourses: (offset?: number) => dispatch(getPlainCourses(offset, null, true)),
    setCoursesSearch: (search: string) => dispatch(setPlainCoursesSearch(search)),
    clearCoursesSearch: (loading?: boolean) => {
      dispatch(setPlainCourses([], null, null, loading));
    }
  });

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(CourseMarketingTab);