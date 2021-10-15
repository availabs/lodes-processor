import { join } from "path";

export const LodesVersion = "LODES7";

export const LodesBaseUrl = `https://lehd.ces.census.gov/data/lodes/${LodesVersion}`;

export const LodesDataYear = 2018;

const LodesDataDir = join(__dirname, "../../../data/census/lodes/");

// ===== Origin-Destination (OD) =====

export const LodesOdDataUrl = `${LodesBaseUrl}/ny/od/`;

export const LodesOdCsvRegExp = new RegExp(
  `^[a-z]{2}_od_(main|aux)_JT0[0-5]_${LodesDataYear}.csv.gz$`
);

export const LodesOdDownloadDir = join(LodesDataDir, "od");

// ===== Residence Area Characteristics (RAC) =====

export const LodesRacDataUrl = `${LodesBaseUrl}/ny/rac/`;

export const LodesRacCsvRegExp = new RegExp(
  `^[a-z]{2}_rac_S[0AEI]0[0-3]_JT0[0-5]_${LodesDataYear}.csv.gz$`
);

export const LodesRacDownloadDir = join(LodesDataDir, "rac");

// ===== Residence Area Characteristics (RAC) =====

export const LodesWacDataUrl = `${LodesBaseUrl}/ny/wac/`;

export const LodesWacCsvRegExp = new RegExp(
  `^[a-z]{2}_wac_S[0AEI]0[0-3]_JT0[0-5]_${LodesDataYear}.csv.gz$`
);

export const LodesWacDownloadDir = join(LodesDataDir, "wac");
