<?php

$image = $_POST['file'];

$fileNameId = $_POST['filename'] . '.png';

$image = str_replace('data:image/png;base64,', '', $image);

$image = str_replace(' ', '+', $image);

// Create directory
$struktureUserID = './../data/' . $_POST['directory'] . '/' . $_POST['userId'] . '';

//mkdir($struktureUserID);
if (!is_dir($struktureUserID)) {
  mkdir($struktureUserID);
}

$filteredDataId = substr($image, strpos($image, ",") + 1);

//Decode the string
$unencodedDataId = base64_decode($image);

$img = imageCreateFromString($unencodedDataId);

imagealphablending($img, true);

imagesavealpha($img, true);

// Make sure that the GD library was able to load the image
// This is important, because you should not miss corrupted or unsupported images
if (!$img) {
  die('Base64 value is not a valid image');
}

header('Content-Type:image/png');

// file_put_contents($struktureUserID . '/' . $fileNameId, $unencodedDataId);
imagepng($img, $struktureUserID . '/' . $fileNameId);

imagedestroy($img);