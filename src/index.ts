import { Client, GatewayIntentBits } from 'discord.js';
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
import { setupEvents } from './events';
import { setupI18n } from './locale';
import { SettingsService } from './service/settings-service';

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

export const settingsService = new SettingsService();

async function main() {
    await bot.login(BOT_TOKEN);
    
    await setupCommands();
    console.log('All commands registered');

    await setupEvents();
    console.log('All events registered');

    await setupI18n();
    console.log('All locales loaded'); 
}

main();