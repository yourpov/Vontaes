import { 
    ChatInputCommandInteraction, 
    PermissionFlagsBits, 
    SlashCommandBuilder,
    MessageFlags
} from 'discord.js';
import { SlashCommand } from '../handler/commands';

export class Ban implements SlashCommand {
    name = 'ban';
    description = 'Ban someone from the server';

    build() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('Who to ban')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription('Why are you banning them')
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

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
            await interaction.reply({ content: 'you dont have permission to ban people', flags: MessageFlags.Ephemeral });
            return;
        }

        try {
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            
            if (member) {
                const executor = interaction.member as any;
                
                if (member.roles.highest.position >= executor.roles.highest.position) {
                    await interaction.reply({ content: 'cant ban someone with equal or higher role', flags: MessageFlags.Ephemeral });
                    return;
                }
                
                if (!member.bannable) {
                    await interaction.reply({ content: 'i dont have permission to ban them', flags: MessageFlags.Ephemeral });
                    return;
                }
            }
            
            await interaction.guild.members.ban(user, { reason });
            await interaction.reply({ content: `banned ${user.tag} - ${reason}`, flags: MessageFlags.Ephemeral });
        } catch {
            await interaction.reply({ content: 'couldnt ban them', flags: MessageFlags.Ephemeral });
        }
    }
}
