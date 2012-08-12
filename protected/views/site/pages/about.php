<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name . ' - About';
?>

<?php $this->beginWidget('CMarkdown'); ?>
	<?php echo file_get_contents(Yii::getPathOfAlias('webroot').DIRECTORY_SEPARATOR.'README.md'); ?>
<?php $this->endWidget(); ?>
