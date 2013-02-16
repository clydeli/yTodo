var cTodo = cTodo || {};

cTodo.Core = {
	// Core variables
	isOnline : navigator.online || true,

	// Core functions
	initialize : function(){
		console.log("Core initializing...");

		// Set remote DataAdapter to Google
		cTodo.Data.remoteAdapter = cTodo.Adapters.Google;

		if(Modernizr.localstorage) { cTodo.Data.initialize(); }
		else { alert("Your browser does not support localStorage") }

		// Initialize UI
		cTodo.UI.initialize();

		// Do core event binding
		this.eventBinding();
	},
	eventBinding : function(){ // Binding system events
		window.addEventListener('online', function(e) {
			this.isOnline = true;
			console.log("online");
			// Sync!
		}, false);
		window.addEventListener('offline', function(e) {
			this.isOnline = false;
			console.log("offline");
			// Maybe disable some functionality
		}, false);
	}
	//
	/*sync : function(taskID){
		if(taskID === undefined){
			// Sync all tasks
		} else {
			// Sync specified task
			// check version info on server -> replace(synced) or merge(not synced) with local version -> update task
		}
	}*/
};
