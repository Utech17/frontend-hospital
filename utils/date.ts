export function formatDate(dateString: string, format: string = "dd/mm/yyyy") {
  if (format === "dd/mm/yyyy") {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  } else {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

export function getTodaysDate(returnISODate = false) {
  const ISODate = new Date().toISOString().slice(0, 10);
  if (returnISODate) return ISODate;
  const [year, month, day] = ISODate.split("-");
  return `${day}/${month}/${year}`;
}

export function convertToISODate(dateStr: string): string | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  if (
    isNaN(+day) ||
    isNaN(+month) ||
    isNaN(+year) ||
    +day < 1 ||
    +day > 31 ||
    +month < 1 ||
    +month > 12
  ) {
    return null;
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export const parseDateDMY = (fechaStr: any) => {
  const partes = fechaStr.split('/');
  return new Date(partes[2], partes[1] - 1, partes[0]);
};