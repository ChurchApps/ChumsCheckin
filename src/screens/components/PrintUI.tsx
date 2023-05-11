import React from "react";
import { View, Text, NativeModules } from "react-native";
import { WebView } from "react-native-webview";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Styles } from "../../helpers";

interface Props {
  htmlLabels: string[],
  onPrintComplete: () => void
}

export const PrintUI = (props: Props) => {
  const shotRef = React.useRef(null);
  const [html, setHtml] = React.useState("");

  const [printIndex, setPrintIndex] = React.useState(-1);
  const [uris, setUris] = React.useState<string[]>([]);
  const [firstTag, setFirstTag] = React.useState(true);

  React.useEffect(() => { resetPrint(); }, []);
  React.useEffect(() => { setPrintIndex((props.htmlLabels.length === 0) ? -1 : 0); }, [props.htmlLabels]);
  React.useEffect(() => { if (printIndex < props.htmlLabels.length) {loadNextLabel();} }, [printIndex]);  //eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (html) {
      if (firstTag) {timeout(1500).then(handleHtmlLoaded);}
      else {timeout(300).then(handleHtmlLoaded);}
    }
  }, [html]); // eslint-disable-line react-hooks/exhaustive-deps
  const timeout = (ms: number) => new Promise(resolve => setTimeout(() => { resolve(null); }, ms));

  const resetPrint = () => { setPrintIndex(-1); setUris([]); };

  const handleCaptureComplete = (uri: string) => {
    console.log("capture complete");
    const urisCopy = [...uris];
    urisCopy.push(uri);

    if (printIndex < props.htmlLabels.length - 1) {
      setPrintIndex(printIndex + 1);
      setUris(urisCopy);
    } else {
      NativeModules.PrinterHelper.printUris(urisCopy.toString());
      resetPrint();
      props.onPrintComplete();
    }
  };

  const handleHtmlLoaded = async () => {
    if (firstTag) {setFirstTag(false);}
    console.log("html loaded");
    //await timeout(500);
    captureRef(shotRef, { format: "jpg", quality: 1 }).then(async result => {
      await timeout(500);
      handleCaptureComplete(result);
    });
  };

  const loadNextLabel = () => { setHtml(props.htmlLabels[printIndex]); };


  return (
    <>
      <Text style={Styles.H1}>Printing</Text>
      <View style={{ flex: 1, opacity: 1 }}>
        <ViewShot ref={shotRef} style={Styles.viewShot}>
          <WebView source={{ html: html }} style={Styles.webView} />
        </ViewShot>
      </View>
    </>
  );


};
