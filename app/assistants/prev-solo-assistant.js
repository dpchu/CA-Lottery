function PrevSoloAssistant(results) {
	
	//this.singleScene = results;
	try{
		this.singleScene = results;
	} catch (e){
		Mojo.Log.info("so damn tiring " + e);
	}
	halp.molog("reached prev-solo!");
}

PrevSoloAssistant.prototype.setup = function() {
	//Mojo.Log.info(this.singleScene.items(0).draw);
		
		prevDaysList = [];
		
		this.forTitle = halp.mysqlToMilspec(this.singleScene.rows.item(0).pubdate);
		
		Mojo.Log.info("The Date pushed through: " + this.forTitle);
		
		for(z = 0; z < this.singleScene.rows.length; z++){
				
				var prevUnix = this.singleScene.rows.item(z).unixts;
				var prevLottname = this.singleScene.rows.item(z).lottname;
				var prevDraw = this.singleScene.rows.item(z).draw;
				var prevDate = this.singleScene.rows.item(z).date;
				var prevResult = this.singleScene.rows.item(z).results;
				
				var prevList = {name : prevLottname, draw : prevDraw, date : prevDate, result : prevResult};
				
				prevDaysList[z] = prevList;
		}
		
		this.prevDaysMdl = {
			items : prevDaysList
		};
		
		this.prevlistAttr = {
			itemTemplate: 'prev-solo/prev-solo-item',
			listTemplate: 'prev-solo/prev-solo-container',
			swipeToDelete: false,
			reorderable: false
	
		};
		
		if((!this.forTitle) && (!this.specMsg)){
		
			this.forTitle = "No data";
			this.specMsg = "Sorry, there currently isn't any data to show.  Give it a few days and the data will gradually file in.";
				
		}
		this.controller.get('newTitle').update("Date: " + this.forTitle);
		this.controller.get('aSpecialMsg').update(this.specMsg);
		this.controller.setupWidget("prevlist", this.prevlistAttr, this.prevDaysMdl);
		
};

PrevSoloAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

PrevSoloAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

PrevSoloAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	  
};
