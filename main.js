'use strict';

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['XXXXXX.servicebus.windows.net:9093'],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: '$ConnectionString',
        password: 'Endpoint=sb://XXXXXX.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXX'
    }
});

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'test', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ _topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        }
    });
  };

  run().catch(console.error)
