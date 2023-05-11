import { GroupInterface, ServiceTimeInterface, VisitSessionInterface } from "./Interfaces";
import { CachedData } from "./CachedData";
import { Utilities } from "./Utilities";

export class VisitSessionHelper {

  public static getByServiceTimeId(visitSessions: VisitSessionInterface[], serviceTimeId: string): VisitSessionInterface[] {
    let result: VisitSessionInterface[] = [];
    visitSessions.forEach(vs => { if (vs.session?.serviceTimeId === serviceTimeId) {result.push(vs);} });
    return result;
  }

  public static setValue(visitSessions: VisitSessionInterface[], serviceTimeId: string, groupId: string, displayName: string) {
    for (let i = visitSessions.length - 1; i >= 0; i--) {
      if (visitSessions[i].session?.serviceTimeId === serviceTimeId) {visitSessions.splice(i, 1);}
    }
    if (groupId !== "") {visitSessions.push({ session: { serviceTimeId: serviceTimeId, groupId: groupId, displayName: displayName } });}
  }

    public static getDisplayText = (visitSession: VisitSessionInterface) => {
      const st: ServiceTimeInterface = Utilities.getById(CachedData.serviceTimes, visitSession.session?.serviceTimeId || "");
      const group: GroupInterface = Utilities.getById(st?.groups || [], visitSession.session?.groupId || "");
      return st.name + " - " + group.name;
    }

    public static getDisplaySessions = (visitSessions: VisitSessionInterface[]) => {
      const items: string[] = [];
      visitSessions.forEach(vs => { items.push(VisitSessionHelper.getDisplayText(vs)); });
      return items.join();
    }

    public static getPickupText = (visitSession: VisitSessionInterface) => {
      const st: ServiceTimeInterface = Utilities.getById(CachedData.serviceTimes, visitSession.session?.serviceTimeId || "");
      const group: GroupInterface = Utilities.getById(st?.groups || [], visitSession.session?.groupId || "");
      if (group.parentPickup) {return group.name;}
      else {return "";}
    }

    public static getPickupSessions = (visitSessions: VisitSessionInterface[]) => {
      const items: string[] = [];
      visitSessions.forEach(vs => {
        const name = VisitSessionHelper.getDisplayText(vs);
        if (name !== "") {items.push(name);}
      });
      return items.join();
    }

}

