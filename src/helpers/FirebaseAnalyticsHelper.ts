export class FirebaseAnalyticsHelper {
  static init(data: Record<string, any>) {
    // No-op implementation - Firebase Analytics removed
    console.log("[FirebaseAnalyticsHelper] Analytics initialized (no-op)");
  }

  static async trackEvent(name: string, data: Record<string, any> = {}) {
    // No-op implementation - Firebase Analytics removed
    console.log(`[FirebaseAnalyticsHelper] Event tracked: ${name}`, data);
  }
}