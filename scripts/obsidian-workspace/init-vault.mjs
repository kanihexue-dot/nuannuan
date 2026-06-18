import { parseCliArgs } from "./cli-args.mjs";
import { getVaultRoot } from "./config.mjs";
import { initializeVault } from "./vault.mjs";

const args = parseCliArgs(process.argv.slice(2));
const vaultRootOverride = args.get("--vault-root") || args.positional[0];
const vaultRoot = getVaultRoot(vaultRootOverride);
const result = await initializeVault(vaultRoot);

console.log(`Initialized vault at ${result.vaultRoot}`);
console.log(`Directories ensured: ${result.createdDirectories.length}`);
console.log(`System files created: ${result.createdFiles.length}`);
