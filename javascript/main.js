// Import necessary modules and functions
"use strict";
import { MANGA } from "@consumet/extensions";
import {
  backToMainPage,
  frontPageMakeUp,
  clearHtmlContent,
} from "/javascript/mainPageMarkUp";
import { showMangaChapters } from "/javascript/selectedMangaPage";

// Update your API URLs
const mangaDexApiUrl = "/.netlify/mangadex-proxy";

// Call the backToMainPage function to set up the click event listener
backToMainPage();

window.onload = function () {
  window.location.hash = "home";
};

// Select the HTML element with the ID 'showcase-mangas'
const frontPageShowcase = document.querySelector(`#showcase-mangas`);
const chosenManga = document.querySelector(`.showcase-mangas__choicen`);

// List of manga titles to display on the landing page
let mainPagedata = { currentMangaPage: 1 };

const showcaseMangas = [
  `naruto`,
  `black clover`,
  `Death Note`,
  `gantz`,
  `jujutsu kaisen`,
  `gintama`,
  `Berserk`,
  `Bleach`,
  `blue lock`,
  `Case Closed`,
  `ONE PIECE`,
  `hunter x hunter`,
  `yu-gi-oh`,
  `attack on titan`,
  `re:zero`,
  `magi`,
];

// Create a new instance of the MangaDex class with the API URL
const mangadex = new MANGA.MangaDex(mangaDexApiUrl);

// Function to show the landing page mangas
async function showTheLandingPageMangas([...manga]) {
  try {
    frontPageShowcase.innerHTML = "";
    manga.forEach((manga) => {
      // Search for manga information
      mangadex
        .search(manga)
        .then((data) => data.results[0].id)
        .then((id) => {
          // Fetch detailed manga information
          mangadex.fetchMangaInfo(id).then((data) => {
            // Extract relevant information
            const mangaName = data.title;
            const mangaImg = data.image;

            // Create HTML markup for the manga
            const showcaseMarkup = frontPageMakeUp(
              mangaName,
              mangaImg,
              data.id
            );

            // Insert the HTML markup into the showcase
            frontPageShowcase.insertAdjacentHTML(`afterbegin`, showcaseMarkup);

            // Attach a click event listener to the image with the specified ID
            const imgElementId = document.getElementById(data.id);

            if (imgElementId) {
              imgElementId.removeEventListener("click", handleMangaClick);
              imgElementId.addEventListener("click", handleMangaClick);
            }
          });
        });
    });
  } catch (err) {
    console.error(err);
  }
}

// Rest of the code remains unchanged
// ...

function handleMangaClick() {
  // Update the hash when an image is clicked
  window.location.hash = `manga=${this.id}`;
  mainPagedata.clickedMangaId = this.id;
  mainPagedata.clickedMangaCover = this.src;
  mainPagedata.clickedMangaTitle = this.alt;

  const clickedMangaMarkup = selectedMangaMarkUp(
    mainPagedata.clickedMangaTitle,
    mainPagedata.clickedMangaCover
  );
  chosenManga.insertAdjacentHTML(`afterbegin`, clickedMangaMarkup);
}

// Show the landing page mangas
showTheLandingPageMangas(showcaseMangas);

// Function to extract manga ID from the hash
function mangaId() {
  const currentHash = window.location.hash;
  const parts = currentHash.split("=");
  return parts.length > 1 ? parts[1] : null;
}

// Add an event listener for hash changes to update the displayed manga chapters
window.addEventListener(`hashchange`, async function () {
  if (window.location.hash === "#home") {
    // Code to be executed when the hash is #home
    clearHtmlContent(frontPageShowcase, chosenManga);
    await showTheLandingPageMangas(showcaseMangas);
    chosenManga.innerHTML = ``;
  }

  const currentId = mangaId();

  if (!currentId) return;

  try {
    mainPagedata.clickedMangaChapters = await showMangaChapters(
      mangadex,
      currentId
    );

    if (
      mainPagedata.clickedMangaChapters &&
      mainPagedata.clickedMangaChapters.length > 0
    ) {
      let clickedMangaChaptersMarkup =
        selectedMangaChaptersMarkUp(mainPagedata);
      // Process the chapters here, for example, update the UI or do other
      chosenManga.insertAdjacentHTML(`beforeend`, clickedMangaChaptersMarkup);
      chosenManga.addEventListener(`click`, async function (e) {
        let clickedNumber = e.target.closest(".chapter-btn");
        if (!clickedNumber) return;
        let clickedNumberChapter = clickedNumber.dataset.clickednumber;
        let theChosenManga = mainPagedata.clickedMangaChapters.find(
          (data) => clickedNumberChapter === data.chapterNumber
        );

        let showMangaHTML = showManga(mainPagedata, theChosenManga);
        await clearHtmlContent(frontPageShowcase, chosenManga);
        chosenManga.insertAdjacentHTML(`afterbegin`, showMangaHTML);
      });
    } else {
      // Handle the case where there are no chapters
      alert("No chapters available");
    }
  } catch (error) {
    // Handle any errors that might occur during the process
    console.error(error);
  }

  frontPageShowcase.innerHTML = ``;
});

