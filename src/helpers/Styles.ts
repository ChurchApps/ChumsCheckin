import { StyleSheet, Dimensions } from 'react-native'

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
    flatlistDropIcon: { fontSize: StyleConstants.fontSize, color: StyleConstants.lightGrayColor, marginRight: '2%' },

    //Buttons
    button: { backgroundColor: StyleConstants.baseColor, marginVertical: '8%', height: 50, justifyContent: 'center', flexDirection: 'row', },
    buttonText: { alignSelf: 'center', color: StyleConstants.whiteColor, fontSize: StyleConstants.smallerFont },
    bigButton: { backgroundColor: StyleConstants.baseColor, marginVertical: '8%', height: 70, justifyContent: 'center', flexDirection: 'row', },
    bigButtonText: { alignSelf: 'center', color: StyleConstants.whiteColor, fontSize: StyleConstants.smallFont },
    bigLinkButton: { marginHorizontal: '3%', height: StyleConstants.deviceWidth * 13 / 100, justifyContent: "center", },
    bigLinkButtonText: { color: StyleConstants.baseColor1, marginLeft: '3%', fontSize: StyleConstants.fontSize1, },
    blockButtons: { height: StyleConstants.deviceWidth * 0.13, width: '100%', flexDirection: "row" },
    blockButton: { backgroundColor: StyleConstants.baseColor1, justifyContent: "center", flex: 1, alignContent: "center", flexDirection: "row" },
    blockButtonText: { color: StyleConstants.whiteColor, fontSize: StyleConstants.smallFont, marginTop: (StyleConstants.deviceWidth * 0.13 - StyleConstants.smallFont) * 0.5 },

    //Splash
    splashMaincontainer: { alignItems: 'center', justifyContent: 'center', flex: 1, },

    //Lookup
    searchView: { flexDirection: 'row', height: 75, marginVertical: 20 },
    searchTextInput: { backgroundColor: StyleConstants.whiteColor, flex: 1, paddingHorizontal: '3%', fontSize: StyleConstants.fontSize1, },
    searchButton: { backgroundColor: StyleConstants.baseColor, flex: 0.3, justifyContent: 'center', alignItems: 'center', paddingHorizontal: '5%' },
    searchButtonText: { color: StyleConstants.whiteColor, fontSize: StyleConstants.fontSize },
    flatlistMainView: { borderBottomWidth: 1, borderBottomColor: StyleConstants.lightGrayColor, flexDirection: 'row', paddingVertical: '3%', alignItems: 'center' },
    personPhoto: { width: 90, height: 60 },
    personName: { color: StyleConstants.baseColor1, fontSize: StyleConstants.fontSize1 },

    //Household
    serviceTimeButton: { backgroundColor: StyleConstants.baseColor1, width: StyleConstants.deviceWidth * 45 / 100, justifyContent: 'center', alignItems: 'center', height: 70, },
    serviceTimeButtonText: { color: StyleConstants.whiteColor, fontSize: StyleConstants.smallerFont },
    serviceTimeText: { fontSize: StyleConstants.smallFont },
    expandedRow: { borderBottomWidth: 1, borderBottomColor: StyleConstants.lightGrayColor, flexDirection: 'row', marginHorizontal: '6%', paddingVertical: '3%', paddingLeft: '2%', alignItems: 'center', justifyContent: 'space-around' },

    //Checkin Complete
    viewShot: { width: StyleConstants.deviceWidth * 0.9, height: StyleConstants.deviceWidth * 0.9 / 3.5 * 1.1 },
    webView: { width: StyleConstants.deviceWidth * 0.9, height: StyleConstants.deviceWidth * 0.9 / 3.5 * 1.1 },
    printImage: { width: StyleConstants.deviceWidth * 0.9, height: StyleConstants.deviceWidth * 0.9 / 3.5 * 1.1, },
    backIcon: { marginVertical: '5%', marginLeft: '3%' },
    modelView: { flex: 1, backgroundColor: StyleConstants.ghostWhite }

})