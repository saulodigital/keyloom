# Keyloom — EVM Wallet Generator

Keyloom is a tiny Node.js CLI that weaves fresh EVM-compatible wallets, printing addresses, public keys, and private keys for your Ethereum apps and scripts.

Ethers v6 is published as ESM-first, the modern, browser-style modules. Since Node treats .mjs files as ES modules automatically, even if your package.json is totally default, we just rename the script to .mjs extension to abstract it.

## Help

```node keyloom.mjs -h```

Use `-h` or `-help`.

## Generate

```node keyloom.mjs```

## Generate multiple wallets

```node keyloom.mjs -count 3```

Use `-c` or `-count`.

## Save wallets to a JSON file

```node keyloom.mjs -c 3 --out wallets.json --pretty```

Use `-o` or `-out`.

## Hide mnemonics (only keep address / keys)

```node keyloom.mjs -c 3 --out wallets.json --no-mnemonic```

## Output examples

Printed example:

```
=== Wallet 1 ===
Address:      0xAbC123...
Public Key:   0x04f9...
Private Key:  0x7f3c...
Mnemonic:     skate fossil ...
```

JSON file example:

```json
[
  {
    "index": 0,
    "address": "0xAbC123...",
    "publicKey": "0x04f9...",
    "privateKey": "0x7f3c...",
    "mnemonic": "skate fossil ..."
  }
]
```
