
import { ServiceTimeInterface } from "../helpers";

export type ScreenList = {
    Login: undefined,
    Splash: undefined,
    Lookup: undefined,
    Services: undefined,
    AddGuest: undefined,
    Household: undefined,
    CheckinComplete: undefined,
    SelectGroup: { serviceTime: ServiceTimeInterface, personId: string },
    SelectChurch: undefined
}