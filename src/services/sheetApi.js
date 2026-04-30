import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1wsapy06r6_QSwnRSY7SagfD64gvP9nTpqiMVN2KvR0k1owo6uMY9jcGQxU5QXW5r7UJmIw6wpYO9/pub?gid=1204855013&single=true&output=csv";

export async function getSheetData() {
  const res = await fetch(SHEET_URL);

  if (!res.ok) {
    throw new Error("Impossible de charger Google Sheet");
  }

  const csvText = await res.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: reject,
    });
  });
}