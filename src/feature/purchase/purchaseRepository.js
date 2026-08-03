import { getDB } from "../../config/db.js";
import { ApplicationError } from "../../errorHandling/applicationErrorHandling.js";

export default class{

    async insert(productId, qty, unit_price){
        try{
            const query = `INSERT INTO inventory_batches (product_id, purchase_quantity, remaining_quantity
            , price_per_unit)VALUES ($1, $2, $3, $4)RETURNING *;`;
            const values = [productId, qty, qty, unit_price];
            const newBatch =  await getDB().query(query, values)
        return newBatch.rows[0];

        }catch{err}{
            throw new ApplicationError("something wend wrong batch not created", 500);
        }
    }
}