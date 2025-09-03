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
export const validateVietnamesePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return false
  }

  // Remove all spaces, dots, dashes, and parentheses
  const cleanNumber = phoneNumber.replace(/[\s.\-()]/g, "")

  // Vietnamese phone number patterns
  const patterns = [
    // Mobile numbers starting with 0 (domestic format): 09x, 08x, 07x, 05x, 03x
    /^0(9[0-9]|8[0-9]|7[0-9]|5[0-9]|3[2-9])[0-9]{7}$/,

    // Landline numbers starting with 02 (domestic format): 02x followed by 8 digits
    /^02[0-9][0-9]{7}$/,

    // With +84 country code (international format) - mobile
    /^\+84(9[0-9]|8[0-9]|7[0-9]|5[0-9]|3[2-9])[0-9]{7}$/,

    // With +84 country code (international format) - landline
    /^\+842[0-9][0-9]{7}$/,

    // With 84 country code (without + sign) - mobile
    /^84(9[0-9]|8[0-9]|7[0-9]|5[0-9]|3[2-9])[0-9]{7}$/,

    // With 84 country code (without + sign) - landline
    /^842[0-9][0-9]{7}$/,
  ]

  return patterns.some((pattern) => pattern.test(cleanNumber))
}

/**
 * Formats a Vietnamese phone number to a standard format (84xxxxxxxxx)
 * For invalid phone numbers, returns the original string but cleaned
 * @param phoneNumber - The phone number to format
 * @returns string - Formatted phone number as 84xxxxxxxxx format
 */
export const formatVietnamesePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return phoneNumber
  }

  // Remove all spaces, dots, dashes, and parentheses
  const cleanNumber = phoneNumber.replace(/[\s.\-()]/g, "")

  // If it's a valid Vietnamese phone number, format it properly
  if (validateVietnamesePhoneNumber(phoneNumber)) {
    // If it starts with +84, format as 84xxxxxxxxx
    if (cleanNumber.startsWith("+84")) {
      return cleanNumber.substring(1)
    }

    // If it starts with 84, format as 84xxxxxxxxx
    if (cleanNumber.startsWith("84")) {
      return cleanNumber
    }

    // If it starts with 0, format as 84xxxxxxxxx (both mobile and landline)
    if (cleanNumber.startsWith("0")) {
      return `84${cleanNumber.substring(1)}`
    }
  }

  // For non-standard or invalid numbers, return cleaned version
  // This handles short numbers, special codes, etc.
  return cleanNumber
}
