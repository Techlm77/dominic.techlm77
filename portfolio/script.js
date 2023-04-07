// define the handlePageScroll function
function handlePageScroll() {
    const windowHeight = window.innerHeight;
    const divs = document.querySelectorAll("[id^=div]");
    divs.forEach((div) => {
      const position = div.getBoundingClientRect().top;
      if (position < windowHeight && position > -div.clientHeight) {
        div.classList.replace("fade-hide", "fade-show");
      } else {
        div.classList.replace("fade-show", "fade-hide");
      }
    });
  }
  
    // add smooth scrolling to all links with a hash fragment
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const hash = this.hash;
      const targetElement = document.querySelector(hash);
      const targetOffsetTop = targetElement.offsetTop;
      window.scroll({
        top: targetOffsetTop,
        behavior: "smooth",
      });
      // update the URL with the hash fragment
      history.pushState(null, null, hash);
    });
  });
  
  // add the handlePageScroll function to the window.onscroll event listener
  window.addEventListener("scroll", handlePageScroll);
  
  // Popup code
  const popupButtons = document.querySelectorAll('.popup-btn');
  popupButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectURL = button.nextElementSibling.getAttribute('href');
      // Create the popup container
      const popupContainer = document.createElement('div');
      popupContainer.classList.add('popup-container');
      // Create the iframe and set its attributes
      const iframe = document.createElement('iframe');
      iframe.src = projectURL;
      // Append the iframe to the popup container
      popupContainer.appendChild(iframe);
      // Create the close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.addEventListener('click', () => {
        document.body.removeChild(popupContainer);
      });
      // Append the close button to the popup container
      popupContainer.appendChild(closeButton);
      // Open the popup
      document.body.appendChild(popupContainer);
    });
  });