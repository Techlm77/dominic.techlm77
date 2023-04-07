<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Upload File</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<form id="form" action="upload.php" method="post" enctype="multipart/form-data">
    <h2>Select image or video to upload:</h2>
    <input type="file" name="fileToUpload" id="fileToUpload">
    <input type="submit" value="Upload" name="submit">
    <br>
    <div id="progressBar" data-progress="0"></div>
</form>

<div class="media-container">
    <?php
    $dir = "../upload/add/";
    $files = glob($dir . "*");
    foreach ($files as $file) {
        $fileType = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($fileType, array("jpg", "jpeg", "png", "gif", "mp4", "webm", "ogg"))) {
            echo "<div class=\"image-container\">";
            echo "<" . ($fileType == "mp4" || $fileType == "webm" || $fileType == "ogg" ? "video" : "img") . " src=\"" . htmlspecialchars(str_replace(' ', '%20', $file)) . "\" " . ($fileType == "mp4" || $fileType == "webm" || $fileType == "ogg" ? "controls" : "") . "></" . ($fileType == "mp4" || $fileType == "webm" || $fileType == "ogg" ? "video" : "img") . ">";
            echo "<div class=\"overlay\">";
            echo "<a href=\"" . htmlspecialchars(str_replace(' ', '%20', $file)) . "\" download>Download</a>";
            echo "<button onclick=\"copyToClipboard('" . htmlspecialchars(str_replace(' ', '%20', $file)) . "')\">Copy Link</button>";
            echo "</div>";
            echo "</div>";
        }
    }
    ?>
</div>

<script>
    function copyToClipboard(url) {
        const dummy = document.createElement('input');
        const text = 'https://chat.techlm77.com' + '/' + url.replace('../', '');
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert("Copied the link to clipboard: " + text);
    }

    const form = document.getElementById('form');
    const progressBar = document.getElementById('progressBar');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const xhr = new XMLHttpRequest();
        const fileInput = document.getElementById('fileToUpload');
        const file = fileInput.files[0];
        xhr.upload.addEventListener('progress', function(e) {
            const percentComplete = (e.loaded / e.total) * 100;
            progressBar.setAttribute('data-progress', percentComplete);
            progressBar.style.width = percentComplete + '%';
        });
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                progressBar.setAttribute('data-done', '1');
                setTimeout(function() {
                    location.reload(true);
                }, 1000); // adds a delay to let the progress bar animation finish before reloading the page
            }
        };
        xhr.open('POST', 'upload.php');
        const formData = new FormData();
        formData.append('fileToUpload', file, file.name);
        xhr.send(formData);
    });
</script>

<?php
if(isset($_FILES["fileToUpload"])){
    $target_dir = "../upload/add/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $allowFileTypes = array("jpg", "jpeg", "png", "gif", "mp4", "webm", "ogg");
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    if(!in_array($imageFileType, $allowFileTypes)) {
        echo 'Sorry, only JPG, JPEG, PNG, GIF, MP4, WEBM & OGG files are allowed.';
        $uploadOk = 0;
    }
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            header("Location: " . $_SERVER["PHP_SELF"]);
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}
?>

</body>
</html>
