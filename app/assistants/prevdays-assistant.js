function PrevdaysAssistant() {
	
}
PrevdaysAssistant.prototype.getAll = function(transaction, results){

	this.date_list = [];
	var pre_datelist;
	for(x = 0; x < results.rows.length; x++){
		var date_item = results.rows.item(x).pubdate;
		
		var parsed_item = halp.mysqlToMilspec(date_item);
		
		pre_datelist = {date:parsed_item};
		
		this.date_list[x] = pre_datelist;
	}
	this.getAllMdl = { items : this.date_list };
	
	this.controller.setWidgetModel( "prevlist", this.getAllMdl );
	
}
PrevdaysAssistant.prototype.setup = function() {
	//sql call for all items
	var sqlGetAll = "SELECT DISTINCT pubdate FROM calotto ORDER BY id DESC; GO;";
	
		//Mojo.Log.info("sqlGetAll: " + sqlGetAll);
		halp.molog("sqlGetAll: " + sqlGetAll);
		
		dao.db.transaction((function(transaction){
			transaction.executeSql(
				sqlGetAll,
				 [],
				this.getAll.bind(this),
				this.deNada.bind(this)
			);
		}.bind(this)));
	this.prevDaysMdl = { items:[]};
	this.prevlistAttr = {
		itemTemplate: 'prevdays/prevlistentry',
		listTemplate: 'prevdays/prevlistcontainer',
		swipeToDelete: false,
		reorderable: false

	};
	
	this.controller.setupWidget("clearallButton", {}, 
	this.clearButtonModel = {
			"label" : "Clear All",
			"buttonClass" : "",
			"disabled" : false,
		});
	
	this.controller.setupWidget("prevlist", this.prevlistAttr, this.prevDaysMdl);
	
	this.controller.listen("prevlist", Mojo.Event.listTap, this.handleButtonPress.bindAsEventListener(this));
	Mojo.Event.listen(this.controller.get("clearallButton"), Mojo.Event.tap, this.clearButton.bindAsEventListener(this));
};
PrevdaysAssistant.prototype.deNada = function(event){

	this.specMsg = "Sorry, there currently isn't any data to show.  Give it a few days and the data will gradually file in.";
	Mojo.Controller.errorDialog(this.specMsg);

};
PrevdaysAssistant.prototype.clearButton = function(event){
	halp.molog("reached the clear button");
	
	var sqlClear = "DROP TABLE calotto; GO;";
	
	halp.molog("sqlClear: " + sqlClear);
	
	dao.db.transaction(function(transaction){
			transaction.executeSql(
				sqlClear,
				 [],
				this.clearedTable.bind(this),
				this.clearedTableErr.bind(this)
			);
	}.bind(this));
};
PrevdaysAssistant.prototype.clearedTable = function(event){
	halp.molog("blah blah blah");
	this.controller.stageController.popScene();
};
PrevdaysAssistant.prototype.clearedTableErr = function(event){
	this.controller.stageController.popScene();
};
PrevdaysAssistant.prototype.handleButtonPress = function(event){

	var mysqled_date = halp.milspecToMysql(event.item.date);
	
	var sqlByDate = "SELECT * FROM calotto WHERE pubdate='" + mysqled_date + "'; GO;";

	halp.molog("sqlByDate: " + sqlByDate);
	
	dao.db.transaction(function(transaction){
			transaction.executeSql(
				sqlByDate,
				 [],
				this.jumpToPrevSolo.bind(this),
				dao.errorHandler
			);
		}.bind(this));
};
PrevdaysAssistant.prototype.jumpToPrevSolo = function(transaction,results){
	halp.molog(results.rows.item(0).id);
	
	this.controller.stageController.pushScene('prev-solo', results);
};
PrevdaysAssistant.prototype.activate = function(event) {

};

PrevdaysAssistant.prototype.deactivate = function(event) {

};

PrevdaysAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get("prevlist"), Mojo.Event.listTap, this.handleButtonPress);
	Mojo.Event.stopListening(this.controller.get("clearallButton"), Mojo.Event.tap, this.clearButton);
};
