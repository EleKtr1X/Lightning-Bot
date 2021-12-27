import type { Command } from '#interfaces/LightningBot';
import Color from 'color';
import { ColorResolvable, MessageEmbed } from 'discord.js';
import ntc from 'ntc';
const { name } = ntc;

export default {
  name: 'color',
  description: 'Gives you information on a hex color!',
  options: [
    {
      name: 'color',
      description: 'The hex color code (e.g. #0099ff)',
      required: true,
      type: 'STRING',
    },
  ],
  async execute(interaction) {
    const colorInput = interaction.options.getString('color');
    const colorStr = colorInput.startsWith('#')
      ? colorInput
      : '#' + colorInput;

    try {
      // eslint-disable-next-line no-unused-vars
      const x = Color(colorStr);
    }
    catch {
      return await interaction.reply('That is not a valid color! Examples of valid colors include `#09f` and `000080`.');
    }
    const color = Color(colorStr);
    const colorName = name(colorStr);
    const hsvArray = color.hsv().array().map(x => Math.round(x));

    const colorEmbed = new MessageEmbed()
      .setColor(color.hex() as ColorResolvable)
      .setTitle(colorName[1])
      .setThumbnail(`https://serux.pro/rendercolour?hex=${colorStr.substring(1)}`)
      .addField('Hex', color.hex())
      .addField('RGB', color.rgb().array().join(', '))
      .addField('CMYK', color.cmyk().array().map(x => Math.round(x)).join(', '))
      .addField('HSV', `${hsvArray[0]}, ${hsvArray[1]}%, ${hsvArray[2]}%`)
      .addField('HSL', color.hsl().string().slice(4, -1));

    if (!colorName[2]) {
      colorEmbed.title += '*';
      colorEmbed.setFooter('* approximate');
    }

    await interaction.reply({ embeds: [colorEmbed] });
  },
} as Command;