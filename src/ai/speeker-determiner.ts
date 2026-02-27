import { Temperament, Emotion, Gender, Voice } from ".";

export interface SpeekerDetermineTemperamentConfig {
    messages: string[];
    voices: Voice[];
    overrideGender?: Gender;
    overridePrompt?: string;
}

export interface SpeekerDetermineEmotionConfig {
    messages: string[];
    overridePrompt?: string;
}

export interface DeterminedTemperament {
    temperament: Temperament;
    voice: Voice;
}

export interface DeterminedEmotion {
    emotion: Emotion;
}

export interface SpeekerDeterminer {

    determineTemperament(config: SpeekerDetermineTemperamentConfig): Promise<DeterminedTemperament>

    determineEmotion(config: SpeekerDetermineEmotionConfig): Promise<DeterminedEmotion>
}