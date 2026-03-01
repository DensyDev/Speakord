import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandStringOption, 
    MessageFlags, 
    SlashCommandSubcommandBuilder,
    PermissionFlagsBits
} from "discord.js";
import { createLocalizationMap, t } from "../../locale";
import { settingsService } from "../..";
import { truncateString } from "../../util";

export const command = new SlashCommandBuilder()
    .setName("prompt")
    .setDescription("Change voice prompt")
    .setDescriptionLocalizations(createLocalizationMap('command.description.prompt'))
	.addSubcommand(new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("Set custom prompt")
        .setDescriptionLocalizations(createLocalizationMap('command.description.prompt.subcommand.set'))
        .addStringOption(new SlashCommandStringOption()
            .setName('prompt')
            .setRequired(false)
            .setDescription('Type voice prompt')
            .setDescriptionLocalizations(createLocalizationMap('command.description.prompt.option.prompt'))))
    .addSubcommand(new SlashCommandSubcommandBuilder()
        .setName("reset")
        .setDescription("Reset custom prompt")
        .setDescriptionLocalizations(createLocalizationMap('command.description.prompt.subcommand.reset')))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (!guildId) return;

    if (subcommand === "set") {
        const prompt = interaction.options.getString('prompt');
        if (!prompt) return;

        await settingsService.setGuildPrompt(guildId, prompt);
        
        await interaction.reply({ 
            content: t('command.prompt.voice.changed', interaction.locale, {
                prompt: truncateString(prompt, 300)
            }), 
            flags: MessageFlags.Ephemeral
        });
    } else {
        await settingsService.resetGuildSettings(guildId);
        
        await interaction.reply({ 
            content: t('command.prompt.voice.reset', interaction.locale), 
            flags: MessageFlags.Ephemeral 
        });
    }
}