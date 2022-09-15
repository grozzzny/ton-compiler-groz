import * as fs from 'fs';
import { Cell } from 'ton/dist';

const path = require("path");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

type ParamsTonCompiler = {
  tmpDir?: string;
  fift?: string;
  func?: string;
  fiftLib: string;
  smartcontLibs: string[];
};

export default class TonCompiler {
  tmpDir: string;
  fift: string;
  func: string;
  fiftLib: string;
  smartcontLibs: string[];

  constructor(params: ParamsTonCompiler) {
    this.tmpDir = params.tmpDir || '/tmp';
    this.fift = params.fift || '/usr/bin/fift';
    this.func = params.func || '/usr/bin/func';
    this.fiftLib = params.fiftLib;
    this.smartcontLibs = params.smartcontLibs;
  }

  async getCell(source: string) {
    const name = `_runtime`;
    const outputFile = `${this.tmpDir}/${name}.cell`;
    fs.writeFileSync(`${this.tmpDir}/${name}.fc`, source);
    await this.compileCell([`${this.tmpDir}/${name}.fc`], outputFile);
    const data = fs.readFileSync(outputFile);
    await exec(`rm -f ${outputFile} ${this.tmpDir}/${name}.fc`);
    return Cell.fromBoc(data)[0];
  }

  async compileCell(contracts: string[], outputFile: string = './contract.cell') {
    const name = path.parse(outputFile).name;
    // Add lib stdlib
    await exec(`cat ${[this.smartcontLibs, ...contracts].join(' ')} > ${this.tmpDir}/${name}.merged.fc`);
    // Compile fif file
    await exec(`${this.func} -APS -o ${this.tmpDir}/${name}.fif ${this.tmpDir}/${name}.merged.fc`);
    await exec(`echo "boc>B \\"${outputFile}\\" B>file" >> ${this.tmpDir}/${name}.fif`);
    // Run and compile cell file
    await exec(`${this.fift} -I ${this.fiftLib} ${this.tmpDir}/${name}.fif`);
    // Delete files fif and .merged.fc
    await exec(`rm -f ${this.tmpDir}/${name}.fif ${this.tmpDir}/${name}.merged.fc`);
  }
}
