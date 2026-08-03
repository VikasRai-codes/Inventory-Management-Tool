import transactionRepository from "./transactionRepository.js";

export default class userController{
    constructor(){
        this.transactionRepositer = new transactionRepository();
    }

    async getTransections(req, res){
        try{
            const purData = await this.transactionRepositer.getAllPurchases();
            const saleData = await this.transactionRepositer.getAllSales();
            const transactions = [...purData, ...saleData].sort((a, b)=>
                new Date(a.timestamp) - new Date(b.timestamp)
            );
            // res.status(200).json(transaction)
            res.status(200).render('transactions', {
                transactions,
                userName: req.session.userName
            });
        }catch(err){
            return res.status(500).send(err.message); 
        }    
    }

}