import {getDB} from '../../config/db.js';
import { ApplicationError } from "../../errorHandling/applicationErrorHandling.js";

export default class salesRepository {

    async createSale(productId, quantity, totalCost){
        console.log("create sale in")
        try{
                // Create sale
                const saleResult = await getDB().query(
                `
                INSERT INTO sales
                (product_id, qty_sold, total_cost)
                VALUES ($1, $2, $3)
                RETURNING *
                `,
                [productId, quantity, totalCost]

            );
            return saleResult.rows[0];
        }catch(err){
             throw new ApplicationError('Something went worng with sale table', 500);
        }
    }

}