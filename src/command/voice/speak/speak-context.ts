import {
    MessageFlags, 
    GuildMember,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    ApplicationCommandType
} from "discord.js";
import { playback } from "./util/speak-utils";

export const command = new ContextMenuCommandBuilder()
    .setName("Speak this message")
    .setType(ApplicationCommandType.Message);

export async function execute(interaction: MessageContextMenuCommandInteraction) {
    const text = interaction.targetMessage.content;
    if (!text) return;

    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
        return interaction.reply({ content: "This command can only be used on the server.", flags: MessageFlags.Ephemeral });
    }

    const voiceChannel = member?.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: "First, join the voice channel.", flags: MessageFlags.Ephemeral });
    }

    await playback(text, interaction, voiceChannel);
}