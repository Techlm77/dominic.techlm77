// Select the required elements from the DOM
const folderList = document.querySelector('#folder-list');
const fileList = document.querySelector('#file-list');
const searchInput = document.querySelector('#search-input');
const folderHeader = document.querySelector('#folder-header');

// An object that stores the folder and file data
const data = {
  Home: ['index.html', 'script.js', 'style.css'],
  Encryption: ['index.html', 'script.js', 'style.css'],
  Explorer: ['index.html', 'script.js', 'style.css'],
  Public: ['index.html', 'script.js', 'style.css'],
  Terminal: ['index.html', 'script.js', 'style.css'],
  Upload: ['delete.php', 'index.php', 'play.gif', 'style.css', 'upload.php'],
  Windows: ['index.html', 'script.js', 'style.css'],
};

// Function to create and add elements to the DOM for each folder
function createFolderListItem(folder) {
  const folderListItem = document.createElement('li');
  folderListItem.classList.add('file-explorer-folder');
  folderListItem.dataset.folder = folder;
  folderListItem.textContent = folder;
  folderList.appendChild(folderListItem);
  return folderListItem;
}

// Function to create and add elements to the DOM for each file
function createFileListItem(file, folder) {
  const fileListItem = document.createElement('li');
  fileListItem.classList.add('file-explorer-file');
  fileListItem.dataset.file = file;
  fileListItem.textContent = file;

  // Add event listener to open file in a new tab
  fileListItem.addEventListener('click', () => {
    let filePath = `https://${window.location.hostname}/${folder.toLowerCase()}/${file}`;
    if (folder === 'Home') {
      filePath = `https://${window.location.hostname}/${file}`;
    }
    window.open(filePath);
  });

  fileList.appendChild(fileListItem);
  return fileListItem;
}

// Function to update the file list based on the selected folder
function updateFileList(folder) {
  fileList.innerHTML = '';
  data[folder].forEach(file => {
    const fileListItem = createFileListItem(file, folder);
    fileList.appendChild(fileListItem);
  });
  folderHeader.textContent = folder;
}

// Populate the folder list with the data object
for (const folder in data) {
  const folderListItem = createFolderListItem(folder);
  folderListItem.addEventListener('click', () => {
    updateFileList(folder);
  });
}

// Add event listener for search input to filter file list
searchInput.addEventListener('input', (event) => {
  const searchQuery = event.target.value.toLowerCase();
  const allFiles = fileList.querySelectorAll('.file-explorer-file');
  allFiles.forEach(file => {
    const fileName = file.dataset.file.toLowerCase();
    if (fileName.includes(searchQuery)) {
      file.style.display = '';
    } else {
      file.style.display = 'none';
    }
  });
});

//Initial list display based on first folder in data object
updateFileList(Object.keys(data)[0]);
