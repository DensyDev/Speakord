import { DeterminedEmotion, DeterminedTemperament, SpeekerDetermineEmotionConfig, SpeekerDeterminer, SpeekerDetermineTemperamentConfig } from "..";

export class EmptySpeekerDeterminer implements SpeekerDeterminer {
    
    async determineTemperament(config: SpeekerDetermineTemperamentConfig): Promise<DeterminedTemperament> {
        return {
            temperament: {
                pitchBias: 0,
                rateBias: 0,
                energyBias: 0
            },
            voice: config.voices[Math.floor(Math.random() * config.voices.length)]
        }  
    }

    async determineEmotion(_: SpeekerDetermineEmotionConfig): Promise<DeterminedEmotion> {
        return {
            emotion: {
                valence: 0,
                arousal: 0,
                volume: 0
            }
        } 
    }
}