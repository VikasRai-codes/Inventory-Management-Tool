import { getDB } from "../../config/db.js";
import salesRepository from "./salesRepository.js";
import { get_FIFO_batches, FIFO_processing } from "../../services/FIFO.js";
import { sendInventoryEvent } from "../../kafka/producer.js";

export default class salesController{
    constructor(){
        this.salesRepositer = new salesRepository();
    }

    async renderSalePage(req, res){
        res.render('sale_form',{
            success: null,
            error: null,
            userName: req.session.userName
        })
    }

    async addSales(req,res){
        const{productId, quantity} = req.body;
        try{
            // Validate input
            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({
                    message: "Invalid productId or quantity"
                });
            }
            // Start transaction
            await getDB().query("BEGIN");

            // Get FIFO batches
            const batches = await get_FIFO_batches(productId);
            console.log("batches:", batches)
            
            // Calculate total available stock
            const totalAvailable = batches.reduce(
                (total, batch) =>
                    total += batch.remaining_quantity
                ,0);
    
            // check stock
            if(totalAvailable < quantity){
                 await getDB().query("ROLLBACK");
                return res.status(404).json({
                                message: "Insufficient inventory",
                                available: totalAvailable,
                                requested: quantity
                            });
            }
            const totalCost = await FIFO_processing(batches, quantity);
            const sale = await this.salesRepositer.createSale(productId, quantity, totalCost);

            // 10. Commit transaction
            await getDB().query("COMMIT");
            const event = {
                productId,
                "event_type": "sale",
                "sale_qunatity": sale.qty_sold,
                "total_cost": sale.total_cost,
                "timestamp": new Date().toISOString()
            }
            await sendInventoryEvent(event);

            // return res.status(201).json({
            // message: "Sale completed successfully",
            // sale
            //  });

             res.render('sale_form',{
                 success: "Sale transaction has been saved.",
                 error: null,
                 userName: req.session.userName
             })
        }catch (err) {
            // Rollback if anything fails
            await getDB().query("ROLLBACK");
            console.error(err);
            return res.status(500).json({
                message: "Failed to create sale",
                error: err.message
            });
        } finally {
            // getDB().release();
        }
    }
}