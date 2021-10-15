import test from "tape";

import CensusLodesOdDataDownloader from "./CensusLodesOdDataDownloader";
import CensusLodesRacDataDownloader from "./CensusLodesRacDataDownloader";
import CensusLodesWacDataDownloader from "./CensusLodesWacDataDownloader";

test("OD list files", async (t) => {
  const downloader = new CensusLodesOdDataDownloader();

  const d = await downloader.listCensusLodesOdDataCsvs();
  console.log(JSON.stringify(d, null, 4));

  t.end();
});

test("RAC list files", async (t) => {
  const downloader = new CensusLodesRacDataDownloader();

  const d = await downloader.listCensusLodesRacDataCsvs();

  console.log(JSON.stringify(d, null, 4));

  t.end();
});

test.only("WAC list files", async (t) => {
  const downloader = new CensusLodesWacDataDownloader();

  const d = await downloader.listCensusLodesWacDataCsvs();

  console.log(JSON.stringify(d, null, 4));

  t.end();
});
