<?php
/* @var $this SiteController */
/* @var $am CAssetManager */
/* @var $cs CClientScript */

$this->pageTitle=Yii::app()->name;

$am=Yii::app()->assetManager;
$cs=Yii::app()->clientScript;
$url=$am->publish(Yii::getPathOfAlias('application.assets'));

$cs->registerCssFile($url.'/css/tasks.css');

$cs->registerCoreScript('jquery');
$cs->registerScriptFile($url.'/js/underscore.js');
$cs->registerScriptFile($url.'/js/json2.js');
$cs->registerScriptFile($url.'/js/backbone.js');
$cs->registerScriptFile($url.'/js/tasks.js');
?>

<div id="tasks">
	<h2>Task list</h2>

	<ul class="task-categories">
		<li><a href="#finished">Finished tasks</a></li>
		<li><a href="#remaining">Remaining tasks</a></li>
		<li><a href="#">All tasks</a></li>
	</ul>

	<table>
		<thead>
			<tr>
				<td>Title</td>
				<td>Done</td>
				<td>Created</td>
				<td>Actions</td>
			</tr>

			<tr>
				<td>
					<input type="text" class="task-form-title" />
				</td>
				<td>
					<input type="checkbox" class="task-form-done" />
				</td>
				<td>
					<input type="text" disabled="disabled" value="Right now"/>
				</td>
				<td>
					<a href="#" class="task-action-create">Create task</a>
				</td>
			</tr>
		</thead>

		<tbody class="task-list"></tbody>
	</table>
</div>

<script type="text/template" id="task-template">
	<td class="task-title"></td>
	<td class="task-done"></td>
	<td class="task-created"></td>
	<td class="task-actions">
		<% if (done > 0) { %>
			<a href="#" class="task-action-toggle-done">Make undone</a>,
		<% } else { %>
			<a href="#" class="task-action-toggle-done">Finish</a>,
		<% } %>
		<a href="#" class="task-action-delete">remove</a>.
	</td>
</script>
