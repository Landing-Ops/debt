// obfuscate-form.js
const { execSync } = require("child_process");
const glob = require("glob");
const path = require("path");

const files = glob.sync("js/*-*-nude.js");

if (files.length === 0) {
  console.log("⚠️  처리할 *-nude.js 파일이 없습니다.");
  process.exit(0);
}

files.forEach((file) => {
  const outFile = file.replace("-nude.js", ".js");
  console.log(`➡️  난독화: ${file} → ${outFile}`);

  const isDynamicWindowFile = file.includes('uid-resolver') || file.includes('verdicts');

  const options = isDynamicWindowFile
    ? `--compact true`
    : `--compact true \
       --self-defending false \
       --string-array true --string-array-threshold 1 --string-array-encoding base64 \
       --control-flow-flattening false \
       --dead-code-injection false \
       --numbers-to-expressions false \
       --identifier-names-generator mangled`;

  execSync(
    `javascript-obfuscator ${file} --output ${outFile} ${options}`,
    { stdio: "inherit" }
  );
});

console.log("✅ 모든 *-nude.js 난독화 완료");

// --split-strings true \
// --split-strings-chunk-length 10
