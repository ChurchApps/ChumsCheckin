import { ApiHelper } from "./ApiHelper";

export class EnvironmentHelper {

    //Local
    /*
    private static ImageBaseUrl = "http://192.168.1.36:3100";
    private static AccessApi = "http://192.168.1.36:8082";
    private static MembershipApi = "http://192.168.1.36:8083";
    private static AttendanceApi = "http://192.168.1.36:8085";
    */

    //Staging
    static ImageBaseUrl = "https://app.staging.chums.org";
    private static AccessApi = "https://accessapi.staging.churchapps.org";
    private static MembershipApi = "https://membershipapi.staging.churchapps.org";
    private static AttendanceApi = "https://attendanceapi.staging.churchapps.org";

    //Prod
    /*
    static ImageBaseUrl = "https://app.chums.org";
    private static AccessApi = "https://accessapi.churchapps.org";
    private static MembershipApi = "https://membershipapi.churchapps.org";
    private static AttendanceApi = "https://attendanceapi.churchapps.org";
*/

    static init = () => {
        /*
        switch (process.env.REACT_APP_STAGE) {
            case "staging": EnvironmentHelper.initStaging(); break;
            case "prod": EnvironmentHelper.initProd(); break;
            default: EnvironmentHelper.initDev(); break;
        }*/
        ApiHelper.apiConfigs = [
            { keyName: "AccessApi", url: EnvironmentHelper.AccessApi, jwt: "", permisssions: [] },
            { keyName: "MembershipApi", url: EnvironmentHelper.MembershipApi, jwt: "", permisssions: [] },
            { keyName: "AttendanceApi", url: EnvironmentHelper.AttendanceApi, jwt: "", permisssions: [] },
        ];
        ApiHelper.defaultApi = "AttendanceApi";
    }



    // static init = () => {
    //     switch (process.env.REACT_APP_STAGE) {
    //         case "staging": EnvironmentHelper.initStaging(); break;
    //         case "prod": EnvironmentHelper.initProd(); break;
    //         default: EnvironmentHelper.initDev(); break;
    //     }
    // }

    // static initDev = () => {
    //     EnvironmentHelper.AccessManagementApiUrl = process.env.REACT_APP_ACCESSMANAGEMENT_API_URL || "";
    //     EnvironmentHelper.ChumsApiUrl = process.env.REACT_APP_CHUMS_API_URL || "";
    //     EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
    //     EnvironmentHelper.GoogleAnalyticsTag = process.env.REACT_APP_GOOGLE_ANALYTICS || "";
    // }

    // //NOTE: None of these values are secret.
    // static initStaging = () => {
    //     EnvironmentHelper.AccessManagementApiUrl = "https://api.staging.livecs.org";
    //     EnvironmentHelper.ChumsApiUrl = "https://api.staging.chums.org";
    //     EnvironmentHelper.ContentRoot = "";
    //     EnvironmentHelper.GoogleAnalyticsTag = "";
    // }

    // //NOTE: None of these values are secret.
    // static initProd = () => {
    //     EnvironmentHelper.AccessManagementApiUrl = "https://api.livecs.org";
    //     EnvironmentHelper.ChumsApiUrl = "https://api.chums.org";
    //     EnvironmentHelper.ContentRoot = "";
    //     EnvironmentHelper.GoogleAnalyticsTag = "UA-164774603-4";
    // }


}


