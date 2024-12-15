import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { frontmatterToMarkdown } from "mdast-util-frontmatter";
import { toMarkdown } from "mdast-util-to-markdown";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "path";

async function main() {
  const isFile = (fileName) => {
    if (fileName != "index.md") {
      return fsSync.lstatSync(fileName).isFile();
    } else {
      return false;
    }
  };
  const folderPath = "./docs/classes";
  let files = fsSync
    .readdirSync(folderPath)
    .map((fileName) => {
      return path.join(folderPath, fileName);
    })
    .filter(isFile);
  for (let h = 0; h < files.length; h++) {
    const data = await fs.readFile(files[h]);
    const tree = unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkGfm)
      .use(rehypeStringify)
      .parse(data);

    var newChildren = [];

    for (let i = 0; i < tree.children.length; i += 1) {
      var table = tree.children[i];
      if (table.type == "table") {
        var processed = processTable(table);
        for (let j = 0; j < processed.length; j++) {
          newChildren.push(processed[j]);
        }
      } else {
        newChildren.push(tree.children[i]);
      }
    }
    tree.children = newChildren;

    let out = toMarkdown(tree, {
      extensions: [frontmatterToMarkdown(["yaml", "toml"])],
    });
    let lines = out.split('\n');
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replaceAll("<","&lt;");
      lines[i] = lines[i].replaceAll(">","&gt;");
      lines[i] = lines[i].replaceAll("<br>","\n");
    }
    out = lines.join('\n');

    await fs.writeFile(files[h], out);
  }
}

function toHeaders(row, sections) {
  let data = [];
  for (let i = 0; i < sections.length; i++) {
    if (i == 0) {
      data.push({
        type: "heading",
        depth: 3,
        children: row[i],
      });
    } else {
      data.push({
        type: "heading",
        depth: 5,
        children: sections[i],
      });
      data.push({
        type: "paragraph",
        children: row[i],
      });
      console.log(row);
    }
  }
  return data;
}

function processTable(table) {
  let rows = table.children;
  let sections = [];
  let newRows = [];
  for (let i = 0; i < rows.length; i++) {
    var newRow = [];
    for (let j = 0; j < rows[i].children.length; j++) {
      newRow.push(rows[i].children[j].children);
    }
    if (i == 0) {
      sections = newRow;
    } else {
      newRows.push(newRow);
    }
  }
  let newHeaders = [];

  for (let i = 0; i < newRows.length; i++) {
    newHeaders = newHeaders.concat(toHeaders(newRows[i], sections));
  }

  return newHeaders;
}

await main();
