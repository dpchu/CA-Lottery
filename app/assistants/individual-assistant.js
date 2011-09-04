function IndividualAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
   
}

IndividualAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	
	this.controller.serviceRequest('palm://com.palm.systemservice/time', {
	    method:"getSystemTime",
	    parameters:{},
	    onSuccess: this.onWin.bind(this),
	    onFailure: function(){Mojo.Log.info("Time service is Fail")}
	}); 
};

IndividualAssistant.prototype.onWin = function(event){

	var string = [event.utc + event.localtime.day];
	
	var mesplit = string.toString();
	
	var halfFirst = mesplit.substring(0, 4);
	var halfSecond = mesplit.substring(5,9);
	
	var timeSeconds = event.localtime.second;
	var timeSecondsPlus = event.localtime.second + 3;
	
	Mojo.Log.info("halfFirst is: " + halfFirst + ", halfSecond is: " + halfSecond);
	Mojo.Log.info("Local second is: " + timeSeconds + ", local minute is: " + timeSecondsPlus);
	
	//ifelse conditionals to stop errors when seconds or minutes are zero!
	
	
	
	if(timeSeconds > 0){
		var randFirst = [halfFirst * timeSeconds] * 42;	
	} else {
		var randFirst = [halfFirst * 3] * 42;
	}
	
	var randSecond = [halfSecond * timeSecondsPlus] * 42; 
	
	
	Mojo.Log.info("randFirst is: " + randFirst + ", randSecond is: " + randSecond);
	
	//more rand
	var randResult = [randFirst * randSecond] * 42;
	
	Mojo.Log.info("*********** Randomized: " + randResult);
	
	//turns int into string
	var rsplit = randResult.toString();
	
	//if string goes past 12 digits, cuts it off at 12 regardless
	rsplit = rsplit.substring(0, 12);
	
	//divvies up rsplit into 2 digit increments
	var pairOne = rsplit.substr(0,2);
	var pairTwo = rsplit.substr(2,2);
	var pairThree = rsplit.substr(4,2);
	var pairFour = rsplit.substr(6,2);
	var pairFive = rsplit.substr(8,2);
	var pairSix = rsplit.substr(10,2);
	
	//turns string into int
	var pairSixPlus = pairSix * 1;
	
	//addresses problem of 00's appearing at end of winningNum
	
	timeSecondsPlusOne = timeSeconds + 1;
	
	if(pairSixPlus < 1){
		pairSixPlus = pairSixPlus + timeSecondsPlusOne;
		pairSixPlus = pairSixPlus.toString();
		Mojo.Log.info("-------------pairsixplus first: " + pairSixPlus);
	} else {
		pairSixPlus = pairSixPlus.toString();
		
		Mojo.Log.info("pairsixplus second: " + pairSixPlus);
	}
	
	if((pairOne > 56) || (pairTwo > 56) || (pairThree > 56) || (pairFour > 56) || (pairFive > 56) || (pairSixPlus > 46)){
		
		var pairOne = (pairOne / 2) + 6;
		var pairTwo = (pairTwo / 2) + 6;
		var pairThree = (pairThree / 2) + 6;
		var pairFour = (pairFour / 2) + 6;
		var pairFive = (pairFive / 2) + 6;
		var pairSixPlus = (pairSixPlus / 3) + 13;
		
		var pairOne = Math.round(pairOne);
		var pairTwo = Math.round(pairTwo);
		var pairThree = Math.round(pairThree);
		var pairFour = Math.round(pairFour);
		var pairFive = Math.round(pairFive);
		var pairSixPlus = Math.round(pairSixPlus);

	}
	
	

	//addresses problem of blanks appearing in unexpected paired sections
	if((pairSixPlus < 2)){
		
		//Enter these numbers and you just might end up on a time traveling island...
		this.winningNum = "4-8-15-16-23-42";
		Mojo.Log.info("LOST!");
		
	} else {
		
		this.winningNum = pairOne + "-" + pairTwo + "-" + pairThree + "-" + pairFour + "-" + pairFive + "-" + pairSixPlus;
	}
	
	Mojo.Log.info("RandNum: " + this.winningNum);
	
	//sends winningNum to view
	this.controller.get("randNumGen").update(this.winningNum);
	
};

IndividualAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

IndividualAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

IndividualAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
