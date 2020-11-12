import * as React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { reconcileBanking } from "../actions";

class BankingCogwheelOptions extends React.PureComponent<any, any> {
  reconcileBanking = () => {
    const { reconcileBanking, selection, closeMenu, showConfirm } = this.props;
    showConfirm(
      () => {
        reconcileBanking(selection);
      },
      "You are about to reconcile selected records",
      "Continue"
    );
    closeMenu();
  };

  render() {
    const { selection, menuItemClass } = this.props;

    const hasSelected = Boolean(selection.length);

    const suffix = selection.length > 1 ? "s" : "";

    return (
      <MenuItem disabled={!hasSelected} className={menuItemClass} role="Completed" onClick={this.reconcileBanking}>
        Reconcile {selection.length} banking deposit{suffix}
      </MenuItem>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  reconcileBanking: (ids: number[]) => dispatch(reconcileBanking(ids))
});

export default connect<any, any, any>(null, mapDispatchToProps)(BankingCogwheelOptions);
