import { Client, Events, GatewayIntentBits } from 'discord.js';
import { 
    OpenAISpeekerDeterminer, 
    OpenAISpeechSynthesizer, 
    OpenAIVoiceResolver 
} from './ai';
import { SpeechService, PlaybackService } from './service';
import { MemoryPlayerQueue } from './player';
import { 
    BOT_TOKEN, 
    OPENAI_API_KEY, 
    OPENAI_GPT_MODEL, 
    OPENAI_TTS_MODEL 
} from './api/constants';
import { setupCommands } from './command';

export const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

export const speechService = new SpeechService(
    new OpenAISpeekerDeterminer(OPENAI_API_KEY, OPENAI_GPT_MODEL),
    new OpenAISpeechSynthesizer(OPENAI_API_KEY, OPENAI_TTS_MODEL),
    new OpenAIVoiceResolver()
);

export const playbackService = new PlaybackService(new MemoryPlayerQueue());

async function main() {
    await bot.login(BOT_TOKEN);
    
    await setupCommands();
    console.log('All commands registered');
}

main();