import ampq, { Connection, Channel } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || '';

let connection: Connection;
let channel: Channel;

export async function get_channel() {
  if (!channel) {
    connection = await ampq.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
  }
  return channel;
}

export async function close_connection() {
  if (connection) await connection.close();
}
