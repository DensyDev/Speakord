import fs from 'fs';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

export * from "./util"

/**
 * Setup i18n.
 */
export async function setupI18n() {
    const localesDir = path.join(__dirname, './locales');
    const availableLangs = fs.readdirSync(localesDir)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));

    await i18next.use(Backend).init({
        fallbackLng: 'en',
        preload: availableLangs,
        backend: {
            loadPath: path.join(__dirname, './locales/{{lng}}.json'),
        },
        initImmediate: false,
        interpolation: {
            escapeValue: false
        }
    });
}

/**
 * Localizes the message.
 * 
 * @param key localization key 
 * @param lang locale
 * @param variables localization variables
 * @returns localized message
 */
export const t = (key: string, lang: string, variables: object = {}) => {
    return i18n.t(key, { 
        lng: lang,
        ...variables 
    });
};

/**
 * The i18n instance.
 */
export const i18n = i18next;