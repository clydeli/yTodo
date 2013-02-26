var cTodo = cTodo || {};

cTodo.Data = {
	// Data variables
	remoteAdapter : {}, // Remote Database Adapter
	localTasks : {},

	// Data functions
	initialize : function(){
		this.storageLoad();
	},

	// Data CRUD functions
	createTask : function(task){
		// Generate a random Id (until no Id clash) for the task
		do { task.id = (((1+Math.random())*0x10000)|0).toString(16).slice(1);
		} while( this.localTasks.hasOwnProperty(task.id) );
		// Save and return the generated task Id
		this.localTasks[task.id] = task;
		this.storageSave(task.id);
		return task.id;
	},
	getTask : function(taskId){
		if(!this.localTasks.hasOwnProperty(taskId)){ return false; }
		return this.localTasks[taskId];
	},
	updateTask : function(taskId, partialTask){
		if(!this.localTasks.hasOwnProperty(taskId)){ return false; }
		for(var key in partialTask){ this.localTasks[taskId][key] = partialTask[key]; }
		this.storageSave(taskId);
	},
	deleteTask : function(taskId){
		if(!this.localTasks.hasOwnProperty(taskId)){ return false; }
		delete this.localTasks[taskId];
		this.storageDelete(taskId);
		if(this.remoteAdapter.initialized){ this.remoteAdapter.deleteTask(taskId); }
	},

	// HTML5 local storage functions
	storageLoad : function(){ // Initialize Data with localStorage when possible
		if(!Modernizr.localstorage) { return false; }
		for(var storedTaskKeys in localStorage){
			if(/^task_/.test(storedTaskKeys)){ // If the key starts with "task_"
				this.localTasks[storedTaskKeys.slice(5)] = JSON.parse(localStorage[storedTaskKeys]);
			}
		}
	},
	storageSave : function(taskId){ // Save Data in localStorage when possible
		if(!Modernizr.localstorage) { return false; }
		if(taskId === undefined){ // Save all local tasks
			for(var localTaskId in this.localTasks){
				localStorage['task_'+localTaskId] = JSON.stringify(this.localTasks[localTaskId]);
			}
		} else{ localStorage['task_'+taskId] = JSON.stringify(this.localTasks[taskId]); }
	},
	storageDelete : function(taskId){
		if(!Modernizr.localstorage) { return false; }
		delete localStorage['task_'+taskId];
	}
};
