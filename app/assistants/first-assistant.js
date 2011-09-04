function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	
	this.items = []; 
	this.url = 'http://www.dchoung.com/calott/calott.xml';
	//this.url = 'http://www.dchoung.com/calott/calott_test18.xml'; //21thcd
	//this.url = 'http://www.dchoung.com/calott/calott_test19.xml'; //22th
	//this.url = 'http://www.dchoung.com/calott/calott_test20.xml'; //22th
 
 
};

FirstAssistant.prototype.setup = function() {
	
	
	
	this.controller.serviceRequest('palm://com.palm.systemservice/time', {
	    method:"getSystemTime",
	    parameters:{},
	    onSuccess: this.gimmieTime.bind(this),
	    onFailure: function(){Mojo.Log.info("service Time is FAIL.")}
	});   
		
	this.cmdMenuAttr = {
		spacerHeight: 0,
        menuClass: 'no-fade'
	};
	
	
	this.spinAttr = {
		spinnerSize: "large",
		
	};
	
	this.spinModel = {
		spinning: true,
	};
		
	this.controller.setupWidget("theSpinner", this.spinAttr,  this.spinModel);
	
	// a local object for list attributes
	this.lottolistAttributes = {
		itemTemplate: 'first/listentry',
		listTemplate: 'first/listcontainer',
		swipeToDelete: false,
		reorderable: false
	};
	
	this.controller.setupWidget(Mojo.Menu.appMenu, appmenuAttr, appmenuModel);
	
	this.lottolistModel = {items : []};
	
	this.controller.setupWidget("lottolist", this.lottolistAttributes, this.lottolistModel);
	
 	this.ajaxCall(event);
	
	this.controller.listen("randClick", Mojo.Event.tap, this.handleButtonPress.bind(this));
		
	this.controller.setupWidget(Mojo.Menu.commandMenu, this.cmdMenuAttr, this.cmdMenuMdl);
};

FirstAssistant.prototype.gimmieTime = function(event){

	var gYear = event.localtime.year;
	var gMonth = event.localtime.month;
	var gDay = event.localtime.day;
	var gSecond = event.localtime.second;
	this.gUtc = event.utc;
	this.gOffset = event.offset;
	
	this.theYMD = gYear + "-" + gMonth + "-" + gDay;
	
	//for testing
	
	//this.theYMD = '2011-1-1'; //test21
	//this.theYMD = '2011-1-2'; //test22
	//this.theYMD = '2011-1-3'; //test22
};


FirstAssistant.prototype.fireAway = function(event){
	
	Mojo.Log.info("FIRE AWAY" + event.command);
	
	if(event.command){
	
		var dayVar = event.command.toString();
		this.dayTurnStile(dayVar);
	/*	
		switch(dayVar){
			case "do-prevday":
				
				break;
	
			case "do-twoday":
				this.dayTurnStile(dayVar);
				break;
	
		}*/
	}
};
FirstAssistant.prototype.theDayproc = function(transaction,results){
	
	Mojo.Log.info("**************************** Crossed into theDayproc ****************************");
	Mojo.Log.info("See if data transferred: " + this.chosenDay);
	
	/*	plan is to extract unixts distinct, place data in a model,
		and then, running another query, use that specific model data
		to do more precise query, all to get the past 3 days.  if there's
		a better solution... */
	
	
		try{
			/* this try/catch is for when there's just one group entry in the db. */
			this.unixOther = results.rows.item(0).unixts;
			this.unixPubDate = results.rows.item(0).pubdate;
		} catch (e){
			Mojo.Log.info("theDayproc err: " + e);
			this.theAlertMSG();
			return;
		}
		if(this.unixOther){
			dayModel = [];
			
			Mojo.Log.info("Length is: " + results.rows.length);
			Mojo.Log.info(this.unixOther + ", " + this.unixPubDate);
			
			
			for(m = 0; m < results.rows.length; m++){
				
				var theNix = results.rows.item(m).unixts;
				var thePubdate = results.rows.item(m).pubdate;
				
				var theuts = { count : m, number : theNix , pdate : thePubdate};
				
				dayModel[m] = theuts
			}
			this.nuDayMdl = {
							items : dayModel
				};
			
			var slinky = Object.toJSON(this.nuDayMdl);
	
			Mojo.Log.info("Data for nuDayMdl: " + slinky + ", What is chosen day: " + this.chosenDay);
			
			switch(this.chosenDay){
				case "do-prevday":
					try{
						this.dayNumber = this.nuDayMdl.items[0].number;
					} catch (e){
						this.theAlertMSG();
						return;					
					}
					break;
			}	
			
			if(this.dayNumber){
				
				var sqlGetDay = "SELECT * FROM calotto WHERE unixts='" + this.dayNumber + "'; GO;";
				
				Mojo.Log.info("SQL for sqlGetDay: " + sqlGetDay);
				
				dao.db.transaction((function (transaction) {
					transaction.executeSql(sqlGetDay, [],
						this.theDayprocFinalStep.bind(this),
						dao.errorHandler
					);
				}).bind(this));	
				
			}
		}

};
FirstAssistant.prototype.theAlertMSG = function(event){
	Mojo.Log.info("No data beyond today.  Pushing showAlertDialog for brush off.");
		
			//this show alert dialog displays when there's nothing beyond the first day.  
		
		var currentScene = Mojo.Controller.stageController.activeScene();
		
		currentScene.showAlertDialog({
		    onChoose: function(inValue){},
		    title: $L("Sorry, there is no data beyond today"),
		    message: $L("Data from previous day will fill in gradually."),
		    choices:[
		        {label: "Ok", value:""}    
		    	]
		});
};

