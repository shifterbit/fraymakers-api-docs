import rehypeStringify from "npm:rehype-stringify";
import remarkFrontmatter from "npm:remark-frontmatter";
import remarkGfm from "npm:remark-gfm";
import remarkParse from "npm:remark-parse";
import { unified } from "npm:unified";
import { frontmatterToMarkdown } from "npm:mdast-util-frontmatter";
import { toMarkdown } from "npm:mdast-util-to-markdown";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { parse, stringify } from 'npm:yaml'
// import { Table } from "mdast";
// import { Table } from "npm:mdast";
class DocElement {
  constructor() {
  }

  toMarkdown(): string {
    return "";
  }
  toJson(): any {
    return null;
  }
}

class VariableDoc extends DocElement {
  name: string;
  type: string;
  initialValue: string;
  description: string;
  customDescription: string;
  isStatic: boolean
  parentClass: string
  constructor(parent: string, isStatic: boolean) {
    super();
    this.name = "";
    this.type = "";
    this.initialValue = "";
    this.description = "";
    this.customDescription = "";
    this.isStatic = isStatic;
    this.parentClass = parent;
  }

  applyOverrides() {
    try {
      let parsed = JSON.parse(fsSync.readFileSync(`./docs/overrides/${this.parentClass}.json`).toString());
      let altDescription = this.isStatic ? (parsed?.staticVariables?.[this.name]) : (parsed?.instanceVariables?.[this.name]);
      if (altDescription != null) {
        this.customDescription = altDescription;
      }
    } catch (error) { 
    }
  }

  toJson(): any {
    return {
      name: this.name,
      type: this.type,
      initialValue: this.initialValue,
      description: this.description,
      customDescription: this.customDescription,
    }
  }

  toMarkdown(): string {
    var returnString = "";
    let title = this.isStatic ? `${this.parentClass}.${this.name}` : this.name;
    if (title != null) {
      title = title.trim();
    }
    var titleString = `### ${title}\n`;
    var typeString = `##### Type\n\`${this.type}\`\n`;
    var initialValueString = `##### Initial Value\n\`${this.initialValue}\`\n`;
    var descriptionString = `##### description\n${this.description?.trim()}\n`;
    var customDescriptionString = `##### community description\n ${this.customDescription?.trim()}\n`;
    returnString += titleString;

    if (this.type != null && this.type.trim().length > 0) {
      returnString += typeString;
    }

    if (this.initialValue != null && this.initialValue.trim() != "n/a" && this.initialValue.trim().length > 0) {
      returnString += initialValueString;
    }

    if (this.description != null && this.description.trim().length > 0) {
      returnString += descriptionString;
    }

    if (this.customDescription != null && this.customDescription.trim().length > 0) {
      returnString += customDescriptionString;
    }

    return returnString;
  }
}

class FunctionDoc extends DocElement {
  name: string;
  fieldName: string;
  description: string;
  customDescription: string;
  isStatic: boolean
  parentClass: string
  constructor(parent: string, isStatic: boolean) {
    super();
    this.name = "";
    this.fieldName = "";
    this.description = "";
    this.customDescription = "";
    this.isStatic = isStatic;
    this.parentClass = parent;
  }

  applyOverrides() {
    try {
      let parsed = JSON.parse(fsSync.readFileSync(`./docs/overrides/${this.parentClass}.json`).toString());
      let altDescription = this.isStatic ? (parsed?.staticFunctions?.[this.fieldName]) : (parsed?.instanceFunctions?.[this.fieldName]);
      if (altDescription != null) {
        this.customDescription = altDescription;
      }
    } catch (error) { 
    }
  }

  toJson(): any {
    return {
      name: this.name,
      fieldName: this.fieldName,
      description: this.description,
      customDescription: this.customDescription,
    }
  }

  toMarkdown(): string {
    var returnString = "";
    let title = this.isStatic ? `${this.parentClass}.${this.name}` : this.name;
    if (title != null) {
      title = title.trim();
    }
    var titleString = `### ${title}\n`;
    var descriptionString = `##### description\n${this.description?.trim()}\n`;
    var customDescriptionString = `##### community description\n${this.customDescription?.trim()}\n`;
    returnString += titleString;
    if (this.description != null && this.description.trim().length > 0) {
      returnString += descriptionString;
    }

    if (this.customDescription != null && this.customDescription.trim().length > 0) {
      returnString += customDescriptionString;
    }

    return returnString;
  }
}

