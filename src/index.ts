import { 
    Speeker, 
    AzureSpeechSynthesizer, 
    AzureVoiceResolver, 
    OpenAISpeekerDeterminer 
} from "./ai";
import { detectLanguage } from "./util/language-detector";
import fs from 'fs';
import path from 'path';

async function main() {
    const text = "Text to speech";

    const voiceResolver = new AzureVoiceResolver("", "eastus");
    const voiceSynthesizer = new AzureSpeechSynthesizer("", "eastus");
    const speekerDeterminer = new OpenAISpeekerDeterminer("");

    const voices = await voiceResolver.resolve(detectLanguage(text));

    const temperament = await speekerDeterminer.determineTemperament({
        messages: [text],
        voices: voices
    });
    const emotion = await speekerDeterminer.determineEmotion({
        messages: [text]
    });

    const speeker: Speeker = {
        temperament: temperament.temperament,
        emotion: emotion.emotion,
        voice: temperament.voice
    };

    const speech = await voiceSynthesizer.synthesize(text, speeker);

    const filePath = path.join(__dirname, 'output.wav');
    fs.writeFileSync(filePath, speech);
}

main();