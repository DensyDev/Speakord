import { Voice } from ".";

export interface VoiceResolver {
    resolve(locale: string): Promise<Voice[]>;
}