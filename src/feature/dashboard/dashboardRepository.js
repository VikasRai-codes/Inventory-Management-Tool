import { getDB } from "../../config/db.js";

export default class dashRepository{
    
    async getTotalProduct(){

        try{
            const result = await getDB().query(`SELECT COUNT(*) AS total_products FROM products;`); 
            return result.rows[0].total_products;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getTotalStock(){
        try{
            const result = await getDB().query(`SELECT COALESCE(SUM(remaining_quantity), 0) AS total_stock
            FROM inventory_batches;`);
            return result.rows[0].total_stock;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getInventoryValue(){
        try{
            const result = await getDB().query(`SELECT COALESCE(SUM(remaining_quantity * price_per_unit),0) 
                AS total_inventory_value FROM inventory_batches;`)
                return result.rows[0].total_inventory_value;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getinventoryOverview(){
        try{
            const result = await getDB().query(`SELECT product_id, SUM(remaining_quantity) AS total_qty,
            SUM(remaining_quantity * price_per_unit) AS total_cost, ROUND(SUM(remaining_quantity * price_per_unit)/ 
            NULLIF(SUM(remaining_quantity), 0), 2) AS average_cost FROM inventory_batches GROUP BY product_id ORDER BY product_id;`);    
            // console.log( "result: -",result.rows);
            return result.rows;    
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
}