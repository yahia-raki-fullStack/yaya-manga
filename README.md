
this is yahia raki first solo project
The application  fetchs manga information from an external source ( MangaDex) using a handler (mangadex), and it utilizes event listeners to respond to user interactions.
but due to it being a free api i was heavily restricted on how big i can make it work consistently

Explore Manga Titles:

The landing page showcases a list of manga titles.
Users can click on a manga cover to view more details.
View Manga Details:

Detailed information about a selected manga, such as the manga name and cover image, is displayed on the landing page.
Read Manga Chapters:

Users can click on a manga cover to view available chapters.
Chapters are sorted and filtered to exclude those with no pages.
The user is then presented with clickable chapter numbers.
Navigate and Read Manga Pages:

When a specific chapter is selected, the user is presented with a manga page viewer.
The viewer allows navigation between pages using arrow keys or by clicking on different areas of the page.
The current page and total page count are displayed.
Responsive Navigation:

The application provides navigation options to go back to the main page by clicking on the logo.
Error Handling:

The code includes error handling, logging errors to the console, and displaying an alert when there are no chapters available for a selected manga.
