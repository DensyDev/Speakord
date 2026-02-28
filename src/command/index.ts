import { ApplicationCommandDataResolvable, CommandInteraction, Events } from "discord.js";
import { bot } from "..";
import path from "path";
import fs from "fs";

type CommandName = { name: string };
type Command = {
    command: ApplicationCommandDataResolvable & CommandName,
    execute: (interaction: CommandInteraction) => void
};

const executors = new Map<string, Function>();

function scanDir(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return scanDir(fullPath);
        }

        if (
            entry.isFile() &&
            fullPath.endsWith(".ts") &&
            fullPath !== __filename
        ) {
            return [fullPath];
        }

        return [];
    });
}

export async function setupCommands() {
    const commandFiles = scanDir(__dirname);

    const commands: ApplicationCommandDataResolvable[] = [];

    for (const filePath of commandFiles) {
        const command = require(filePath) as Command;

        if ("command" in command && "execute" in command) {
            if (!bot.application) throw new Error("Application not ready");

            commands.push(command.command);
            executors.set(command.command.name, command.execute);
        } else {
            console.log(`Command at ${filePath} is missing required properties (command or execute)`);
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