#!/usr/bin/env node

const { readFileSync } = require("fs");
const { join } = require("path");

const { data } = JSON.parse(readFileSync(join(__dirname, "./jobs.json")));

console.log(
  "lat,lon,construction_manufacturing,trade,education,transport_utilities,health,public_admin,information,leisure_hospitality,finance,professional"
);

data.forEach(
  ({
    lat,
    lon,
    attributes: {
      construction_manufacturing = "",
      trade = "",
      education = "",
      transport_utilities = "",
      health = "",
      public_admin = "",
      information = "",
      leisure_hospitality = "",
      finance = "",
      professional = "",
    },
  }) => {
    const row = [
      lat,
      lon,
      construction_manufacturing,
      trade,
      education,
      transport_utilities,
      health,
      public_admin,
      information,
      leisure_hospitality,
      finance,
      professional,
    ].join();

    console.log(row);
  }
);
