
function padNumberString(num: number) {
  return num.toString().padStart(2, "0");
}

export function formatUTCString(utcString: string) {
  const date = new Date(utcString);
  const day = padNumberString(date.getDate());
  const month = padNumberString(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = padNumberString(date.getHours());
  const minutes = padNumberString(date.getMinutes());

  return `${day}-${month}-${year} @ ${hours}:${minutes}`
}
