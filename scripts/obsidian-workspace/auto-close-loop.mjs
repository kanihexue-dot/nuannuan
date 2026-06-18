import { numberArg, parseCliArgs, requiredArg } from "./cli-args.mjs";
import { getVaultRoot } from "./config.mjs";
import { autoCloseMarkdownLoop } from "./vault.mjs";

const args = parseCliArgs(process.argv.slice(2));
const inputPath = requiredArg(args, "--input");
const vaultRoot = getVaultRoot(args.get("--vault-root"));
const themeLimit = numberArg(args, "--theme-limit", 2);
const cardLimit = numberArg(args, "--card-limit", 2);

const result = await autoCloseMarkdownLoop({
  vaultRoot,
  inputPath,
  themeLimit,
  cardLimit,
});

console.log(`Auto-closed source: ${result.sourceNotePath}`);
console.log(`Approved themes: ${result.approvedThemes.join(", ") || "none"}`);
console.log(
  `Approved cards: ${
    result.approvedCards.map((entry) => entry.split("｜")[0]).join(", ") || "none"
  }`,
);
