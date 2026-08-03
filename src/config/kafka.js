import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "inventory-service",
    brokers: ["localhost:9092"]
});

export const producer = kafka.producer();

export const consumer = kafka.consumer({
    groupId: "inventory-consumer-group"
});

export const startServer = async () => {
    await producer.connect();
    console.log("Kafka Producer Connected");
};
