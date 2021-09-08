<?php

header('Content-Type: application/json');

// Create directory
$directory = './../data/' . $_POST['range'] . '';

//mkdir($struktureUserID);
if (!is_dir($directory)) {
  mkdir($directory);
}