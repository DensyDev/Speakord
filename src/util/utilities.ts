import fs from "fs";
import path from "path";

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

export function findTSFiles(dir: string, filter: (entry: fs.Dirent, fullPath: string) => boolean): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return findTSFiles(fullPath, filter);
        }

        if (filter(entry, fullPath)) {
            return [fullPath];
        }

        return [];
    });
}