var ytodo = ytodo || {};

ytodo.UI = (function(){

	var
		priorityColorTable = ['RoyalBlue', 'Darkorange', 'DarkRed'], // Normal, High, Critical

		// UI functions
		initialize = function(){
			console.log('UI initializing...');
			// Read task data and append to html
			for(var key in ytodo.Data.getTask()){
				insertTask(ytodo.Data.getTask(key));
			}
			eventBinding();
		},
		eventBinding = function(){

			// Binding UI events
			// Menu button actions
			$('#loginButton').click( function(){ ytodo.Data.getAdapter().initialize(); });
			$('#addButton').click( function(){ $('#newTaskFrame').removeClass('hidden'); });

			// Add new task item functions
			$('#addCancelBtn').click( function(){ $('#newTaskFrame').addClass('hidden'); });
			$('#addOKBtn').click( function(){
				// Create new task item
				var newTask = new ytodo.Type.taskItem({
					title : $('#newTaskTitle').val(),
					priority : $('#newTaskPriority').val()
				});
				var createdId = ytodo.Data.createTask(newTask, true);
				// UI reactions
				insertTask(ytodo.Data.getTask(createdId));
				$('#newTaskFrame').addClass('hidden');
			});

			// Delete an item from list
			$('#taskArea').on('click', '.closeBar', function(){
				var taskId = $(this).parent().attr('data-taskId');
				ytodo.Data.deleteTask(taskId);
				//$(this).parent().addClass('hidden');
				$(this).parent().remove();
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
