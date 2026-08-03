import { getDB } from '../../config/db.js';
import { sendInventoryEvent } from "../../kafka/producer.js";
import purchaseRepository from './purchaseRepository.js';

export default class purchaseController{
    constructor() {
        this.purchaseRepositer = new purchaseRepository
    }

    async getPurchasePage(req, res){
        res.render('inventory_form',{
            success: null,
            error: null,
            userName: req.session.userName
        });
    }

    async addPurchase(req, res){
        console.log(req.body)
        try{
            const {productId, qty, unit_price} = req.body;
            const event = {
                productId,
                event_type: "Purchase",
                qty,
                unit_price,
                timesstamp: new Date().toISOString()
            }
            
            // to insert data into inventory batch
            const newBatch = await this.purchaseRepositer.insert(productId, qty, unit_price)
            // console.log(newBatch)
            await sendInventoryEvent(event);
    
            res.render('inventory_form', {
                success:"New Inventory Created  ",
                error: null,
                userName: req.session.userName
            })
        }catch(err){
            return res.status(parseInt(err.code)).json(err); 
        }    
    }

}