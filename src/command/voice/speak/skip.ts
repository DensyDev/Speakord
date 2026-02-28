import { getVoiceConnection } from "@discordjs/voice";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    MessageFlags,
    GuildMember,
} from "discord.js";
import { playbackService } from "../../..";

export const command = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip current message");

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
        return interaction.reply({ content: "This command can only be used on the server.", flags: MessageFlags.Ephemeral });
    }

    const voiceChannel = member?.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: "First, join the voice channel.", flags: MessageFlags.Ephemeral });
    }

    const connection = getVoiceConnection(voiceChannel.guild.id);
    if (!connection) {
        return interaction.reply({ content: "Speakord is not connected to the voice channel.", flags: MessageFlags.Ephemeral });
    }

    if (!playbackService.playerQueue.empty(interaction.guildId!)) {
        await playbackService.skipPlayback(interaction.guildId!);
        await interaction.reply({ content: "Current playback skipped", flags: MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ content: "Current queue is empty", flags: MessageFlags.Ephemeral });
    }
}