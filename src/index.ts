import { Client, GatewayIntentBits, Message } from 'discord.js';
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from '@discordjs/voice';
import { OpenAISpeekerDeterminer, OpenAISpeechSynthesizer, OpenAIVoiceResolver } from './ai';
import { PlaybackService, SpeechService } from './service';
import { MemoryPlayerQueue } from './player';
import { BOT_TOKEN, OPENAI_API_KEY, OPENAI_GPT_MODEL, OPENAI_TTS_MODEL } from './api/constants';
import { getGlobalUserHistory, truncateString } from './util';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const speechService = new SpeechService(
    new OpenAISpeekerDeterminer(OPENAI_API_KEY, OPENAI_GPT_MODEL),
    new OpenAISpeechSynthesizer(OPENAI_API_KEY, OPENAI_TTS_MODEL),
    new OpenAIVoiceResolver()
);

const playbackService = new PlaybackService(new MemoryPlayerQueue());

client.on('messageCreate', async (message: Message) => {
    if (!message.content.startsWith('!') || message.author.bot) return;
    
    const text = message.content.replace('!', '').trim();
    if (!text) return;
    console.log(text);

    const member = message.member;
    const voiceChannel = member?.voice.channel;

    if (!voiceChannel) {
        return message.reply("First, join the voice channel.!");
    }

    try {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

        const audioBuffer = await speechService.speek(message.guildId!, text, {
            temperament: (await getGlobalUserHistory(message.guild!, message.member?.user.id!, 100)).map(m => truncateString(m, 1000)),
            emotion: (await getGlobalUserHistory(message.guild!, message.member?.user.id!, 5)).map(m => truncateString(m, 1000))
        }, {
            
        });

        await playbackService.addAndPlay(message.guildId!, connection, {
            buffer: audioBuffer
        });

        await message.react('✅');

    } catch (error) {
        console.error('Error while TTS/Playback:', error);
        message.reply('Error while TTS/Playback: ' + error);
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member?.id === client.user?.id && !newState.channelId) {
        const guildId = oldState.guild.id;
        
        console.log(`Cleaning up for guild: ${guildId}`);
        speechService.resetSession(guildId);
        playbackService.stopAndClear(guildId);
    }
});

client.login(BOT_TOKEN);