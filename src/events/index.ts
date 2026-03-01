import { findTSFiles } from '../util';
import { bot } from '..';

type Event = {
    name: string;
    once?: boolean;
    listener: (...args: any) => void;
};

export async function setupEvents() {
    const eventFiles = findTSFiles(__dirname, (entry, fullPath) => entry.isFile() &&
            fullPath.endsWith(".ts") &&
            fullPath !== __filename);

    for (const filePath of eventFiles) {
        const event = require(filePath) as Event;

        if (!event.name || !event.listener) continue;

        if (event.once) {
            bot.once(event.name, (...args) => event.listener(...args));
        } else {
            bot.on(event.name, (...args) => event.listener(...args));
        }
    }
}