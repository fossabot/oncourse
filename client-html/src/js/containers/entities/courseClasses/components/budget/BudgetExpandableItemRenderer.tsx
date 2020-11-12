/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import React, { useCallback, useMemo } from "react";
import clsx from "clsx";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import { ClassCost } from "@api/model";
import { IconButton } from "@material-ui/core";
import Decimal from "decimal.js-light";
import { formatCurrency } from "../../../../../common/utils/numbers/numbersNormalizing";
import { NumberArgFunction, StringArgFunction } from "../../../../../model/common/CommonFunctions";
import { ClassCostType } from "../../../../../model/entities/CourseClass";

interface BudgetItemRowProps {
  value: ClassCost;
  currencySymbol: string;
  maxBasedValue: number;
  projectedBasedValue: number;
  actualBasedValue: number;
  openEditModal: (data: ClassCost) => void;
  onDeleteClassCost: NumberArgFunction;
  classes?: any;
}

const BudgetItemRow = React.memo<BudgetItemRowProps>(
  ({
    value,
    currencySymbol,
    maxBasedValue,
    projectedBasedValue,
    actualBasedValue,
    classes,
    openEditModal,
    onDeleteClassCost
  }) => {
    const onEditClick = () => openEditModal(value);
    const onDeleteClick = useCallback(
      () => (onDeleteClassCost ? onDeleteClassCost(value.id || value["temporaryId"]) : null),
      [value.id, onDeleteClassCost]
    );

    const amountLabel = useMemo(
      () =>
        `${formatCurrency(value.perUnitAmountExTax, currencySymbol)} ${
          value.repetitionType === "Discount" ? "" : value.repetitionType
        }`,
      [value.perUnitAmountExTax, value.repetitionType, currencySymbol]
    );

    const maxBasedLabel = useMemo(() => formatCurrency(maxBasedValue, currencySymbol), [maxBasedValue, currencySymbol]);

    const projectedBasedLabel = useMemo(() => formatCurrency(projectedBasedValue, currencySymbol), [
      projectedBasedValue,
      currencySymbol
    ]);

    const actualBasedLabel = useMemo(() => formatCurrency(actualBasedValue, currencySymbol), [
      actualBasedValue,
      currencySymbol
    ]);

    const percentOfProjectedValue = useMemo(
      () =>
        (projectedBasedValue <= 0
          ? 0
          : new Decimal(actualBasedValue)
              .div(projectedBasedValue || 1)
              .mul(100)
              .toDecimalPlaces(0)
              .toFixed(2)),

      [projectedBasedValue, actualBasedValue]
    );

    const description = useMemo(() =>
        (value.description + (value.tutorRole ? ` (${value.tutorRole})` : "")),
     [value.description, value.tutorRole]);

    return (
      <Grid
        item
        xs={12}
        container
        alignItems="center"
        direction="row"
        className={classes.tableTab}
        onDoubleClick={onEditClick}
      >
        <Grid item xs={3}>
          <Typography variant="body2">{description}</Typography>
        </Grid>
        <Grid item xs={2} className={classes.rowItemCol1}>
          <Typography variant="body2" className="money text-end">
            {amountLabel}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.rowItemCol2}>
          <Typography variant="body2" className="money text-end">
            {maxBasedLabel}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.rowItemCol3}>
          <Typography variant="body2" className="money text-end">
            {projectedBasedLabel}
          </Typography>
        </Grid>
        <Grid item xs={2} container alignItems="center" className={classes.rowItemCol4}>
          <Typography variant="body2" className="disabled">
            (
            {percentOfProjectedValue}
            %)&nbsp;
          </Typography>
          <Typography variant="body2" className="money">
            {actualBasedLabel}
          </Typography>
        </Grid>
        <Grid item xs={1} container alignItems="center">
          <div className="flex-fill" />

          <div className={classes.tableTabButtons}>
            {onDeleteClassCost && (
              <IconButton className="lightGrayIconButton" onClick={onDeleteClick}>
                <Delete fontSize="inherit" />
              </IconButton>
            )}

            <IconButton className="lightGrayIconButton" onClick={onEditClick}>
              <Edit fontSize="inherit" />
            </IconButton>
          </div>
        </Grid>
      </Grid>
    );
  }
);

