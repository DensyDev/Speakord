import { Gender, Voice, VoiceResolver } from "..";

type OpenAIVoiceMeta = {
    name: string;
    gender: Gender;
    description: string;
};

const OPENAI_VOICES: OpenAIVoiceMeta[] = [
    { name: 'alloy', gender: 'neutral', description: 'Balanced, natural voice with a clear tone.' },
    { name: 'ash', gender: 'male', description: 'Calm male voice with steady cadence.' },
    { name: 'ballad', gender: 'female', description: 'Warm female voice with smooth rhythm.' },
    { name: 'coral', gender: 'female', description: 'Bright female voice with a friendly tone.' },
    { name: 'echo', gender: 'male', description: 'Clear male voice with a modern sound.' },
    { name: 'fable', gender: 'neutral', description: 'Soft narrative voice with a reflective tone.' },
    { name: 'nova', gender: 'female', description: 'Confident female voice with crisp articulation.' },
    { name: 'onyx', gender: 'male', description: 'Deep male voice with a resonant presence.' },
    { name: 'sage', gender: 'neutral', description: 'Measured voice with a thoughtful tone.' },
    { name: 'shimmer', gender: 'female', description: 'Light female voice with a polished sound.' },
    { name: 'verse', gender: 'neutral', description: 'Even, adaptable voice with balanced dynamics.' },
    { name: 'marin', gender: 'female', description: 'Soft female voice with natural pacing.' },
    { name: 'cedar', gender: 'male', description: 'Warm male voice with a steady tone.' }
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