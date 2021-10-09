import fs from "fs";

/**
 * Checks if a given path refers to a folder
 * @param path the path to be checked
 * @returns a boolean indicating if the path exists and refers to a folder
 */
export function folderExists(path: string): boolean {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}
