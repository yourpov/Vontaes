import { 
    ChatInputCommandInteraction, 
    PermissionFlagsBits, 
    SlashCommandBuilder,
    MessageFlags
} from 'discord.js';
import { SlashCommand } from '../handler/commands';

export class Timeout implements SlashCommand {
    name = 'timeout';
    description = 'Timeout someone';

    build() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('Who to timeout')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('duration')
                    .setDescription('How long in minutes')
                    .setRequired(true)
                    .setMinValue(1)
                    .setMaxValue(40320)
            )
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription('Why are you timing them out')
                    .setRequired(false)
            );
    }

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        const user = interaction.options.getUser('user', true);
        const duration = interaction.options.getInteger('duration', true);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.guild) {
            await interaction.reply({ content: 'only works in servers', flags: MessageFlags.Ephemeral });
            return;
        }

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
            await interaction.reply({ content: 'you dont have permission to timeout people', flags: MessageFlags.Ephemeral });
            return;
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            const executor = interaction.member as any;
            
            if (member.roles.highest.position >= executor.roles.highest.position) {
                await interaction.reply({ content: 'cant timeout someone with equal or higher role', flags: MessageFlags.Ephemeral });
                return;
            }
            
            if (!member.moderatable) {
                await interaction.reply({ content: 'i dont have permission to timeout them', flags: MessageFlags.Ephemeral });
                return;
            }
            
            await member.timeout(duration * 60 * 1000, reason);
            await interaction.reply({ content: `timed out ${user.tag} for ${duration} minutes - ${reason}`, flags: MessageFlags.Ephemeral });
        } catch {
            await interaction.reply({ content: 'couldnt timeout them', flags: MessageFlags.Ephemeral });
        }
    }
}
