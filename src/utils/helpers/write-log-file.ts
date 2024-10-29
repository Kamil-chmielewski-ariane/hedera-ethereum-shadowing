import fs from "fs";

export async function writeLogFile(path: string, data: any) {
    fs.appendFile(`${path}`, data, 'utf-8', (err) => {
        if (err) {  console.error(err);  return; }
    });
}