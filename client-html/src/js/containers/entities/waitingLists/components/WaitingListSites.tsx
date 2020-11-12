/*
 * Copyright ish group pty ltd. All rights reserved. https://www.ish.com.au
 * No copying or use of this code is allowed without permission in writing from ish.
 */

import * as React from "react";
import { change } from "redux-form";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Site } from "@api/model";
import { Grid } from "@material-ui/core";
import NestedList, { NestedListItem } from "../../../../common/components/form/nestedList/NestedList";
import { getSites, setPlainSites } from "../../sites/actions";
import { State } from "../../../../reducers/state";

class WaitingListSites extends React.PureComponent<any, any> {
  sitesToNestedListItems = (sites: Site[]) =>
    sites.map(site => ({
        id: site.id.toString(),
        entityId: site.id,
        primaryText: site.name,
        secondaryText: `${site.suburb ? site.suburb + ", " : ""} ${site.postcode ? site.postcode : ""}`,
        link: `/site/${site.id}`,
        active: true
      }));

  onAddSite = (items: NestedListItem[]): void => {
    const {
 dispatch, form, values, foundQuickSearchSites
} = this.props;
    const updated = (values.sites ? values.sites : []).concat(
      items.map(item => foundQuickSearchSites.find(site => site.id === item.entityId))
    );
    dispatch(change(form, "sites", updated));
  };

  onDeleteSite = (item: NestedListItem): void => {
    const { dispatch, form, values } = this.props;
    dispatch(
      change(
        form,
        "sites",
        values.sites.filter(site => site.id !== item.entityId)
      )
    );
  };

  onDeleteAllSites = (): void => {
    const { dispatch, form } = this.props;
    dispatch(change(form, "sites", []));
  };

  render() {
    const {
      foundQuickSearchSites,
      pendingQuickSearchSites,
      getQuickSearchSites,
      submitSucceeded,
      twoColumn,
      values,
      clearSites
    } = this.props;

    return (
      <Grid container className="pl-3 pr-3 pb-2">
        <Grid item xs={twoColumn ? 6 : 12}>
          <NestedList
            formId={values && values.id}
            title="Sites"
            searchPlaceholder="Find sites"
            values={values && values.sites ? this.sitesToNestedListItems(values.sites) : []}
            searchValues={foundQuickSearchSites ? this.sitesToNestedListItems(foundQuickSearchSites) : []}
            pending={pendingQuickSearchSites}
            onAdd={this.onAddSite}
            onDelete={this.onDeleteSite}
            onDeleteAll={this.onDeleteAllSites}
            onSearch={getQuickSearchSites}
            clearSearchResult={clearSites}
            sort={(a, b) =>
              (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)}
            resetSearch={submitSucceeded}
            aqlEntity="Site"
            aqlEntityTags={["Site"]}
            usePaper
          />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state: State) => ({
  foundQuickSearchSites: state.sites.items,
  pendingQuickSearchSites: state.sites.loading
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    getQuickSearchSites: (search: string) => dispatch(getSites(null, "name,suburb,postcode", null, null, search)),
    clearSites: (loading: boolean) => dispatch(setPlainSites([]))
  });

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(WaitingListSites);
