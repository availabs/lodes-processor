import { mkdirSync, createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { join } from "path";

import got from "got";
import { JSDOM } from "jsdom";
import _ from "lodash";

import {
  LodesOdDataUrl,
  LodesOdCsvRegExp,
  LodesOdDownloadDir,
} from "./Constants";

const pipelineAsync = promisify(pipeline);

export default class CensusLodesOdDataDownloader {
  static parseCensusLodesOdFileName(fileName: string) {
    const state = fileName.slice(0, 2);
    const partOfState = fileName.slice(6, 10);
    const jobType = fileName.slice(11, 15);
    const year = fileName.slice(16, 20);

    return {
      state,
      partOfState,
      jobType,
      year,
      fileName,
    };
  }

  async listCensusLodesOdDataCsvs() {
    try {
      const dom = await JSDOM.fromURL(LodesOdDataUrl);

      const as = dom.window.document.querySelectorAll("a");

      const odFiles = [...as].sort().reduce((acc, e) => {
        const { href } = e;

        const fileName = _.last(href.split("/"));

        if (LodesOdCsvRegExp.test(fileName)) {
          const d = {
            ...CensusLodesOdDataDownloader.parseCensusLodesOdFileName(fileName),
            url: href,
          };

          acc.push(d);
        }

        return acc;
      }, []);

      return odFiles;
    } catch (err) {
      throw err;
    }
  }

  async downloadCensusLodesOdDataCsvs() {
    mkdirSync(LodesOdDownloadDir, { recursive: true });

    const odFiles = await this.listCensusLodesOdDataCsvs();

    for (const { fileName, url } of odFiles) {
      const outFilePath = join(LodesOdDownloadDir, fileName);
      const outputStream = createWriteStream(outFilePath);

      console.log("Downloading", fileName);
      await pipelineAsync(got.stream.get(url), outputStream);
    }
  }
}
