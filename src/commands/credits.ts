import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommand } from '../handler/commands';
import { Embed } from '../util/embed';

export class Credits implements SlashCommand {
    name = 'credits';
    description = 'see who made this';

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        const embed = new Embed()
            .setTitle('vontaes')
            .setDescription('bot made with [typescript](https://www.typescriptlang.org/)')
            .addField('dev', '<@1055337846657007648> (YourPOV)', false)
            .addField('telegram', 'https://t.me/uhhhwhatever', true)
            .addField('github', 'https://github.com/yourpov', true)
            .setColor(225, 225, 225)
            .setTimestamp()
            .build();

        await interaction.reply({ embeds: [embed] });
    }
}
