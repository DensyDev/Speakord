import { Locale, LocalizationMap } from 'discord.js';
import { t } from '.';

/**
 * Creates a LocalizationMap for a specific key, 
 * going through all available Discord locales
 */
export function createLocalizationMap(
    key: string,
    variables?: Record<string, any>
): LocalizationMap {
    const map: LocalizationMap = {};

    for (const locale of Object.values(Locale)) {
        const translation = t(key, locale, variables);

        if (translation) {
            map[locale] = translation;
        }
    }

    return map;
}