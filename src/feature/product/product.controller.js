
import { getDB } from '../../config/db.js';

export default class productController{
    
    async addProduct(req, res){

        try{
            const {p_name,} = req.body;
            const query = `INSERT INTO products (p_name) VALUES ($1) RETURNING *;`;
            const result = await getDB().query(query, [p_name]);
            console.log("Product inserted: ", result.rows[0]);
            res.status(200).send(result.rows[0]);
        }catch(err){
            res.status(500).send(err.massage);
        }
    }

}