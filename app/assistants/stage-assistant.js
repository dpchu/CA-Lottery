function StageAssistant() {
	
}

StageAssistant.prototype.setup = function() {

	dao.init();
	
	appmenuAttr = {omitDefaultItems: true};
    appmenuModel = {
        visible: true,
        items: [ 
            Mojo.Menu.editItem,
            {label: "Previous Days", command: 'do-prevdays'},
            {label: "Other Cool Apps", command: 'do-othercool'},
            { label: "About", command: 'do-about' }
        ]
    };
	
	appmenuSubModel = {
		 visible: true,
        items: [ 
            Mojo.Menu.editItem,
            {label: "Previous Days", command: 'do-prevdays'},
            { label: "About", command: 'do-about' }
        ]
	}

	this.controller.pushScene("first");
   
};
StageAssistant.prototype.handleCommand = function(event){

	var currentScene = Mojo.Controller.stageController.activeScene();
	
	this.appTitle = Object.toJSON(Mojo.appInfo.title);
	this.appVersion = Object.toJSON(Mojo.appInfo.version);
	this.appVendor = Object.toJSON(Mojo.appInfo.vendor);
	
	if (event.type === Mojo.Event.command) {
        switch (event.command) {
            case 'do-othercool':
            	this.controller.pushScene('othercool');
            	break;
            	
            case 'do-prevdays':
            	this.controller.pushScene('prevdays');	
            	break;
            	
            case 'do-about':
            	currentScene.showAlertDialog({
			    onChoose: function(inValue){},
			    title: $L(this.appTitle),
			    message: $L("Version: " + this.appVersion + " by " + this.appVendor),
			    choices:[
			        {label: "Ok", value:""}    
			    	]
				});
				break;
				
				
    	}
    }
};
