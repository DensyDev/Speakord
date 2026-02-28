import { getVoiceConnection } from "@discordjs/voice";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    MessageFlags,
    GuildMember,
} from "discord.js";
import { playbackService } from "../../..";

export const command = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop all playback");

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
        return interaction.reply({ content: "This command can only be used on the server.", flags: MessageFlags.Ephemeral });
    }

    const connection = getVoiceConnection(interaction.guild!.id);
    if (!connection) {
        return interaction.reply({ content: "Speakord is not connected to the voice channel.", flags: MessageFlags.Ephemeral });
    }

    playbackService.stopAndClear(interaction.guildId!);
    connection.destroy();
    await interaction.reply({ content: "All playback has been stopped", flags: MessageFlags.Ephemeral });
}