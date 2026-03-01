import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandStringOption, 
    MessageFlags, 
    GuildMember
} from "discord.js";
import { playback } from "./util/playback";

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
        return interaction.reply({ content: "This command can only be used on the server.", flags: MessageFlags.Ephemeral });
    }

    const voiceChannel = member?.voice.channel;
    if (!voiceChannel) {
        return interaction.reply({ content: "First, join the voice channel.", flags: MessageFlags.Ephemeral });
    }

    await playback(text, interaction, voiceChannel);
}