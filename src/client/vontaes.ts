import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import * as env from '../config/env';
import { CommandStore } from '../handler/commands';
import { InteractionHandler } from '../handler/events';
import { DH } from '../commands/dh';
import { Role } from '../commands/role';
import { Ban } from '../commands/ban';
import { Kick } from '../commands/kick';
import { Timeout } from '../commands/timeout';
import { Credits } from '../commands/credits';
import { Invite } from '../commands/invite';
import { Roblox } from '../commands/roblox';

export class Vontaes {
    private client: Client;
    private cmds: CommandStore;
    private handler: InteractionHandler;

    constructor() {
        this.client = new Client({ 
            intents: [
                GatewayIntentBits.Guilds
            ] 
        });
        this.cmds = new CommandStore();
        this.handler = new InteractionHandler(this.cmds);

        this.loadCommands();
        this.listen();
    }

    private loadCommands(): void {
        this.cmds.add(new DH());
        this.cmds.add(new Role());
        this.cmds.add(new Ban());
        this.cmds.add(new Kick());
        this.cmds.add(new Timeout());
        this.cmds.add(new Credits());
        this.cmds.add(new Invite());
        this.cmds.add(new Roblox());
    }

    private listen(): void {
        this.client.on('interactionCreate', async (i: any) => {
            await this.handler.handle(i);
        });
    }

    async start(): Promise<void> {
        await this.client.login(env.token);
        await this.deploy();
    }

    stop(): void {
        this.client.destroy();
    }

    async clearCommands(): Promise<void> {
        const rest = new REST().setToken(env.token);
        await rest.put(
            Routes.applicationGuildCommands(this.client.user!.id, env.guildId),
            { body: [] }
        );
    }

    private async deploy(): Promise<void> {
        const rest = new REST().setToken(env.token);
        const data = this.cmds.build();

        await rest.put(
            Routes.applicationGuildCommands(this.client.user!.id, env.guildId),
            { body: data }
        );
    }
}
