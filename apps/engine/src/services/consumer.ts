import { Kafka, logLevel } from "kafkajs";

// consumer.js


export async function runConsumer() {
  const kafka = new Kafka({
    clientId: "my-consumer",
    brokers: ["localhost:9092"],
  });

  const consumer = kafka.consumer({ groupId: "test-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        key: message.key?.toString(),
        value: message?.value?.toString(),
      });
    },
  });
}

