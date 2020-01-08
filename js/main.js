(function fetchRepos() {
  fetch('https://api.github.com/search/repositories?q=stars%3A>%3D10000&per_page=100')
    .then(response => response.json())
    .then(data => buildCards(data.items))
})();

const buildCards = (repos) => {
  const results = document.querySelector('.results--container');
  for (let i = 0; i < repos.length; i++) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `<div class="card--heading">
                        <h2 class="heading--tier-2">
                          <a href="${repos[i].html_url}" target="_blank" class="card--heading__link">
                            ${repos[i].name}
                            <img src="img/icon-link.svg" alt="" class="icon-link">
                            <span class="sr-only">opens in new tab</span>
                          </a>
                        </h2>
                        <p class="card--heading__subhead"><span class="text-bold">Author:</span> ${repos[i].owner.login}</p>
                        <p class="card--heading__subhead"><span class="text-bold">Star Count:</span> ${repos[i].stargazers_count}</p>
                      </div>
                      <div class="card--desc">
                        <p>${repos[i].description}</p>
                      </div>
                      <ul class="card--commit-list" aria-hidden="true"></ul>
                      <button class="btn btn-card" id="card-${i}">Recent Commits`;
    results.appendChild(card);
  }
}
