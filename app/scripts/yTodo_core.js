var ytodo = ytodo || {};

ytodo.Core = (function(window){

	var
		// Core variables
		isOnline = navigator.online || true,

		eventBinding = function(){ // Binding system events
			window.addEventListener('online', function(e) {
				isOnline = true;
				console.log('Application is now online');
				// Sync!
			}, false);
			window.addEventListener('offline', function(e) {
				isOnline = false;
				console.log('Application is now offline');
				// Maybe disable some functionality
			}, false);
		},

		initialize = function(){
			console.log('Core initializing...');

			// Set remote DataAdapter to Google
			//ctodo.Data.remoteAdapter = ctodo.Adapters.Google;

			// Alert message of lacking support on localStorage
			if(!Modernizr.localstorage) { alert('Your browser does not support localStorage'); }

			// Initilization
			ytodo.Data.initialize();
			ytodo.UI.initialize();

			// Do core event binding
			eventBinding();
		};


	// Core functions
	return {
		initialize : initialize
	}

})(window);
