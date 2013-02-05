
// Try functions
var newTask1 = {
	title : "Practice kata",
	due : "2013-2-26",
}
var newTask2 = {
	title : "Write Craftsmanship Blog",
	importance : "high",
}

var realTask1 = new cTodo.Type.taskItem(newTask1);
var realTask2 = new cTodo.Type.taskItem(newTask2);

cTodo.Data.createTask(realTask1);
cTodo.Data.createTask(realTask2);

for (var key in cTodo.Data.localTasks){
	localTask1 = cTodo.Data.localTasks[key];
	break;
}

//cTodo.Data.updateTask( localTask1.id, { note: "this one is updated"});

//cTodo.Data.deleteTask(localTask1.id);

console.log(cTodo.Data.localTasks);
