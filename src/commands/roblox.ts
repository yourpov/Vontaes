import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommand } from '../handler/commands';

export class Roblox implements SlashCommand {
    name = 'roblox';
    description = 'roblox profile link';

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply('follow & add https://www.roblox.com/users/327750469/profile to claim items');
    }
}
