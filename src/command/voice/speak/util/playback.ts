import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CommandInteraction,
    ComponentType,
    InteractionResponse,
    MessageFlags,
    VoiceBasedChannel
} from "discord.js";
import { playbackService, speechService } from "../../../..";
import { fetchUserHistory as fetchDiscordUserHistory, truncateString } from "../../../../util";

export const playbackDeferReplies = new Map<string, InteractionResponse>();

export async function playback(text: string, interaction: CommandInteraction, voiceChannel: VoiceBasedChannel) {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const defer = await interaction.deferReply();
    playbackDeferReplies.set(guildId, defer);

    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel("Skip")
            .setCustomId("skip_playback")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
            .setEmoji({ name: "⏭️" })
    );

    try {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 20_000);


        const history = await fetchUserHistory(interaction, 100, 1000);
        const audioBuffer = await speechService.speek(guildId, text, {
            temperament: history,
            emotion: history.slice(0, 5)
        });

        const skip = await defer.edit({
            content: "Playing your message...",
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel("Skip")
                        .setCustomId("skip_playback")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji({ name: "⏭️" })
                )
            ]
        });

        let skipped = false;

        // Adding a button listener
        const collector = skip.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });
        collector.on('collect', async (button: ButtonInteraction) => {
            try {
                await button.deferUpdate().catch(() => { });
                if (button.member?.user.id != interaction.user.id) {
                    return button.reply({ content: `This interaction is not for you`, ephemeral: true })
                }
                if (button.customId === "skip_playback") {
                    skipped = true;
                    playbackService.skipPlayback(guildId);

                    await defer.edit({ content: "Your message has skipped", components: [disabledRow] });
                    await button.followUp({
                        content: playbackService.playerQueue.empty(guildId) ?
                            "Current playback stopped" :
                            "Current playback skipped",
                        flags: MessageFlags.Ephemeral
                    }).catch(() => { });
                }
            } catch (error) { }
        });

        // Play audio and edit defer if playback is not skipped
        await playbackService.addAndPlay(guildId, connection, { buffer: audioBuffer }, {
            onStop: async () => {
                collector.stop();
                if (skipped) {
                    return;
                }
                await defer.edit({ content: "Your message played back", components: [disabledRow] }).catch(() => { });
            }
        });

    } catch (error) {
        console.error("Error while TTS/Playback:", error);
        await defer.edit({ content: "Internal error while playback", components: [] }).catch(() => { });
    } finally {
        playbackDeferReplies.delete(guildId);
    }
}

async function fetchUserHistory(interaction: CommandInteraction, messageLimit: number, lengthLimit: number) {
    const history = await fetchDiscordUserHistory(interaction.guild!, interaction.member?.user.id!, messageLimit);
    return history.map(m => truncateString(m, lengthLimit));
}