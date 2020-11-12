/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import React from "react";
import clsx from "clsx";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { AppTheme } from "../../../model/common/Theme";

const styles = (theme: AppTheme) =>
  createStyles({
    expansionPanelRoot: {
      overflow: "visible",
      border: `1px solid ${theme.palette.divider}`,
      marginBottom: theme.spacing(2),
      "&:before": {
        display: "none"
      }
    },
    headerRoot: {
      width: "100%",
      background: "transparent"
    },
    expansionPanelSummaryContent: {
      position: "relative",
      "&$expansionPanelSummaryExpanded": {
        margin: "12px 0"
      }
    },
    expansionPanelSummaryRoot: {
      padding: `0 ${theme.spacing(2)}px`,
      "&$expansionPanelSummaryExpanded": {
        minHeight: 48
      }
    },
    expansionPanelSummaryExpanded: {},
    fieldCardRoot: {
      width: "100%",
      overflow: "visible"
    },
    contentRoot: {
      "&:last-child": {
        padding: 0
      }
    }
  });

export interface Props {
  title: string;
  expanded?: boolean;
  classes?: any;
  children?: any;
  onExpanded?: () => void;
  showArrow?: boolean;
  disabled?: boolean;
}

const CheckoutSectionExpandableRenderer = React.memo<Props>(props => {
  const {
 expanded, classes, title, children, onExpanded, showArrow, disabled
} = props;

  const handleExpanded = React.useCallback(() => {
    if (onExpanded) onExpanded();
  }, []);

  return (
    <ExpansionPanel
      expanded={expanded || false}
      onChange={handleExpanded}
      TransitionProps={{ mountOnEnter: true }}
      elevation={0}
      classes={{ root: classes.expansionPanelRoot }}
      disabled={disabled}
    >
      <ExpansionPanelSummary
        classes={{
          root: classes.expansionPanelSummaryRoot,
          content: clsx(classes.expansionPanelSummaryContent, showArrow && expanded && "selectedItemArrow"),
          expanded: classes.expansionPanelSummaryExpanded
        }}
        expandIcon={!expanded && <ExpandMoreIcon />}
      >
        <div className={clsx(classes.headerRoot, "centeredFlex")}>
          <div className="heading flex-fill">{title}</div>
        </div>
      </ExpansionPanelSummary>
      {children && (
        <ExpansionPanelDetails className="p-0">
          <Card classes={{ root: classes.fieldCardRoot }} elevation={0}>
            <CardContent classes={{ root: classes.contentRoot }}>{children}</CardContent>
          </Card>
        </ExpansionPanelDetails>
      )}
    </ExpansionPanel>
  );
});

export default withStyles(styles)(CheckoutSectionExpandableRenderer);
