#!/usr/bin/env node

import fs from "fs";
import path from "path";
import arg from "arg";
import invariant from "tiny-invariant";
import console from "console";

const urlRegex =
  /((?<!\+)https?:\/\/(?:www\.)?(?:[-\p{Letter}.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w\p{Letter}.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*)/gu;

const helpText = `
Description:
  a cli to find and remove links that might annoy the chrome web store team 
  often these are firebase links for some reason

Usage: 
  badlinks <file_or_folder> [options]

Options:
  -r, --remove    Remove the found JS links
  -h, --help      Display this help message
`;

function showHelp() {
  console.log(helpText);
  process.exit(0);
}

export function extractJsLinks(text: string) {
  return text.match(urlRegex)?.filter((link) => link.includes(".js")) || [];
}

function processFile(filePath: string, shouldRemove: boolean) {
  let fileContent = fs.readFileSync(filePath, "utf-8");
  const jsLinks = extractJsLinks(fileContent);

  if (jsLinks.length === 0) {
    console.log(`No JS link(s) found in ${filePath}`);
    return;
  }

  console.log(`JS link(s) found in ${filePath}:`);
  console.log(jsLinks);

  if (shouldRemove) {
    jsLinks.forEach((link) => (fileContent = fileContent.replace(link, "")));
    fs.writeFileSync(filePath, fileContent);
    console.log(`JS link(s) removed from ${filePath}`);
  } else {
    console.error("Links found (use --remove to remove them).");
  }
}

function processPath(inputPath: string, shouldRemove: boolean) {
  const fileStats = fs.statSync(inputPath);

  if (fileStats.isDirectory()) {
    const fileNames = fs.readdirSync(inputPath);
    for (const fileName of fileNames) {
      processPath(path.join(inputPath, fileName), shouldRemove);
    }
  } else if (fileStats.isFile() && path.extname(inputPath) === ".js") {
    processFile(inputPath, shouldRemove);
  }
}

function parseArgs() {
  const argSpec = {
    "--help": Boolean,
    "--remove": Boolean,
    "-h": "--help",
    "-r": "--remove",
  };

  try {
    const args = arg(argSpec);

    if (args["--help"]) {
      showHelp();
    }

    const inputPath = args._.length > 0 ? args._[0] : null;

    if (!inputPath) {
      console.error("** Error: A file or folder path is required \n --- ");
      showHelp();
    }

    return {
      inputPath,
      remove: args["--remove"] || false,
    };
  } catch (error) {
    // @ts-ignore
    console.error(`Error: ${error?.message}`);
    showHelp();
  }
}

try {
  const options = parseArgs();
  invariant(options?.inputPath, "No input path");
  processPath(options.inputPath, options.remove);
} catch (error) {
  // @ts-ignore
  console.error("Error:", error.message);
  process.exit(1);
}
