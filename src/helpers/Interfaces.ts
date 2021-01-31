export interface ApiConfig { keyName: string, url: string, jwt: string, permisssions: RolePermissionInterface[] }
export type ApiListType = "AccessApi" | "MembershipApi" | "AttendanceApi";

export interface ApiInterface { name: string, keyName?: string, permissions: RolePermissionInterface[], jwt: string }
export interface ApplicationInterface { name: string, keyName?: string, permissions: RolePermissionInterface[] }
export interface ChurchAppInterface { id?: number, churchId?: number, appName?: string }
export interface ChurchInterface { id?: number, name: string, registrationDate?: Date, apis?: ApiInterface[], apps?: ApplicationInterface[], address1?: string, address2?: string, city?: string, state?: string, zip?: string, country?: string, subDomain?: string }
export interface ForgotResponse { emailed: boolean }
export interface LoadCreateUserRequestInterface { userEmail: string, fromEmail?: string, subject?: string, body?: string, userName: string }
export interface LoginResponseInterface { user: UserInterface, churches: ChurchInterface[], errors: string[] }
export interface PermissionInterface { apiName?: string, section?: string, action?: string, displaySection?: string, displayAction?: string }
export interface RegisterInterface { churchName?: string, displayName?: string, email?: string, password?: string }
export interface RoleInterface { id?: number, churchId?: number, appName?: string, name?: string }
export interface RolePermissionInterface { id?: number, churchId?: number, roleId?: number, apiName?: string, contentType?: string, contentId?: number, action?: string }
export interface RoleMemberInterface { id?: number, churchId?: number, roleId?: number, userId?: number, user?: UserInterface }
export interface ResetPasswordRequestInterface { userEmail: string, fromEmail: string, subject: string, body: string }
export interface ResetPasswordResponseInterface { emailed: boolean }
export interface SwitchAppRequestInterface { appName: string, churchId: number }
export interface SwitchAppResponseInterface { appName: string, churchId: number }
export interface UserInterface { id?: number, email?: string, authGuid?: string, displayName?: string, registrationDate?: Date, lastLogin?: Date, password?: string }

export interface GroupServiceTimeInterface { id?: number, groupId?: number, serviceTimeId?: number, serviceTime?: ServiceTimeInterface }
export interface GroupInterface { id?: number, name?: string, categoryName?: string, parentPickup?: boolean }
export interface NameInterface { first?: string, middle?: string, last?: string, nick?: string, display?: string }
export interface PersonInterface { id?: number, name: NameInterface, membershipStatus?: string, gender?: string, birthDate?: Date, maritalStatus?: string, anniversary?: Date, photo?: string, photoUpdated?: Date, householdId?: number, householdRole?: string, userId?: number }
export interface ServiceInterface { id?: number, campusId?: number, name?: string }
export interface ServiceTimeInterface { id?: number, name?: string, groups?: GroupInterface[] }
export interface SessionInterface { id?: number, groupId?: number, serviceTimeId?: number, sessionDate?: Date, displayName?: string }
export interface VisitInterface { id?: number, personId?: number, serviceId?: number, groupId?: number, visitDate?: Date, visitSessions?: VisitSessionInterface[], person?: PersonInterface }
export interface VisitSessionInterface { id?: number, visitId?: number, sessionId?: number, visit?: VisitInterface, session?: SessionInterface }