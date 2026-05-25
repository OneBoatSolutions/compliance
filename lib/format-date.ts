export function formatDate(date: string | null) {
  if (!date) {
    return "Never Logged In";
  }

  const parsedDate = new Date(date);

  // ✅ prevents crash
  if (isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}
