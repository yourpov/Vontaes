import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export interface SlashCommand {
    name: string;
    description: string;
    build?(): SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    run(interaction: ChatInputCommandInteraction): Promise<void>;
}

export class CommandStore {
    private store: Map<string, SlashCommand>;

    constructor() {
        this.store = new Map();
    }

    add(cmd: SlashCommand): void {
        this.store.set(cmd.name, cmd);
    }

    find(name: string): SlashCommand | undefined {
        return this.store.get(name);
    }

    all(): SlashCommand[] {
        return Array.from(this.store.values());
    }

    build(): (SlashCommandBuilder | SlashCommandOptionsOnlyBuilder)[] {
        return this.all().map(cmd => {
            if (cmd.build) {
                return cmd.build();
            }
            return new SlashCommandBuilder()
                .setName(cmd.name)
                .setDescription(cmd.description);
        });
    }
}
