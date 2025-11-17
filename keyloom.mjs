import { Wallet } from "ethers";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/**
 * Very small arg parser:
 *  --count  or -c    → how many wallets
 *  --out    or -o    → output file (JSON)
 *  --no-mnemonic     → don't include mnemonics in output
 *  --pretty          → pretty-print JSON
 */
function parseArgs(argv) {
  const args = {
    count: 1,
    out: null,
    includeMnemonic: true,
    pretty: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--count" || arg === "-c") {
      const value = argv[i + 1];
      if (!value || isNaN(Number(value))) {
        console.error("Error: --count needs a number, e.g. --count 5");
        process.exit(1);
      }
      args.count = Math.max(1, Number(value));
      i++;
    } else if (arg === "--out" || arg === "-o") {
      const value = argv[i + 1];
      if (!value) {
        console.error("Error: --out needs a file path, e.g. --out wallets.json");
        process.exit(1);
      }
      args.out = value;
      i++;
    } else if (arg === "--no-mnemonic") {
      args.includeMnemonic = false;
    } else if (arg === "--pretty") {
      args.pretty = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Usage:
  node wallet-gen.mjs [options]

Options:
  -c, --count <n>      Number of wallets to generate (default: 1)
  -o, --out <file>     Save wallets to a JSON file
      --no-mnemonic    Do not include mnemonics in the output
      --pretty         Pretty-print JSON when using --out
  -h, --help           Show this help

Examples:
  node wallet-gen.mjs
  node wallet-gen.mjs --count 3
  node wallet-gen.mjs -c 3 --out wallets.json --pretty
`);
}

async function main() {
  const { count, out, includeMnemonic, pretty } = parseArgs(process.argv.slice(2));

  console.log("⚠️  WARNING: These private keys give full control over the wallets.");
  console.log("   Never commit them to git or share them with anyone.\n");

  const wallets = [];

  for (let i = 0; i < count; i++) {
    const wallet = Wallet.createRandom();

    const data = {
      index: i,
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    };

    if (includeMnemonic && wallet.mnemonic) {
      data.mnemonic = wallet.mnemonic.phrase;
    }

    wallets.push(data);

    // Always print a quick summary to the console
    console.log(`=== Wallet ${i + 1} ===`);
    console.log("Address:     ", data.address);
    console.log("Public Key:  ", data.publicKey);
    console.log("Private Key: ", data.privateKey);
    if (includeMnemonic && data.mnemonic) {
      console.log("Mnemonic:    ", data.mnemonic);
    }
    console.log();
  }

  if (out) {
    const json = JSON.stringify(wallets, null, pretty ? 2 : 0);
    const outfile = path.resolve(process.cwd(), out);
    await writeFile(outfile, json, { encoding: "utf8", flag: "w" });

    console.log(`💾 Saved ${wallets.length} wallet(s) to: ${outfile}`);
    console.log("👉 Consider adding this file to .gitignore so it never gets committed.");
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});