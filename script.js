// Get all the window elements and the desktop element
const windows = Array.from(document.querySelectorAll('.window'));
const desktop = document.querySelector('.desktop');

// Attach an event listener to the desktop for mousedown events
desktop.addEventListener('mousedown', function (event) {
    // Check if the mousedown event was on a window header
    if (event.target.classList.contains('window-header') || event.target.classList.contains('window-title')) {
        // Get the window element that was clicked on
        const window = event.target.closest('.window');

        // Get the window's iframe element
        const iframe = window.querySelector('iframe');

        // Calculate the initial mouse position relative to the window position
        const initialMouseX = event.clientX;
        const initialMouseY = event.clientY;
        const initialWindowX = window.offsetLeft;
        const initialWindowY = window.offsetTop;

        // Attach event listeners to the desktop for mousemove and mouseup events
        desktop.addEventListener('mousemove', handleWindowDrag);
        desktop.addEventListener('mouseup', stopWindowDrag);

        // Set the window's position to fixed so that it can be dragged
        window.style.position = 'absolute';

        // Disable the iframe pointer events during window dragging
        iframe.style.pointerEvents = 'none';

        // Function to handle window dragging
        function handleWindowDrag(event) {
            // Calculate the new window position based on the initial mouse position and the current mouse position
            const newWindowX = initialWindowX + (event.clientX - initialMouseX);
            const newWindowY = initialWindowY + (event.clientY - initialMouseY);

            // Set the window's position to the new position
            window.style.left = newWindowX + 'px';
            window.style.top = newWindowY + 'px';
        }

        // Function to stop window dragging
        function stopWindowDrag() {
            // Remove the event listeners for mousemove and mouseup events
            desktop.removeEventListener('mousemove', handleWindowDrag);
            desktop.removeEventListener('mouseup', stopWindowDrag);

            // Set the window's position to absolute so that it stays in place
            window.style.position = 'absolute';

            // Re-enable the iframe pointer events
            iframe.style.pointerEvents = 'auto';
        }
    }
});

// Function to bring a window to the front
function bringWindowToFront(window) {
    // Get the highest z-index value of all the windows
    const maxZIndex = windows.reduce((max, w) => Math.max(max, parseInt(w.style.zIndex || 0)), 0);

    // Set the window's z-index to the highest value + 1
    window.style.zIndex = maxZIndex + 1;
}

// Attach event listeners to each window for mousedown events
windows.forEach(window => {
    window.addEventListener('mousedown', function (event) {
        bringWindowToFront(window);
    });
});

// Get the taskbar and search div elements
const taskbar = document.querySelector('.taskbar');
const searchDiv = document.querySelector('#search-div');

// Function to show the search div and bring the taskbar to the front
function showSearch() {
    taskbar.style.zIndex = 999;
    searchDiv.style.display = "block";
}

// Function to hide the search div and reset the search box value
function searchClick() {
    searchDiv.style.display = "none";
    document.getElementById('search-box').value = '';
}

// Function to only allow letters to be inputted into the search box
function lettersOnly(textarea) {
    var regex = /[^a-z/ /]/gi;
    textarea.value = textarea.value.replace(regex, "");

    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("search-box");
    filter = input.value.toUpperCase();
    ul = document.getElementById("searchList");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("p")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// Function to handle search input
function capture() {
    var search = document.getElementById("search-box").value.toLowerCase();
    switch (search) {
        case "websocket":
            openWindow("WebSocket Chat", "../chat/index.html");
            break;
        case "upload":
            openWindow("Upload", "index.php");
            break;
        case "asymmetric":
            openWindow("Asymmetric Key", "encrypt.html");
            break;
        case "varoom":
            openWindow("Varoom", "https://techlm77.com/3D-Objects/Car/3D-Car(controls).html");
            break;
        case "explorer":
            openWindow("File Explorer", "file-explorer.html");
            break;
        default:
        // Handle unknown search
    }
    document.getElementById('search-box').value = '';
    searchDiv.style.display = "none";
    taskbar.style.zIndex = 0;
}

// Define taskIcons variable and assign it to the task-icons element
var taskIcons = document.querySelector('.task-icons');

function openWindow(title, src) {
    // Create a new window element
    var windowElement = document.createElement('div');
    windowElement.classList.add('window');
    desktop.appendChild(windowElement);

    // Set the window's HTML content to an iframe with the specified src attribute
    windowElement.innerHTML = `
      <div class="window-header">
        <span class="window-title">${title}</span>
        <button class="window-close-button">x</button>
      </div>
      <div class="window-content">
        <iframe src="${src}"></iframe>
      </div>
    `;

    // Attach event listeners to the window for mousedown events
    windowElement.addEventListener('mousedown', function (event) {
        bringWindowToFront(windowElement);
    });

    // Add event listener to close button
    var closeButton = windowElement.querySelector('.window-close-button');
    closeButton.addEventListener('click', function (event) {
        windowElement.remove();
        var taskIcon = document.querySelector('.task-icon[title="' + title + '"]');
        if (taskIcon) {
            taskIcon.remove();
        }
    });

    // Set the window's initial position
    windowElement.style.top = '420px';
    windowElement.style.left = '400px';

    // Bring the new window to the front
    bringWindowToFront(windowElement);

    // Create a task icon button for the new window
    var taskIcon = document.createElement('button');
    taskIcon.classList.add('task-icon');
    taskIcon.innerHTML = title;
    taskIcon.setAttribute('title', title);
    taskIcons.appendChild(taskIcon);

    // Attach event listener to task icon button
    taskIcon.addEventListener('click', function (event) {
        bringWindowToFront(windowElement);
    });
}
