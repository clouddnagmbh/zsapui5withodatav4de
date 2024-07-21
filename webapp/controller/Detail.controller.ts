import MessageBox, { Action } from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import Page from "sap/m/Page";
import Fragment from "sap/ui/core/Fragment";
import UIComponent from "sap/ui/core/UIComponent";
import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

/**
 * @namespace at.clouddna.zsapui5withodatav4.controller
 */
export default class Detail extends Controller {
  private aFragments: any = {};
  private oEditModel: JSONModel;

  public onInit(): void {
    let oOwnerComponent = this.getOwnerComponent() as UIComponent;
    oOwnerComponent.getRouter().getRoute("Detail").attachPatternMatched(this.onPatternMatched, this);
    oOwnerComponent.getRouter().getRoute("Create").attachPatternMatched(this.onCreatePatternMatched, this);

  }

  private onPatternMatched(oEvent: any) {
    let oArguments = oEvent.getParameters().arguments,
      sPath = decodeURIComponent(oArguments.path);
    this.getView().bindElement({
      path: sPath,
      parameters: {
        "$$updateGroupId": "updateBook"
      }
    });
    this.oEditModel = new JSONModel({
      editMode: false,
      create: false
    });
    this.getView().setModel(this.oEditModel, "editModel");
    this._loadFragment("Display");
  }

  private onCreatePatternMatched(oEvent: any) {
    let oModel = this.getView().getModel(),
      oListBinding = oModel.bindList("/ZRAP_CV_BOOKS") as ODataListBinding,
      oCreateContext = oListBinding.create();
    oCreateContext.created().then(() => {
      this.getView().bindElement({
        path: oCreateContext.getPath(),
        parameters: {
          "$$updateGroupId": "updateBook"
        }
      });
    });
    this.oEditModel = new JSONModel({
      editMode: true,
      create: true
    });
    this.getView().setModel(this.oEditModel, "editModel");
    this._loadFragment("Edit");
  }



  private _loadFragment(sFragmentName: string) {
    let oPage = (this.getView().byId("page") as Page);
    oPage.removeAllContent();
    if (this.aFragments[sFragmentName]) {
      oPage.addContent(this.aFragments[sFragmentName]);
    } else {
      Fragment.load({
        id: Fragment.createId(this.getView().getId(), sFragmentName),
        name: "at.clouddna.zsapui5withodatav4.view.fragment." + sFragmentName,
        type: "XML",
        controller: this
      }).then((oFragment: any) => {
        this.aFragments[sFragmentName] = oFragment;
        oPage.addContent(oFragment);
      });
    }
  }

  private onEditPressed() {
    this._onSwitchEdit();
  }
  private _onSwitchEdit() {
    let bNewMode = !this.oEditModel.getProperty("/editMode");
    this.oEditModel.setProperty("/editMode", bNewMode);
    this._loadFragment(bNewMode ? "Edit" : "Display");
  }

  private onSavePressed() {
    (this.getView().getModel() as ODataModel).submitBatch("updateBook").then(
      () => {
        MessageToast.show("Erfolgreich gespeichert!");
        this._onSwitchEdit();
      },
      (oError: any) => {
        MessageBox.error("Ein unerwarteter Fehler ist aufgetreten!");
      }
    );
  }

  private onCancelPressed() {
    (this.getView().getModel() as ODataModel).resetChanges("updateBook");
    this._onSwitchEdit();
    if(this.oEditModel.getProperty("/create")){
      this.onNavBack();
  }
  }

  private onDeletePressed() {
    let oElementBinding = this.getView().getElementBinding().getBoundContext() as any,
      i18nModel = this.getView().getModel("i18n"),
      oResourceBundle = (i18nModel as any).getResourceBundle(),
      sText = oResourceBundle.getText("deleteQuestion");
    MessageBox.confirm(sText, {
      actions: [Action.YES, Action.NO],
      emphasizedAction: Action.YES,
      onClose: (sAction: string) => {
        if (Action.YES === sAction) {
          oElementBinding.delete("updateBook").then(
            () => {
              this.onNavBack();
            },
            (oError: any) => {
              MessageBox.error("Ein unerwarteter Fehler ist aufgetreten!");
            }
          );
        }
      }
    });
  }

  private onNavBack() {
    let oHistory = History.getInstance(),
      sPreviousHash = oHistory.getPreviousHash();
    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      let oRouter = (this.getOwnerComponent() as UIComponent).getRouter();
      oRouter.navTo("Main", {}, undefined, true);
    }
  }


}