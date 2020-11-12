import * as React from "react";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DragIndicator from "@material-ui/icons/DragIndicator";
import Typography from "@material-ui/core/Typography";
import { withStyles, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import AddCircle from "@material-ui/icons/AddCircle";
import clsx from "clsx";

const styles = theme =>
  createStyles({
    panelRoot: {
      "&:before": {
        content: "none"
      },
      "&$panelExpandedWithoutMargin": {
        "&:last-child": {
          marginTop: theme.spacing(3),
          marginBottom: 0
        }
      },
      "&$panelExpanded": {
        "&:last-child": {
          marginBottom: theme.spacing(3)
        }
      }
    },
    panelExpanded: {},
    panelExpandedWithoutMargin: {},
    panelDetailsRoot: {
      "&$panelDetailsPadding": {
        padding: theme.spacing(0, 3)
      },
      "&.p-0": {
        padding: 0
      }
    },
    panelDetailsPadding: {},
    collapse: {
      overflow: "visible"
    },
    summaryRoot: {
      borderBottom: "1px solid transparent"
    },
    summaryExpanded: {
      borderBottomColor: `${theme.palette.divider}`
    },
    summaryExpandIcon: {
      "&:hover": {
        backgroundColor: theme.palette.action.hover
      }
    }
  });

const CardBase = props => {
  const {
    classes,
    children,
    heading,
    details,
    className,
    expanded,
    noPadding,
    onDelete,
    dragHandlerProps,
    disableExpandedBottomMargin,
    onAddItem,
    onDetailsClick
  } = props;

  return (
    <ExpansionPanel
      classes={{
        root: classes.panelRoot,
        expanded: disableExpandedBottomMargin ? classes.panelExpandedWithoutMargin : classes.panelExpanded
      }}
      className={className}
      defaultExpanded={expanded}
      // TransitionComponent={
      //   (
      //     <Collapse
      //       classes={{
      //         entered: classes.collapse
      //       }}
      //     />
      //   ) as any
      // }
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          root: classes.summaryRoot,
          expanded: classes.summaryExpanded,
          expandIcon: clsx("p-0-5 mr-2", classes.summaryExpandIcon)
        }}
      >
        <div className="flex-fill centeredFlex" {...dragHandlerProps}>
          <div>
            <Typography className="heading" component="div">
              {heading}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {details}
            </Typography>
          </div>
          {Boolean(dragHandlerProps) && <DragIndicator color="disabled" />}
          {Boolean(onAddItem) && (
            <IconButton className="addButtonColor fs2 p-1" onClick={onAddItem}>
              <AddCircle color="inherit" fontSize="inherit" />
            </IconButton>
          )}
        </div>
        <div>
          {Boolean(onDelete) && (
            <IconButton className="fs2 p-1" onClick={onDelete} data-component={heading}>
              <Delete fontSize="inherit" />
            </IconButton>
          )}
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        onClick={onDetailsClick}
        classes={{
          root: clsx("relative", classes.panelDetailsRoot)
        }}
        className={noPadding ? "p-0" : classes.panelDetailsPadding}
      >
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default withStyles(styles)(CardBase);
