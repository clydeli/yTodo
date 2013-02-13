var cTodo = cTodo || {};
cTodo.Adapters = {};

cTodo.Adapters.Google = {
	// cTodo registered info
	regInfo : {
		clientId : "207999260172.apps.googleusercontent.com",
		apiKey : 'AIzaSyAZOeBh5jP4UnYQyV2cZYjD69hwUIYxK3s',
		scope : 'https://www.googleapis.com/auth/tasks'
	},
	// User specific info
	userInfo : {
		listId : "",
		updated : "",
		idTable : {} // A table for matching local Id to Google tasks Id
	},

	//
	auth : function(){
		var config = {
			'client_id': this.regInfo.clientId,
			'scope': this.regInfo.scope
		};
		gapi.auth.authorize(config, function() {
			console.log('login complete');
			console.log(gapi.auth.getToken());
		});
    },

	// Global adapter functions
	initialize : function(){
		gapi.client.setApiKey(this.regInfo.apiKey);
	},
	createTask : function(task, callback){

	},
	getTask : function(taskId, callback){

	},
	updateTask : function(taskId, task, callback){

	},
	deleteTask : function(taskId, callback){
		// Make attrtibute "deleted" as true
	}
}
