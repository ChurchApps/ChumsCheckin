import React from "react";
import { Text, FlatList, ActivityIndicator, SafeAreaView, Dimensions, PixelRatio, ScrollView, View, Image, StatusBar } from "react-native";
import Ripple from "react-native-material-ripple";
import Header from "../src/components/Header";
import { screenNavigationProps, CachedData, Styles, StyleConstants, Utilities } from "../src/helpers";
import { ApiHelper, AppCenterHelper, ArrayHelper, DimensionHelper, FirebaseHelper, GroupInterface, GroupServiceTimeInterface } from "../src/helpers";
import { router } from "expo-router";

interface Props { navigation: screenNavigationProps }

const Services = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [services, setServices] = React.useState([]);
  const [dimension, setDimension] = React.useState(Dimensions.get("window"));

  const loadData = () => {
    setIsLoading(true);
    // AppCenterHelper.trackEvent("Services Screen");
    ApiHelper.get("/services", "AttendanceApi").then(data => {
      setServices(data); setIsLoading(false);
    });
  };

  React.useEffect(() => {
    FirebaseHelper.addOpenScreenEvent("Services");
    Dimensions.addEventListener("change", () => {
      const dim = Dimensions.get("screen");
      setDimension(dim);
    });
  }, []);

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };

  const selectService = (serviceId: string) => {
    setIsLoading(true);

    const promises: Promise<any>[] = [
      ApiHelper.get("/servicetimes?serviceId=" + serviceId, "AttendanceApi").then(times => { CachedData.serviceId = serviceId; CachedData.serviceTimes = times; }),
      ApiHelper.get("/groupservicetimes", "AttendanceApi").then(groupServiceTimes => { CachedData.groupServiceTimes = groupServiceTimes; }),
      ApiHelper.get("/groups", "MembershipApi").then(groups => { CachedData.groups = groups; })
    ];

    Promise.all(promises).then(() => {
      //for simplicity, iterate the group service times and add groups to the services.
      CachedData.serviceTimes.forEach(st => {
        st.groups = [];
        ArrayHelper.getAll(CachedData.groupServiceTimes, "serviceTimeId", st.id).forEach((gst: GroupServiceTimeInterface) => {
          const g: GroupInterface = ArrayHelper.getOne(CachedData.groups, "id", gst.groupId);
          st.groups?.push(g);
        });
      });
      console.log(JSON.stringify(CachedData.serviceTimes));


      router.navigate('/lookup')
      setIsLoading(false);
    });

  };

  const getRow = (data: any) => {
    const item = data.item;
    return (
      <Ripple style={[serviceStyles.serviceCard, { width: wd("90%") }]} onPress={() => { selectService(item.id); }}>
        <View style={serviceStyles.serviceCardContent}>
          <Text style={serviceStyles.campusName}>{item.campus.name}</Text>
          <Text style={serviceStyles.serviceName}>{item.name}</Text>
        </View>
        <View style={serviceStyles.arrowContainer}>
          <Text style={serviceStyles.arrow}>›</Text>
        </View>
      </Ripple>
    );
  };

  const getResults = () => {
    if (isLoading) { 
      return (
        <View style={serviceStyles.loadingContainer}>
          <ActivityIndicator size="large" color={StyleConstants.baseColor} animating={isLoading} />
          <Text style={serviceStyles.loadingText}>Loading services...</Text>
        </View>
      ); 
    }
    else { 
      return (
        <View style={serviceStyles.servicesContainer}>
          <FlatList 
            data={services} 
            renderItem={getRow} 
            keyExtractor={(item: any) => item.id.toString()}
            contentContainerStyle={serviceStyles.servicesList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ); 
    }
  };

  const getLogoUrl = () => {
    if (CachedData.churchAppearance?.logoLight) {
      return { uri: CachedData.churchAppearance?.logoLight };
    }
    else { return require("../src/images/logo1.png"); }
  };

  React.useEffect(loadData, []);

  return (
    <View style={serviceStyles.container}>
      <Header navigation={props.navigation} logo={false} />

      {/* Professional Header Section with Prominent Logo */}
      <View style={serviceStyles.headerSection}>
        {/* Prominent Church Logo in White Box */}
        <View style={serviceStyles.logoContainer}>
          <Image source={getLogoUrl()} style={serviceStyles.prominentLogo} />
        </View>
        
        {/* Header Text Below Logo */}
        <View style={serviceStyles.headerTextContainer}>
          <View style={serviceStyles.titleRow}>
            <View style={serviceStyles.titleIconContainer}>
              <Text style={serviceStyles.titleIcon}>🏛️</Text>
            </View>
            <View style={serviceStyles.titleTextContainer}>
              <Text style={serviceStyles.headerTitle}>Select a Service</Text>
              <Text style={serviceStyles.headerSubtitle}>Choose which service you'd like to check in for</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={serviceStyles.mainContent}>
        {getResults()}
      </View>
    </View>
  );
};

