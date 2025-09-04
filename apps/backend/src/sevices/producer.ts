
const { Kafka } = require("kafkajs");
export  async function runProducer() {
  const kafka = new Kafka({
    clientId: "my-producer",
    brokers: ["localhost:9092"],
  });

  const producer = kafka.producer();
  await producer.connect();

  
  await producer.send({
    topic: "test-topic",
    messages: [{ key: "key1", value: "Hello from Producer!" }],
  });

  console.log("✅ Message sent successfully");
  await producer.disconnect();
}


