import { producer } from "../config/kafka.js";

export const sendInventoryEvent = async (event) => {
    try{
        await producer.send({
            topic: "inventory-events",
            messages: [
                {
                key: event.product_id,
                value: JSON.stringify(event)
                }
            ]
        });
        console.log("Event sent successfully from Producer:",event);
    } catch (error) {
        console.error("Producer Error:", error);
    }
};