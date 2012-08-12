jQuery(function($) {

	// Model represents task attributes, data and methods to work with.
	var Task = Backbone.Model.extend({

		defaults: {
			id: null,
			title: '',
			done: false,
			create_time: Math.round(+new Date() / 1000), // current UNIX timestamp
			update_time: Math.round(+new Date() / 1000) // current UNIX timestamp
		},

		toggleDone: function() {
			this.save({
				done: this.get('done') > 0 ? 0 : 1
			});
		}

	});

	// Model collection for working with a set of models simultaneously.
	var TaskBook = Backbone.Collection.extend({

		// Specify model.
		model: Task,

		// Pass the URL for working with tasks.
		url: tasksParams.tasksUrl(),

		finished: function() {
			return this.filter(function(task){ return task.get('done') > 0; });
		},

		remaining: function() {
			return this.filter(function(task){ return task.get('done') == 0; });
		}

	});

	// Create an instance of the tasks collection.
	var taskBook = new TaskBook;

	var TaskView = Backbone.View.extend({

		tagName: 'tr',

		className: 'task',

		template: _.template($('#task-template').html()),

		events: {
			'click .task-action-toggle-done': 'toggleDone',
			'click .task-action-delete': 'delete'
		},

		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},

		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			this.setTitle();
			this.setDone();
			this.setCreated();
			return this;
		},

		setTitle: function() {
			var title = this.model.get('title');
			this.$('.task-title').text(title);
		},

		setDone: function() {
			var done = this.model.get('done');
			this.$('.task-done').text(done > 0 ? 'Yes' : 'No');
		},

		setCreated: function() {
			var create_time = this.model.get('create_time');
			var dt = new Date(create_time * 1000);
			this.$('.task-created').text(
				dt.getDay() + '.' + dt.getMonth() + '.' + dt.getFullYear() + ', ' + dt.getHours() + ':' + dt.getMinutes()
			);
		},

		remove: function() {
			$(this.el).remove();
		},

		toggleDone: function(e) {
			e.preventDefault(); // Ensure that anchor will not to change after click.
			this.model.toggleDone();
		},

		delete: function(e) {
			e.preventDefault(); // Ensure that anchor will not to change after click.
			this.model.destroy();
		}

	});

	var AppView = Backbone.View.extend({

		el: $('#tasks'),

		events: {
			'click .task-action-create': 'createTask'
		},

		initialize: function() {
			this.titleInput = this.$('.task-form-title');
			this.doneCheckbox = this.$('.task-form-done');

			taskBook.bind('add', this.addOneTask, this);
			taskBook.bind('reset', this.addAllTasks, this);

			taskBook.fetch();
		},

		render: function(data) {
			this.$(".task-list").html('');
			_.each(data, function(task) { this.addOneTask(task); }, this);
			return this;
		},

		addOneTask: function(task) {
			var taskView = new TaskView({model: task});
			this.$('.task-list').append(taskView.render().el);
		},

		addAllTasks: function() {
			taskBook.each(this.addOneTask);
		},

		createTask: function(e) {
			e.preventDefault(); // Ensure that anchor will not to change after click.

			var title = this.titleInput.val(),
				done = this.doneCheckbox.prop('checked') ? 1 : 0;

			taskBook.create({title: title, done: done});

			this.titleInput.val('');
			this.doneCheckbox.prop('checked', false);
		}

	});

	// Create application view.
	var appView = new AppView;

	// Application URL router.
	var TaskRouter = Backbone.Router.extend({

		// Route configuration.
		routes: {
			'finished': 'showFinished',
			'remaining': 'showRemaining',
			'*hash': 'defaultRoute'
		},

		// Show only finished tasks.
		showFinished: function() {
			appView.render(taskBook.finished());
		},

		// Show tasks to be finished in future.
		showRemaining: function() {
			appView.render(taskBook.remaining());
		},

		// Show all tasks.
		defaultRoute: function(hash) {
			appView.render(taskBook.models);
		}

	});

	// Create router instance and let Backbone work with it.
	var taskRouter = new TaskRouter;
	Backbone.history.start();

});
