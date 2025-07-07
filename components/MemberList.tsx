import React from "react";
import { View, Text, FlatList, Image, Dimensions, PixelRatio, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";
import { CachedData, EnvironmentHelper, screenNavigationProps, VisitHelper, Styles, StyleConstants } from "../../src/helpers";
import MemberServiceTimes from "./MemberServiceTimes";
import { VisitInterface, PersonInterface, VisitSessionInterface, ServiceTimeInterface, GroupInterface, ArrayHelper } from "@churchapps/mobilehelper";
import { DimensionHelper } from "../../src/helpers";

interface Props { navigation?: screenNavigationProps, pendingVisits: VisitInterface[] }

const MemberList = (props: Props) => {
  const [selectedMemberId, setSelectedMemberId] = React.useState("");
  const [dimension, setDimension] = React.useState(Dimensions.get("window"));

  const handleMemberClick = (id: string) => { 
    setSelectedMemberId((selectedMemberId === id) ? "" : id); 
  };

  const isLandscape = () => {
    return dimension.width >= dimension.height;
  };

  const getCondensedGroupList = (person: PersonInterface) => {
    if (selectedMemberId === person.id) return null;
    
    const visit = VisitHelper.getByPersonId(props.pendingVisits, person.id || "");
    if (!visit?.visitSessions?.length) return null;
    
    const groups: JSX.Element[] = [];
    visit.visitSessions.forEach((vs: VisitSessionInterface, index) => {
      const st: ServiceTimeInterface | null = ArrayHelper.getOne(CachedData.serviceTimes, "id", vs.session?.serviceTimeId || "");
      const group: GroupInterface = ArrayHelper.getOne(st?.groups || [], "id", vs.session?.groupId || "");
      let name = group.name || "none";
      if (st != null) name = (st.name || "") + " - " + name;
      
      groups.push(
        <View key={index} style={styles.groupChip}>
          <Text style={styles.groupText} numberOfLines={1}>{name}</Text>
        </View>
      );
    });
    
    return (
      <View style={styles.groupContainer}>
        {groups}
      </View>
    );
  };

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimension(window);
    });
    
    return () => subscription?.remove();
  }, []);

  const getMemberRow = (data: any) => {
    const person: PersonInterface = data.item;
    const isExpanded = selectedMemberId === person.id;
    
    return (
      <View style={styles.memberCard}>
        <TouchableOpacity 
          style={[
            styles.memberRow,
            isExpanded && styles.memberRowExpanded
          ]} 
          onPress={() => handleMemberClick(person.id || "")}
          activeOpacity={0.7}
        >
          {/* Person Photo */}
          <Image 
            source={{ uri: EnvironmentHelper.ContentRoot + person.photo }} 
            style={styles.personPhoto} 
          />
          
          {/* Person Info */}
          <View style={styles.personInfo}>
            <Text style={styles.personName} numberOfLines={1}>
              {person.name.display}
            </Text>
            {getCondensedGroupList(person)}
          </View>
          
          {/* Expand/Collapse Icon */}
          <View style={styles.expandIcon}>
            <FontAwesome 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={StyleConstants.secondaryText} 
            />
          </View>
        </TouchableOpacity>
        
        {/* Service Times (shown when expanded) */}
        <MemberServiceTimes 
          person={person} 
          navigation={props.navigation} 
          selectedMemberId={selectedMemberId} 
          key={person.id?.toString()} 
          pendingVisits={props.pendingVisits} 
        />
      </View>
    );
  };

  if (!CachedData.householdMembers?.length) {
    return (
      <View style={styles.emptyState}>
        <FontAwesome name="users" size={64} color={StyleConstants.lightText} />
        <Text style={styles.emptyStateText}>No household members found</Text>
      </View>
    );
  }

  return (
    <FlatList 
      data={CachedData.householdMembers} 
      renderItem={getMemberRow} 
      keyExtractor={(item: PersonInterface) => item.id?.toString() || "0"}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = {
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  memberCard: {
    backgroundColor: StyleConstants.cardBackground,
    borderRadius: StyleConstants.cardRadius,
    marginBottom: 12,
    ...StyleConstants.lightShadow,
    overflow: "hidden" as const,
  },
  memberRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    minHeight: 80,
  },
  memberRowExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: StyleConstants.lightGrayColor,
  },
  personPhoto: {
    width: 56,
    height: 56,
    borderRadius: StyleConstants.borderRadius,
    backgroundColor: StyleConstants.primaryBlueL6,
  },
  personInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center" as const,
  },
  personName: {
    fontSize: StyleConstants.h4Size,
    fontWeight: StyleConstants.fontMedium,
    color: StyleConstants.primaryText,
    marginBottom: 4,
  },
  groupContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 6,
    marginTop: 4,
  },
  groupChip: {
    backgroundColor: StyleConstants.primaryBlueL6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  groupText: {
    fontSize: StyleConstants.captionSize,
    color: StyleConstants.primaryBlue,
    fontWeight: StyleConstants.fontMedium,
  },
  expandIcon: {
    width: 32,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 48,
  },
  emptyStateText: {
    fontSize: StyleConstants.h4Size,
    color: StyleConstants.lightText,
    textAlign: "center" as const,
    marginTop: 16,
  },
};
export default MemberList;
