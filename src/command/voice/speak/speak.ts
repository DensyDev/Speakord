import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandStringOption, 
    MessageFlags, 
    GuildMember
} from "discord.js";
import { playback } from "./util/playback";
import { t } from "../../../locale";

export const command = new SlashCommandBuilder()
    .setName("speak")
    .setDescription("Speak to the voice")
	.addStringOption(new SlashCommandStringOption()
        .setName('text')
        .setDescription('Type your text'));

export async function execute(interaction: ChatInputCommandInteraction) {
    const text = interaction.options.getString('text');
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