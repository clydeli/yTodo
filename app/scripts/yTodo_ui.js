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

			// Initialize datepicker
			$('#newTaskDue').datepicker();

			createTagList();
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
					priority : $('input[name="newTaskPriority"]:checked').val(),
					category : 'active'
				});

				// Optional properties
				if($('#newTaskLinks').val() != ""){
					newTask.links = [$('#newTaskLinks').val()];
				}
				if($('#newTaskTags').val() != ""){
					var tags = $('#newTaskTags').val().split(',');
					tags = tags.map(function(i){ return i.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); });
					newTask.tags = tags;
				}

				var createdId = ytodo.Data.createTask(newTask);
				// UI reactions
				insertTask(ytodo.Data.getTask(createdId));
				if($('#newTaskTags').val() != ""){ createTagList(); }
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
					ytodo.Data.updateTask(taskId, {	status : 'needsAction' });
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

			// Sortable and Draggable
			$("ul.todoList").sortable({
				connectWith: "ul",
				cursorAt: { right: 50 },
				placeholder: "li-placeholder",
				update: function(e, target){
					var
						taskId = $(target.item).attr('data-taskId'),
						targetList = $(target.item).parent()[0].id.slice(0, -4),
						srcList = $(this)[0].id.slice(0, -4);

					if( targetList !== srcList ){
						ytodo.Data.updateTask(taskId, {	category : targetList });
					}

				}
			});
			$(".todoList").disableSelection();

			// tagList click handler
			$('#tagList').on('click', '.tags', function(){
				if($(this).hasClass('selected')){
					$(this).removeClass('selected');
					$('.todoList li').removeClass('hidden');
					return true;
				}

				$('#tagList .tags').removeClass('selected');
				$(this).addClass('selected');

				$('.todoList li').addClass('hidden');
				var selectedTag = $(this).html();
				$('.todoList li').each(function(){
					var hasTag = false;
					$(this).find('.tags').each(function(){
						if($(this).html() == selectedTag){ hasTag = true; }
					});
					if(hasTag){ $(this).removeClass('hidden'); }
				});
			});

		},

		// Inner functions
		insertTask = function(task){
			var taskHTML =
				'<li data-taskId="'+task.id+'">'+
					'<div class="priorityBar" style="background-color:'+priorityColorTable[task.priority]+';"></div>'+
					'<div class="mainContent">'+task.title+'</div>'+
					'<div class="extraContent">';
						if(task.links){
							for(var i=0; i<task.links.length; ++i){
								taskHTML += '<a href="'+task.links[i]+'" rel="external" target="_blank">link'+String(i+1)+'</a>';
						}}
						if(task.tags){
							for(var j=0; j<task.tags.length; ++j){
								taskHTML += '<div class="tags">'+task.tags[j]+'</div>';
						}}
						taskHTML +=
					'</div>'+
					'<div class="closeBar"></div>'+
				'</li>';

			// Add to corresponding list
			$('#'+task.category+'List').append(taskHTML);
		},

		createTagList = function(){
			var tagsHash = {}; // Used to save current tags

			// Traverse all tags on screen
			$('.tags').each(function(){
				tagsHash[$(this).html()] = true;
			});

			// Insert tags to tagList
			$('#tagList').html('');
			for(var tagKey in tagsHash){
				$('#tagList').append('<li class="tags">'+tagKey+'</li>');
			}
		};

		return {
			initialize : initialize,
			insertTask : insertTask
		}
})();
