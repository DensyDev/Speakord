import { getVoiceConnection } from "@discordjs/voice";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    MessageFlags,
    GuildMember,
    PermissionFlagsBits,
} from "discord.js";
import { playbackService } from "../../..";
import { createLocalizationMap, t } from "../../../locale";

export const command = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip current message")
    .setDescriptionLocalizations(createLocalizationMap('command.description.skip'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
        return interaction.reply({ content: t('command.speak.only.in.guild', interaction.locale), flags: MessageFlags.Ephemeral });
    }

    const voiceChannel = member?.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: t('command.speak.not.in.voice', interaction.locale), flags: MessageFlags.Ephemeral });
    }

    const connection = getVoiceConnection(voiceChannel.guild.id);
    if (!connection) {
        return interaction.reply({ content: t('command.speak.not.in.voice', interaction.locale), flags: MessageFlags.Ephemeral });
    }

    if (!playbackService.playerQueue.empty(interaction.guildId!)) {
        await playbackService.skipPlayback(interaction.guildId!);
        await interaction.reply({ content: t('command.speak.queue.skipped', interaction.locale), flags: MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ content: t('command.speak.queue.empty', interaction.locale), flags: MessageFlags.Ephemeral });
    }
}