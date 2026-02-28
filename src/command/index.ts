import { ApplicationCommandDataResolvable, CommandInteraction, Events } from "discord.js";
import { bot } from "..";
import { findTSFiles } from "../util";

type CommandName = { name: string };
type Command = {
    command: ApplicationCommandDataResolvable & CommandName,
    execute: (interaction: CommandInteraction) => void
};

const executors = new Map<string, Function>();

export async function setupCommands() {
    const commandFiles = findTSFiles(__dirname, (entry, fullPath) => entry.isFile() &&
            fullPath.endsWith(".ts") &&
            fullPath !== __filename);

    const commands: ApplicationCommandDataResolvable[] = [];

    for (const filePath of commandFiles) {
        const command = require(filePath) as Command;

        if ("command" in command && "execute" in command) {
            if (!bot.application) throw new Error("Application not ready");

            commands.push(command.command);
            executors.set(command.command.name, command.execute);
        } else {
            console.warn(`Command at ${filePath} is missing required properties (command or execute)`);
        }
    }

    if (!bot.application) {
        throw new Error("Application not ready");
    }
    await bot.application?.commands.set(commands);

    setupCommandHandler();
}

function setupCommandHandler() {
    bot.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

        const executor = executors.get(interaction.commandName);
        if (!executor) {
            console.error(`No command matching ${interaction.commandName} was found`);
            return;
        }

        try {
            await executor(interaction);
        } catch (error) {
            console.error(`Error while executing command ${interaction.commandName}: ${error}`);
        }
    });
}