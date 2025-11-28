import { Vontaes } from './client/vontaes';

const bot = new Vontaes();

bot.start().catch(err => {
    console.error('Failed to start:', err);
    process.exit(1);
});

process.on('SIGINT', () => {
    bot.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    bot.stop();
    process.exit(0);
});
