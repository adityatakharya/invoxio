import { Kafka, Producer } from "kafkajs";
import dotenv from 'dotenv';
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";

dotenv.config();

const kafka = new Kafka({
    brokers: [process.env.KAFKABROKER as string],
    ssl: {
        ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
    },
    sasl: {
        username: process.env.KAFKA_SASL_USERNAME as string,
        password: process.env.KAFKA_SASL_PASSWORD as string,
        mechanism: "plain",
    },
})

let producer: null | Producer = null;

export async function createProducer(){
    if(producer) return producer;

    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message: string, channel: string){
    const producer = await createProducer();
    
    await producer.send({
        topic: "MESSAGES",
        messages: [
            { 
                key: `message-${Date.now()}`,
                value: message,
                headers: {
                    room: channel,
                },
            },
        ]
    })

}

export async function startConsumer(){
    const consumer = kafka.consumer({groupId: "default"});
    await consumer.connect();
    await consumer.subscribe({topic: "MESSAGES"})
    await consumer.run({
        autoCommit: true,
        autoCommitInterval: 1 * 60 * 1000,
        eachMessage: async ({message, pause}) => {
            if(!message.value || !message.headers?.room) return;
            console.log("Inside startConsumer. Pushing to database: ", message.value);
            try{
                await prismaClient.message.create({
                    data: {
                        text: message.value?.toString(),
                        room: message.headers?.room?.toString(),
                    }
                })
            }
            catch(err){
                console.log("Something went wrong with Kafka Consumer Process. ", err);
                pause();
                setTimeout(() => {consumer.resume([{topic: 'MESSAGES'}])}, 60 * 1000)
            }
        }
    })
}

export default kafka;