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
		initialize = function(){
			storageLoad();
		},

		// Data CRUD functions
		createTask = function(task){
			// Generate a random Id (until no Id clash) for the task
			do { task.id = (((1+Math.random())*0x10000)|0).toString(16).slice(1);
			} while( localTasks.hasOwnProperty(task.id) );
			// Save and return the generated task Id
			localTasks[task.id] = task;
			storageSave(task.id);
			return task.id;
		},
		getTask = function(taskId){
			if(!localTasks.hasOwnProperty(taskId)){ return false; }
			return localTasks[taskId];
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
			//if(remoteAdapter.initialized){ remoteAdapter.deleteTask(taskId); }
		};

	return {
		initialize : initialize,
		create : createTask,
		get : getTask,
		update : updateTask,
		remove : deleteTask
	};

})();
