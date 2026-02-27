/**
 * Truncates the input string if it exceeds the specified maximum length.
 * 
 * @param text input string to truncate
 * @param maxLength maximum allowed length of the string 
 * @returns truncated string or the original string if not truncated
 */
export function truncateString(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    } else {
        return text;
    }
}