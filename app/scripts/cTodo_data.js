var cTodo = cTodo || {};

cTodo.Data = {
	// Data variables
	remoteAdpater : {},
	localTasks : {},

	// Data functions
	load : function(){ // Initialize Data with localStorage when possible
		if (!(('localStorage' in window) && window.localStorage !== null)) { return false; }
		var storedEntry;
		for( storedEntry in localStorage){
			if(/^task_/.test(storedEntry)){
				this.localTasks[storedEntry.slice(5)] = JSON.parse(localStorage[storedEntry]);
			}
		}
	},
	save : function(taskId){ // Save Data with localStorage when possible
		if (!(('localStorage' in window) && window.localStorage !== null)) { return false; }
		if(taskId === undefined){ // Save all local tasks
			var localTaskId;
			for( localTaskId in this.localTasks){
				localStorage["task_"+localTaskId] = JSON.stringify(this.localTasks[localTaskId]);
			}
		} else{ localStorage["task_"+taskId] = JSON.stringify(this.localTasks[taskId]); }
	},
	createTask : function(task){
		// Generate a random Id (until no Id clash) for the task
		do { task.id = (((1+Math.random())*0x10000)|0).toString(16).slice(1);
		} while( this.localTasks.hasOwnProperty(task.id) )
		this.localTasks[task.id] = task;
	},
	getTask : function(taskId){
		if(!this.localTasks.hasOwnProperty(taskId)){ return false; }
		return this.localTasks[taskId];
	},
	updateTask : function(taskId, partialTask){
		if(!this.localTasks.hasOwnProperty(taskId)){ return false; }
		var key;
		for(key in partialTask){ this.localTasks[taskId][key] = partialTask[key]; }
	},
	deleteTask : function(taskId){
		if(!this.localTasks.hasOwnProperty(taskId)){ return false; }
		delete this.localTasks[taskId];
	}
};
