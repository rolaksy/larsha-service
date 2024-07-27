const crypto = require('crypto');

// Secret key for encryption and decryption
const secret = 'my_secret_key_12345';

// Create a 32-byte key from the secret
const key = crypto.createHash('sha256').update(secret).digest();

// Encrypt function
exports.encrypt = (text) => {
    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    const s = iv.toString('hex') + '$$' + encrypted.toString('hex');
    return s;
}

// Decrypt function
exports.decrypt = (text) => {
    const algorithm = 'aes-256-ctr';
    const textParts = text.split('$$');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join('$$'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
}
