import * as amqp from 'amqplib/callback_api';
import { Helper } from '..';
import { RABBIT_CONFIG } from '../../config/config';
import chatService from '../../modules/chat/chat.service';
import { ChatInterface } from '../../interfaces';
class RabbitMq {
    public channel!: amqp.Channel;

    constructor() {
        this.connectToRabbitMq();
    }

    /**
     * Connects to RabbitMQ
     */
    private connectToRabbitMq() {
        try {
            const rabbitMqUrl: string = RABBIT_CONFIG.URL;
            amqp.connect(rabbitMqUrl, (_error: Error, connection: amqp.Connection) => {
                if (_error) { 
                    console.error("Error connecting to RabbitMQ:", _error);
                    return;
                }
                connection.createChannel((_error: Error, channel: amqp.Channel) => {
                    if (_error) { 
                        console.error("Error creating channel:", _error); 
                        return;
                    }
                    console.log('Connected to RabbitMQ successfully!');
                    this.channel = channel;
                    this.initializeQueues();
                });
            });
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }

    /**
     * Initializes queues
     */
    private initializeQueues() {
        this.assertQueue(RABBIT_CONFIG.MESSAGE_QUEUE);
        this.consumeQueue(RABBIT_CONFIG.MESSAGE_QUEUE);
       
    }

    /**
     * Sends data to a queue
     * @param queue The name of the queue
     * @param data The data to send
     * @returns The sent data
     */
    public sendToQueue(queue: string, data: ChatInterface.ChatInterface) {
        const jsonData = JSON.stringify(data);
        this.channel.sendToQueue(queue, Buffer.from(jsonData));
        Helper.Logger.createLog("info", `Data sent to ${queue}`, data);
        return jsonData;
    }

    /**
     * Consumes messages from a queue
     * @param queue The name of the queue
     */
    public async consumeQueue(queue: string) {
        this.channel.consume(queue, async (msg: any) => {
            const data:ChatInterface.ChatInterface= JSON.parse(msg.content.toString());
            // console.log("Rabbit Mq info", `Data consumed from ${queue}`, data)
            await chatService.insertMessage(data)
            this.channel.ack(msg);
        }, { noAck: false });
    }




    
    /**
     * Asserts the existence of a queue
     * @param queue The name of the queue
     */
    public assertQueue(queue: string) {
        this.channel.assertQueue(queue, {
            durable: false,
            // autoDelete: true,
            // messageTtl: 5 * 60 * 1000,
            // expires: 2 * 3600 * 1000,
        });
    }

}

export default new RabbitMq();