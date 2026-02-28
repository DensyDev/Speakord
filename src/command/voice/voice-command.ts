import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Voice settings");

export async function execute(interaction: CommandInteraction) {
    
}