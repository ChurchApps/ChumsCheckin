export class AppCenterHelper {
  static init(data: Record<string, any>) {
    // No-op implementation - AppCenter removed
    console.log("[AppCenterHelper] AppCenter initialized (no-op)");
  }

  static async trackEvent(name: string, data: Record<string, any> = {}) {
    // No-op implementation - AppCenter removed
    console.log(`[AppCenterHelper] Event tracked: ${name}`, data);
  }
}
