import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandStringOption, 
    MessageFlags 
} from "discord.js";
import { createLocalizationMap, t } from "../../locale";

export const command = new SlashCommandBuilder()
    .setName("gender")
    .setDescription("Change voice gender")
    .setDescriptionLocalizations(createLocalizationMap('command.description.gender'))
	.addStringOption(new SlashCommandStringOption()
        .setName('gender')
        .setDescription('Select voice gender')
        .setDescriptionLocalizations(createLocalizationMap('command.description.gender.option.gender'))
        .addChoices([
            { name: "Male", name_localizations: createLocalizationMap('command.description.gender.option.gender.male'), value: "male"},
            { name: "Female", name_localizations: createLocalizationMap('command.description.gender.option.gender.female'), value: "female"},
            { name: "Neutral", name_localizations: createLocalizationMap('command.description.gender.option.gender.neutral'), value: "neutral"},
            { name: "Disable", name_localizations: createLocalizationMap('command.description.gender.option.gender.unknown'), value: "unknown"}
        ]));

export async function execute(interaction: ChatInputCommandInteraction) {
    const gender = interaction.options.getString('gender');
    if (!gender) return;

    if (gender !== "unknown") {
        interaction.reply({ content: t('command.gender.voice.changed', interaction.locale, {
            gender: t(`command.description.gender.option.gender.${gender}`, interaction.locale)
        }), flags: MessageFlags.Ephemeral })
    } else {
        interaction.reply({ content: t('command.gender.voice.reset', interaction.locale), flags: MessageFlags.Ephemeral })
    }
}