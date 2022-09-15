# TON Contract test

Sources:
 - https://github.com/the-ton-tech/ton-compiler
 - https://github.com/Naltox/ton-contract-executor/blob/8b352d0cf96553e9ded19a102a890e17c973d017/src/smartContract/SmartContract.spec.ts

```
npm run build --prefix node_modules/ton-compiler
npm test
```

###Example test code
```
describe("SmartContract", () => {
  it("should run basic contract", async () => {
    const source = `
        () main() {
            ;; noop
        }
        int test() method_id {
            ~dump(12345);
            return 777;
        }
    `
    
    // Linux
    const contract = await SmartContract.fromCell(await buildCodeCell(source), new Cell(), {debug: true, getMethodsMutate: true})

    // Mac
    //const contract = await SmartContract.fromFuncSource(source, new Cell(), {debug: true, getMethodsMutate: true})

    let res = await contract.invokeGetMethod('test', [])
    expect(res.result[0]).to.be.bignumber.equal(new BN(777))
  })
})
```

###Example compile function by the-ton-tech
```
async function buildCodeCell(source: string) {
  const pathToStdlib = 'node_modules/ton-compiler/test/contracts/stdlib.fc'

  const result = await compiler.funcCompile({
    optLevel: 2,
    sources: {
      "stdlib.fc": fs.readFileSync(pathToStdlib, { encoding: 'utf-8' }),
      "yourContract": source
    }
  })

  if (result.status === 'error') throw new Error(result.message)

  return Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0]
}
```

###Example compile function by grozzzny

```
git clone https://github.com/newton-blockchain/ton.git
```

```js
const compiler = new TonCompiler({
  smartcontLibs: ['<ton>/crypto/smartcont/stdlib.fc'],
  fiftLib: '<ton>/crypto/fift/lib'
})
await compiler.getCell('..code func')
await compiler.compileCell(['contract.fc'], 'contract')
```

##Lessons
- https://society.ton.org/ton-hello-world-step-by-step-guide-for-writing-your-first-smart-contract-in-func
- https://github.com/romanovichim/TonFunClessons_ru
- https://github.com/romanovichim/TonFunClessons_Eng

##Documentation
- https://www.tonspace.co/
- https://ton.org/docs/#/