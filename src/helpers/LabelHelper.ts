import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { CachedData } from "./CachedData";
import { VisitSessionHelper } from "./VisitSessionHelper";
import { VisitInterface, PersonInterface, ServiceTimeInterface, GroupInterface, ArrayHelper } from "@churchapps/mobilehelper";

// Static imports for label templates
const labelTemplate = Asset.fromModule(require('../../assets/labels/1_1x3_5.html'));
const pickupTemplate = Asset.fromModule(require('../../assets/labels/pickup_1_1x3_5.html'));

export class LabelHelper {

  private static generatePickupCode() {
    //Omitted vowels and numbers that are substituted for vowels to avoid bad words from being formed
    const characters = ["2", "3", "4", "5", "6", "7", "8", "9", "B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"];
    let pickupCode = "";
    for (let i = 0; i < 4; i++) {
      let idx = Math.floor(Math.random() * characters.length);
      pickupCode += characters[idx];
    }
    return pickupCode;
  }

  private static async readHtml(fileName: string) {
    try {
      let asset: Asset;
      if (fileName === "1_1x3_5.html") {
        asset = labelTemplate;
      } else if (fileName === "pickup_1_1x3_5.html") {
        asset = pickupTemplate;
      } else {
        throw new Error(`Unknown template: ${fileName}`);
      }
      
      await asset.downloadAsync();
      if (asset.localUri) {
        return await FileSystem.readAsStringAsync(asset.localUri);
      }
      throw new Error(`Asset not found: ${fileName}`);
    } catch (error) {
      console.error('Error reading HTML file:', error);
      throw error;
    }
  }

  private static replaceValues(html: string, visit: VisitInterface, childVisits: VisitInterface[], pickupCode: string) {
    const person: PersonInterface = ArrayHelper.getOne(CachedData.householdMembers, "id", visit.personId || "");
    let isChild: boolean = false;
    childVisits.forEach(cv => { if (cv.personId === person.id) { isChild = true; } });
    let result = html.replace(/\[Name\]/g, person.name.display || "");
    result = result.replace(/\[Sessions\]/g, VisitSessionHelper.getDisplaySessions(visit.visitSessions || []).replace(/ ,/g, "<br/>"));
    result = result.replace(/\[PickupCode\]/g, (isChild) ? pickupCode : "");
    result = result.replace(/\[Allergies\]/g, (person.nametagNotes) ? person.nametagNotes : "");
    //console.log(result);
    return result;
  }


  private static replaceValuesPickup(html: string, childVisits: VisitInterface[], pickupCode: string) {
    let childList: string[] = [];
    let allergiesList: string[] = [];
    childVisits.forEach(cv => {
      const person: PersonInterface = ArrayHelper.getOne(CachedData.householdMembers, "id", cv.personId || "");
      childList.push(person.name.display + " - " + VisitSessionHelper.getPickupSessions(cv.visitSessions || []));
      allergiesList.push(person.nametagNotes ?? "");
    });
    let childBullets = "";
    let allergiesBullets = "";
    childList.forEach(child => { childBullets += "<li>" + child + "</li>"; });
    allergiesList.forEach(child => { allergiesBullets += "<li>" + child + "</li>"; });
    let result = html.replace(/\[Children\]/g, childBullets);
    result = result.replace(/\[PickupCode\]/g, pickupCode);
    result = result.replace(/\[Allergies\]/g, allergiesBullets);
    return result;
  }


  private static getChildVisits() {
    const result: VisitInterface[] = [];
    CachedData.pendingVisits.forEach(pv => {
      let isChild = false;
      pv.visitSessions?.forEach(vs => {
        const serviceTime: ServiceTimeInterface = ArrayHelper.getOne(CachedData.serviceTimes, "id", vs.session?.serviceTimeId || "");
        const group: GroupInterface = ArrayHelper.getOne(serviceTime.groups || [], "id", vs.session?.groupId || "");
        if (group.parentPickup) { isChild = true; }
      });
      if (isChild) { result.push(pv); }
    });
    return result;
  }

  public static async getAllLabels() {
    const pickupCode = LabelHelper.generatePickupCode();
    const childVisits: VisitInterface[] = LabelHelper.getChildVisits();
    const labelTemplate = await this.readHtml("1_1x3_5.html");
    const pickupTemplate = await this.readHtml("pickup_1_1x3_5.html");
    const result: string[] = [];

    CachedData.pendingVisits.forEach(pv => {
      if (pv.visitSessions && pv.visitSessions.length > 0) { result.push(this.replaceValues(labelTemplate, pv, childVisits, pickupCode)); }
    });

    if (childVisits.length > 0) { result.push(this.replaceValuesPickup(pickupTemplate, childVisits, pickupCode)); }
    return result;
  }
}


