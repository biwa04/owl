import { type Message } from "../deps.ts";
import {
  addMessage,
  RecordingChannelRepository,
} from "../objects/recording-channel.ts";

function record(
  message: Message,
  repository: RecordingChannelRepository,
) {
  const guildID = message.guildId;
  const channelID = message.channelId;
  if (guildID === undefined) {
    return;
  }

  repository.find(guildID, channelID).then((channel) => {
    repository.save(addMessage(channel, message.content));
  }).catch(console.log);
}

export function handleMessageToRecord(
  message: Message,
  repository: RecordingChannelRepository,
) {
  record(message, repository);
}
