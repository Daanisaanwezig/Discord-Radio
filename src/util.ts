import fs from "fs";
import { basename, join } from "path";

// This limit is somewhat arbitrary, however some issues do arrise with too long station names.
// Refer to issue #20
const STATION_NAME_MAX_LENGTH = 50;
export const STATIONS_LIST_MAX_ITEMS = 20;

/**
 * Checks if a given path refers to a folder
 * @param path the path to be checked
 * @returns a boolean indicating if the path exists and refers to a folder
 */
export function folderExists(path: string): boolean {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}

/**
 * Checks if a given station folder exists and is valid
 * @param stationFolder the station to be verified
 * @returns a boolean indicating if the station folder is valid
 */
export function stationExists(stationFolder: string): boolean {
  return folderExists(stationFolder) && basename(stationFolder).length <= STATION_NAME_MAX_LENGTH;
}

interface StationsList {
  stations: string[],
  next: boolean
};

/**
 * Returns one page of stations. The amount of stations per page is determined by STATIONS_LIST_MAX_ITEMS.
 * @param musicFolder path to the music folder
 * @param page what page (as an index) should be returned
 * @returns a StationsList object containing the next stations and if more stations are available
 */
export function getStations(musicFolder: string, page: number): Promise<StationsList> {
  return new Promise((resolve, reject) => {
    fs.readdir(musicFolder, (err, stations) => {
      if (err) reject("Couldn't read music folder.");

      // filter out all files and invalid folders from the music folder
      stations = stations.filter(station => stationExists(join(musicFolder, station)));

      if (stations.length == 0) reject("No stations found... Did you create any?")

      let endIdx = (page + 1) * STATIONS_LIST_MAX_ITEMS;
      let ret: StationsList = {
        stations: stations.slice(page * STATIONS_LIST_MAX_ITEMS, endIdx), // select a subset of stations
        next: stations.length >= (endIdx + 1) // check if there is at least one more station on the next page
      };
      resolve(ret);
    });
  })
}