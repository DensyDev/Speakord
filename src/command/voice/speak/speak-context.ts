import {
    MessageFlags, 
    GuildMember,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    ApplicationCommandType
} from "discord.js";
import { playback } from "./util/playback";
import { createLocalizationMap, t } from "../../../locale";

export const command = new ContextMenuCommandBuilder()
    .setName("Speak this message")
    .setNameLocalizations(createLocalizationMap('command.description.speak.context'))
    .setType(ApplicationCommandType.Message);

export async function execute(interaction: MessageContextMenuCommandInteraction) {
    const text = interaction.targetMessage.content;
    if (!text) return;

    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
        return interaction.reply({ content: t('command.speak.only.in.guild', interaction.locale), flags: MessageFlags.Ephemeral });
    }

    const voiceChannel = member?.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: t('command.speak.join.voice', interaction.locale), flags: MessageFlags.Ephemeral });
    }

    await playback(text, interaction, voiceChannel);
}