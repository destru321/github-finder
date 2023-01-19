async function getUsers(searchQuery) {
    if(searchQuery != '' && searchQuery != undefined) {
        let users = await fetch(`https://api.github.com/search/users?q=${searchQuery}`);

        let res = await users.json();

        let container = document.querySelector('.users');
        container.innerHTML = '';

        res.items.forEach(user => {
            let userContainer = document.createElement('div');
            userContainer.classList = 'flex items-center justify-between bg-[#252931] rounded-lg p-2 my-2 w-9/12 cursor-pointer sm:w-5/12 lg:w-[30%] user'
            let userAvatar = document.createElement('img');
            userAvatar.src = user.avatar_url
            userAvatar.classList = 'w-10 h-10 rounded-full'

            let userName = document.createElement('h3');
            userName.innerText = user.login;
            userContainer.appendChild(userAvatar);
            userContainer.appendChild(userName);
            container.appendChild(userContainer);
        })
    }
}

async function getUser(userName) {
    if(userName != '' && userName != undefined) {
        let user = await fetch(`https://api.github.com/users/${userName}`);

        let repos = await fetch(`https://api.github.com/users/${userName}/repos`);

        let res = await user.json();
        let resRepos = await repos.json();
        let reposHtml = ``;
        resRepos.forEach(repo => {
            reposHtml += `
                <div class="w-5/6 bg-[#252931] p-2 my-2 rounded-lg">
                    <a class="block w-full h-full" href="${repo.html_url}" target="_blank">
                        <h2>${repo.name}</h2>
                        <h3>Watchers: ${repo.watchers}</h3>
                    </a>
                </div>

            `
        })

        document.getElementById('inject').innerHTML = `
                <div class="flex flex-col items-center">
                    <div class="w-11/12">
                        <a class="back text-center block" href="/">Back to search</a>
                        <div class="flex items-center justify-between w-full mb-5">
                            <img src="${res.avatar_url}" alt="avatar" class="h-16 w-16 rounded-full">
                            <h2 class="text-2xl">${res.login}</h2>
                        </div>
                        <p class="text-center mb-5">${res.bio || "No bio yet"}</p>
                        <div class="flex justify-center mb-5">
                            <button class="rounded-lg bg-[#252931] h-10 p-2">
                                <a class="block w-full h-full" href="https://github.com/${res.login}" target="_blank">View github profile</a>
                            </button>
                        </div>
                        <div class="flex justify-between items-center w-full mb-5">
                            <div class="flex justify-start w-3/12">
                                <div class="flex flex-col items-center">
                                    <p>Follows</p>
                                    <p>${res.followers}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-center w-3/12">
                                <p>Following</p>
                                <p>${res.following}</p>
                            </div>
                            <div class="flex justify-end w-3/12">
                                    <div class="flex flex-col items-center">
                                        <p>Repos</p>
                                        <p>${res.public_repos}</p>
                                    </div>
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            ${reposHtml}
                        </div>
                    </div>
                </div>
            `;

            userPageFunctions();
    } else {
        window.history.pushState(" "," ","/")
    }
    
}


function landingPage(usr) {
    if(window.location.pathname != '/user') {
        document.getElementById('inject').innerHTML = `
        <main id="main" class="flex flex-col items-center">
            <div class="flex items-center justify-between p-1 w-5/6 h-12 border-2 border-[#252931] rounded-lg">
                <input type="text" class="bg-transparent outline-0 w-4/6 text-black h-full p-2 search">
                <button class="bg-[#252931] w-2/6 h-full rounded-lg searchBtn" type="button">SEARCH</button>
            </div>
            <div class="users w-full sm:w-5/6 flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-between lg:w-[900px] mt-5">
    
            </div>
        </main>`
        landingPageFunctions();
    } else {
        document.getElementById('inject').innerHTML = '';
        getUser(usr);
    }
}

window.addEventListener('popstate', () => {
    landingPage();
})

landingPage();

function userPageFunctions() {
    document.querySelector('.back').addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState("", "", "/");
        landingPage();
        landingPageFunctions();
    })
}

function landingPageFunctions() {
    document.querySelector('.searchBtn').addEventListener('click', async () => {
        let searchInput = document.querySelector('.search');
        await getUsers(searchInput.value);
        searchInput.value = '';
        document.querySelectorAll('.user').forEach(user => {
            user.addEventListener('click', (e) => {
                window.history.pushState("", "", "/user");
                landingPage(user.childNodes[1].innerText);
            })
        })
    })
}