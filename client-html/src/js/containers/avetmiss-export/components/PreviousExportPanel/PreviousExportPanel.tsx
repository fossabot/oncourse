import React from "react";
import CardContent from "@material-ui/core/CardContent";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Card } from "@material-ui/core";
import { FundingStatus, FundingUpload } from "@api/model";
import InfoBox from "./InfoBox";

interface Props {
  item: FundingUpload;
  classes: any;
  onSubmit: (id: number, status: FundingStatus) => void;
  hideHeader: boolean;
}

const PreviousExportPanel = (props: Props) => {
  const {
 classes, onSubmit, item, hideHeader
} = props;
  return (
    <Card className="h-100">
      <CardContent className={clsx("mb-0 pl-2", classes.settingsWrapper)}>
        <Typography
          color="inherit"
          component="div"
          className={clsx("heading mt-1 centeredFlex pl-2", {
            "invisible": hideHeader
          })}
        >
          Previous Export
        </Typography>

        <Divider className={classes.divider} />

        <InfoBox item={item} onClick={onSubmit} />
      </CardContent>
    </Card>
  );
};

export default PreviousExportPanel;
