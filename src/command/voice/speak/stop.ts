import { getVoiceConnection } from "@discordjs/voice";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    MessageFlags,
    GuildMember,
} from "discord.js";
import { playbackService } from "../../..";
import { t } from "../../../locale";

export const command = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop all playback");

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
        return interaction.reply({ content: t('command.speak.only.in.guild', interaction.locale), flags: MessageFlags.Ephemeral });
    }

    const connection = getVoiceConnection(interaction.guild!.id);
    if (!connection) {
        return interaction.reply({ content: t('command.speak.not.in.voice', interaction.locale), flags: MessageFlags.Ephemeral });
    }

    playbackService.stopAndClear(interaction.guildId!);
    connection.destroy();
    await interaction.reply({ content: t('command.speak.all.playback.stopped', interaction.locale), flags: MessageFlags.Ephemeral });
}