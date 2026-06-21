import crypto from "crypto";
import { SECRET_KEY } from "./key";

const ALGORITHM = 'aes-256-gcm';

// Фиксированный ключ ровно 32 байта


/**
 * Зашифровать строку
 */
export function encrypt(text: string): string {
  if (typeof text !== 'string') {
    throw new Error('Encrypt: text must be a string');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Расшифровать строку
 */
export function decrypt(hash: string | undefined): string {
  if (!hash || typeof hash !== 'string') {
    throw new Error('No encrypted data provided');
  }

  try {
    const parts = hash.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [ivHex, authTagHex, encryptedHex] = parts;

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err: any) {
    console.error('Decryption failed:', err.message);
    throw new Error('Invalid or corrupted token');
  }
}