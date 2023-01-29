import { config, createBot, GatewayIntents, startBot } from "./deps.ts";
import { handlePingCommand, pingCommand } from "./commands/ping.ts";
import { InMemoryRecordingChannelRepository } from "./objects/recording-channel.ts";
import {
  handleStartRecordingCommand,
  startRecordingCommand,
} from "./commands/start-recording.ts";
import { handleMessageToRecord } from "./commands/record.ts";
import { ScrapboxRepository } from "./objects/page.ts";
import { handleSaveCommand, saveCommand } from "./commands/save.ts";

const recordingChannelRepository = new InMemoryRecordingChannelRepository();
const pageRepository = new ScrapboxRepository();
const DISCORD_BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN") ||
  config()["DISCORD_BOT_TOKEN"];

const bot = createBot({
  token: DISCORD_BOT_TOKEN,
  intents: GatewayIntents.MessageContent | GatewayIntents.Guilds |
    GatewayIntents.GuildMessages,
  events: {
    ready(bot) {
      console.log("Successfully connected to gateway");
      bot.helpers.createApplicationCommand(pingCommand);
      bot.helpers.createApplicationCommand(startRecordingCommand);
      bot.helpers.createApplicationCommand(saveCommand);
    },
    interactionCreate(client, interaction) {
      handlePingCommand(client, interaction);
      handleStartRecordingCommand(
        client,
        interaction,
        recordingChannelRepository,
      );
      handleSaveCommand(
        client,
        interaction,
        recordingChannelRepository,
        pageRepository,
      );
    },
    messageCreate(_, message) {
      handleMessageToRecord(message, recordingChannelRepository);
    },
  },
});

await startBot(bot);
