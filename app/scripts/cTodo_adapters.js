var cTodo = cTodo || {};
cTodo.Adapters = {};

cTodo.Adapters.Google = {
	initialized : false,
	// cTodo registered info
	regInfo : {
		clientId : '207999260172.apps.googleusercontent.com',
		apiKey : 'AIzaSyAZOeBh5jP4UnYQyV2cZYjD69hwUIYxK3s',
		scope : 'https://www.googleapis.com/auth/tasks'
	},
	// User specific info
	userInfo : {
		listId : '',
		updated : '',
		localIdTable : {}, // table for matching local Id to Google tasks Id
		remoteIdTable : {} // table for matching Google tasks Id to local Id
	},

	// Global adapter functions
	initialize : function(){
		this.loadLocalInfo();
		gapi.client.setApiKey(this.regInfo.apiKey); // Optional : Set Google API key
		gapi.client.load('tasks', 'v1');
		this.oauth();
		this.initialized = true;
	},

	createTask : function(task, callback){

	},
	getTask : function(taskId, callback){

	},
	updateTask : function(taskId, task, callback){

	},
	deleteTask : function(taskId, callback){
		this.deleteIdPair(taskId);
		// Do something ... (make attrtibute "deleted" as true)
	},

	// Local storage functions
	saveLocalInfo : function(){
		if(!Modernizr.localstorage) { return false; }
		localStorage['adapter_info'] = JSON.stringify(this.userInfo);
	},
	loadLocalInfo : function(){
		if(!Modernizr.localstorage) { return false; }
		if(localStorage.hasOwnProperty('adapter_info')){
			this.userInfo = JSON.parse(localStorage['adapter_info']);
		}
	},
	createIdPair : function(localId, remoteId){
		this.userInfo.localIdTable[localId] = remoteId;
		this.userInfo.remoteIdTable[remoteId] = localId;
		this.saveLocalInfo();
	},
	deleteIdPair : function(localId){
		var remoteId = this.userInfo.localIdTable[localId];
		delete this.userInfo.localIdTable[localId];
		delete this.userInfo.remoteIdTable[remoteId];
		this.saveLocalInfo();
	},

	// Adapter authentication functions
	oauth : function(){
		gapi.auth.authorize(
			{ 'client_id': this.regInfo.clientId, 'scope': this.regInfo.scope },
			function() {
				console.log('login complete');
				console.log(gapi.auth.getToken());
			}
		);
    },
    checkToken : function(){ },
    refreshToken : function(){ },

    // Other adapter functions
	getLists : function(callback){
		var request = gapi.client.tasks.tasklists.list();
		request.execute( function(resp){ callback(resp); });
	},
	importTasks : function(listId){
		console.log(listId);
		var that = this; // reserve the this pointer to that...
		var request = gapi.client.tasks.tasks.list({ 'tasklist': listId });
		request.execute( function(resp){
			for(var i=0; i<resp.items.length; ++i){
				// check if the task item is already existed
				if(that.userInfo.remoteIdTable.hasOwnProperty(resp.items[i].id)) continue;
				var createdId = cTodo.Data.createTask( that.convertTask(resp.items[i]));
				that.createIdPair(createdId, resp.items[i].id);
				cTodo.UI.insertTask(cTodo.Data.getTask(createdId));
			}
		});
	},
	convertTask : function(googleTaskItem){
		return (new cTodo.Type.taskItem({
			title : googleTaskItem.title,
			status : googleTaskItem.status
		}));
	}
};
