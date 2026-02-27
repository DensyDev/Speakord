import { 
    Speeker, 
    AzureSpeechSynthesizer, 
    AzureVoiceResolver, 
    OpenAISpeekerDeterminer, 
    OpenAISpeechSynthesizer,
    OpenAIVoiceResolver
} from "./ai";
import { OPENAI_API_KEY, OPENAI_GPT_MODEL, OPENAI_TTS_MODEL } from "./api/constants";
import { SpeechService } from "./service/speech-service";
import fs from 'fs';
import path from 'path';

async function main() {
    const text = "";

    const speechService = new SpeechService(
        new OpenAISpeekerDeterminer(OPENAI_API_KEY, OPENAI_GPT_MODEL),
        new OpenAISpeechSynthesizer(OPENAI_API_KEY, OPENAI_TTS_MODEL),
        new OpenAIVoiceResolver()
    );

    const speech = await speechService.speek("1", text, {});

    const filePath = path.join(__dirname, 'output.wav');
    fs.writeFileSync(filePath, speech);
}

main();