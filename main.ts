// Writes one funny developer excuse for production breaking to entry.txt.
//
// Standard library only. Reads nothing but this file and writes only the
// output directory given by MAKEFUN_OUTPUT_DIR (default /output).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The tests passed, the review passed, the deploy passed. Production is the only one that failed the vibe check.";

function fail(message: string): never {
  console.error("error: " + message);
  process.exit(1);
}

const length = LINE.length;
if (length < 1 || length > 200) {
  fail("line is " + length + " characters, must be 1 to 200");
}
if (LINE.trim().length === 0) {
  fail("line is only whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
try {
  mkdirSync(outDir, { recursive: true });
} catch (error) {
  fail("cannot create output dir: " + String(error));
}
const dest = join(outDir, "entry.txt");
try {
  writeFileSync(dest, LINE, "utf8");
} catch (error) {
  fail("cannot write " + dest + ": " + String(error));
}
let written: string;
try {
  written = readFileSync(dest, "utf8");
} catch (error) {
  fail("cannot read back " + dest + ": " + String(error));
}
if (written !== LINE) {
  fail("read-back mismatch: file differs from the line");
}
console.log("wrote entry.txt (" + length + " characters): " + LINE);
