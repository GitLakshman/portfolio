const crypto = require("crypto");
const fs = require("fs");

const decryptFile = (inputFile, outputFile, password) => {
  const key = crypto.createHash("sha256").update(password).digest();

  const input = fs.readFileSync(inputFile);
  const iv = input.slice(0, 16);
  const data = input.slice(16);

  const cipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const output = Buffer.concat([cipher.update(data), cipher.final()]);
  fs.writeFileSync(outputFile, output);
};

decryptFile("public/models/character.enc", "public/models/decrypted_character.glb", "MyCharacter12");
