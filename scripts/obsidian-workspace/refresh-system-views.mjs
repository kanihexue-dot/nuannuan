import { parseCliArgs } from "./cli-args.mjs";
import { getVaultRoot } from "./config.mjs";
import { refreshSystemViews } from "./vault.mjs";

const args = parseCliArgs(process.argv.slice(2));
const vaultRoot = getVaultRoot(args.get("--vault-root"));
const result = await refreshSystemViews(vaultRoot);

console.log(`Refreshed system views in: ${vaultRoot}`);
console.log(`Themes: ${result.themeCount}`);
console.log(`Cards: ${result.cardCount}`);
console.log(`Sources: ${result.sourceCount}`);
