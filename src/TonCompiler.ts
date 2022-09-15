import * as fs from "fs"
import {Cell} from "ton/dist"

const util = require('util')
const exec = util.promisify(require('child_process').exec)

type ParamsTonCompiler = {
  tmpDir?: string
  fift?: string
  func?: string
  fiftLib: string
  smartcontLibs: string[]
}

export default class TonCompiler {
  tmpDir: string
  fift: string
  func: string
  fiftLib: string
  smartcontLibs: string[]

  constructor(params: ParamsTonCompiler) {
    this.tmpDir = params.tmpDir || '/tmp'
    this.fift = params.fift || '/usr/bin/fift'
    this.func = params.func || '/usr/bin/func'
    this.fiftLib = params.fiftLib
    this.smartcontLibs = params.smartcontLibs
  }

  async getCell(source: string) {
    const name = `_runtime`
    fs.writeFileSync(`${this.tmpDir}/${name}.fc`, source)
    await this.compileCell([`${this.tmpDir}/${name}.fc`], name, this.tmpDir)
    const data = fs.readFileSync(`${this.tmpDir}/${name}.cell`)
    await exec(`rm -f ${this.tmpDir}/${name}.cell ${this.tmpDir}/${name}.fc`)
    return Cell.fromBoc(data)[0]
  }

  async compileCell(contracts: string[], name: string, otputDir: string = '.') {
    await exec(`cat ${[this.smartcontLibs, ...contracts].join(' ')} > ${this.tmpDir}/${name}.merged.fc`) // Add lib stdlib
    await exec(`${this.func} -APS -o ${this.tmpDir}/${name}.fif ${this.tmpDir}/${name}.merged.fc`) // Compile fif file
    await exec(`echo "boc>B \\"${otputDir}/${name}.cell\\" B>file" >> ${this.tmpDir}/${name}.fif`)
    await exec(`${this.fift} -I ${this.fiftLib} ${this.tmpDir}/${name}.fif`) // Run and compile cell file
    await exec(`rm -f ${this.tmpDir}/${name}.fif ${this.tmpDir}/${name}.merged.fc`) // Delete files fif and .merged.fc
  }
}