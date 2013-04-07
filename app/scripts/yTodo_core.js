var ytodo = ytodo || {};

ytodo.Core = (function(window){

	var
		eventBinding = function(){ // Binding system events
			window.addEventListener('online', function(e) {
				console.log('Application is now online');
				// Sync!
			}, false);
			window.addEventListener('offline', function(e) {
				console.log('Application is now offline');
				// Maybe disable some functionality
			}, false);
		},

		initialize = function(){
			console.log('Core initializing...');

			// Alert message of lacking support on localStorage
			if(!Modernizr.localstorage) { alert('Your browser does not support localStorage'); }

			// Initilization
			ytodo.Data.initialize(ytodo.Adapters.Google);
			ytodo.UI.initialize();

			// Do core event binding
			eventBinding();
		};


	// Core functions
	return {
		initialize : initialize
	}

})(window);
