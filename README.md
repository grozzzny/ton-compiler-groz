# The TON func smart-contract compiler

```
npm -i ton-compiler-groz
```

### Required
```
git clone https://github.com/newton-blockchain/ton.git
```

### Example compile

```js
const compiler = new TonCompiler({
  smartcontLibs: ['<ton directory>/crypto/smartcont/stdlib.fc'],
  fiftLib: '<ton directory>/crypto/fift/lib'
})
await compiler.getCell('..code func')
// or
await compiler.compileCell(['contract.fc'], 'contract')
```

## TON official repository
- https://github.com/newton-blockchain/ton.git

## Documentation
- https://www.tonspace.co/
- https://ton.org/docs/#/

## Tests
- https://github.com/grozzzny/ton-contract-test