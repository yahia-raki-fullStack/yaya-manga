// Event listener cleanup
function backToMainPage() {
  document.addEventListener("DOMContentLoaded", function () {
    // Wait for the DOM to be fully loaded

    const logoImage = document.getElementById("logoImage");

    if (logoImage) {
      // Remove existing event listener to avoid multiple bindings
      logoImage.removeEventListener("click", handleLogoClick);

      // Add new event listener
      logoImage.addEventListener("click", handleLogoClick);
    }
  });
}

function handleLogoClick() {
  // Handle the click event

  // Clear the hash and set it to a default value (e.g., 'home')
  window.location.hash = "#home";
}

// Function to clear HTML content
function clearHtmlContent(frontPageShowcase, chosenManga) {
  frontPageShowcase.innerHTML = "";
  chosenManga.innerHTML = "";
}

function frontPageMakeUp(mangaName, img, id) {
  const markup = `<div class="top-mangas">
    <div class="manga-info">
      <h2 class="manga-name">${mangaName}</h2>
      <img src="${img}" alt="" class="manga-cover" id="${id}" />
    </div>
  </div>`;
  return markup;
}

export { backToMainPage, frontPageMakeUp, clearHtmlContent };
