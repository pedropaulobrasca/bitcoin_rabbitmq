import { config } from "dotenv";
import { Channel, connect } from "amqplib";

config();

export const createMessageChannel = async (): Promise<Channel> => {
  try {
    const connection = await connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME);

    console.log("📬 Message channel created!");
    return channel;
  } catch (error) {
    console.log("❌ Error creating message channel!");
    console.error(error);
    return null;
  }
};
