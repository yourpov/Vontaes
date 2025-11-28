import { config } from 'dotenv';

config();

const t = process.env.DISCORD_TOKEN;
const g = process.env.GUILD_ID;

if (!t) throw new Error('DISCORD_TOKEN is required');
if (!g) throw new Error('GUILD_ID is required');

export const token: string = t;
export const guildId: string = g;
