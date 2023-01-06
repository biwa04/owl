import { config, createBot, GatewayIntents, startBot } from "./deps.ts";
import { handlePingCommand, pingCommand } from "./commands/ping.ts";

const bot = createBot({
  token: config()["DISCORD_BOT_TOKEN"],
  intents: GatewayIntents.MessageContent,
  events: {
    ready(bot) {
      console.log("Successfully connected to gateway");
      bot.helpers.createApplicationCommand(pingCommand);
    },
    interactionCreate(client, interaction) {
      handlePingCommand(client, interaction);
    },
  },
});

await startBot(bot);
