# Lodes Processor (FORK)

NOTE: This is a fork of [conveyal/lodes-processor](https://github.com/conveyal/lodes-processor)

## Building

### Getting the Build Environment

This fork was created, Aug 17, 2021.
At that time the original repo's last commit was May 1, 2014.

Building this project required Java 8 and Gradle 2.2.1. See:

- Java [releases](https://java.com/releases/)
- Gradle [releases](https://gradle.org/releases/)

The Java environment can be downloaded using [SDKMAN!](https://sdkman.io/).

```sh
sdk install java 8.0.302-open
sdk install gradle 2.2.1
```

### Build the JAR

NOTE: [build.gradle](build.gradle) required package location updates.

```sh
gradle fatJar
```

## Running

### Creating an _Origins and Destination Opportunities_ Jobs CSV

The [Conveyal Analysis UI](https://github.com/conveyal/analysis-ui) allows loading
a Spatial Dataset [CSV](https://docs.conveyal.com/prepare-inputs/upload-spatial-data#csv).

This repository can create an _Origins and Destination Opportunities_
CSV using the Census LODES dataset.

#### Obtaining the US Census Bureau LODES Data

You can download the LODES7 2018 NYS All Jobs
Residence Area Characteristic (RAC) data using this link:
[ny_rac_S000_JT00_2018.csv.gz](https://lehd.ces.census.gov/data/lodes/LODES7/ny/rac/ny_rac_S000_JT00_2018.csv.gz).

For other LODES data files, see Census.gov's [/data/lodes](https://lehd.ces.census.gov/data/lodes).

For LODES dataset documentation, see the following:

- [LEHD Origin-Destination Employment Statistics (LODES)](https://lehd.ces.census.gov/data/#lodes) and
- [LODES Tech Doc 7.5](https://lehd.ces.census.gov/data/lodes/LODES7/LODESTechDoc7.5.pdf)

To extract a county from the LODES7 CSV:

```sh
zcat ny_rac_S000_JT00_2018.csv.gz \
  | awk -F, 'BEGIN{ OFS="," } { if (NR == 1 || $1 ~ /^36001/) { print } }' \
  | gzip -9 \
  > ny_rac_S000_JT00_2018.36001.csv.gz
```

where _36001_ is the FIPS code for Albany County, NY.

#### Obtaining the US Census Bureau Block-Level Shapefile

You can download Census TIGER/Line Shapefiles
[here](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html).

You can download the 2020 NYS Census Blocks Shapefile using this link:
[tl_2020_36_tabblock20.zip](https://www2.census.gov/geo/tiger/TIGER2020/TABBLOCK20/tl_2020_36_tabblock20.zip).

To create a county extract from the 2020 NYS Census Blocks Shapefile:

```sh
ogr2ogr \
  -F 'ESRI Shapefile' \
  tl_2020_36001_tabblock20 \
  /vsizip/tl_2020_36_tabblock20.zip \
  -where "COUNTYFP20='001'" \
  -nln tl_2020_36001_tabblock20
```

where _36001_ is the FIPS code for Albany County, NY.

#### Placing the data in the expected directories

```sh
mkdir -p data/csvs/
mkdir -p data/shapes/
```

Put an uncompressed copy of the LODES CSV in _data/csvs/_ .

Put an uncompressed copy of the TIGER Blocks Shapefile in _data/shapes/_ .

#### Creating the Jobs JSON file

NOTE: the _-s_ flag below requires the path to the Shapefile's directory.

```sh
java \
  -jar build/libs/avail-lodes-processor.jar \
  -ag data/type_attribute_groups.csv \
  -a data/csvs/ \
  -s data/shapes/tl_2020_36001_tabblock20 \
  -i jobs -n jobs
```

#### Creating the Jobs CSV file

NOTE: The following assume

```sh
./jobs-json-to-csv.js > jobs.csv
```

## Required Code Changes for 2020 Census Blocks

The Census Blocks Shapefile's GEOID10, ALAND10, and AWATER10 attributes
were changed to GEOID20, ALAND20, and AWATER20
in [Blocks.java](src/main/java/com/conveyal/lodes/Blocks.java).
