import OpenAI from "openai";
import { SpeechSynthesizer as ISpeechSynthesizer, PitchPoint, Speeker } from "..";

export class OpenAISpeechSynthesizer implements ISpeechSynthesizer {

    private client: OpenAI;
    private model: string;

    constructor(apiKey: string, model: string) {
        this.client = new OpenAI({ apiKey });
        this.model = model;
    }

    async synthesize(text: string, speeker: Speeker): Promise<Buffer> {
        const instructions = this.buildInstructions(speeker);
        const response = await this.client.audio.speech.create({
            model: this.model,
            voice: speeker.voice.name,
            input: text,
            instructions: instructions
        });
        return Buffer.from(await response.arrayBuffer());
    }

    private buildInstructions(speeker: Speeker): string {
        const { temperament, emotion } = speeker;

        const rate = temperament.rateBias + emotion.arousal * 0.3;
        const pitch = temperament.pitchBias;
        const energy = temperament.energyBias + emotion.arousal;

        const style = this.mapStyle(emotion.valence, emotion.arousal);

        return `
            Speak in a ${style} manner.
            Tempo: ${this.mapRate(rate)}.
            Pitch: ${this.mapPitch(pitch)}.
            Energy level: ${this.mapEnergy(energy)}.
            Volume: ${Math.floor(emotion.volume * 100)}%.
            ${emotion.prompt ? `Follow the prompt:\n` + emotion.prompt : ''}
            `.trim();
    }

    private mapStyle(valence: number, arousal: number): string {
        if (valence > 0.4) return "cheerful and warm";
        if (valence < -0.4 && arousal > 0.3) return "angry and sharp";
        if (valence < -0.4 && arousal < -0.1) return "sad and subdued";
        if (arousal > 0.5) return "excited and energetic";
        if (valence > 0.2 && arousal < -0.2) return "friendly and calm";
        return "neutral and natural";
    }

    private mapRate(rate: number): string {
        if (rate > 0.5) return "fast";
        if (rate < -0.5) return "slow";
        return "moderate";
    }

    private mapPitch(pitch: number): string {
        if (pitch > 0.5) return "high";
        if (pitch < -0.5) return "low";
        return "natural";
    }

    private mapEnergy(energy: number): string {
        if (energy > 0.5) return "high";
        if (energy < -0.5) return "low";
        return "balanced";
    }
}