import ColumnListItem from "sap/m/ColumnListItem";
import Table from "sap/m/Table";
import UIComponent from "sap/ui/core/UIComponent";
import Controller from "sap/ui/core/mvc/Controller";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";
import Context from "sap/ui/model/odata/v4/Context";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

/**
 * @namespace at.clouddna.zsapui5withodatav4.controller
 */
export default class Main extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        //this.getView().bindElement("/ZRAP_CV_BOOKS(BookGuid=4393d7c9-c6f0-1edf-91d7-1d7014266276,IsActiveEntity=false)")
    }

    /*public onAfterRendering(){
        let oTable = this.getView().byId("booksTable") as Table,
        oBinding = oTable.getBinding("items") as ListBinding,
        aFilter : Array<Filter> = [],
        aSorter : Array<Sorter> = [];
        //Werte dynamisch ermitteln und in das Filter-Array einfügen:
        let sRatingValue = 5;
        aFilter.push(new Filter("Rating", FilterOperator.EQ, sRatingValue));
        //Werte dynamisch ermitteln und in das Sorter-Array einfügen:
        aSorter.push(new Sorter("ISBN", true));
        //Auf das Aggregation Binding anwenden
        oBinding.filter(aFilter);
        oBinding.sort(aSorter);
    }*/

    private refresh(){
        //this.getView().byId("table").getBinding("items").refresh();
        //this.getView().getModel().refresh();
        (this.getView().getModel() as ODataModel).submitBatch("test");
    }

    private reset(){
        //this.getView().byId("table").getBinding("items").refresh();
        //this.getView().getModel().refresh();
        (this.getView().getModel() as ODataModel).resetChanges("test");
    }

    private onNavToDetail(oEvent: any) {
        let oRouter = (this.getOwnerComponent() as UIComponent).getRouter(),
            oListItem = oEvent.getSource() as ColumnListItem,
            oSourceBinding = oListItem.getBindingContext() as Context,
            sPath = oSourceBinding.getPath();
        oRouter.navTo("Detail", {
            path: encodeURIComponent(sPath)
        });
      }
      
    private onCreatePressed() {
        let oRouter = (this.getOwnerComponent() as UIComponent).getRouter()
        oRouter.navTo("Create");
    }
    
}