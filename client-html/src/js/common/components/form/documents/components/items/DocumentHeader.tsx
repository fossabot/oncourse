/*
 * Copyright ish group pty ltd 2020.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 */

import Avatar from "@material-ui/core/Avatar";
import { Directions, Language, Link } from "@material-ui/icons";
import { AlertTitle } from "@material-ui/lab";
import Alert from "@material-ui/lab/Alert";
import clsx from "clsx";
import React, { MouseEvent } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Grid, Popover } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faFileAlt,
  faFileArchive,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileWord
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@material-ui/core/Tooltip";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Document } from "@api/model";
import { AppTheme } from "../../../../../../model/common/Theme";
import { formatRelativeDate } from "../../../../../utils/dates/formatRelative";
import DocumentIconsChooser from "./DocumentIconsChooser";
import { III_DD_MMM_YYYY_HH_MM_SPECIAL } from "../../../../../utils/dates/format";
import { getDocumentShareSummary, getDocumentVersion } from "../utils";

library.add(faFileImage, faFilePdf, faFileExcel, faFileWord, faFilePowerpoint, faFileArchive, faFileAlt, faFile);

const styles = (theme: AppTheme) =>
  createStyles({
    closeIcon: {
      fontSize: "16px",
      width: "24px",
      height: "24px",
      margin: 0,
      padding: 0,
      position: "absolute",
      top: theme.spacing(0.5),
      right: theme.spacing(0.5)
    },
    miniGrayText: {
      fontSize: "10px",
      color: theme.palette.grey[500]
    },
    infoName: {
      fontSize: "14px"
    },
    avatar: {
      width: "30px",
      height: "30px",
      margin: "2px"
    },
    share: {
      display: "flex",
      alignItems: "center",
      position: "absolute",
      bottom: theme.spacing(0.5),
      right: theme.spacing(0.5)
    }
  });

const DocumentInfo = props => {
  const { classes } = props;
  return (
    <div className="flex-column flex-fill overflow-hidden pr-1">
      <Typography noWrap className={classes.infoName}>
        {props.name}
      </Typography>
      <Typography className={classes.miniGrayText}>
        {formatRelativeDate(new Date(props.date), new Date(), III_DD_MMM_YYYY_HH_MM_SPECIAL)}
      </Typography>
      <Typography className={classes.miniGrayText}>{props.size}</Typography>
    </div>
  );
};

interface Props {
  entity: string;
  index: number;
  unlink: any;
  classes: any;
  item: Document;
}

class DocumentHeader extends React.PureComponent<Props, any> {
  state = {
    popoverAnchor: null
  }

  unlinkItem = e => {
    e.stopPropagation();
    const { index, unlink } = this.props;
    unlink(index);
  };

  openDocumentURL = (e: MouseEvent<any>, url: string) => {
    e.stopPropagation();
    window.open(url);
  };

  handlePopoverClose = () => {
    this.setState({
      popoverAnchor: null
    });
  }

  handlePopoverOpen = event => {
    this.setState({
      popoverAnchor: event.currentTarget
    });
  };

  render() {
    const { classes, item, entity } = this.props;
    const { popoverAnchor } = this.state;

    const validUrl = item
      && (item.versionId
        ? item.versions.find(v => v.id === item.versionId).url
        : item.versions[0].url);

    return (
      <Grid container justify="space-between" className="mb-1">
        <div className="d-flex overflow-hidden">
          <Tooltip title="Open Document URL" disableHoverListener={!validUrl}>
            <ButtonBase disabled={!validUrl} onClick={(e: any) => this.openDocumentURL(e, validUrl)}>
              <DocumentIconsChooser
                type={getDocumentVersion(item).mimeType}
                thumbnail={item.thumbnail || (item.versions && item.versions[0] && item.versions[0].thumbnail)}
              />
            </ButtonBase>
          </Tooltip>

          <DocumentInfo
            name={item.name}
            date={item.added || (item.versions && item.versions[0] && item.versions[0].added)}
            size={getDocumentVersion(item).size}
            classes={classes}
          />

          <div
            className={classes.share}
            onMouseEnter={this.handlePopoverOpen}
            onMouseLeave={this.handlePopoverClose}
          >
            {((item.attachmentRelations.length === 1
              && item.attachmentRelations[0].entity === "Course"
              && item.access === "Public") || (!item.attachmentRelations.length && entity === "Course" && item.access === "Public"))
              && (
                <Avatar className={clsx("activeAvatar", classes.avatar)}>
                  <Language />
                </Avatar>
              )}
            {
              ["Link", "Public"].includes(item.access)
              && (
              <Avatar className={clsx("activeAvatar", classes.avatar)}>
                <Link />
              </Avatar>
            )
            }
            {
              ["Tutors and enrolled students", "Tutors only"].includes(item.access)
              && (
              <Avatar className={clsx("activeAvatar", classes.avatar)}>
                <Directions />
              </Avatar>
              )
            }
          </div>

          <Popover
            className="pointer-events-none"
            open={Boolean(popoverAnchor)}
            anchorEl={popoverAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            disableRestoreFocus
          >
            <Alert severity="info">
              <AlertTitle>Who can view this document</AlertTitle>
              {getDocumentShareSummary(item.access, item.attachmentRelations)}
            </Alert>
          </Popover>

          <Tooltip title="Unlink">
            <IconButton
              onClick={this.unlinkItem}
              className={classes.closeIcon}
            >
              <CloseIcon fontSize="inherit" color="inherit" />
            </IconButton>
          </Tooltip>
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(DocumentHeader);