FirstAssistant.prototype.theDayprocFinalStep = function(transaction,results){
	Mojo.Log.info("**************************** Crossed into theDayprocFinalStep ****************************");
	/*	this is the function that does a query to get the specific day */
	
	/* passes model to the prevdays scene for display, w00t */
	this.controller.stageController.pushScene('prevdays', results);
	
};

FirstAssistant.prototype.dayTurnStile = function(event){

	/*	this func takes the specific 'day' command from fireAway and goes
		for a specific request */

	this.chosenDay = event;

	var sqlOneday = "SELECT DISTINCT unixts, pubdate FROM calotto WHERE pubdate !='" + this.theYMD + "' ORDER BY unixts DESC LIMIT 1; GO;";
	
	Mojo.Log.info("SQL for sqlOneday: " + sqlOneday);
	
	dao.db.transaction((function (transaction) {
		transaction.executeSql(sqlOneday, [],
			this.theDayproc.bind(this),
			dao.errorHandler
		);
	}).bind(this));		
};

FirstAssistant.prototype.handleButtonPress = function(event){
	
	this.controller.stageController.pushScene('individual');
	
};

FirstAssistant.prototype.ajaxCall = function(event){
	
	if (Mojo.Host.current === Mojo.Host.mojoHost) {
		// same original policy means we need to use the proxy on mojo-host
		this.url = '/proxy?url=' + encodeURIComponent(this.url);
	}
	
	var request = new Ajax.Request(this.url, 
		{
		method: 'get',
		evalJSON: 'false',
		onCreate: function(){Mojo.Log.info("ajax onCreated.")},
		onLoading: function(){Mojo.Log.info("ajax onLoading.")},
		onLoaded: function(){Mojo.Log.info("ajax onLoaded.")},
		onSuccess: function(){Mojo.Log.info("ajax onSuccessed.")},
		onComplete: this.callWin.bind(this),
		onFailure: function(){Mojo.Log.info("ajax onFailed.")},
		}
	);
};



FirstAssistant.prototype.callWin = function(transport){
		
	var xmlstring = transport.responseText;
	
	Mojo.Log.info("****** The XML string has loaded");
	
	//gets feed date, to be compared later
	var superNode = transport.responseXML.getElementsByTagName('pubDate');
	var feedDate = superNode[0].firstChild.nodeValue;
	
	this.xmlDate = feedDate;
	
	this.nodes = transport.responseXML.getElementsByTagName('item');
	
	var sqlcallWin = "SELECT * FROM calotto WHERE pubdate='" + this.theYMD + "'; GO;";
	var sqlcallAll = "SELECT * FROM calotto; GO;";
	
	Mojo.Log.info("SQL for sqlcallWin: " + sqlcallWin);
	
	dao.db.transaction((function (transaction) {
		transaction.executeSql(sqlcallWin, [],
			this.checkDate.bind(this),
			dao.errorHandler
		);
		/*
transaction.executeSql(sqlcallAll, [],
			this.allCall.bind(this),
			dao.errorHandler
		);
*/
	}).bind(this));	
};
FirstAssistant.prototype.allCall = function(transaction,results){
	/*	this is where we take the data and compare it to the current date, if
		there's any row older then 4 days ago, we delete it. */
	/*
for(y = 0; y < results.rows.length; y++){
	
		//3600-1hr, 7200- 2hrs, 86400-1day, 129600-1.5days, 172800- 2days, 259200- 3days, 345600- 4days
		var unixDiff = this.gUtc - 172800;  //gets utc of 2 hrs ago
		var allUnixTS = results.rows.item(y).unixts;  //gets unix ts column of db
		var unixResult = unixDiff - allUnixTS;  //utc of an hour ago minus utc timestamp in db
	
		if(allUnixTS < unixDiff){
	
			var sqlDelRows = "DELETE FROM calotto WHERE unixts <= '" + unixDiff + "'; GO;"
			
			Mojo.Log.info("SQL for sqlDelRows: " + sqlDelRows);
			
			dao.db.transaction((function (transaction) {
				transaction.executeSql(sqlDelRows, [],
					function(){Mojo.Log.info("Deleted old rows")},
					dao.errorHandler
				);
			}).bind(this));	
		}
	}
*/
	

};

