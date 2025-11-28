import { EmbedBuilder, APIEmbedField } from 'discord.js';

export class Embed {
    private embed: EmbedBuilder;

    constructor() {
        this.embed = new EmbedBuilder();
    }

    setTitle(title: string): this {
        this.embed.setTitle(title);
        return this;
    }

    setDescription(description: string): this {
        this.embed.setDescription(description);
        return this;
    }

    setColor(r: number, g: number, b: number): this {
        const color = (r << 16) + (g << 8) + b;
        this.embed.setColor(color);
        return this;
    }

    addField(name: string, value: string, inline: boolean = false): this {
        this.embed.addFields({ name, value, inline });
        return this;
    }

    setFooter(text: string, iconURL?: string): this {
        this.embed.setFooter({ text, iconURL });
        return this;
    }

    setThumbnail(url: string): this {
        this.embed.setThumbnail(url);
        return this;
    }

    setImage(url: string): this {
        this.embed.setImage(url);
        return this;
    }

    setAuthor(name: string, iconURL?: string, url?: string): this {
        this.embed.setAuthor({ name, iconURL, url });
        return this;
    }

    setURL(url: string): this {
        this.embed.setURL(url);
        return this;
    }

    setTimestamp(timestamp?: Date | number): this {
        this.embed.setTimestamp(timestamp);
        return this;
    }

    build(): EmbedBuilder {
        return this.embed;
    }
}
