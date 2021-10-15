import { relative } from "path";

import {
  LodesOdDownloadDir,
  LodesRacDownloadDir,
  LodesWacDownloadDir,
} from "./Constants";

import CensusLodesOdDataDownloader from "./CensusLodesOdDataDownloader";
import CensusLodesRacDataDownloader from "./CensusLodesRacDataDownloader";
import CensusLodesWacDataDownloader from "./CensusLodesWacDataDownloader";

export const downloadCensusLodesOdDataCsvs = {
  desc: `Download the Census LODES Origin-Destination (OD) Data Files.`,
  command: "download_census_lodes_od",
  handler: async () => {
    const dir = relative("", LodesOdDownloadDir);

    console.log(`Downloading the Census LODES OD data files into ${dir}`);

    const loader = new CensusLodesOdDataDownloader();
    await loader.downloadCensusLodesOdDataCsvs();
  },
};

export const downloadCensusLodesRacDataCsvs = {
  desc: `Download the Census LODES Residence Area Characteristics (RAC) Data Files.`,
  command: "download_census_lodes_rac",
  handler: async () => {
    const dir = relative("", LodesRacDownloadDir);

    console.log(`Downloading the Census LODES RAC data files into ${dir}`);

    const loader = new CensusLodesRacDataDownloader();
    await loader.downloadCensusLodesRacDataCsvs();
  },
};

export const downloadCensusLodesWacDataCsvs = {
  desc: `Download the Census LODES Workplace Area Characteristics (WAC) Data Files.`,
  command: "download_census_lodes_wac",
  handler: async () => {
    const dir = relative("", LodesWacDownloadDir);

    console.log(`Downloading the Census LODES WAC data files into ${dir}`);

    const loader = new CensusLodesWacDataDownloader();
    await loader.downloadCensusLodesWacDataCsvs();
  },
};
