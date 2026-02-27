import { 
    SpeechSynthesizer, 
    SpeekerDeterminer, 
    Voice, 
    VoiceResolver, 
    DeterminedTemperament, 
    Speeker
} from "../ai";
import { detectLanguage } from "../util";

export class SpeechService {
    private voicesCache = new Map<string, Voice[]>();
    private sessionCache = new Map<string, DeterminedTemperament>();

    constructor(
        private speekerDeterminer: SpeekerDeterminer,
        private speechSynthesizer: SpeechSynthesizer,
        private voiceResolver: VoiceResolver
    ) {}

    async speek(
        sessionId: string, 
        text: string, 
        history?: { temperament?: string[], emotion?: string[] }, 
        overrides?: { gender?: any, prompt?: string }
    ): Promise<Buffer> {
        const lang = detectLanguage(text);

        let voices = this.voicesCache.get(lang);
        if (!voices) {
            voices = await this.voiceResolver.resolve(lang);
            this.voicesCache.set(lang, voices);
        }

        let detTemp = this.sessionCache.get(sessionId);
        if (!detTemp) {
            detTemp = await this.speekerDeterminer.determineTemperament({
                messages: history?.temperament || [text],
                voices: voices,
                overrideGender: overrides?.gender,
                overridePrompt: overrides?.prompt
            });
            this.sessionCache.set(sessionId, detTemp);
        }

        const detEmotion = await this.speekerDeterminer.determineEmotion({
            messages: history?.emotion || [text],
            overridePrompt: overrides?.prompt
        });

        const speeker: Speeker = {
            temperament: detTemp.temperament,
            voice: detTemp.voice,
            emotion: detEmotion.emotion
        };

        return await this.speechSynthesizer.synthesize(text, speeker);
    }

    resetSession(sessionId: string) {
        this.sessionCache.delete(sessionId);
    }

    clearAllCaches() {
        this.voicesCache.clear();
        this.sessionCache.clear();
    }
}