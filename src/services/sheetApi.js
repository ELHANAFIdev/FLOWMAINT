import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1YBQyyDdnYDadf_7uE0PsHRy9fSIMYehRI-N5gSseE9M/export?format=csv&gid=398327789";

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