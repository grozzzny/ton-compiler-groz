# The TON func smart-contract compiler

```
npm i ton-compiler-groz
```

### Required
```
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

### Install Fift and FunC
- https://ton.org/docs/#/compile

### Example compile

```js
const compiler = new TonCompiler({
  smartcontLibs: ['<ton directory>/crypto/smartcont/stdlib.fc'],
  fiftLib: '<ton directory>/crypto/fift/lib',
  fift: '/usr/bin/fift',
  func: '/usr/bin/func',
  tmpDir: '/tmp'
})
await compiler.getCell('..code func')
// or
await compiler.compileCell(['contract.fc'], './contract.cell')
```

## Documentation
- https://www.tonspace.co/
- https://ton.org/docs/#/

## Tests
- https://github.com/grozzzny/ton-contract-test