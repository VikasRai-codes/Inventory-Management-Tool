import dashRepository from "./dashboardRepository.js";

export default class dashController{
    constructor(){
        this.dashRepositer = new dashRepository();
    }

    async getDashboardData(req, res){
        try{
            const totalCount = await this.dashRepositer.getTotalProduct();
            const totalStock = await this.dashRepositer.getTotalStock();
            const inventoryValue = await this.dashRepositer.getInventoryValue();
            const formattedCost = Intl.NumberFormat("en-IN").format(inventoryValue);
            const inventoryList = await this.dashRepositer.getinventoryOverview();
          
            res.render('dashboard', {
                totalCount,
                totalStock,
                formattedCost, 
                inventoryList,
                userName: req.session.userName
            });
        }catch(err){
            res.status(parseInt(err.code)).send(err); 
        } 
        
    }
}