import { 
    ChatInputCommandInteraction, 
    PermissionFlagsBits, 
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    ComponentType,
    MessageFlags
} from 'discord.js';
import { SlashCommand } from '../handler/commands';

export class Role implements SlashCommand {
    name = 'role';
    description = 'Give someone a role';

    build() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('Who to give the role to')
                    .setRequired(true)
            );
    }

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        const user = interaction.options.getUser('user', true);

        if (!interaction.guild) {
            await interaction.reply({ content: 'only works in servers', flags: MessageFlags.Ephemeral });
            return;
        }

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageRoles)) {
            await interaction.reply({ content: 'you dont have permission to manage roles', flags: MessageFlags.Ephemeral });
            return;
        }

        const roles = interaction.guild.roles.cache
            .filter(r => r.id !== interaction.guild?.id && !r.managed && r.position < interaction.guild!.members.me!.roles.highest.position)
            .sort((a, b) => b.position - a.position)
            .first(25);

        if (roles.length === 0) {
            await interaction.reply({ content: 'no roles i can assign', flags: MessageFlags.Ephemeral });
            return;
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId('role_select')
            .setPlaceholder('pick a role')
            .addOptions(roles.map(role => ({
                label: role.name,
                value: role.id,
                description: `${role.members.size} members`
            })));

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

        const response = await interaction.reply({
            content: `pick a role for ${user.tag}`,
            components: [row],
            flags: MessageFlags.Ephemeral
        });

        try {
            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 60000
            });

            collector.on('collect', async (i: StringSelectMenuInteraction) => {
                const roleId = i.values[0];
                const role = interaction.guild!.roles.cache.get(roleId);
                const member = await interaction.guild!.members.fetch(user.id);

                if (!role) {
                    await i.update({ content: 'role not found', components: [] });
                    return;
                }

                try {
                    await member.roles.add(role);
                    await i.update({ content: `gave ${role.name} to ${user.tag}`, components: [] });
                } catch {
                    await i.update({ content: 'couldnt give them the role', components: [] });
                }
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    await interaction.editReply({ content: 'timed out', components: [] });
                }
            });
        } catch {
            await interaction.editReply({ content: 'something went wrong', components: [] });
        }
    }
}
