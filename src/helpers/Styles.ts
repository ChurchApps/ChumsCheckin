import { StyleSheet, Dimensions } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export class StyleConstants {
  static deviceWidth = Dimensions.get("window").width;
  static deviceHeight = Dimensions.get("window").height;

  static fontSize = StyleConstants.deviceWidth * 4 / 100;
  static fontSize1 = StyleConstants.deviceWidth * 4.5 / 100;
  static fontSize2 = StyleConstants.deviceWidth * 5 / 100;
  static smallFont = StyleConstants.deviceWidth * 3.6 / 100;
  static smallerFont = StyleConstants.deviceWidth * 3.0 / 100;

  //Colors
  static baseColor = '#24B8FE'
  static baseColor1 = '#08A1CD'
  static blueColor = '#2196F3'
  static darkColor = '#3c3c3c';
  static blackColor = 'black';
  static grayColor = 'gray';
  static lightGrayColor = 'lightgray';
  static whiteColor = 'white';
  static yellowColor = "#FEAA24";
  static greenColor = '#70DC87';
  static redColor = "#B0120C";
  static cyanColor = '#1C9BA0';
  static darkPink = '	#FF69B4';
  static ghostWhite = '#F6F6F8'

  //Font
  static RobotoBold = 'Roboto-Bold';
  static RobotoBlack = 'Roboto-Black';
  static RobotoItalic = 'Roboto-Italic';
  static RobotoLight = 'Roboto-Light';
  static RobotoMedium = 'Roboto-Medium';
  static RobotoRegular = 'Roboto-Regular';
  static RobotoThin = 'Roboto-Thin';
}

