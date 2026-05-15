export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function daysBetween(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
  );
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayString();
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = addDays(todayString(), -1);
  return dateStr === yesterday;
}
