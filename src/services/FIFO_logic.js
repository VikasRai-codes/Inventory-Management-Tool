import pool from "../db.js";


export const createSale = async (req, res) => {

    const client = await pool.connect();

    try {

        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Invalid productId or quantity"
            });
        }

        // Start transaction
        await client.query("BEGIN");

        // 1. Get FIFO batches
        const batchResult = await client.query(
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

        const batches = batchResult.rows;

        // 2. Calculate total available stock
        const totalAvailable = batches.reduce(
            (total, batch) =>
                total + batch.remaining_quantity,
            0
        );

        // 3. Check stock
        if (totalAvailable < quantity) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Insufficient inventory",
                available: totalAvailable,
                requested: quantity
            });
        }

        // 4. Create sale
        const saleResult = await client.query(
            `
            INSERT INTO sales
            (product_id, quantity_sold, total_cost)
            VALUES ($1, $2, 0)
            RETURNING *
            `,
            [productId, quantity]
        );

        const sale = saleResult.rows[0];

        let remainingToSell = quantity;
        let totalCost = 0;

        // 5. FIFO processing
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
            await client.query(
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

            // 7. Record batch consumption
            await client.query(
                `
                INSERT INTO sale_batch_consumptions
                (
                    sale_id,
                    batch_id,
                    quantity_consumed,
                    cost_per_unit
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    sale.id,
                    batch.id,
                    quantityToConsume,
                    batch.price_per_unit
                ]
            );

            // 8. Reduce remaining sale quantity
            remainingToSell -= quantityToConsume;
        }

        // 9. Update total FIFO cost
        await client.query(
            `
            UPDATE sales
            SET total_cost = $1
            WHERE id = $2
            `,
            [
                totalCost,
                sale.id
            ]
        );

        // // 10. Commit transaction
        await client.query("COMMIT");

        return res.status(201).json({
            message: "Sale completed successfully",

            saleId: sale.id,

            productId,

            quantitySold: quantity,

            fifoCost: totalCost
        });

    } catch (error) {

        // Rollback if anything fails
        await client.query("ROLLBACK");

        console.error(error);

        return res.status(500).json({
            message: "Failed to create sale",
            error: error.message
        });

    } finally {

        client.release();
    }
};