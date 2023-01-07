import { Bot, Interaction, InteractionResponseTypes } from "../deps.ts";
import {
  type RecordingChannel,
  RecordingChannelRepository,
} from "../objects/recording-channel.ts";

export const startRecordingCommand = {
  name: "start-recording",
  description: "メッセージの収録を開始する",
};

function reactToStartRecordingCommand(
  interaction: Interaction,
  repository: RecordingChannelRepository,
): string {
  const channelID = interaction.channelId;
  const guildID = interaction.guildId;

  if (channelID === undefined || guildID === undefined) {
    return "Cannnot start recording";
  }

  const channel: RecordingChannel = {
    messages: [],
    channelID: channelID,
    guildID: guildID,
  };

  repository.save(channel);

  return "Start Recording";
}

export function handleStartRecordingCommand(
  client: Bot,
  interaction: Interaction,
  repository: RecordingChannelRepository,
) {
  if (interaction.data?.name === "start-recording") {
    client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: reactToStartRecordingCommand(
          interaction,
          repository,
        ),
      },
    });
  }
}
