import { mkdirSync, createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { join } from "path";

import got from "got";
import { JSDOM } from "jsdom";
import _ from "lodash";

import {
  LodesRacDataUrl,
  LodesRacCsvRegExp,
  LodesRacDownloadDir,
} from "./Constants";

const pipelineAsync = promisify(pipeline);

export default class CensusLodesRacDataDownloader {
  static parseCensusLodesRacFileName(fileName: string) {
    const state = fileName.slice(0, 2);
    const workforceSegment = fileName.slice(7, 11);
    const jobType = fileName.slice(12, 16);
    const year = fileName.slice(17, 21);

    return {
      state,
      workforceSegment,
      jobType,
      year,
      fileName,
    };
  }

  async listCensusLodesRacDataCsvs() {
    try {
      const dom = await JSDOM.fromURL(LodesRacDataUrl);

      const as = dom.window.document.querySelectorAll("a");

      const racFiles = [...as].sort().reduce((acc, e) => {
        const { href } = e;

        const fileName = _.last(href.split("/"));

        if (LodesRacCsvRegExp.test(fileName)) {
          const d = {
            ...CensusLodesRacDataDownloader.parseCensusLodesRacFileName(
              fileName
            ),
            url: href,
          };

          acc.push(d);
        }

        return acc;
      }, []);

      return racFiles;
    } catch (err) {
      throw err;
    }
  }

  async downloadCensusLodesRacDataCsvs() {
    mkdirSync(LodesRacDownloadDir, { recursive: true });

    const racFiles = await this.listCensusLodesRacDataCsvs();

    for (const { fileName, url } of racFiles) {
      const outFilePath = join(LodesRacDownloadDir, fileName);
      const outputStream = createWriteStream(outFilePath);

      console.log("Downloading", fileName);
      await pipelineAsync(got.stream.get(url), outputStream);
    }
  }
}
