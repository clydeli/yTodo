var cTodo = cTodo || {};
cTodo.Type = {};

// Define the Type "taskItem"
cTodo.Type.taskItem = function(task){
	this.id = task.id || '';
	this.title = task.title || '';
	this.status = task.status || 'needs Action';
	this.updated = task.updated || (new Date());
	this.isSynced = task.isSynced || false;
	this.category = task.category || 'active'; // Active, Backlog, Regular
	// Optional content
    if(task.links){ this.links = task.links || []; } // Mail, Map, Regular links
	if(task.tags){ this.tags = task.tags || []; }
	if(task.due){ this.due = task.due || (new Date()); }
	if(task.note){ this.note = task.note || ''; }
	if(task.priority){ this.priority = task.priority || 1; }
};

cTodo.Type.taskItem.prototype = {
	mergeWith : function(task){
		if(!this.isSynced){
			// Temporary merge handler based on updated time
			//if(task.updated.gettime() > this.updated.gettime()){ this = task; }
		}
	}
};
