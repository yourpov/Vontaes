import { 
    ChatInputCommandInteraction, 
    PermissionFlagsBits, 
    SlashCommandBuilder,
    MessageFlags
} from 'discord.js';
import { SlashCommand } from '../handler/commands';

export class Kick implements SlashCommand {
    name = 'kick';
    description = 'Kick someone from the server';

    build() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('Who to kick')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription('Why are you kicking them')
                    .setRequired(false)
            );
    }

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.guild) {
            await interaction.reply({ content: 'only works in servers', flags: MessageFlags.Ephemeral });
            return;
        }

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
            await interaction.reply({ content: 'you dont have permission to kick people', flags: MessageFlags.Ephemeral });
            return;
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            const executor = interaction.member as any;
            
            if (member.roles.highest.position >= executor.roles.highest.position) {
                await interaction.reply({ content: 'cant kick someone with equal or higher role', flags: MessageFlags.Ephemeral });
                return;
            }
            
            if (!member.kickable) {
                await interaction.reply({ content: 'i dont have permission to kick them', flags: MessageFlags.Ephemeral });
                return;
            }
            
            await member.kick(reason);
            await interaction.reply({ content: `kicked ${user.tag} - ${reason}`, flags: MessageFlags.Ephemeral });
        } catch {
            await interaction.reply({ content: 'couldnt kick them', flags: MessageFlags.Ephemeral });
        }
    }
}