FirstAssistant.prototype.checkDate = function(transaction,results){
	
	try {
		
		var chkDbDate = results.rows.item(0).pubdate;	
		
	} catch(e) {
		
		Mojo.Log.info("DB is empty.  Must insert data into the DB.");
		
	}
	if(chkDbDate == this.theYMD){
		
		Mojo.Log.info("********** XML Date is same as sysDate, going to extractDB. **********");
		
		this.extractDB(results);
		Mojo.Log.info("Stop here, all 3 dates should match. *** XML Date: " + this.xmlDate + " *** sysDate: " + this.theYMD + " *** DB Date: " + chkDbDate + " *** ");
		
	} else if(chkDbDate != this.theYMD){
	
		//func for inserting feed data into database.
		Mojo.Log.info("********** XML Date != sysDate, going to insFeed. **********");
		this.insFeed();
	}
};
FirstAssistant.prototype.checkDateSecond = function(transaction,results){

	//from insFeed, supposed to run only when there's no data in DB.	
	var chkDbDateSecond = results.rows.item(0).pubdate;
	
	this.extractDB(results);
	Mojo.Log.info("This func is meant for first dl and use. *** XML Date: " + this.xmlDate + " *** sysDate: " + this.theYMD + " *** DB Date: " + chkDbDateSecond + " ***");	
	
};
FirstAssistant.prototype.extractDB = function(results){

	//from checkDate function
	moreList = [];
		
		var unixDiffFour = this.negFourUTC;
		var unixUTC = this.gUtc;
		var unixMathfunk = unixUTC - 450;
		
		for(x = 0; x < results.rows.length; x++){
	
			var finUnix = results.rows.item(x).unixts;
			var finLottname = results.rows.item(x).lottname;
			var finDraw = results.rows.item(x).draw;
			var finDate = results.rows.item(x).date;
			var finResult = results.rows.item(x).results;
			
			var nuList = {name : finLottname, draw : finDraw, date : finDate, result : finResult};
			
			moreList[x] = nuList;
			
			//Mojo.Log.info("**** DB Date: " + finUnix + ", UNIX Date: " + unixUTC + ", Diff Date: " + unixMathfunk + " ****");
		}
		
		Mojo.Log.info("Reached extractDB, data pulled from DB.");
		
		//new model to replace lottolistModel
		this.newModel = {
					items : moreList
		};
		
		//sticks new model into lottolist widget
		this.controller.setWidgetModel("lottolist", this.newModel);
		
		//spinner
		this.controller.get("theSpinner").mojo.stop();
		
	

};
FirstAssistant.prototype.insFeed = function(results){

	//from checkDate function
	Mojo.Log.info("Reached insFeed, proceeding to insert feed data into DB.");

	var theUnixDate = this.gUtc;
	var nodesIn = this.nodes;
	var theXmlDate = this.xmlDate;

	dao.db.transaction((function (transaction) {
		for(i = 0; i < nodesIn.length; i++){
		
			var theName = nodesIn[i].childNodes[1].firstChild.nodeValue;
			var theDraw = nodesIn[i].childNodes[3].firstChild.nodeValue;
			var theDate = nodesIn[i].childNodes[5].firstChild.nodeValue;
			var theResult = nodesIn[i].childNodes[7].firstChild.nodeValue;
		
			var sqlinsFeed = "INSERT INTO calotto ('unixts', 'pubdate', 'lottname', 'draw', 'date', 'results') VALUES(?,?,?,?,?,?); GO;";
			
			
			//Mojo.Log.info("SQL for insFeed: " + sqlinsFeed);
	  		transaction.executeSql(sqlinsFeed, 
	  			[
	  				theUnixDate,
	  				theXmlDate,
	  				theName,
	  				theDraw,
	  				theDate,
	  				theResult
	  			], 
	  			function(){Mojo.Log.info('insertion success on ' + theXmlDate)}, 
	  			dao.errorHandler
	  		);
		}
	}).bind(this));
	
	/*this is for the first installation, when there's no data to extract from the db, so it needs to be inserted first, and then extracted.
	*/
	
	var sqlcheckDateSecond = "SELECT * FROM calotto WHERE pubdate='" + this.theYMD + "' LIMIT 7; GO;";
	
	Mojo.Log.info("SQL for checkDateSecond: " + sqlcheckDateSecond);
	
	dao.db.transaction((function (transaction) {
		transaction.executeSql(sqlcheckDateSecond, [],
			this.checkDateSecond.bind(this),
			dao.errorHandler
		);
	}).bind(this));

};

FirstAssistant.prototype.activate = function(event) {};

FirstAssistant.prototype.deactivate = function(event) {};

FirstAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get("randClick"), Mojo.Event.tap, this.handleButtonPress);
};
