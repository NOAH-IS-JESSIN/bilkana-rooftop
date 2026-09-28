import { HOURS } from "../content/site";

/** Minutes since midnight in Amman (Asia/Amman, UTC+3 all year since 2022). */
function ammanMinutes(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Amman",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

/** Open 08:00 → 01:00 next day. */
export function isOpenNow(now = new Date()) {
  const m = ammanMinutes(now);
  const close = HOURS.close - 24 * 60; // 60 = 01:00
  return m >= HOURS.open || m < close;
}
