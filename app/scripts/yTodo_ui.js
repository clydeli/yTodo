var ytodo = ytodo || {};

ytodo.UI = (function(){

	var
		priorityColorTable = ['RoyalBlue', 'Darkorange', 'DarkRed'], // Normal, High, Critical

		// UI functions
		initialize = function(){
			console.log('UI initializing...');
			// Read task data and append to html
			for(var key in ytodo.Data.getTask()){
				var taskItem = ytodo.Data.getTask(key);
				insertTask(taskItem);
				// Applying completed styling if it's completed
				if(taskItem.status === 'completed'){
					$('.todoList li[data-taskId="'+taskItem.id+'"]').addClass('completed');
				}
			}

			eventBinding();
		},
		eventBinding = function(){

			// Binding UI events
			// Sortable and Draggable
			$("ul.todoList").sortable({	connectWith: "ul", cursorAt: { right: 50 } });
			$(".todoList").disableSelection();

			// Menu button actions
			$('#loginButton').click( function(){ ytodo.Data.getAdapter().initialize(); });
			$('#addButton').click( function(){ $('#newTaskFrame').removeClass('hidden'); });

			// Add new task item functions
			$('#addCancelBtn').click( function(){ $('#newTaskFrame').addClass('hidden'); });
			$('#addOKBtn').click( function(){
				// Create new task item
				var newTask = new ytodo.Type.taskItem({
					title : $('#newTaskTitle').val(),
					priority : $('#newTaskPriority').val(),
					category : 'active'
				});
				var createdId = ytodo.Data.createTask(newTask, true);
				// UI reactions
				insertTask(ytodo.Data.getTask(createdId));
				$('#newTaskFrame').addClass('hidden');
			});

			// Complete and delete an item from list
			$('#taskArea').on('click', '.closeBar', function(e){
				var taskId = $(this).parent().attr('data-taskId');
				if($(this).parent().hasClass('completed')){
					ytodo.Data.deleteTask(taskId);
					$(this).parent().addClass('hidden');
					//$(this).parent().remove();
				} else {
					ytodo.Data.updateTask(taskId, {	status : 'completed' });
					$(this).parent().addClass('completed');
				}
				e.stopPropagation();
			});
			// Recover or expand/collpase an item
			$('#taskArea').on('click', '.todoList li', function(){
				var taskId = $(this).attr('data-taskId');
				if($(this).hasClass('completed')){
					ytodo.Data.updateTask(taskId, {	status : 'needs Action' });
					$(this).removeClass('completed');
				}
			});
			// Update item priority
			$('#taskArea').on('click', '.priorityBar', function(e){
				var taskId = $(this).parent().attr('data-taskId');
				var newPriority = (ytodo.Data.getTask(taskId).priority+1)%priorityColorTable.length;
				ytodo.Data.updateTask(taskId, {	priority : newPriority });
				$(this).css('background-color', priorityColorTable[newPriority]);
				e.stopPropagation();
			});
		},

		// Inner functions
		insertTask = function(task){
			var taskHTML =
				'<li data-taskId="'+task.id+'">'+
					'<div class="priorityBar" style="background-color:'+priorityColorTable[task.priority]+';"></div>'+
					'<div class="mainContent">'+task.title+'</div>'+
					'<div class="extraContent">'+
					'</div>'+'<div class="closeBar"></div>'+
				'</li>';

			switch(task.category){
				case 'active' :
					$('#activeList').append(taskHTML);
					break;
			}
		};

		return {
			initialize : initialize,
			insertTask : insertTask
		}
})();
