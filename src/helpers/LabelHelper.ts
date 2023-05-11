import fs from "react-native-fs"
import { GroupInterface, PersonInterface, ServiceTimeInterface, VisitInterface } from "./Interfaces";
import { CachedData } from "./CachedData";
import { Utilities } from "./Utilities";
import { VisitSessionHelper } from "./VisitSessionHelper";

export class LabelHelper {

    private static generatePickupCode() {
        //Omitted vowels and numbers that are substituted for vowels to avoid bad words from being formed
        const characters = ['2', '3', '4', '5', '6', '7', '8', '9', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
        let pickupCode = "";
        for (let i = 0; i < 4; i++) {
            let idx = Math.floor(Math.random() * characters.length);
            pickupCode += characters[idx];
        }
        return pickupCode;
    }

    private static readHtml(fileName: string) {
        //*** IMPORTANT: This is reading from /android/app/src/main/assets rather than the /assets folder.  I'd like to change this but am not sure how. */
        return fs.readFileAssets("labels/" + fileName);
    }

    private static replaceValues(html: string, visit: VisitInterface, childVisits: VisitInterface[], pickupCode: string, allergies : string) {
        const person: PersonInterface = Utilities.getById(CachedData.householdMembers, visit.personId || "");
        var isChild: boolean = false;
        childVisits.forEach(cv => { if (cv.personId === person.id) isChild = true; });
        var result = html.replace(/\[Name\]/g, person.name.display || "");
        result = result.replace(/\[Sessions\]/g, VisitSessionHelper.getDisplaySessions(visit.visitSessions || []).replace(/ ,/g, "<br/>"));
        result = result.replace(/\[PickupCode\]/g, (isChild) ? pickupCode : "");
        result = result.replace(/\[Allergies\]/g, (allergies) ? allergies : "");
        return result;
    }


    private static replaceValuesPickup(html: string, childVisits: VisitInterface[], pickupCode: string, allergies : string) {
        var childList: string[] = [];
        childVisits.forEach(cv => {
            const person: PersonInterface = Utilities.getById(CachedData.householdMembers, cv.personId || "");
            childList.push(person.name.display + " - " + VisitSessionHelper.getPickupSessions(cv.visitSessions || []));
        });
        var childBullets = "";
        childList.forEach(child => { childBullets += "<li>" + child + "</li>" });
        var result = html.replace(/\[Children\]/g, childBullets);
        result = result.replace(/\[PickupCode\]/g, pickupCode);
        result = result.replace(/\[Allergies\]/g, (allergies) ? allergies : "");
        return result;
    }


    private static getChildVisits() {
        const result: VisitInterface[] = [];
        CachedData.pendingVisits.forEach(pv => {
            var isChild = false;
            pv.visitSessions?.forEach(vs => {
                const serviceTime: ServiceTimeInterface = Utilities.getById(CachedData.serviceTimes, vs.session?.serviceTimeId || "");
                const group: GroupInterface = Utilities.getById(serviceTime.groups || [], vs.session?.groupId || "");
                if (group.parentPickup) isChild = true;
            });
            if (isChild) result.push(pv);
        });
        return result;
    }

    public static async getAllLabels() {
        const pickupCode = LabelHelper.generatePickupCode();
        const childVisits: VisitInterface[] = LabelHelper.getChildVisits();
        const labelTemplate = await this.readHtml("1_1x3_5.html");
        const pickupTemplate = await this.readHtml("pickup_1_1x3_5.html");
        const allergiesTags = CachedData.userChurch?.person.nameTagNotes ?? "";
        const result: string[] = [];

        CachedData.pendingVisits.forEach(pv => { result.push(this.replaceValues(labelTemplate, pv, childVisits, pickupCode, allergiesTags)); });
        if (childVisits.length > 0) result.push(this.replaceValuesPickup(pickupTemplate, childVisits, pickupCode, allergiesTags));
        return result;
    }
}


