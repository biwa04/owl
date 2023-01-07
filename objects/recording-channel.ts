export type RecordingChannel = {
  guildID: bigint;
  channelID: bigint;
  messages: string[];
};

export function addMessage(
  channel: RecordingChannel,
  msg: string,
): RecordingChannel {
  return {
    guildID: channel.guildID,
    channelID: channel.channelID,
    messages: channel.messages.concat([msg]),
  };
}

export interface RecordingChannelRepository {
  save(channel: RecordingChannel): Promise<void>;
  find(guildID: bigint, channelID: bigint): Promise<RecordingChannel>;
}

export class InMemoryRecordingChannelRepository
  implements RecordingChannelRepository {
  data: Map<bigint, Map<bigint, RecordingChannel>>;

  constructor() {
    this.data = new Map<bigint, Map<bigint, RecordingChannel>>();
  }

  save(channel: RecordingChannel): Promise<void> {
    return new Promise(() => {
      const map = new Map<bigint, RecordingChannel>().set(
        channel.channelID,
        channel,
      );

      this.data.set(
        channel.guildID,
        map,
      );
    });
  }

  find(guildID: bigint, channelID: bigint): Promise<RecordingChannel> {
    return new Promise((resolve, reject) => {
      const channels = this.data.get(guildID);
      if (channels === undefined) {
        reject(new Error("Undefined"));
        return;
      }

      const channel = channels.get(channelID);
      if (channel === undefined) {
        reject(new Error("Undefined"));
        return;
      }

      resolve(channel);
    });
  }
}
