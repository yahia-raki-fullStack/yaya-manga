// Function to show manga chapters based on the manga ID
async function showMangaChapters(handler, id) {
  try {
    const data = await handler.fetchMangaInfo(id);

    let chaptersSorted = await data.chapters
      .sort((a, b) => a.chapterNumber - b.chapterNumber)
      .filter((data) => data.pages > 0);

    return await getSelectedChapters(chaptersSorted, handler);
  } catch (err) {
    console.error(err);
    // Handle the error (e.g., show an error message to the user)
  }
}

async function getSelectedChapters(chapters, handler) {
  try {
    if (chapters.length <= 0) {
      alert(`Please choose another manga. The current one is deleted.`);
      return [];
    }

    let requestLimit = 15;
    let result = [];

    for (let i = 0; i < chapters.length && i < requestLimit; i++) {
      if (!chapters[i].id) continue;

      let chapterNumber = chapters[i].chapterNumber; // Assuming chapterNumber is present in the chapters array

      let chapterData = await handler.fetchChapterPages(`${chapters[i].id}`);

      // Add chapterNumber and chapterData to the result array
      result.push({ chapterNumber, chapterData });
    }

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { showMangaChapters };
