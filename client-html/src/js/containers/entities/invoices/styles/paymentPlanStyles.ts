/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import { createStyles, fade } from "@material-ui/core/styles";
import { AppTheme } from "../../../../model/common/Theme";

export const paymentPlanStyles = (theme: AppTheme) => createStyles({
  root: {
    backgroundColor: "inherit",
    padding: 0
  },
  deleteIcon: {
    color: fade(theme.palette.text.primary, 0.2),
    fontSize: "18px",
    width: theme.spacing(4),
    height: theme.spacing(4),
    padding: 0
  },
  step: {
    "&:first-child $stepButton": {
      marginTop: theme.spacing(-1),
      paddingTop: theme.spacing(1)
    }
  },
  stepButton: {}
});
