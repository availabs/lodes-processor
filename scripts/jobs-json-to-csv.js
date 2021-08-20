#!/usr/bin/env node

const { readFileSync } = require("fs");

const { data } = JSON.parse(readFileSync(process.argv[2]));

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
