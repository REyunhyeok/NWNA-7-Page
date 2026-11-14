export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let n = bytes / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
}

export function formatDate(d: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function parseTags(tags: string) {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function normalizeTags(raw: string) {
  return Array.from(new Set(parseTags(raw).map((t) => t.replace(/^#/, "")))).slice(0, 8).join(",");
}
