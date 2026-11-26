// Real-Life Patch Notes: The Comedy Changelog — make.fun entry
// Writes exactly one line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// Node 22+, standard library only. No network, no randomness, no secrets.
//
// The entry is a one-line fake patch note for a bug in human biology:
// the doorway effect — walking through a doorway wipes the reason you
// entered the room. Specific, instantly recognisable, and fixed in the
// terse register of a real release note.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "v5.2.0: fixed a bug where walking through a doorway deleted the reason you entered the room; memory now persists across doorways.";

// The entry must also read like a real release note: it opens with a
// version number (vX.Y.Z) and states the fix in past tense, as if it
// shipped. A helper checks that shape so a future edit cannot silently
// drift out of the patch-note register.
function validatePatchNoteShape(text: string): void {
  if (!/^v\d+\.\d+\.\d+: /.test(text)) {
    throw new Error("entry must open with a version number like v5.2.0: ");
  }
  if (!/fixed a bug where/i.test(text)) {
    throw new Error("entry must state the fix as a shipped bug fix");
  }
}

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry must not be empty");
  }
  // Gate: /output/entry.txt must be UTF-8 text of 1 to 160 characters,
  // not only white space.
  const chars = [...text];
  if (chars.length < 1 || chars.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  validatePatchNoteShape(text);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
validate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Read the file back and re-check it: the program only exits cleanly
// when what is on disk is exactly the validated entry, byte for byte.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt on disk does not match the validated entry");
}
validate(written);
