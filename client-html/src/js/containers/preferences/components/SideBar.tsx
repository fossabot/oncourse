import React, { useCallback, useMemo, useState } from "react";
import { MenuItem } from "@material-ui/core";
import { connect } from "react-redux";
import Menu from "@material-ui/core/Menu/Menu";
import { DataCollectionType } from "@api/model";
import { State } from "../../../reducers/state";
import CollapseMenuList from "../../../common/components/layout/side-bar-list/CollapseSideBarList";
import routes from "../routes";
import { SidebarSharedProps } from "../../../model/common/sidebar";

const formTypes = Object.keys(DataCollectionType).map(type => {
  const response = { type, displayName: type };

  if (type === "Survey") {
    response.displayName = "Student Feedback";
  }
  return response;
});

const preferencesItems = routes
  .filter(r => r.title)
  .map(({ url, title }) => ({
    url,
    name: title
  }));

const DataCollectionTypesMenu = React.memo<any>(({ anchorEl, history, onClose }) => {
  const handleMenuClick = useCallback(e => {
    history.push(`/preferences/collectionForms/new/${e.target.getAttribute("role")}/`);
    onClose();
  }, []);

  return (
    <Menu id="types-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {formTypes.map(val => (
        <MenuItem key={val.type} role={val.type} onClick={handleMenuClick}>
          {val.displayName}
        </MenuItem>
      ))}
    </Menu>
  );
});

const SideBar = React.memo<any>(
  ({
 search, history, collectionForms, collectionRules, activeFiltersConditions, tutorRoles
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const dataCollectionTypesMenuOpen = useCallback(e => setAnchorEl(e.currentTarget), []);
    const dataCollectionTypesMenuClose = useCallback(() => setAnchorEl(null), []);

    const dataCollectionFormsLinkCondition = useCallback(
      i => `/preferences/collectionForms/edit/${i.type}/${i.id}`,
      []
    );
    const dataCollectionRulesLinkCondition = useCallback(i => `/preferences/collectionRules/edit/${i.id}`, []);
    const preferencesLinkCondition = useCallback(i => i.url, []);
    const tutorRolesLinkCondition = useCallback(i => `/preferences/tutorRoles/${i.id}`, []);

    const sharedProps = useMemo<SidebarSharedProps>(
      () => ({
 history, search, activeFiltersConditions, category: "Preferences"
}),
      [history, search, activeFiltersConditions]
    );

    return (
      <>
        <DataCollectionTypesMenu anchorEl={anchorEl} history={history} onClose={dataCollectionTypesMenuClose} />

        <CollapseMenuList
          name="Data Collection Forms"
          basePath="/preferences/collectionForms/"
          customPlusHandler={dataCollectionTypesMenuOpen}
          linkCondition={dataCollectionFormsLinkCondition}
          data={collectionForms}
          sharedProps={sharedProps}
          defaultCollapsed
        />

        <CollapseMenuList
          name="Data Collection Rules"
          basePath="/preferences/collectionRules/"
          plusIconPath="new"
          linkCondition={dataCollectionRulesLinkCondition}
          data={collectionRules}
          sharedProps={sharedProps}
          defaultCollapsed
        />

        <CollapseMenuList
          name="Tutor Pay Rates"
          basePath="/preferences/tutorRoles/"
          plusIconPath="new"
          linkCondition={tutorRolesLinkCondition}
          data={tutorRoles}
          sharedProps={sharedProps}
          defaultCollapsed
        />

        <CollapseMenuList
          name="Preferences"
          basePath="/preferences/"
          linkCondition={preferencesLinkCondition}
          data={preferencesItems}
          sharedProps={sharedProps}
        />
      </>
    );
  }
);

const mapStateToProps = (state: State) => ({
  collectionForms: state.preferences.dataCollectionForms,
  collectionRules: state.preferences.dataCollectionRules,
  tutorRoles: state.preferences.tutorRoles
});

export default connect<any, any, any>(
  mapStateToProps,
  null
)(SideBar);
