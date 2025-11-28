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

export class Invite implements SlashCommand {
    name = 'invite';
    description = 'create a server invite';

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply({ content: 'only works in servers', flags: MessageFlags.Ephemeral });
            return;
        }

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.CreateInstantInvite)) {
            await interaction.reply({ content: 'you dont have permission to create invites', flags: MessageFlags.Ephemeral });
            return;
        }

        const expiryMenu = new StringSelectMenuBuilder()
            .setCustomId('invite_expiry')
            .setPlaceholder('pick expiry time')
            .addOptions([
                { label: 'never expires', value: '0' },
                { label: '30 minutes', value: '30' },
                { label: '1 hour', value: '60' },
                { label: '6 hours', value: '360' },
                { label: '12 hours', value: '720' },
                { label: '1 day', value: '1440' },
                { label: '7 days', value: '10080' }
            ]);

        const usesMenu = new StringSelectMenuBuilder()
            .setCustomId('invite_uses')
            .setPlaceholder('pick max uses')
            .addOptions([
                { label: 'unlimited', value: '0' },
                { label: '1 use', value: '1' },
                { label: '5 uses', value: '5' },
                { label: '10 uses', value: '10' },
                { label: '25 uses', value: '25' },
                { label: '50 uses', value: '50' },
                { label: '100 uses', value: '100' }
            ]);

        const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(expiryMenu);
        const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(usesMenu);

        const response = await interaction.reply({
            content: 'configure your invite',
            components: [row1, row2],
            flags: MessageFlags.Ephemeral
        });

        let expires = 0;
        let uses = 0;
        let selections = 0;

        try {
            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 60000
            });

            collector.on('collect', async (i: StringSelectMenuInteraction) => {
                if (i.customId === 'invite_expiry') {
                    expires = parseInt(i.values[0]);
                } else if (i.customId === 'invite_uses') {
                    uses = parseInt(i.values[0]);
                }

                selections++;

                if (selections === 2) {
                    const channel = interaction.channel;
                    
                    if (!channel || !('createInvite' in channel)) {
                        await i.update({ content: 'couldnt find the channel', components: [] });
                        return;
                    }

                    try {
                        const invite = await channel.createInvite({
                            maxAge: expires * 60,
                            maxUses: uses,
                            reason: `created by ${interaction.user.tag}`
                        });

                        const details = [];
                        if (expires > 0) details.push(`expires in ${expires} minutes`);
                        else details.push('never expires');
                        
                        if (uses > 0) details.push(`${uses} uses max`);
                        else details.push('unlimited uses');

                        await i.update({
                            content: `${invite.url}\n${details.join(' • ')}`,
                            components: []
                        });
                    } catch {
                        await i.update({ content: 'couldnt create invite', components: [] });
                    }
                } else {
                    await i.update({ 
                        content: `configured ${selections}/2 options`,
                        components: [row1, row2]
                    });
                }
            });

            collector.on('end', async (collected) => {
                if (selections < 2) {
                    await interaction.editReply({ content: 'timed out', components: [] });
                }
            });
        } catch {
            await interaction.editReply({ content: 'something went wrong', components: [] });
        }
    }
}
