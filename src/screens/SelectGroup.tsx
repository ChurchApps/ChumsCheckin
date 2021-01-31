import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { Container, Icon } from 'native-base'
import Ripple from 'react-native-material-ripple';
import { RouteProp } from '@react-navigation/native';
import { ScreenList } from './ScreenList'
import { Header } from './components'
import { screenNavigationProps, VisitHelper, VisitSessionHelper, CachedData, Styles, StyleConstants, GroupInterface } from "../helpers"

type ProfileScreenRouteProp = RouteProp<ScreenList, 'SelectGroup'>;
interface Props { navigation: screenNavigationProps; route: ProfileScreenRouteProp; }
interface GroupCategoryInterface { key: number, name: string, items: GroupInterface[] }

export const SelectGroup = (props: Props) => {
    const [selectedCategory, setSelectedCategory] = React.useState(-1);
    const [groupTree, setGroupTree] = React.useState<GroupCategoryInterface[]>([]);

    const buildTree = () => {
        var category = "";
        var gt: GroupCategoryInterface[] = [];
        props.route.params.serviceTime?.groups?.forEach(g => {
            if (g.categoryName !== category) gt.push({ key: gt.length, name: g.categoryName || "", items: [] })
            gt[gt.length - 1].items.push(g);
            category = g.categoryName || "";
        })
        setGroupTree(gt);
    }

    const handleCategoryClick = (value: number) => { setSelectedCategory((selectedCategory == value) ? -1 : value); }
    const handleNone = () => { selectGroup(0, "NONE"); }

    const selectGroup = (id: number, name: string) => {
        const personId = props.route.params.personId;
        var visit = VisitHelper.getByPersonId(CachedData.pendingVisits, personId);
        if (visit === null) {
            visit = { personId: personId, serviceId: CachedData.serviceId, visitSessions: [] };
            CachedData.pendingVisits.push(visit);
        }
        const vs = visit?.visitSessions || [];
        const serviceTimeId = props.route.params.serviceTime.id || 0;
        VisitSessionHelper.setValue(vs, serviceTimeId, id, name);
        props.navigation.goBack()
    }


    const getRow = (data: any) => {
        const item: GroupCategoryInterface = data.item;
        return (
            <View>
                <Ripple style={Styles.flatlistMainView} onPress={() => { handleCategoryClick(item.key) }}  >
                    <Icon name={(selectedCategory === item.key) ? 'up' : 'down'} type="AntDesign" style={Styles.flatlistDropIcon} />
                    <Text style={[Styles.bigLinkButtonText]}>{item.name}</Text>
                </Ripple>
                { getExpanded(selectedCategory, item)}
            </View>
        )
    }

    const getExpanded = (selectedCategory: number, category: GroupCategoryInterface) => {
        if (selectedCategory !== category.key) return null;
        else {
            const result: JSX.Element[] = [];
            category.items.forEach(g => {
                result.push(<Ripple key={g.id?.toString()} style={[Styles.expandedRow, { justifyContent: "flex-start" }]} onPress={() => selectGroup(g.id || 0, g.name || "")}>
                    <Text style={[Styles.bigLinkButtonText, { marginLeft: '10%' }]}>{g.name}</Text>
                </Ripple>);
            })
            return result;
        }
    }

    React.useEffect(buildTree, []);

    return (
        <Container>
            <Header />
            <View style={Styles.fullWidthContainer}>
                <FlatList data={groupTree} renderItem={getRow} keyExtractor={(item: GroupCategoryInterface) => item.name} />
                <View style={Styles.blockButtons}>
                    <Ripple style={[Styles.blockButton, { backgroundColor: StyleConstants.redColor }]} onPress={handleNone}>
                        <Text style={Styles.blockButtonText}>NONE</Text>
                    </Ripple>
                </View>
            </View>
        </Container>
    );

}