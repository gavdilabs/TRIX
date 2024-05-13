import Controller from "sap/ui/core/mvc/Controller";

export default abstract class DataHelper{
    private viewController:Controller = undefined;

    constructor(viewController:Controller){
        this.viewController = viewController;
    }
}