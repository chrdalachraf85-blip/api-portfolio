# GitHub Profile Portfolio

A small web app that displays a GitHub user's profile and public repositories. It loads the `zakariabensaid-360` profile on startup, then lets you search for another GitHub username or filter the displayed repositories by name.

The app uses JavaScript's `fetch` API to retrieve profile and repository data from GitHub. Repository cards show details such as description, stars, forks, language, and last update. Loading and error states are included, and local mock data is available for development.

## Run locally

Open `index.html` in a browser. To use the local sample data instead of GitHub, set `USE_MOCK` to `true` in `app.js`.
