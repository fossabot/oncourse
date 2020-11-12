import { PreferenceEnum, UserPreference } from "@api/model";

type mockedUserPreferencesDB = { [key in PreferenceEnum]?: string | number };

export function mockUserPreferences(): mockedUserPreferencesDB {
  const mapUserPreference = (key: PreferenceEnum): UserPreference => ({
    key,
    value: this.userPreferences[key]
  });

  this.getUserPreferences = (keys: PreferenceEnum[]) => {
    return keys.map(mapUserPreference);
  };

  return {
    "html.dashboard.category.width": 300,
    "html.global.theme": "default",
    "google.analytics.cid": "dbcbdffcb3b601c2bdeb1391a5015499",
    "google.analytics.ci": "63 083 009 205",
    "google.analytics.cn": "OnRoad OffRoad Training",
    "google.analytics.uid": "779",
    "timezone.default": "Australia/Hobart",
    "systemUser.defaultAdministrationCentre.name": "OnRoad OffRoad Training",
    "license.scripting": "",
    "license.accesscontrol": "",
    "account.default.studentEnrolments.id": "11025",
    "account.default.voucherLiability.id": "4682"
  };
}
