import fs from "fs";
import path from "path";
import { Command } from "commander";
import { findJsLinks } from "./links";
const program = new Command();

program
  .name("bad firebase links")
  .usage("<folder> [options]")
  .description(
    "find JS links in a folder that google doesn't like (mostly firebase ones apparently)"
  )
  .argument("<folder>", "Folder to find JS links in")
  .option("-r, --remove", "Remove the JS links")
  .action((folder, options, command) => {
    findJsLinks(folder, options.remove);
  });

program.parse(process.argv);