export const Styles = StyleSheet.create({
  //Global styles
  mainContainer: { paddingHorizontal: '5%', backgroundColor: StyleConstants.ghostWhite, flex: 1, },
  fullWidthContainer: { backgroundColor: StyleConstants.ghostWhite, flex: 1, },
  H1: { fontSize: StyleConstants.fontSize2, alignSelf: 'flex-start', marginVertical: '4%', fontFamily: StyleConstants.RobotoLight },
  headerImageView: { height: StyleConstants.deviceHeight * 24 / 100, width: '100%', backgroundColor: StyleConstants.whiteColor },
  headerImage: { maxWidth: StyleConstants.deviceWidth * 70 / 100, height: StyleConstants.deviceHeight * 20 / 100, alignSelf: 'center' },
  printerStatus: { backgroundColor: '#09A1CD', height: 30, justifyContent: 'center', flexDirection: 'row' },
  content: { backgroundColor: StyleConstants.ghostWhite, paddingBottom: '5%', flex: 1, },
  label: { fontSize: StyleConstants.fontSize, alignSelf: 'flex-start', marginVertical: '4%', fontFamily: StyleConstants.RobotoLight },
  textInput: { backgroundColor: StyleConstants.whiteColor, paddingHorizontal: '3%', fontSize: StyleConstants.smallFont, },
  textInputView: { height: wp('12%'), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: wp('5%'), backgroundColor: 'white', borderRadius: wp('2%'), shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: wp('1.5%'), elevation: 5 },
  textInputStyle: { height: wp('10%'), width: wp('80%'), alignItems: 'center', justifyContent: 'center', fontSize: wp('3.8%'), color: 'gray' },
  flatlistDropIcon: { fontSize: wp('6%'), color: StyleConstants.grayColor, marginLeft: wp('3%') },
  inputIcon: { width: wp('4.5%'), height: wp('4.5%'), margin: wp('3%') },

  //Buttons
  button: { backgroundColor: StyleConstants.baseColor, marginVertical: '8%', height: 50, justifyContent: 'center', flexDirection: 'row', },
  buttonText: { alignSelf: 'center', color: StyleConstants.whiteColor, fontSize: StyleConstants.smallerFont },
  bigButton: { backgroundColor: StyleConstants.baseColor, height: wp('12%'), width: wp('90%'), borderRadius: wp('2%'), justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: wp('8%') },
  bigButtonText: { alignSelf: 'center', color: StyleConstants.whiteColor, fontSize: StyleConstants.smallFont, fontFamily: StyleConstants.RobotoMedium },
  bigLinkButton: { width: wp('90%'), height: wp('15%'), justifyContent: 'center', backgroundColor: 'white', alignSelf: 'center', alignItems: 'center', marginVertical: wp('2%'), borderRadius: wp('2%'), shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: wp('1.5%'), elevation: 5, shadowColor: StyleConstants.blueColor, flexDirection: 'row' },
  bigLinkButtonText: { fontSize: wp('4.5%'), fontFamily: StyleConstants.RobotoMedium, color: StyleConstants.baseColor1 },
  blockButtons: { height: StyleConstants.deviceWidth * 0.13, width: '100%', flexDirection: "row" },
  blockButton: { backgroundColor: StyleConstants.baseColor1, justifyContent: "center", flex: 1, alignContent: "center", flexDirection: "row" },
  blockButtonText: { color: StyleConstants.whiteColor, fontSize: StyleConstants.smallFont, marginTop: (StyleConstants.deviceWidth * 0.13 - StyleConstants.smallFont) * 0.5 },

  //Splash
  splashMaincontainer: { alignItems: 'center', justifyContent: 'center', flex: 1, },

  //Lookup
  searchView: { width: wp('90%'), height: wp('15%'), alignSelf: 'center', flexDirection: 'row', marginVertical: wp('2%'), shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: wp('1.5%') },
  searchTextInput: { backgroundColor: StyleConstants.whiteColor, flex: 1, paddingHorizontal: '3%', fontSize: StyleConstants.fontSize1, borderTopLeftRadius: wp('2%'), borderBottomLeftRadius: wp('2%'), elevation: 5 },
  searchButton: { backgroundColor: StyleConstants.baseColor, flex: 0.3, justifyContent: 'center', alignItems: 'center', paddingHorizontal: '5%', borderTopRightRadius: wp('2%'), borderBottomRightRadius: wp('2%'), elevation: 5 },
  searchButtonText: { color: StyleConstants.whiteColor, fontSize: StyleConstants.fontSize, fontFamily: StyleConstants.RobotoMedium },
  flatlistMainView: { width: wp('90%'), backgroundColor: 'white', alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'center', marginVertical: wp('2%'), borderRadius: wp('2%'), shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: wp('1.5%'), elevation: 5, flexDirection: 'row' },
  personPhoto: { width: wp('16%'), height: wp('16%'), marginHorizontal: wp('3%'), marginVertical: wp('2%'), borderRadius: wp('1.5%') },
  personName: { width: wp('60%'), color: StyleConstants.baseColor1, fontSize: StyleConstants.fontSize1, fontFamily: StyleConstants.RobotoMedium },

  //Household
  serviceTimeButton: { width: wp('55%'), height: wp('16%'), marginHorizontal: wp('2%'), alignItems: 'center', justifyContent: 'center', borderRadius: wp('2%') },
  serviceTimeButtonText: { color: StyleConstants.whiteColor, fontSize: StyleConstants.smallerFont },
  serviceTimeText: { fontSize: StyleConstants.smallFont, color: StyleConstants.blueColor },
  expandedRow: { width: wp('90%'), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center', marginTop: wp('2%'), paddingBottom: wp('2%'), borderBottomWidth: 1, borderBottomColor: StyleConstants.lightGrayColor },
  serviceTimeView: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  timeIcon: { fontSize: wp('5%'), color: StyleConstants.blueColor, marginHorizontal: wp('1%') },
  groupName: { width: wp('60%'), textAlign: 'left', fontSize: wp('3.4%'), color: StyleConstants.greenColor, marginVertical: wp('0.5%') },

  //Checkin Complete
  viewShot: { width: StyleConstants.deviceWidth * 0.9, height: StyleConstants.deviceWidth * 0.9 / 3.5 * 1.1 },
  webView: { width: StyleConstants.deviceWidth * 0.9, height: StyleConstants.deviceWidth * 0.9 / 3.5 * 1.1 },
  printImage: { width: StyleConstants.deviceWidth * 0.9, height: StyleConstants.deviceWidth * 0.9 / 3.5 * 1.1, },
  backIcon: { marginVertical: '5%', marginLeft: '3%' },
  modelView: { flex: 1, backgroundColor: StyleConstants.ghostWhite },

  //WhiteLogo
  headerLogoView: { borderBottomLeftRadius: wp('8%'), borderBottomRightRadius: wp('8%'), marginBottom: wp('2.5%'), backgroundColor: 'white', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: wp('1.5%'), shadowColor: StyleConstants.blueColor, elevation: 5 },
  headerLogoIcon: { maxWidth: wp('55%'), maxHeight: wp('55%'), marginBottom: wp("2%"), marginTop: wp("2%"), resizeMode: 'contain', alignSelf: 'center' },
})