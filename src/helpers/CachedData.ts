import { PersonInterface, ServiceTimeInterface, VisitInterface, ChurchInterface, GroupServiceTimeInterface, GroupInterface } from "./Interfaces";

export class CachedData {
    static pendingVisits: VisitInterface[] = [];
    static existingVisits: VisitInterface[] = [];

    static church: ChurchInterface | null = null;
    static householdId: number = 0;
    static householdMembers: PersonInterface[] = [];

    static serviceId: number = 0;
    static serviceTimes: ServiceTimeInterface[] = [];
    static groupServiceTimes: GroupServiceTimeInterface[] = [];
    static groups: GroupInterface[] = [];



    static printerReady = false;
}

