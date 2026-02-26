import { Gender, Voice, VoiceResolver } from "..";

type OpenAIVoiceMeta = {
    name: string;
    gender: Gender;
    description: string;
};

const OPENAI_VOICES: OpenAIVoiceMeta[] = [
    {
        name: "alloy",
        gender: "neutral",
        description: "Balanced and neutral voice. Suitable for most general-purpose narration."
    },
    {
        name: "ash",
        gender: "male",
        description: "Warm and confident male voice with a natural delivery."
    },
    {
        name: "coral",
        gender: "female",
        description: "Clear and professional female voice. Good for structured or business content."
    },
    {
        name: "echo",
        gender: "male",
        description: "Deep and calm male voice with steady pacing."
    },
    {
        name: "fable",
        gender: "neutral",
        description: "Expressive voice ideal for storytelling and character-driven narration."
    },
    {
        name: "nova",
        gender: "female",
        description: "Bright and energetic female voice with dynamic tone."
    },
    {
        name: "onyx",
        gender: "male",
        description: "Low-pitched, powerful male voice with authoritative presence."
    },
    {
        name: "sage",
        gender: "neutral",
        description: "Soft and composed voice with a calm and reassuring tone."
    },
    {
        name: "shimmer",
        gender: "female",
        description: "Light and smooth female voice with gentle articulation."
    }
];

export class OpenAIVoiceResolver implements VoiceResolver {

    async resolve(locale: string): Promise<Voice[]> {
        return OPENAI_VOICES.map(v => ({
            name: v.name,
            locale,
            gender: v.gender,
            description: v.description
        }));
    }
}