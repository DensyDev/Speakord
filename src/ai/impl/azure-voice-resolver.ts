import { Gender, Voice, VoiceResolver } from "..";
import { SpeechConfig, SpeechSynthesizer, SynthesisVoiceGender } from "microsoft-cognitiveservices-speech-sdk";

export class AzureVoiceResolver implements VoiceResolver {

    private config: SpeechConfig;
    private synthesizer: SpeechSynthesizer;

    constructor(key: string, region: string) {
        this.config = SpeechConfig.fromSubscription(key, region);
        this.synthesizer = new SpeechSynthesizer(this.config);
    }

    async resolve(locale: string): Promise<Voice[]> {
        const voices: Voice[] = [];

        const result = await this.synthesizer.getVoicesAsync();

        for (const voice of result.voices) {
            if (voice.locale.startsWith(locale)) {
                voices.push({
                    name: voice.shortName,
                    locale: locale,
                    gender: this.mapGender(voice.gender)
                })
            }
        }

        return voices;
    }

    private mapGender(gender: SynthesisVoiceGender): Gender {
        if (gender === SynthesisVoiceGender.Male) return 'male';
        if (gender === SynthesisVoiceGender.Female) return 'female';
        if (gender === SynthesisVoiceGender.Neutral) return 'neutral';
        return 'unknown';
    }
}