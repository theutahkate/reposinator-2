const baseUrl = 'https://api.github.com/';
const results = document.querySelector('.results--container');
const kittenBtn = document.querySelector('.btn-kitten');
let isKittens = false;

kittenBtn.addEventListener('click', function() {
  toggleKittenMode()
});

const fetchRepos = () => {
  fetch(`${baseUrl}search/repositories?q=stars%3A>%3D10000&per_page=100`)
    .then(response => response.json())
    .then(data => buildCards(data.items))
};

const toggleKittenMode = () => {
  results.innerHTML = '';
  if (!isKittens) {
    kittenBtn.innerHTML = '<img src="img/sadcat.png" alt="orange tabby cartoon cat, sobbing because you hate kittens" class="sad-kitten">No Kitten Mode'
    fetchKittenRepos()
    isKittens = true;
    document.getElementsByTagName('body')[0].classList.add('kitten-mode')
  } else {
    kittenBtn.innerText = 'Kitten Mode';
    fetchRepos()
    isKittens = false;
    document.querySelector('.kitten-mode').classList.remove('kitten-mode')
  }
}

function fetchKittenRepos() {
  fetch(`${baseUrl}search/repositories?q=kitten&watchers_count:>10000&private:false&order=desc`)
    .then(response => response.json())
    .then(data => buildCards(data.items))
}

const buildCards = (repos) => {
  for (let i = 0; i < repos.length; i++) {
    let owner = repos[i].owner.login;
    let repoName = repos[i].name;

    let card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('id', `card-${i}`)

    let button = document.createElement('button');
    button.classList.add('btn', 'btn-card');
    button.innerText = 'Recent Commits';

    card.innerHTML = `<div class="card--content-wrapper">
                        <div class="card--heading">
                          <h2 class="heading--tier-2">
                            <a href="${repos[i].html_url}" target="_blank" class="card--heading__link">
                              ${repoName}
                              <img src="img/icon-link.svg" alt="" class="icon-link">
                              <span class="sr-only">opens in new tab</span>
                            </a>
                          </h2>
                          <p class="card--heading__subhead"><span class="text-bold">Author:</span> ${owner}</p>
                          <p class="card--heading__subhead"><span class="text-bold">Star Count:</span> ${repos[i].stargazers_count}</p>
                        </div>
                        <div class="card--desc">
                          <p>${repos[i].description}</p>
                        </div>
                      </div>`;

    button.addEventListener('click', function() {
      toggleCommits(repoName, owner, i);
    })
    card.appendChild(button);
    results.appendChild(card);
  }
}

const toggleCommits = (repoName, owner, cardIndex) => {
  const ul = document.querySelector(`#card-${cardIndex} .card--commit-list`);
  const noCommitsP = document.querySelector(`#card-${cardIndex} .card--no-commits`);
  const commitsBtn = document.querySelector(`#card-${cardIndex} .btn-card`);
  if (ul) {
    ul.remove();
    commitsBtn.innerText = 'Recent Commits';
  } else if (noCommitsP) {
    noCommitsP.remove();
  } else {
    fetchCommits(repoName, owner, cardIndex);
  }
}

const fetchCommits = (repoName, owner, cardIndex) => {
  const commitsSince = new Date(Date.now() - 86400 * 1000).toISOString()
  fetch(`${baseUrl}repos/${owner}/${repoName}/commits?since=${commitsSince}`)
    .then(response => response.json())
    .then(data => buildCommits(data, cardIndex))
}

const buildCommits = (commits, cardIndex) => {
  const commitsBtn = document.querySelector(`#card-${cardIndex} .btn-card`);
  if (commits.length) {
    let wrapper = document.querySelector(`#card-${cardIndex} .card--content-wrapper`);
    const ul = document.createElement('ul');
    ul.classList.add('card--commit-list');
    for (let i = 0; i < commits.length; i++) {
      const element = commits[i];
      let li = document.createElement('li');
      li.classList.add('commit');
      li.innerHTML = `<div class="text-bold commit--author">${element.commit.author.name }</div>
                      <div class="commit--date">${element.commit.author.date }</div>
                      <div class="commit--message"><span class="text-bold">Message:</span> ${element.commit.message}</div>`;
      ul.appendChild(li);
    }
    wrapper.appendChild(ul);
  } else {
    let wrapper = document.querySelector(`#card-${cardIndex} .card--content-wrapper`);
    const p = document.createElement('p');
    p.classList.add('card--no-commits');
    p.innerHTML = '<p class="card--no-commits">No commits in the last 24 hours</p>';
    wrapper.appendChild(p);
  }
  commitsBtn.innerText = 'Hide Commits';
}

fetchRepos();