class ClassDoc extends DocElement {
  name: string;
  instanceVariables: VariableDoc[];
  staticVariables: VariableDoc[];
  instanceFunctions: FunctionDoc[];
  staticFunctions: FunctionDoc[];
  constructor() {
    super();
    this.name = "";
    this.instanceVariables = [];
    this.instanceFunctions = [];
    this.staticFunctions = [];
    this.staticVariables = [];
  }
  toJson() {
    return {
      name: this.name,
      instanceVariables: (this.instanceVariables.length > 0) ? this.instanceVariables.map((docVal) => docVal.toJson()) : null,
      staticVariables: (this.staticVariables.length > 0) ? this.staticVariables.map((docVal) => docVal.toJson()) : null,
      instanceMethods: (this.instanceFunctions.length > 0) ? this.instanceFunctions.map((docVal) => docVal.toJson()) : null,
      staticMethods: (this.staticFunctions.length > 0) ? this.staticFunctions.map((docVal) => docVal.toJson()) : null
    }
  }
  toMarkdown(): string {
    var returnString = "";
    returnString += `---\ntitle: ${this.name}\nlayout: doc\n---\n\n\n`;
    if (this.staticVariables != null && this.staticVariables.length > 0) {
      returnString += `## Static Variables\n`;
      this.staticVariables.forEach((val: VariableDoc, _index: number, _arr: VariableDoc[]) => { returnString += val.toMarkdown() });
    }
    if (this.staticFunctions != null && this.staticFunctions.length > 0) {
      returnString += `## Static Functions\n`;
      this.staticFunctions.forEach((val: FunctionDoc, _index: number, _arr: FunctionDoc[]) => { returnString += val.toMarkdown() });
    }
    if (this.instanceVariables != null && this.instanceVariables.length > 0) {
      returnString += `## Instance Variables\n`;
      this.instanceVariables.forEach((val: VariableDoc, _index: number, _arr: VariableDoc[]) => { returnString += val.toMarkdown() });
    }
    if (this.instanceFunctions != null && this.instanceFunctions.length > 0) {
      returnString += `## Instance Functions\n`;
      this.instanceFunctions.forEach((val: FunctionDoc, _index: number, _arr: FunctionDoc[]) => { returnString += val.toMarkdown() });
    }
    return returnString;

  }
}


async function main() {
  const isFile = (fileName) => {
    if (fileName != "Readme.md") {
      return fsSync.lstatSync(fileName).isFile();
    } else {
      return false;
    }
  };

  let pageObjects: ClassDoc[] = [];

  const folderPath = "./fraymakers-api-docs/docs/classes";
  const outPath = "./docs/classes";
  await fs.mkdir(outPath, { recursive: true });
  let files = fsSync
    .readdirSync(folderPath)
    .map((fileName) => {
      return path.join(folderPath, fileName);
    })
    .filter(isFile);
  for (let h = 0; h < files.length; h++) {
    let data = fsSync.readFileSync(files[h]).toString();
    data = data.replaceAll("<", "\\&lt;").replaceAll(">", "\\&gt;");
    const tree = unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkGfm)
      .use(rehypeStringify)
      .parse(data);

    var newChildren = [];
    var currentClassDoc: ClassDoc = new ClassDoc();
    var frontMatterData: { title: string, layout: string } = { title: "", layout: "" };
    if (tree.children.length > 0 && tree.children[0]?.type == "yaml") {
      frontMatterData = parse(tree.children[0].value);
      currentClassDoc.name = frontMatterData.title;
    }

    var currentHeader: string = "";
    for (let i = 0; i < tree.children.length; i++) {
      var table = tree.children[i];
      if (table.type == "table") {
        processTable(table, currentClassDoc, currentHeader);
      }

      if (table.type = "heading") {
        let headerString = tree?.children[i]?.children?.[0]?.value;
        currentHeader = headerString;
      }
    }
    var mdcurrentClassDoc
    fs.writeFile(path.join(outPath, `${currentClassDoc.name}.md`), currentClassDoc.toMarkdown());
  }
  fs.writeFile(path.join(outPath, `index.md`), fsSync.readFileSync(path.join(folderPath,"Readme.md")).toString().replace("layout: page", "layout: doc").replace("Docs", "Class Index"));
}

function processTable(table: Table, classDoc: ClassDoc, headerName: String) {
  let rows = table.children;
  let sections = [];
  let newRows = [];
  if (headerName === "Instance Variables" || headerName === "Static Variables") {
    for (let i = 1; i < rows.length; i++) {
      let currRow = rows[i];
      let isStatic: boolean = headerName === "Static Variables";
      var variableField: VariableDoc = new VariableDoc(classDoc.name, isStatic);
      variableField.name = currRow.children[0].children[0].value;
      variableField.type = currRow.children[1].children[0].value;
      variableField.initialValue = currRow.children[2].children[0].value;
      variableField.description = currRow.children[3].children[0]?.value;
      if (variableField.description != null) {
        variableField.description = currRow.children[3].children.map((item) => {
          return item.value != null ? item.value.replaceAll("&lt;br&gt;", "\n").replaceAll("\- \n","").replaceAll("\-\n","").replaceAll("\n-", "") : null;
        }).join("\n").replaceAll("\n\n","\n");
      }
      variableField.applyOverrides();
      if (isStatic) {
        classDoc.staticVariables.push(variableField);
      } else {
        classDoc.instanceVariables.push(variableField);
      }
    }
  } else if (headerName === "Instance Functions" || headerName === "Static Functions") {
    for (let i = 1; i < rows.length; i++) {
      let currRow = rows[i];

      let isStatic: boolean = headerName === "Static Functions";
      var functionField: FunctionDoc = new FunctionDoc(classDoc.name, isStatic);
      functionField.name = currRow.children[0].children[0].value;
      if (functionField.name != null && functionField.name.length > 0) {
        functionField.fieldName = functionField.name.split('(')[0];
      }
      functionField.description = currRow.children[1].children[0]?.value;
      if (functionField.description != null) {
        functionField.description = currRow.children[1].children.map((item) => {

          return item.value != null ? item.value.replaceAll("&lt;br&gt;", "\n").replaceAll("\- \n","").replaceAll("\-\n","").replaceAll("\n-", "") : null;
        }
      ).join("\n").replaceAll("\n\n","\n");
      }
      
      functionField.applyOverrides();
      if (isStatic) {
        classDoc.staticFunctions.push(functionField);
      } else {
        classDoc.instanceFunctions.push(functionField);
      }
    }
  }
}

await main();





