import { Speeker } from "./";

export interface SpeechSynthesizer {
    synthesize(text: string, speeker: Speeker): Promise<Buffer>
}