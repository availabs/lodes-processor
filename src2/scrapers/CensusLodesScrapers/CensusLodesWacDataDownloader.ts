import { mkdirSync, createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { join } from "path";

import got from "got";
import { JSDOM } from "jsdom";
import _ from "lodash";

import {
  LodesWacDataUrl,
  LodesWacCsvRegExp,
  LodesWacDownloadDir,
} from "./Constants";

const pipelineAsync = promisify(pipeline);

export default class CensusLodesWacDataDownloader {
  static parseCensusLodesWacFileName(fileName: string) {
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

  async listCensusLodesWacDataCsvs() {
    try {
      const dom = await JSDOM.fromURL(LodesWacDataUrl);

      const as = dom.window.document.querySelectorAll("a");

      const wacFiles = [...as].sort().reduce((acc, e) => {
        const { href } = e;

        const fileName = _.last(href.split("/"));

        if (LodesWacCsvRegExp.test(fileName)) {
          const d = {
            ...CensusLodesWacDataDownloader.parseCensusLodesWacFileName(
              fileName
            ),
            url: href,
          };

          acc.push(d);
        }

        return acc;
      }, []);

      return wacFiles;
    } catch (err) {
      throw err;
    }
  }

  async downloadCensusLodesWacDataCsvs() {
    mkdirSync(LodesWacDownloadDir, { recursive: true });

    const wacFiles = await this.listCensusLodesWacDataCsvs();

    for (const { fileName, url } of wacFiles) {
      const outFilePath = join(LodesWacDownloadDir, fileName);
      const outputStream = createWriteStream(outFilePath);

      console.log("Downloading", fileName);
      await pipelineAsync(got.stream.get(url), outputStream);
    }
  }
}
