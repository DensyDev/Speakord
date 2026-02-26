import OpenAI from 'openai';
import { 
    SpeekerDeterminer, 
    SpeekerDetermineTemperamentConfig,
    SpeekerDetermineEmotionConfig, 
    DeterminedTemperament, 
    DeterminedEmotion,
} from "..";

export class OpenAISpeekerDeterminer implements SpeekerDeterminer {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    async determineTemperament(config: SpeekerDetermineTemperamentConfig): Promise<DeterminedTemperament> {
        const systemPrompt = `
            You are a professional voice director and psychologist. Your task is to analyze user messages and define a permanent "Voice Temperament".

            CORE CONCEPTS:
            - pitchBias: [-1.0 to 1.0] Base frequency. -1.0 is a deep bass, 1.0 is high-pitched/tiny.
            - rateBias: [-1.0 to 1.0] Speaking speed. -1.0 is very slow/sluggish, 1.0 is fast/energetic.
            - energyBias: [-1.0 to 1.0] Vocal range and power. -1.0 is monotone/flat, 1.0 is highly dynamic/expressive.

            VOICE SELECTION RULES:
            1. Choose the best matching voice from the provided list.
            2. Respect 'overrideGender' if provided: ${config.overrideGender ?? 'Not specified'}.
            3. Respect 'overridePrompt' if provided: "${config.overridePrompt ?? 'None'}".

            AVAILABLE VOICES:
            ${JSON.stringify(config.voices)}

            Return ONLY a JSON object:
            {
              "temperament": {
                "pitchBias": number,
                "rateBias": number,
                "energyBias": number,
                "age": "child" | "youth" | "adult" | "senior",
                "traits": string[]
              },
              "voice": { "name": string, "locale": string, "gender": string }
            }`;

        const response = await this.client.chat.completions.create({
            model: "gpt-4o", // or "gpt-4-turbo"
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze these messages to determine long-term temperament: ${config.messages.join("\n")}` }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content!) as DeterminedTemperament;
    }

    async determineEmotion(config: SpeekerDetermineEmotionConfig): Promise<DeterminedEmotion> {
        const systemPrompt = `
            You are an expert in emotional prosody. Analyze the LATEST messages to determine the current "Emotional State".

            CORE CONCEPTS:
            - valence: [-1.0 to 1.0] Positivity of mood. -1.0 is pure agony/anger, 1.0 is pure joy.
            - arousal: [-1.0 to 1.0] Excitement level. -1.0 is sleepy/dead inside, 1.0 is frantic/screaming.
            - volume: [0.0 to 1.0] 0.5 is normal. 0.1 is whispering, 1.0 is shouting.
            - contour: An array of {pos: percentage, change: relative_pitch}.
              Example for a question: [{"pos": 0, "change": "0st"}, {"pos": 80, "change": "0st"}, {"pos": 100, "change": "+10st"}]
              Example for sarcasm: [{"pos": 0, "change": "0st"}, {"pos": 50, "change": "+6st"}, {"pos": 100, "change": "-4st"}]

            Return ONLY a JSON object:
            {
              "emotion": {
                "valence": number,
                "arousal": number,
                "volume": number,
                "mood": string,
                "contour": [{ "pos": number, "change": string }]
              }
            }`;

        const response = await this.client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze the recent context for immediate emotion: ${config.messages.slice(-5).join("\n")}` }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content!);
        return result as DeterminedEmotion;
    }
}