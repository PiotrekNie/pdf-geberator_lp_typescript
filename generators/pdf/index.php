<?php
require_once __DIR__ . '../../vendor/autoload.php';

$directory = $_POST['directory'];
$userid = $_POST['userId'];
$serialnumber = $_POST['serialNumber'];
$label = $_POST['label'];
if (isset($_GET['userId'])) $userid = $_GET['userId'];

// Fonts
$defaultConfig = (new Mpdf\Config\ConfigVariables())->getDefaults();
$fontDirs = $defaultConfig['fontDir'];

$defaultFontConfig = (new Mpdf\Config\FontVariables())->getDefaults();
$fontData = $defaultFontConfig['fontdata'];

if (isset($userid)) {
	$mpdf = new \Mpdf\Mpdf([
		'mode' => 'utf-8', 'format' => array(178.308, 425.196), 'orientation' => 'L', 'dpi' => 300, 'img_dpi' => 300, 'ICCProfile' => '../../vendor/mpdf/mpdf/data/iccprofiles/Coated_Fogra39L_VIGC_300.icc',
		'fontDir' => array_merge($fontDirs, [
			__DIR__ . '/components/fontDir',
		]),
		'fontdata' => $fontData + [
			'opensans' => [
				'R' => 'OpenSans-Regular.ttf',
			]
		],
		'default_font' => 'opensans'
	]);

	$mpdf->img_dpi = 96;

	$mpdf->showImageErrors = false;

	// Add parser
	// $mpdf->WriteHTML('<div style="position:absolute;top:0px;left:0px;z-index:100;width:100%;height:auto;"><img src="components/trimmer.svg" style="width:100%;height:auto;"></div>');

	$mpdf->WriteHTML('<div style="position:absolute;top:466px;left:1933px;z-index:40"><img src="../data/' . $directory . '/' . $userid . '/kid-photo.png" style="width:1156px;height:auto;border-radius:30px;"></div>');

	$mpdf->WriteHTML('<div style="position:absolute;top:1888px;left:329px;z-index:100;font-family:opensans,sans-serif;font-size:24px;color:#ffffffv;">' . $serialnumber . '</div>');

	$mpdf->WriteHTML('<div style="position:absolute;top:102px;left:101px;z-index:0;width:4820px;"><img src="components/' . $label . '.jpg"></div>');

	// Add Foreaground
	if ($label == 'label-2') {
		$mpdf->WriteHTML('<div style="position:absolute;top:0px;left:0px;z-index:50;width:100%;height:auto;"><img src="components/label-2-foreground.svg"></div>');
	}

	$mpdf->Output('../data/' . $directory . '/' . $userid . '/' . $serialnumber . '.pdf');

	echo '<img src="https://localhost/generators/data/' . $directory . '/' . $userid . '/kid-photo.jpg" style="width:1156px;height:1156px;">';
} else {
	echo 'Error.';
}