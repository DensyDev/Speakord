import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { CommandInteraction, InteractionResponse, VoiceBasedChannel } from "discord.js";
import { playbackService, speechService } from "../../../..";
import { fetchUserHistory as fetchDiscordUserHistory, truncateString } from "../../../../util";

export const playbackDeferReplies = new Map<string, InteractionResponse>();

export async function playback(text: string, interaction: CommandInteraction, voiceChannel: VoiceBasedChannel) {
    try {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
        
        const defer = await interaction.deferReply();
        playbackDeferReplies.set(interaction.guild!.id, defer);

        const audioBuffer = await speechService.speek(interaction.guildId!, text, {
            temperament: await fetchUserHistory(interaction, 100, 1000),
            emotion: await fetchUserHistory(interaction, 5, 1000)
        });

        await playbackService.addAndPlay(interaction.guildId!, connection, {
            buffer: audioBuffer
        });

        await defer.edit("Your message played back");
        playbackDeferReplies.delete(interaction.guild!.id);
    } catch (error) {
        console.error('Error while TTS/Playback:', error);
        interaction.reply('Internal error while playback');
    }
}

async function fetchUserHistory(interaction: CommandInteraction, messageLimit: number, lengthLimit: number) {
    return (await fetchDiscordUserHistory(interaction.guild!, interaction.member?.user.id!, messageLimit)).map(m => truncateString(m, lengthLimit))
}