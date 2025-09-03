/**
 * Validates if a string is a valid Vietnamese phone number
 * Supports formats:
 * - Mobile: 09x, 08x, 07x, 05x, 03x (10 digits)
 * - Landline: 02x followed by 8 digits (10 digits total)
 * - With country code: +84 or 84 followed by mobile/landline number (without leading 0)
 * - With or without spaces, dots, dashes
 *
 * @param phoneNumber - The phone number string to validate
 * @returns boolean - true if valid Vietnamese phone number, false otherwise
 */
export declare const validateVietnamesePhoneNumber: (phoneNumber: string) => boolean;
/**
 * Formats a Vietnamese phone number to a standard format (84xxxxxxxxx)
 * For invalid phone numbers, returns the original string but cleaned
 * @param phoneNumber - The phone number to format
 * @returns string - Formatted phone number as 84xxxxxxxxx format
 */
export declare const formatVietnamesePhoneNumber: (phoneNumber: string) => string;
//# sourceMappingURL=utils.d.ts.map