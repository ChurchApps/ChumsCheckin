import { ServiceTimeInterface } from "./Interfaces";

const DAY = 1440;
const WEEK = 7 * DAY;
const parseTime = (value?: string | null) => {
  const match = value?.match(/^(\d{1,2}):(\d{2})/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};

export class ServiceTimeHelper {
  // Comma-separated names of the groups offered at a service time, de-duplicated in first-seen order.
  static getGroupSummary(serviceTime: ServiceTimeInterface): string {
    const seen = new Set<string>();
    const names: string[] = [];
    (serviceTime?.groups || []).forEach(g => {
      const name = (g?.name || "").trim();
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return;
      seen.add(key);
      names.push(name);
    });
    return names.join(", ");
  }

  // Mirrors the Api's CheckinGateHelper, but live on the device clock so a kiosk left running opens and closes on time.
  // ponytail: device time zone, not the church's — kiosks sit at the church.
  static isCheckinOpen(st: ServiceTimeInterface, now = new Date()): boolean {
    const start = parseTime(st.startTime);
    if (st.dayOfWeek == null || st.dayOfWeek < 0 || st.dayOfWeek > 6 || start === null) return true;
    let end = parseTime(st.endTime) ?? start;
    if (end < start) end += DAY;
    const windowStart = st.dayOfWeek * DAY + start - Math.max(0, st.checkinOpenMinutes ?? 0);
    const windowEnd = st.dayOfWeek * DAY + end + Math.max(0, st.checkinCloseMinutes ?? 0);
    const nowMinute = now.getDay() * DAY + now.getHours() * 60 + now.getMinutes();
    return [nowMinute - WEEK, nowMinute, nowMinute + WEEK].some(t => t >= windowStart && t <= windowEnd);
  }

  // Soonest upcoming check-in opening among the times, e.g. "Sun 9:30 AM"; empty when none are scheduled.
  static getOpensLabel(times: ServiceTimeInterface[], locale?: string, now = new Date()): string {
    const nowMinute = now.getDay() * DAY + now.getHours() * 60 + now.getMinutes();
    let best: number | null = null;
    let bestWait = Infinity;
    times.forEach(st => {
      const start = parseTime(st.startTime);
      if (st.dayOfWeek == null || start === null) return;
      const opens = st.dayOfWeek * DAY + start - Math.max(0, st.checkinOpenMinutes ?? 0);
      const wait = (((opens - nowMinute) % WEEK) + WEEK) % WEEK;
      if (wait < bestWait) { bestWait = wait; best = opens; }
    });
    if (best === null) return "";
    // 2024-01-07 was a Sunday; Date rolls the minute offset into the right weekday.
    return new Date(2024, 0, 7, 0, best).toLocaleString(locale, { weekday: "short", hour: "numeric", minute: "2-digit" });
  }
}
