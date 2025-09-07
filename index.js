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
import { parse, stringify } from 'yaml'

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
    var frontMatterData = null;
    if (tree.children.length > 0 && tree.children[0]?.type == "yaml") {
      frontMatterData = parse(tree.children[0].value);
    }

    var prevHeader = null;
    for (let i = 0; i < tree.children.length; i++) {
      var table = tree.children[i];
      if (table.type == "table") {
        var processed = processTable(table, frontMatterData, prevHeader?.children?.[0]?.value);
        for (let j = 0; j < processed.length; j++) {
          newChildren.push(processed[j]);
        }
      } else {
        newChildren.push(tree.children[i]);
      }
      if (tree.children[i].type = "heading") {
        prevHeader = tree.children[i];
      }
    }
    tree.children = newChildren;

    let out = toMarkdown(tree, {
      extensions: [frontmatterToMarkdown(["yaml", "toml"])],
    });
    let lines = out.split('\n');
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replaceAll("layout: page", "layout: doc");
      lines[i] = lines[i].replaceAll("<br>", '\n');
      lines[i] = lines[i].replaceAll("<", "&lt;");
      lines[i] = lines[i].replaceAll(">", "&gt;");
    }

    var title = 
`---
title: ${frontMatterData.title}
layout: doc
---
`;

    out = lines.join('\n');
    out = title + out;

    await fs.writeFile(files[h], out);
  }
}

function toHeaders(row, sections, frontMatterData, headerName) {
  let data = [];
  for (let i = 0; i < sections.length; i++) {
    if (i == 0) {

      if (headerName.startsWith("Static") && frontMatterData?.title != null) {
        var currRow = row[i][0];
        row[i][0].value = frontMatterData.title + "." + row[i][0].value;
      }
      data.push({
        type: "heading",
        depth: 3,
        children: row[i]
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
    }
  }
  return data;
}

function processTable(table, frontMatterData, headerName) {
  let rows = table.children;
  let sections = [];
  let newRows = [];
  for (let i = 0; i < rows.length; i++) {
    var newRow = [];
    for (let j = 0; j < rows[i].children.length; j++) {
      var toPush = rows[i].children[j].children;
      newRow.push(toPush);
    }
    if (i == 0) {
      sections = newRow;
    } else {
      newRows.push(newRow);
    }
  }
  let newHeaders = [];

  for (let i = 0; i < newRows.length; i++) {
    newHeaders = newHeaders.concat(toHeaders(newRows[i], sections, frontMatterData, headerName));
  }

  return newHeaders;
}

await main();
