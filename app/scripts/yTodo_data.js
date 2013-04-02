var ytodo = ytodo || {};

ytodo.Data = (function(){
	// Data variables
	var
		remoteAdapter = {}, // Remote Database Adapter
		localTasks = {},

		// HTML5 local storage functions
		storageLoad = function(){ // Initialize Data with localStorage when possible
			if(!Modernizr.localstorage) { return false; }
			for(var storedTaskKeys in localStorage){
				if(/^task_/.test(storedTaskKeys)){ // If the key starts with "task_"
					localTasks[storedTaskKeys.slice(5)] = JSON.parse(localStorage[storedTaskKeys]);
				}
			}
		},
		storageSave = function(taskId){ // Save Data in localStorage when possible
			if(!Modernizr.localstorage) { return false; }
			if(taskId === undefined){ // Save all local tasks
				for(var localTaskId in localTasks){
					localStorage['task_'+localTaskId] = JSON.stringify(localTasks[localTaskId]);
				}
			} else{ localStorage['task_'+taskId] = JSON.stringify(localTasks[taskId]); }
		},
		storageDelete = function(taskId){
			if(!Modernizr.localstorage) { return false; }
			delete localStorage['task_'+taskId];
		},


		// Data functions
		initialize = function(adapter){
			if(adapter){ remoteAdapter = adapter; }
			storageLoad();
		},

		// Data CRUD functions
		createTask = function(task, sync){
			// Generate a random Id (until no Id clash) for the task
			do { task.id = (((1+Math.random())*0x10000)|0).toString(16).slice(1);
			} while( localTasks.hasOwnProperty(task.id) );
			// Save and return the generated task Id
			localTasks[task.id] = task;
			storageSave(task.id);
			// If the task is created from local and need to be synced
			if(sync) { remoteAdapter.createTask(task.id); }
			return task.id;

		},
		getTask = function(taskId){
			if(taskId) {
				if(!localTasks.hasOwnProperty(taskId)){ return false; }
				return localTasks[taskId];
			} else { return localTasks; }
		},
		updateTask = function(taskId, partialTask){
			if(!localTasks.hasOwnProperty(taskId)){ return false; }
			for(var key in partialTask){ localTasks[taskId][key] = partialTask[key]; }
			storageSave(taskId);
		},
		deleteTask = function(taskId){
			if(!localTasks.hasOwnProperty(taskId)){ return false; }
			delete localTasks[taskId];
			storageDelete(taskId);
			remoteAdapter.deleteTask(taskId);
		},

		// RemoteAdapter set and get
		setAdapter = function(adapter){ remoteAdapter = adapter; }
		getAdapter = function(adapter){ return remoteAdapter; }

	return {
		initialize : initialize,
		createTask : createTask,
		getTask : getTask,
		updateTask : updateTask,
		deleteTask : deleteTask,
		setAdapter : setAdapter,
		getAdapter : getAdapter
	};

})();
