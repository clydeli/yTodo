var cTodo = cTodo || {};
cTodo.Type = {};

cTodo.Type.taskItem = function(task){
	this.id = task.id || "";
	this.title = task.title || "";
	this.status = task.status || "needs Action";
	this.links = task.links || [];
	this.tags = task.tags || [];
	this.due = task.due || "";
	this.note = task.note || "";
	this.priority = task.priority || 1; //
	this.updated = task.updated || (new Date());
	this.isSynced = task.isSynced || false;
};

cTodo.Type.taskItem.prototype = {
	mergeWith : function(task){
		if(!this.isSynced){
			// Temporary merge handler based on updated time
			if(task.updated.gettime() > this.updated.gettime()){ this = task; }
		}
	}
};
