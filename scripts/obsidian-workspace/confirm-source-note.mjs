import { parseCliArgs, requiredArg } from "./cli-args.mjs";
import { getVaultRoot } from "./config.mjs";
import { confirmSourceNote } from "./vault.mjs";

const args = parseCliArgs(process.argv.slice(2));
const sourceNotePath = requiredArg(args, "--source-note");
const vaultRoot = getVaultRoot(args.get("--vault-root"));
const result = await confirmSourceNote({ vaultRoot, sourceNotePath });

console.log(`Confirmed themes: ${result.approvedThemes.join(", ") || "none"}`);
console.log(
  `Confirmed cards: ${
    result.approvedCards.map((entry) => entry.split("｜")[0]).join(", ") || "none"
  }`,
);
