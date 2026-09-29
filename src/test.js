import bcrypt from "bcryptjs";

const password = "test123";
const hash = await bcrypt.hash(password, 10);

console.log("Hash:", hash);

const isMatch = await bcrypt.compare(password, hash);
console.log("Matches:", isMatch);

const isWrongMatch = await bcrypt.compare("wrongpassword", hash);
console.log("Wrong password matches:", isWrongMatch);
