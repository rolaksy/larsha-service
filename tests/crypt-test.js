const { encrypt, decrypt } = require('../lib/crypt');

const text = 'P@ssw0rd1';
const e = encrypt(text);
console.log(e);
console.log(decrypt(e))