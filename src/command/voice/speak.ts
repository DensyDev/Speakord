import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandStringOption, 
    MessageFlags, 
    GuildMember,
    CommandInteraction,
    VoiceBasedChannel
} from "discord.js";
import { playbackService, speechService } from "../..";
import { fetchUserHistory as fetchDiscordUserHistory, truncateString } from "../../util";

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

export async function playback(text: string, interaction: CommandInteraction, voiceChannel: VoiceBasedChannel) {
    try {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
        const defer = await interaction.deferReply();

        const audioBuffer = await speechService.speek(interaction.guildId!, text, {
            temperament: await fetchUserHistory(interaction, 100, 1000),
            emotion: await fetchUserHistory(interaction, 5, 1000)
        });

        await playbackService.addAndPlay(interaction.guildId!, connection, {
            buffer: audioBuffer
        });

        await defer.edit("Your message played back");

    } catch (error) {
        console.error('Error while TTS/Playback:', error);
        interaction.reply('Internal error while playback');
    }
}

async function fetchUserHistory(interaction: CommandInteraction, messageLimit: number, lengthLimit: number) {
    return (await fetchDiscordUserHistory(interaction.guild!, interaction.member?.user.id!, messageLimit)).map(m => truncateString(m, lengthLimit))
}