
import Snackbar from 'react-native-snackbar'
import { StyleConstants } from './Styles'
import { StackNavigationProp } from '@react-navigation/stack'
import { ScreenList } from '../screens'


export type screenNavigationProps = StackNavigationProp<ScreenList, "Login">

export class Utilities {
  public static snackBar(message: string) {
    Snackbar.show({ text: message, backgroundColor: StyleConstants.baseColor, duration: Snackbar.LENGTH_SHORT });
  }

  public static getById(list: any[], id: number): any {
    var result = null;
    list.forEach(item => { if (item.id === id) result = item; });
    return result;
  }


  public static validateEmail = (email: string) => {
    let value = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = value.test(email.trim())
    return (isValid)
  }

}


