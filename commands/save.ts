import {
  ApplicationCommandOptionTypes,
  Bot,
  Interaction,
  InteractionResponseTypes,
} from "../deps.ts";
import { newPage, PageRepository } from "../objects/page.ts";
import { type RecordingChannelRepository } from "../objects/recording-channel.ts";

export const saveCommand = {
  name: "save",
  description: "save pong",
  options: [
    {
      name: "sid",
      type: ApplicationCommandOptionTypes.String,
      description: "Scrapboxのsid",
      required: true,
    },
    {
      name: "project-id",
      type: ApplicationCommandOptionTypes.String,
      description: "ScrapboxのprojectID",
      required: true,
    },
  ],
};

function reactToSaveCommand(
  interaction: Interaction,
  recordingChannelRepository: RecordingChannelRepository,
  pageRepository: PageRepository,
): string {
  const guildID = interaction.guildId;
  const channelID = interaction.channelId;
  const options = interaction.data?.options;
  if (!(guildID && channelID && options)) {
    return "Cannot save to scrapbox";
  }

  const sid = options[0].value?.toString();
  const scrapboxProjectId = options[1].value?.toString();
  if (!(sid && scrapboxProjectId)) {
    return "Cannot save to scrapbox";
  }

  recordingChannelRepository.find(guildID, channelID).then((channel) => {
    const page = newPage(sid, scrapboxProjectId, channel.messages);
    pageRepository.save(page).catch(console.log);
  });

  return `https://scrapbox.io/${scrapboxProjectId}`;
}

export function handleSaveCommand(
  client: Bot,
  interaction: Interaction,
  recordingChannelRepository: RecordingChannelRepository,
  pageRepository: PageRepository,
) {
  if (interaction.data?.name === "save") {
    client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: reactToSaveCommand(
          interaction,
          recordingChannelRepository,
          pageRepository,
        ),
      },
    });
  }
}
