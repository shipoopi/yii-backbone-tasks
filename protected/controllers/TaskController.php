<?php

/**
 * Controller for working with the tasks.
 */
class TaskController extends Controller
{
	/**
	 * Create new task by given field values set.
	 * @throws CHttpException
	 */
	public function actionCreate()
	{
		$task=new Task();
		$task->attributes=CJSON::decode(file_get_contents('php://input'));
		if(!$task->save())
			throw new CHttpException(400,'Cannot create new task with invalid data.');
	}

	/**
	 * List all task records.
	 */
	public function actionRead()
	{
		$tasks=array();
		foreach(Task::model()->findAll() as $task)
			$tasks[]=(object)$task->attributes;

		header('Content-Type: application/json; charset=UTF-8');
		echo CJSON::encode($tasks);
	}

	/**
	 * Update existing task by it's given ID.
	 * @param integer $id ID of the model to be updated.
	 * @throws CHttpException
	 */
	public function actionUpdate($id)
	{
		$task=$this->loadModel($id);
		$task->attributes=CJSON::decode(file_get_contents('php://input'));
		if(!$task->save())
			throw new CHttpException(400,'Cannot update existing task with invalid data.');
	}

	/**
	 * Delete existing model from the database by it's given ID.
	 * @param integer $id ID of the model that should be deleted.
	 * @throws CHttpException
	 */
	public function actionDelete($id)
	{
		$task=$this->loadModel($id);
		if(!$task->delete())
			throw new CHttpException(400,'Cannot delete task.');
	}

	/**
	 * Load the task model from the database.
	 * @param integer $id the task identifier.
	 * @return Task the desired model.
	 * @throws CHttpException
	 */
	public function loadModel($id)
    {
        $model=Task::model()->findByPk($id);
        if($model===null)
            throw new CHttpException(404,'The requested page does not exist.');
        return $model;
    }
}
