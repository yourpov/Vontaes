import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommand } from '../handler/commands';

export class DH implements SlashCommand {
    name = 'dh';
    description = 'call someone to the gym';

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply('<@1393268483080458300> meet me @ gym please and trade (okh4wk) to receive ur item\n\nhttps://www.roblox.com/users/327750469/profile');
    }
}
