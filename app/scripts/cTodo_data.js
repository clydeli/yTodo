var cTodo = cTodo || {};

cTodo.Data = {
	localTasks : {},
	load : function(){ 
		// Initialize Data with localStorage when possible
		var storedEntry;
		for( storedEntry in localStorage){
			if(/^task_/.test(storedEntry)){
				this.localTasks[storedEntry.slice(5)] = JSON.parse(localStorage[storedEntry]);
			}
		}
	},
	save : function(taskId){ 
		// Save Data with localStorage when possible
		localStorage["task_"+taskId] = JSON.stringify(this.localTasks[taskId]);
	},
	createTask : function(task){
		// Random an Id for the task
		do { task.id = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		} while(this.localTasks.hasOwnProperty(task.id))
		this.localTasks[task.id] = task;
	},
	getTask : function(taskId){ 
		if(this.localTasks.hasOwnProperty(taskId)){
			return this.localTasks[taskId];
		}
	},
	updateTask : function(taskId, partialTask){
		if(this.localTasks.hasOwnProperty(taskId)){
			for(var key in partialTask){ this.localTasks[taskId][key] = partialTask[key]; }
		}
	},
	deleteTask : function(taskId){
		if(this.localTasks.hasOwnProperty(taskId)){
			delete this.localTasks[taskId];	
		}
	}
};