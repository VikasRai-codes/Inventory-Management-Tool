import { getDB } from "../config/db.js";

export async function get_FIFO_batches(productId){

     const batchResult = await getDB().query(
            `
            SELECT *
            FROM inventory_batches
            WHERE product_id = $1
            AND remaining_quantity > 0
            ORDER BY purchased_at ASC, id ASC
            FOR UPDATE
            `,
            [productId]
        );
        return batchResult.rows;
}

export async function FIFO_processing(batches, quantity) {
    let remainingToSell = quantity;
    let totalCost = 0;
    for (const batch of batches) {

            if (remainingToSell <= 0) {
                break;
            }

            // Decide quantity from this batch
            const quantityToConsume = Math.min(
                remainingToSell,
                batch.remaining_quantity
            );

            // Calculate cost
            const batchCost =
                quantityToConsume *
                Number(batch.price_per_unit);

            // Add to total FIFO cost
            totalCost += batchCost;

            // 6. Update batch
            await getDB().query(
                `
                UPDATE inventory_batches
                SET remaining_quantity =
                    remaining_quantity - $1
                WHERE id = $2
                `,
                [
                    quantityToConsume,
                    batch.id
                ]
            );

            // Reduce remaining sale quantity
            remainingToSell -= quantityToConsume;
        }
    return totalCost;
}
