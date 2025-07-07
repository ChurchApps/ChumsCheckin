
// import { StackNavigationProp } from "@react-navigation/stack";

import { ScreenList } from "../screenList";

export type screenNavigationProps = {
  navigate: (screen: string, params?: object) => void;
  goBack: () => void;
  replace: (screen: string, params?: object) => void;
};

// export type screenNavigationProps = StackNavigationProp<ScreenList, "Login">

export class Utilities {

  public static validateEmail = (email: string) => {
    //eslinteslint-comments/no-unlimited-disable
    let value = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = value.test(email.trim());
    return (isValid);
  };

}


