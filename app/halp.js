function Halp() {

	this.fObj = function(data){
		//testing function
		Object.toJSON(data);
	};
	
	this.molog = function(data){
		//logging
		Mojo.Log.info("********** " + data + " **********");
	};
	
	this.mologWithfObj = function(comments,data){
		halp.molog("********** " + comments + ": " + Object.toJSON(data) + " **********");
	};
	
	//date formatting
	this.mysqlToMilspec = function(date){
		//re-orders into month/day/year
		
		var date_parse = date.split('-');
		
		var date_string = date_parse[1] + "/" + date_parse[2] + "/" + date_parse[0];
		
		return date_string;	
	};
	
	this.milspecToMysql = function(date){
		//re-orders back to mysql timestamp
		
		var parseFromMilspec = date.split('/');
		
		var backToMysql = parseFromMilspec[2] + "-" + parseFromMilspec[0] + "-" + parseFromMilspec[1];	
		
		return backToMysql;
	};
};

var halp = new Halp();