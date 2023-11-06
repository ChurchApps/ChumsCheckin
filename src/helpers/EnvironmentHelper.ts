import { CONTENT_ROOT, ACCESS_API, MEMBERSHIP_API, ATTENDANCE_API, STAGE } from "@env";
import { ApiHelper } from "./ApiHelper";
export class EnvironmentHelper {
  private static MembershipApi = "";
  private static AttendanceApi = "";

  static ContentRoot = "";

  static init = () => {
    let stage = STAGE;
    stage = "prod";
    switch (stage) {
      case "staging": EnvironmentHelper.initStaging(); break;
      case "prod": EnvironmentHelper.initProd(); break;
      default: EnvironmentHelper.initDev(); break;
    }
    ApiHelper.apiConfigs = [
      { keyName: "MembershipApi", url: EnvironmentHelper.MembershipApi, jwt: "", permisssions: [] },
      { keyName: "AttendanceApi", url: EnvironmentHelper.AttendanceApi, jwt: "", permisssions: [] },
    ];
  };

  static initDev = () => {
    this.initStaging();
    EnvironmentHelper.MembershipApi = MEMBERSHIP_API || EnvironmentHelper.MembershipApi;
    EnvironmentHelper.AttendanceApi = ATTENDANCE_API || EnvironmentHelper.AttendanceApi;
    EnvironmentHelper.ContentRoot = CONTENT_ROOT || EnvironmentHelper.ContentRoot;
  };

  //NOTE: None of these values are secret.
  static initStaging = () => {
    EnvironmentHelper.MembershipApi = "https://membershipapi.staging.churchapps.org";
    EnvironmentHelper.AttendanceApi = "https://attendanceapi.staging.churchapps.org";
    EnvironmentHelper.ContentRoot = "https://content.staging.churchapps.org";
  };

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.MembershipApi = "https://membershipapi.churchapps.org";
    EnvironmentHelper.AttendanceApi = "https://attendanceapi.churchapps.org";
    EnvironmentHelper.ContentRoot = "https://content.churchapps.org";
  };
}


