

export function formatUTCString(utcString: string) {
  let [year, month, day] = utcString.split("T")[0].split("-");
  year = year.slice(2, 4);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[parseInt(month)-1];

  return `${day} ${monthName} ${year}`
}

export function formatTimestampSting(createdAt: string, updatedAt: string) {
  return `${formatUTCString(createdAt)} | ${formatUTCString(updatedAt)}`
}