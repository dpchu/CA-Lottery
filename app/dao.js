function DAO() {

	this.db = null;

	var dbase = "calotto";
	
	var sqlCreateTable = "CREATE TABLE IF NOT EXISTS calotto ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'unixts' TEXT, 'pubdate' TEXT, 'lottname' TEXT, 'draw' TEXT, 'date' TEXT, 'results' TEXT); GO;";
	
	var sqlExtractAll = null;

	this.init = function(){
		
		this.db = openDatabase(dbase, "", dbase);
		
		this.db.transaction((function (inTransaction) {
      		inTransaction.executeSql(sqlCreateTable, [], 
      		function() { }, 
      		dao.errorHandler); 
    	}));
		
		Mojo.Log.info('*********** db calotto created *************');
		
	};
	
	this.errorHandler = function(inTransaction, inError){	
		Mojo.Controller.errorDialog("Dao error - (" + inError.code + ") : " + inError.message);	
	};
	this.errorDBHandler = function(inTransaction, inError){	
		//Mojo.Controller.errorDialog("DB error - (" + inError.code + ") : " + inError.message);
		Mojo.Controller.stageController.popScene();	
	};		
};

var dao = new DAO();