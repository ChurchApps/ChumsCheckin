import { PersonInterface, ServiceTimeInterface, VisitInterface, ChurchInterface, GroupServiceTimeInterface, GroupInterface, AvailablePrinter } from "./Interfaces";

export class CachedData {
  static pendingVisits: VisitInterface[] = [];
  static existingVisits: VisitInterface[] = [];

  static church: ChurchInterface | null = null;
  static householdId: string = "";
  static householdMembers: PersonInterface[] = [];

  static serviceId: string = "";
  static serviceTimes: ServiceTimeInterface[] = [];
  static groupServiceTimes: GroupServiceTimeInterface[] = [];
  static groups: GroupInterface[] = [];


  static printer: AvailablePrinter = { model: "none", ipAddress: "" }
}