function selectedMangaMarkUp(mangaTitle, mangaCover) {
  const markUp = `<div class="clicked-manga">
  <h2 class="manga-name">${mangaTitle}</h2>
  <img src="${mangaCover}" alt="" class="cover" />
</div>`;
  return markUp;
}

function selectedMangaChaptersMarkUp(mangaChapters) {
  let markUp = mangaChapters.clickedMangaChapters
    .map((data) => {
      // Check if data.chapterNumber is not null before checking if it's a valid number
      let chapterNumber =
        data.chapterNumber !== null
          ? isNaN(data.chapterNumber)
            ? 0
            : data.chapterNumber
          : 0;

      // Return the HTML markup with the correct data-clickedNumber attribute
      return `<div class="chapter-btn" data-clickedNumber="${chapterNumber}">${chapterNumber}</div>`;
    })
    .join("");

  return markUp;
}

// let markup = `<div class="clicked-manga"><img src="/img/front-page-test/manga-test.jpg" class="manga-page" />
// <div class="container">
//   <div class="arrow">&larr;</div>
//   <textarea placeholder="Type something here..."></textarea>
//   <div class="arrow">&rarr;</div>
// </div>
// <div class="chapter-btn">1</div>`;
function renderChapters(chapters) {
  return chapters
    .map((data) => {
      let chapterNumber =
        data.chapterNumber !== null
          ? isNaN(data.chapterNumber)
            ? 0
            : data.chapterNumber
          : 0;

      return `<div class="chapter-btn" data-clickedNumber="${chapterNumber}">${chapterNumber}</div>`;
    })
    .join("");
}

function renderMangaPage(imgSrc, currentPage, totalPages) {
  return `<div class="clicked-manga">
    <img src="${imgSrc}" class="manga-page" />
    <div class="container">
      <div class="arrow" id="left-arrow">&larr;</div>
      <div class="page-indicator">${formatPageIndicator(
        currentPage,
        totalPages
      )}</div>
      <div class="arrow" id="right-arrow">&rarr;</div>
    </div>
  </div>`;
}

function formatPageIndicator(currentPage, totalPages) {
  return `${String(currentPage).padStart(2, "0")}/${totalPages}`;
}

function showManga(mangaChapters, theChosenManga) {
  let currentPage = 1;

  let chaptersNumber = renderChapters(mangaChapters.clickedMangaChapters);

  let totalPages = theChosenManga.chapterData.length;

  let markup =
    renderMangaPage(
      theChosenManga.chapterData[currentPage - 1].img,
      currentPage,
      totalPages
    ) + chaptersNumber;

  document.addEventListener("click", handleScreenClick);
  document.addEventListener("keydown", handleArrowKeys);

  function handleScreenClick(event) {
    if (event.clientX > window.innerWidth / 2) {
      navigatePage(1);
    } else {
      navigatePage(-1);
    }
  }

  function handleArrowKeys(event) {
    if (event.key === "ArrowRight") {
      navigatePage(1);
    } else if (event.key === "ArrowLeft") {
      navigatePage(-1);
    }
  }

  function navigatePage(direction) {
    currentPage += direction;
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    document.querySelector(".manga-page").src =
      theChosenManga.chapterData[currentPage - 1].img;

    updatePageIndicator();
  }

  function updatePageIndicator() {
    document.querySelector(".page-indicator").textContent = formatPageIndicator(
      currentPage,
      totalPages
    );
  }

  return markup;
}
showTheLandingPageMangas;
