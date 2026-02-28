import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandStringOption, 
    MessageFlags 
} from "discord.js";

export const command = new SlashCommandBuilder()
    .setName("gender")
    .setDescription("Change voice gender")
	.addStringOption(new SlashCommandStringOption()
        .setName('gender')
        .setDescription('Select voice gender')
        .addChoices([
            { name: "Male", value: "male"},
            { name: "Female", value: "female"},
            { name: "Neutral", value: "neutral"},
            { name: "Disable", value: "unknown"}
        ]));

export async function execute(interaction: ChatInputCommandInteraction) {
    const gender = interaction.options.getString('gender');
    if (!gender) return;

    if (gender !== "unknown") {
        interaction.reply({ content: `Voice gender changed to ${gender}`, flags: MessageFlags.Ephemeral })
    } else {
        interaction.reply({ content: `Voice gender reset to auto-select`, flags: MessageFlags.Ephemeral })
    }
}