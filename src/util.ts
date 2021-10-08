import fs from "fs";
import { basename } from "path";

// This limit is somewhat arbitrary, however some issues do arrise with too long station names.
// Refer to issue #20
const STATION_NAME_MAX_LENGTH = 50;

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