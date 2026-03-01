import { Guild, TextChannel, Message, Collection } from 'discord.js';

/**
 * Collects the user's latest messages from the entire server.
 */
export async function fetchUserHistory(
    guild: Guild, 
    userId: string, 
    limit: number = 20
): Promise<string[]> {
    try {
        const channels = guild.channels.cache.filter(ch => 
            ch.isTextBased() && 
            ch.permissionsFor(guild.members.me!)?.has('ViewChannel') &&
            ch.permissionsFor(guild.members.me!)?.has('ReadMessageHistory')
        ) as Collection<string, TextChannel>;

        const allMessages: Message[] = [];

        await Promise.all(channels.map(async (channel) => {
            try {
                const fetched = await channel.messages.fetch({ limit: 30 });
                const userMsgs = fetched.filter(m => m.author.id === userId && m.content.length > 0);
                allMessages.push(...userMsgs.values());
            } catch (err) {

            }
        }));

        return allMessages
            .sort((a, b) => b.createdTimestamp - a.createdTimestamp) 
            .slice(0, limit)
            .reverse()
            .map(m => cleanMessageContent(m.content));

    } catch (error) {
        console.error('Error fetching global history:', error);
        return [];
    }
}

/**
 * Cleaning text of role IDs, users, channels.
 */
function cleanMessageContent(content: string): string {
    return content
        .replace(/<@!?\d+>/g, '')
        .replace(/<@&\d+>/g, '')
        .replace(/<#\d+>/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .trim();
}