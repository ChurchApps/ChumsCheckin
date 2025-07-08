export class FirebaseHelper {
  static async addAnalyticsEvent(eventName: string, dataBody: any) {
    // No-op implementation - Firebase Analytics removed
    console.log(`[FirebaseHelper] Analytics event: ${eventName}`, dataBody);
  }

  static async addOpenScreenEvent(screenName: string) {
    // No-op implementation - Firebase Analytics removed
    console.log(`[FirebaseHelper] Screen opened: ${screenName}`);
  }
}