export interface BudgetExpandableProps {
  header: any;
  rowsValues: ClassCostType;
  currencySymbol: string;
  classes: any;
  openEditModal: (data: ClassCost) => void;
  onDeleteClassCost?: NumberArgFunction;
  expanded: boolean;
  setExpanded: StringArgFunction;
  showEmpty?: boolean;
  headerComponent?: any;
}

const BudgetExpandableItemRenderer: React.FC<BudgetExpandableProps> = ({
  header,
  rowsValues,
  currencySymbol,
  classes,
  openEditModal,
  onDeleteClassCost,
  expanded,
  setExpanded,
  showEmpty,
  headerComponent
}) => {
  const handleChange = useCallback(() => {
    setExpanded(header);
  }, [header]);

  const maxLabel = useMemo(() => formatCurrency(rowsValues.max, currencySymbol), [currencySymbol, rowsValues.max]);

  const projectedLabel = useMemo(() => formatCurrency(rowsValues.projected, currencySymbol), [
    currencySymbol,
    rowsValues.projected
  ]);

  const actualLabel = useMemo(() => formatCurrency(rowsValues.actual, currencySymbol), [
    currencySymbol,
    rowsValues.actual
  ]);

  const percentOfProjectedValue = useMemo(
    () =>
      (rowsValues.projected <= 0
        ? 0
        : new Decimal(rowsValues.actual)
            .div(rowsValues.projected || 1)
            .mul(100)
            .toDecimalPlaces(0)
            .toFixed(2)),
    [rowsValues.projected, rowsValues.actual]
  );

  return rowsValues.items.length || showEmpty ? (
    <div className={classes.root}>
      <ExpansionPanel
        expanded={expanded}
        onChange={handleChange}
        className={classes.panel}
        TransitionProps={{
          unmountOnExit: true,
          mountOnEnter: true
        }}
      >
        <ExpansionPanelSummary
          classes={{
            root: classes.panelSumRoot,
            focused: classes.panelSumFocus
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Grid container direction="row">
            <Grid item xs={5}>
              {headerComponent || <div className="secondaryHeading">{header}</div>}
            </Grid>
            {!expanded && (
              <>
                <Grid item xs={2} className={classes.headerItem}>
                  <Typography variant="body2" className="money">
                    {maxLabel}
                  </Typography>
                </Grid>
                <Grid item xs={2} className={classes.headerItem}>
                  <Typography variant="body2" className="money">
                    {projectedLabel}
                  </Typography>
                </Grid>
                {/* <Grid item xs={1} /> */}
                <Grid item xs={2} className={classes.headerItem}>
                  <Typography variant="body2" className="money">
                    {actualLabel}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container>
            {rowsValues.items.map((item, i) => (
              <BudgetItemRow
                key={i}
                openEditModal={openEditModal}
                onDeleteClassCost={onDeleteClassCost}
                value={item.value}
                currencySymbol={currencySymbol}
                classes={classes}
                projectedBasedValue={item.projected}
                actualBasedValue={item.actual}
                maxBasedValue={item.max}
              />
            ))}
            <Grid item xs={12} container direction="row" className={classes.tableTab}>
              <Grid item xs={5} />
              <Grid item xs={2} className={clsx("pt-1 summaryTopBorder", classes.rowItemCol2)}>
                <Typography variant="body2" className="money text-end">
                  {maxLabel}
                </Typography>
              </Grid>
              <Grid item xs={2} className={clsx("pt-1 summaryTopBorder", classes.rowItemCol3)}>
                <Typography variant="body2" className="money text-end">
                  {projectedLabel}
                </Typography>
              </Grid>
              <Grid item xs={2} className={clsx("pt-1 summaryTopBorder", classes.rowItemCol4)}>
                <Typography variant="body2" className="disabled">
                  (
                  {percentOfProjectedValue}
                  %)&nbsp;
                </Typography>
                <Typography variant="body2">{actualLabel}</Typography>
              </Grid>
              <Grid item xs={1} className="pt-1 summaryTopBorder" />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  ) : null;
};

export default BudgetExpandableItemRenderer;
