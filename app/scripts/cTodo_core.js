var cTodo = cTodo || {};

cTodo.Core = {
	// Core variables
	isOnline : navigator.online || true,

	// Core functions
	initialize : function(){
		console.log('Core initializing...');

		// Set remote DataAdapter to Google
		cTodo.Data.remoteAdapter = cTodo.Adapters.Google;

		// Alert message of lacking support on localStorage
		if(!Modernizr.localstorage) { alert('Your browser does not support localStorage'); }

		// Initilization
		cTodo.Data.initialize();
		cTodo.UI.initialize();

		// Do core event binding
		this.eventBinding();
	},
	eventBinding : function(){ // Binding system events
		window.addEventListener('online', function(e) {
			this.isOnline = true;
			console.log('Application is now online');
			// Sync!
		}, false);
		window.addEventListener('offline', function(e) {
			this.isOnline = false;
			console.log('Application is now offline');
			// Maybe disable some functionality
		}, false);
	}

};
