import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { i18n, t } from "../../locale";

export const command = new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Voice settings");

export async function execute(interaction: CommandInteraction) {
    console.log(interaction.locale);
    
    return interaction.reply(t('current_lang', interaction.locale, { lang: interaction.locale}))
}