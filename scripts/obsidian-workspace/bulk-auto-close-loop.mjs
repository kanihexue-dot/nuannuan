import { numberArg, parseCliArgs, requiredArg } from "./cli-args.mjs";
import { getVaultRoot } from "./config.mjs";
import { autoCloseMarkdownDirectory } from "./vault.mjs";

const args = parseCliArgs(process.argv.slice(2));
const inputDir = requiredArg(args, "--input-dir");
const vaultRoot = getVaultRoot(args.get("--vault-root"));
const themeLimit = numberArg(args, "--theme-limit", 2);
const cardLimit = numberArg(args, "--card-limit", 2);

const result = await autoCloseMarkdownDirectory({
  vaultRoot,
  inputDir,
  themeLimit,
  cardLimit,
});

console.log(`Bulk auto-closed files: ${result.processedFiles.length}`);
for (const item of result.processedFiles) {
  console.log(`- ${item.inputPath}`);
}

if (result.skippedFiles.length > 0) {
  console.log(`Skipped files: ${result.skippedFiles.length}`);
}
