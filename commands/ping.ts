import { Bot, Interaction, InteractionResponseTypes } from "../deps.ts";

export const pingCommand = {
  name: "ping",
  description: "ping pong",
};

function reactToPingCommand(_: Interaction): string {
  return "Pong!";
}

export function handlePingCommand(client: Bot, interaction: Interaction) {
  if (interaction.data?.name === "ping") {
    client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: { content: reactToPingCommand(interaction) },
    });
  }
}
