import { getDB } from "../../config/db.js";
import { ApplicationError } from "../../errorHandling/applicationErrorHandling.js";

export default class{

    async getAllPurchases(){

        try{
            const result = await getDB().query(`SELECT product_id, remaining_quantity AS qty, price_per_unit AS unit_cost, purchased_at AS timestamp
                FROM inventory_batches ORDER BY purchased_at ASC;`);

            const purList = result.rows.map(pur =>({
                ...pur,
                type: "PURCHASE",
                fifo: '-'
            }));
            
            return purList;
        }catch{err}{
            console.log(err)
            throw new ApplicationError("something went wrong with database", 500);
        }
    }

    async getAllSales(){
        try{
           const result = await getDB().query(`SELECT product_id, qty_sold AS qty,total_cost AS fifo, sold_at AS timestamp
                FROM sales ORDER BY sold_at ASC;`);
            const saleList = result.rows.map(sale =>({
                ...sale,
                type: "SALE",
                unit_cost: '-'
            }));
            return saleList;

        }catch{err}{
            throw new ApplicationError("something went wrong with database", 500);
        }
    }
}