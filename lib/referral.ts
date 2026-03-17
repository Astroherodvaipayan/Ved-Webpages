/**
 * Referral code generation and parsing utilities
 * Uses cryptographically secure random values for unique codes
 */

const REFERRAL_CODE_LENGTH = 12;
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a unique, cryptographically secure referral code
 * @returns A 12-character alphanumeric referral code
 */
export function generateReferralCode(): string {
    const array = new Uint8Array(REFERRAL_CODE_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => CHARS[byte % CHARS.length]).join('');
}

/**
 * Build a full referral link from a referral code
 * @param referralCode - The unique referral code
 * @param baseUrl - The base URL of the application
 * @returns Full referral link
 */
export function buildReferralLink(referralCode: string, baseUrl: string): string {
    return `${baseUrl}/waitlist?ref=${referralCode}`;
}

/**
 * Parse referral code from a URL
 * @param urlString - The URL to parse
 * @returns The referral code if found, null otherwise
 */
export function parseReferralCode(urlString: string): string | null {
    try {
        const url = new URL(urlString);
        return url.searchParams.get('ref');
    } catch {
        return null;
    }
}

/**
 * Validate referral code format (alphanumeric, correct length)
 * @param code - The code to validate
 * @returns True if valid format
 */
export function isValidReferralCodeFormat(code: string | null): boolean {
    if (!code) return false;
    if (code.length !== REFERRAL_CODE_LENGTH) return false;
    const validChars = new RegExp(`^[${CHARS}]+$`);
    return validChars.test(code);
}
