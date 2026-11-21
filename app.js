/* ==================================================================
   Fetch × GitHub Workshop — portfolio application
   ================================================================== */

const USERNAME = 'chrdalachraf85-blip';

let allRepos = [];
let currentUser = USERNAME;

function getUrl(path) {
  return `https://api.github.com${path}`;
}

async function fetchJSON(path) {
  const response = await fetch(getUrl(path));
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

function renderProfile(user) {
  const login = user.login || currentUser;
  const name = user.name || login;
  const avatar = document.querySelector('#avatar');

  if (user.avatar_url) {
    avatar.src = user.avatar_url;
  } else {
    avatar.removeAttribute('src');
  }
  avatar.alt = `Photo de profil de ${name}`;
  document.querySelector('#name').textContent = name;
  document.querySelector('#login').textContent = `@${login}`;
  document.querySelector('#nav-login').textContent = login;
  document.querySelector('#bio').textContent = user.bio || 'Aucune biographie renseignée.';
  document.querySelector('#location').textContent = user.location || 'Localisation non renseignée';

  const createdAt = user.created_at ? new Date(user.created_at) : null;
  document.querySelector('#joined').textContent = createdAt && !Number.isNaN(createdAt.valueOf())
    ? `Sur GitHub depuis ${createdAt.getFullYear()}`
    : 'Date de création inconnue';

  const githubLink = document.querySelector('#github-link');
  githubLink.href = user.html_url || `https://github.com/${encodeURIComponent(login)}`;
  document.querySelector('#stat-repos').textContent = user.public_repos ?? 0;
  document.querySelector('#stat-followers').textContent = user.followers ?? 0;
  document.querySelector('#stat-following').textContent = user.following ?? 0;
}

function createRepoCard(repo) {
  const template = document.querySelector('#repo-template');
  const card = template.content.firstElementChild.cloneNode(true);
  const link = card.querySelector('.repo-name');
  link.href = repo.html_url || `https://github.com/${encodeURIComponent(currentUser)}/${encodeURIComponent(repo.name)}`;
  link.textContent = repo.name;
  card.querySelector('.repo-description').textContent = repo.description || 'Aucune description fournie.';
  card.querySelector('.repo-stars').textContent = repo.stargazers_count ?? 0;
  card.querySelector('.repo-forks').textContent = repo.forks_count ?? 0;
  card.querySelector('.repo-language').textContent = repo.language || 'Autre';

  const updatedAt = repo.updated_at ? new Date(repo.updated_at) : null;
  const updatedText = updatedAt && !Number.isNaN(updatedAt.valueOf())
    ? new Intl.DateTimeFormat('fr', { dateStyle: 'medium' }).format(updatedAt)
    : 'Date inconnue';
  card.querySelector('.repo-updated').textContent = `Mis à jour le ${updatedText}`;
  return card;
}

function renderRepos(repos) {
  const grid = document.querySelector('#repo-grid');
  grid.replaceChildren(...repos.map(createRepoCard));
  document.querySelector('#repo-count').textContent = `${repos.length} dépôt${repos.length === 1 ? '' : 's'}`;
  document.querySelector('#repo-empty').hidden = repos.length > 0;
}

function showSection(id) {
  for (const sectionId of ['state-loading', 'state-error', 'content']) {
    document.querySelector(`#${sectionId}`).hidden = sectionId !== id;
  }
}

function getErrorMessage(error, username) {
  const status = Number(error.message);
  if (status === 404) return `Le compte GitHub « ${username} » est introuvable.`;
  if (status === 403 || status === 429) return 'La limite de requêtes GitHub est atteinte. Réessayez plus tard ou activez les données locales.';
  if (!status) return 'Impossible de joindre GitHub. Vérifiez votre connexion puis réessayez.';
  return `GitHub a renvoyé une erreur (${status}). Réessayez dans un instant.`;
}

async function loadPortfolio(username) {
  const normalizedUsername = username.trim().replace(/^@/, '');
  if (!normalizedUsername) return;

  currentUser = normalizedUsername;
  showSection('state-loading');

  try {
    const encodedUsername = encodeURIComponent(normalizedUsername);
    const [user, repos] = await Promise.all([
      fetchJSON(`/users/${encodedUsername}`),
      fetchJSON(`/users/${encodedUsername}/repos?sort=updated&per_page=100`),
    ]);

    allRepos = repos.filter((repo) => !repo.fork);
    renderProfile(user);
    document.querySelector('#repo-search').value = '';
    renderRepos(allRepos);
    showSection('content');
  } catch (error) {
    document.querySelector('#error-message').textContent = getErrorMessage(error, normalizedUsername);
    showSection('state-error');
  }
}

document.querySelector('#retry-btn').addEventListener('click', () => loadPortfolio(currentUser));

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.querySelector('#search-input').value.trim();
  if (username) loadPortfolio(username);
});

document.querySelector('#repo-search').addEventListener('input', (event) => {
  const query = event.currentTarget.value.trim().toLocaleLowerCase();
  const filteredRepos = allRepos.filter((repo) => repo.name.toLocaleLowerCase().includes(query));
  renderRepos(filteredRepos);
});

loadPortfolio(USERNAME);
