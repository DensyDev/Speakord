import LanguageDetect from 'languagedetect';

const languageDetector = new LanguageDetect();
languageDetector.setLanguageType('iso2')

export function detectLanguage(sample: string): string {
    const detected = languageDetector.detect(sample, 1);
    if (!detected) {
        throw new Error("No language detected");
    }
    return detected[0][0] // return first detected language name
}