<?php
$target_dir = "../upload/add/"; // directory where the file will be saved
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]); // path of the file
$uploadOk = 1; // flag to check if the file was uploaded successfully
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION)); // get the file extension

// Check if file is an image or video file
if(isset($_POST["submit"])) {
   $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
   if($check !== false) {
       echo "File is an image - " . $check["mime"] . ".";
       $uploadOk = 1;
   } else {
       $uploadOk = 0;
       echo "File is not an image.";
   }
}

// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000000) { // (in bytes) set to 500MB
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" && $imageFileType != "mp4" && $imageFileType != "mkv" && $imageFileType != "avi" ) {
    echo "Sorry, only JPG, JPEG, PNG, GIF, MP4, MKV & AVI files are allowed.";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is okay, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
        // Notification for file upload success
        echo '<script>alert("Your file has been uploaded!")</script>';
        // Wait for 3 seconds before redirecting to index.php
        header("refresh:3;url=index.php");
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>
