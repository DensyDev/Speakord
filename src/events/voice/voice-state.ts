import { Events, VoiceState } from "discord.js";
import { getVoiceConnection } from '@discordjs/voice';
import { bot } from "../..";
import { playbackDeferReplies } from "../../command/voice/speak/util/speak-utils";

export const name = Events.VoiceStateUpdate;

export async function listener(oldState: VoiceState, newState: VoiceState) {
    const channel = oldState.channel;
    if (channel && channel.members.has(bot.user!.id)) {

        const memberCount = channel.members.filter(member => !member.user.bot).size;
        if (memberCount === 0) {

            // Edit all deferred replies
            playbackDeferReplies.forEach(defer => defer.edit('All left the voice channel.'))

            const connection = getVoiceConnection(oldState.guild.id);
            if (connection) {
                connection.destroy();
            }
        }
    }
}