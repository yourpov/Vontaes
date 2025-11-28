import { Interaction, InteractionType, MessageFlags } from 'discord.js';
import { CommandStore } from './commands';

export class InteractionHandler {
    private cmds: CommandStore;

    constructor(cmds: CommandStore) {
        this.cmds = cmds;
    }

    async handle(interaction: Interaction): Promise<void> {
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        if (!interaction.isChatInputCommand()) return;

        const cmd = this.cmds.find(interaction.commandName);
        if (!cmd) return;

        try {
            await cmd.run(interaction);
        } catch (err) {
            const msg = 'An error occurred while executing the command.';
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: msg, flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral });
            }
        }
    }
}
