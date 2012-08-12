<?php

class TaskController extends Controller
{
	public function actionCreate()
	{
		$task=new Task();
		$task->attributes=CJSON::decode(file_get_contents('php://input'));
		if(!$task->save())
			throw new CHttpException(400,'Cannot create new task with invalid data.');
	}

	public function actionRead()
	{
		$tasks=array();
		foreach(Task::model()->findAll() as $task)
			$tasks[]=(object)$task->attributes;

		header('Content-Type: application/json; charset=UTF-8');
		echo CJSON::encode($tasks);
	}

	/**
	 * @param integer $id
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
	 * @param integer $id
	 * @throws CHttpException
	 */
	public function actionDelete($id)
	{
		$task=$this->loadModel($id);
		if(!$task->delete())
			throw new CHttpException(400,'Cannot delete task.');
	}

	/**
	 * @param integer $id
	 * @return Task
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
