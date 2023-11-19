export interface LinkRemovalResult {
  filePath: string;
  links: string[];
  removed: boolean;
}

export function findJsLinks(
  fsModule: typeof fs,
  folderPath: string,
  remove: boolean = false
): LinkRemovalResult[] {
  let results: LinkRemovalResult[] = [];
  const files = fsModule.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileStat = fsModule.statSync(filePath);

    if (fileStat.isDirectory()) {
      results = results.concat(findJsLinks(fsModule, filePath, remove));
    } else if (fileStat.isFile() && path.extname(filePath) === ".js") {
      let fileContent = fsModule.readFileSync(filePath, "utf-8");
      const links =
        fileContent.match(/https?:\/\/(?!.*redux)[^\s"]+\.js/g) || [];

      if (links.length > 0) {
        if (remove) {
          links.forEach((link) => {
            fileContent = fileContent.replace(link, "");
          });
          fsModule.writeFileSync(filePath, fileContent);
        }

        results.push({ filePath, links, removed: remove });
      }
    }
  }

  return results;
}
