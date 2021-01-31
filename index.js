/**
 * @format
 */
import { BaseimageUrl, ApiRoot, AccessApiRoot } from '@env'
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { EnvironmentHelper } from "./src/helpers";

//console.log("*************" + ApiRoot);



//EnvironmentHelper.ChumsApiUrl = ApiRoot
//EnvironmentHelper.AccessManagementApiUrl = AccessApiRoot
//EnvironmentHelper.ImageBaseUrl = BaseimageUrl

AppRegistry.registerComponent(appName, () => App);
