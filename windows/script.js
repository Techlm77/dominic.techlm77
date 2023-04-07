// Get all the window elements and the desktop element
const windows = Array.from(document.querySelectorAll('.window'));
const desktop = document.querySelector('.desktop');

// Attach an event listener to the desktop for mousedown events
desktop.addEventListener('mousedown', function (event) {
  // Check if the mousedown event was on a window header
  if (event.target.classList.contains('window-header') || event.target.classList.contains('window-title')) {
    // Get the window element that was clicked on
    const window = event.target.closest('.window');

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
