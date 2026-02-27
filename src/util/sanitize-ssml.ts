export function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&"']/g, (match) => {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case "'": return '&apos;';
            default: return match;
        }
    });
}

export function sanitizeSSML(text: string): string {
    let clean = text.replace(/[\r\n\t]+/g, ' ');
    clean = clean.replace(/[\x00-\x1F\x7F]/g, '');
    clean = escapeXml(clean);
    return clean.trim();
}