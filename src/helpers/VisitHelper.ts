import { VisitInterface } from "@churchapps/mobilehelper";

export class VisitHelper {

  public static getByPersonId(visits: VisitInterface[], personId: string): VisitInterface | null {
    let result: VisitInterface | null = null;
    visits.forEach(v => { if (v.personId === personId) {result = v;} });
    return result;
  }

}

