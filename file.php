<?php
if(!isset($_GET['v'])) die("invalid request");

$filename = $_GET['v'];

$file_path = "upload/add/" . $filename;

if (!file_exists($file_path)) die("file not found");

$file_extension = pathinfo($filename, PATHINFO_EXTENSION);

if (in_array($file_extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
    header('Content-Type: image/' . $file_extension);
    readfile($file_path);
    exit;
} else if (in_array($file_extension, ['mp4', 'm4v'])) {
    if (!is_readable($file_path)) die("file could not be opened");
    header('Content-Type: video/mp4');
    readfile($file_path);
    exit;
} else if ($file_extension == 'webm') {
    header('Content-Type: video/webm');
    readfile($file_path);
    exit;
} else {
    die("unsupported file type");
}
?>