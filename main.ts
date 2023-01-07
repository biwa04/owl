import { config, createBot, GatewayIntents, startBot } from "./deps.ts";
import { handlePingCommand, pingCommand } from "./commands/ping.ts";
import { InMemoryRecordingChannelRepository } from "./objects/recording-channel.ts";
import {
  handleStartRecordingCommand,
  startRecordingCommand,
} from "./commands/start-recording.ts";
import { handleMessageToRecord } from "./commands/record.ts";

const recordingChannelRepository = new InMemoryRecordingChannelRepository();

const bot = createBot({
  token: config()["DISCORD_BOT_TOKEN"],
  intents: GatewayIntents.MessageContent | GatewayIntents.Guilds |
    GatewayIntents.GuildMessages,
  events: {
    ready(bot) {
      console.log("Successfully connected to gateway");
      bot.helpers.createApplicationCommand(pingCommand);
      bot.helpers.createApplicationCommand(startRecordingCommand);
    },
    interactionCreate(client, interaction) {
      handlePingCommand(client, interaction);
      handleStartRecordingCommand(
        client,
        interaction,
        recordingChannelRepository,
      );
    },
    messageCreate(_, message) {
      handleMessageToRecord(message, recordingChannelRepository);
    },
  },
});

await startBot(bot);
