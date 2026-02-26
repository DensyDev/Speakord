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
    private model: string;

    constructor(apiKey: string, model: string) {
        this.client = new OpenAI({ apiKey });
        this.model = model;
    }

    async determineTemperament(config: SpeekerDetermineTemperamentConfig): Promise<DeterminedTemperament> {
        const hasOverride = config.overridePrompt && config.overridePrompt !== "NONE" && config.overridePrompt.trim() !== "";

        const systemPrompt = `You are a robotic vocal profile architect.
        
        LOGIC CONSTRAINTS:
        1. Look for 'ACTUAL_DIRECTIVE' in the user message.
        2. IF 'ACTUAL_DIRECTIVE' is NOT "NONE":
           - You MUST ignore 'MESSAGES_HISTORY' sentiment.
           - You MUST select a voice and set biases (pitch, rate, energy) to PERFECTLY MATCH the 'ACTUAL_DIRECTIVE'.
           - 'traits' array must contain characteristics from the 'ACTUAL_DIRECTIVE'.
        3. IF 'ACTUAL_DIRECTIVE' is "NONE":
           - Analyze 'MESSAGES_HISTORY' to define a matching permanent persona.

        TECHNICAL BIASES:
        - pitchBias, rateBias, energyBias: [-1.0 to 1.0].
        - age: child | youth | adult | senior.

        VOICE SELECTION:
        - Respect 'overrideGender' if provided: ${config.overrideGender ?? 'Not specified'}.
        - Pick the most suitable voice from the provided list.

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

        const userContent = `
        MESSAGES_HISTORY: "${config.messages.join("\n")}"
        ACTUAL_DIRECTIVE: "${hasOverride ? config.overridePrompt : "NONE"}"

        FINAL INSTRUCTION: ${hasOverride
                ? "!!! OVERRIDE ACTIVE !!! Your supreme command is ACTUAL_DIRECTIVE. Ignore MESSAGES_HISTORY. Adjust ALL biases and choose a voice that strictly fits the DIRECTIVE."
                : "Analyze the history to determine long-term temperament."}
        `;

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent }
            ],
            temperature: 0.0,
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content!) as DeterminedTemperament;
    }

    async determineEmotion(config: SpeekerDetermineEmotionConfig): Promise<DeterminedEmotion> {
        const hasOverride = config.overridePrompt && config.overridePrompt !== "NONE" && config.overridePrompt.trim() !== "";
        const systemPrompt = `You are a robotic vocal parameter generator.
        
        STRICT LOGIC UNIT:
        1. Look for 'ACTUAL_DIRECTIVE' in the user message.
        2. IF 'ACTUAL_DIRECTIVE' is NOT "NONE":
           - You MUST ignore the sentiment of 'MESSAGES_CONTEXT'.
           - Every single JSON field (valence, arousal, volume, mood, prompt, contour) MUST be derived ONLY from 'ACTUAL_DIRECTIVE'.
           - The 'prompt' field MUST be a detailed elaboration of 'ACTUAL_DIRECTIVE'.
        3. IF 'ACTUAL_DIRECTIVE' is "NONE":
           - Analyze 'MESSAGES_CONTEXT' normally.

        TECHNICAL SPECS:
        - valence/arousal: [-1.0 to 1.0].
        - volume: [0.0 to 1.0].
        - contour: Array of {pos: %, change: string}. ALWAYS use +/- signs (e.g., "+0st").
        - prompt: Natural language instruction for TTS.
        
        Return ONLY a JSON object:
        {
          "emotion": {
            "valence": number,
            "arousal": number,
            "volume": number,
            "mood": string,
            "prompt": string,
            "contour": [{ "pos": number, "change": string }]
        }
        `;

        const userContent = `
        MESSAGES_CONTEXT: "${config.messages.join("\n")}"
        ACTUAL_DIRECTIVE: "${hasOverride ? config.overridePrompt : "NONE"}"

        FINAL INSTRUCTION: ${hasOverride
                ? "!!! OVERRIDE ACTIVE !!! You MUST ignore MESSAGES_CONTEXT and generate parameters strictly for ACTUAL_DIRECTIVE. All parameters and the 'prompt' field must reflect the DIRECTIVE."
                : "Analyze the emotion of MESSAGES_CONTEXT."}
        `;

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent }
            ],
            temperature: 0.0,
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content!) as DeterminedEmotion;
    }
}