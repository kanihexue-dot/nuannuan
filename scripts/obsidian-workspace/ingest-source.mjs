import { parseCliArgs, requiredArg } from "./cli-args.mjs";
import { getVaultRoot } from "./config.mjs";
import { ingestMarkdownSource, ingestYouTubeSource } from "./vault.mjs";

const args = parseCliArgs(process.argv.slice(2));
const kind = args.get("--kind");
const vaultRoot = getVaultRoot(args.get("--vault-root"));

if (kind === "md") {
  const inputPath = requiredArg(args, "--input", "Missing --input for markdown ingestion");

  const result = await ingestMarkdownSource({ vaultRoot, inputPath });
  console.log(`Markdown ingested: ${result.sourceNotePath}`);
  process.exit(0);
}

if (kind === "youtube") {
  const url = requiredArg(args, "--url", "Missing --url for YouTube ingestion");
  const title = requiredArg(args, "--title", "Missing --title for YouTube ingestion");

  const result = await ingestYouTubeSource({ vaultRoot, url, title });
  console.log(`YouTube ingested: ${result.sourceNotePath}`);
  process.exit(0);
}

throw new Error("Unsupported --kind. Use md or youtube.");