// Professional tablet-optimized styles matching ChumsApp
const serviceStyles = {
  container: {
    flex: 1,
    backgroundColor: StyleConstants.ghostWhite
  },
  
  // Header Section (Blue background with prominent logo)
  headerSection: {
    backgroundColor: StyleConstants.baseColor, // Dark blue #1565C0
    paddingHorizontal: DimensionHelper.wp("5%"),
    paddingTop: DimensionHelper.wp("6%"),
    paddingBottom: DimensionHelper.wp("5%"),
    borderBottomLeftRadius: DimensionHelper.wp("8%"),
    borderBottomRightRadius: DimensionHelper.wp("8%"),
    marginBottom: DimensionHelper.wp("2%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    shadowColor: StyleConstants.baseColor,
    alignItems: "center"
  },
  
  // Prominent White Box for Logo within Blue Header
  logoContainer: {
    backgroundColor: StyleConstants.whiteColor,
    borderRadius: 12,
    width: DimensionHelper.wp("70%"), // 70% of blue box width
    height: DimensionHelper.wp("16%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: DimensionHelper.wp("4%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4
  },
  
  prominentLogo: {
    width: DimensionHelper.wp("65%"), // Slightly smaller than container for padding
    height: DimensionHelper.wp("14%"),
    resizeMode: "contain"
  },
  
  headerTextContainer: {
    width: "100%"
  },
  
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
  },
  
  titleIconContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    width: DimensionHelper.wp("10%"),
    height: DimensionHelper.wp("10%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: DimensionHelper.wp("3%")
  },
  
  titleIcon: {
    fontSize: DimensionHelper.wp("5%")
  },
  
  titleTextContainer: {
    flex: 1
  },
  
  headerTitle: {
    fontSize: DimensionHelper.wp("5.5%"),
    fontFamily: StyleConstants.RobotoMedium,
    fontWeight: "600",
    color: StyleConstants.whiteColor,
    marginBottom: DimensionHelper.wp("1%"),
    textAlign: "left"
  },
  
  headerSubtitle: {
    fontSize: DimensionHelper.wp("3.8%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: "rgba(255,255,255,0.9)",
    textAlign: "left"
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    paddingHorizontal: DimensionHelper.wp("5%")
  },
  
  servicesContainer: {
    flex: 1
  },
  
  servicesList: {
    paddingBottom: DimensionHelper.wp("5%")
  },
  
  // Service Cards (Professional Material Design)
  serviceCard: {
    backgroundColor: StyleConstants.whiteColor,
    borderRadius: 12,
    marginVertical: DimensionHelper.wp("1.5%"),
    padding: DimensionHelper.wp("4%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    shadowColor: StyleConstants.baseColor,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    minHeight: DimensionHelper.wp("16%")
  },
  
  serviceCardContent: {
    flex: 1,
    justifyContent: "center"
  },
  
  campusName: {
    fontSize: DimensionHelper.wp("3.8%"),
    fontFamily: StyleConstants.RobotoMedium,
    color: StyleConstants.baseColor,
    marginBottom: DimensionHelper.wp("1%")
  },
  
  serviceName: {
    fontSize: DimensionHelper.wp("4.5%"),
    fontFamily: StyleConstants.RobotoMedium,
    color: StyleConstants.darkColor,
    lineHeight: DimensionHelper.wp("5.5%")
  },
  
  arrowContainer: {
    marginLeft: DimensionHelper.wp("3%"),
    justifyContent: "center",
    alignItems: "center"
  },
  
  arrow: {
    fontSize: DimensionHelper.wp("6%"),
    color: StyleConstants.baseColor,
    opacity: 0.7
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: DimensionHelper.wp("20%")
  },
  
  loadingText: {
    fontSize: DimensionHelper.wp("4%"),
    fontFamily: StyleConstants.RobotoRegular,
    color: StyleConstants.baseColor,
    marginTop: DimensionHelper.wp("4%"),
    textAlign: "center"
  }
};


export default Services
