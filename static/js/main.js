'use strict';

const application = document.body;
const head = document.head;

const appConfig = {
    forMe: {
        text: 'Для меня',
        href: '/forme',
    },
    meetings: {
        text: 'Мероприятия',
        href: '/meetings',
        open: createMetPage,
    },
    people: {
        text: 'Люди',
        href: '/peoples',
        open: createPeoplesPage,
    },
    profile: {
        text: 'Профиль',
        href: '',
        open: createProfilePage,
    },
    registration: {
        text: "Регистрация",
        href: "/registration",
    },
    login: {
        text: "Логин",
        href: "/login",
    }
}

function addCSS(elemName) {
    cssHrefs[elemName].forEach(href => {
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet'
        head.appendChild(link);
    });
}

function createHeader() {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <header class="header">
            <img src="assets/google.png" class="logo">
            <input type="search" placeholder="Люди, мероприятия" class="searchinput">
            <img src="assets/pericon.svg" class="icon">
        </header>
    `

    const icon = tmp.getElementsByClassName('icon')[0];
    icon.dataset.section = 'profile';

    application.appendChild(tmp.firstElementChild);
}

function createNavigation() {
    const navigation = document.createElement('nav');
    navigation.classList.add('navigation');

    const navSettings = [
        'forMe',
        'meetings',
        'people',
    ];

    navSettings.forEach(key => {
        let option = appConfig[key];

        const navPoint = document.createElement('a');
        navPoint.innerHTML = option.text;
        navPoint.href = option.href;
        navPoint.dataset.section = key;
        navPoint.classList.add('navpoint');

        navigation.appendChild(navPoint);
    });
    
    application.appendChild(navigation);
}

const wrapCreateChipsFunc = parentNode => {
    return  labelText => {
        const label = document.createElement('span');
        label.classList.add('chips');
        label.innerHTML = labelText;

        parentNode.appendChild(label);
    };
};

function createMetCard(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <div class="metcard" id="${data.cardId}metcard">
            <img src="${data.imgSrc}" class="metimg">
            <div class="swimblock top">
                <span>${data.text}</span>
                <div class="tabels"></div>  
            </div>
            <h3>${data.title}</h3>
            <h4>${data.place}</h4>
            <h4>${data.date}</h4>
        </div>
    `;

    const labels = tmp.getElementsByClassName('tabels')[0];
    data.labels.forEach(wrapCreateChipsFunc(labels));

    return tmp.firstElementChild;
}

function createUserCard(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <div class="usercard" id="${data.cardId}usercard">
            <img src="${data.imgSrc}" class="overlay">
            <div class="overlay"></div>
            <div class="wraper top">
                <h2>${data.name}</h2>
                <span>${data.job}</span>
                
                <h3>Интересы</h3>
                <div class="tabels"></div>
                
                <h3>Навыки</h3>
                <div class="tabels"></div>
            </div>
        </div>
    `;

    const interestings = tmp.getElementsByClassName('tabels')[0];
    data.interestings.forEach(wrapCreateChipsFunc(interestings));

    const skills = tmp.getElementsByClassName('tabels')[1];
    data.skills.forEach(wrapCreateChipsFunc(skills));
    
    return tmp.firstElementChild;
}

function createMetPage() {
    application.innerHTML = '';
    createHeader();
    createNavigation();

    const main = document.createElement('main');
    main.classList.add('main');

    ajax('POST', '/ajax/metings', (status, responseText) => {
        if (status !== 200) {
            return;
        }
        let cards = JSON.parse(responseText);
        for (let i = 0; i < cards.length; i++) {
            main.appendChild(createMetCard(cards[i]));
        }
    }, {pageNum: 1});

    application.appendChild(main);
}

function createPeoplesPage() {
    application.innerHTML = '';
    createHeader();
    createNavigation();

    const main = document.createElement('main');
    main.classList.add('main');

    ajax('POST', '/ajax/peoples', (status, responseText) => {
        if (status !== 200) {
            return;
        }
        
        const cards = JSON.parse(responseText);
        for (let i = 0; i < cards.length; i++) {
            if (status !== 200) {
                return;
            }

            main.appendChild(createUserCard(cards[i]));
        }
    }, {pageNum: 1});

    application.appendChild(main);
}

function createProfile(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
    <main class="profilemain">
        <div class="leftcolumn">
            <img src="${data.imgSrc}" class="avatar">
            <div class="iconwithtext">
                <h2 class="name">${data.name}</h2>
                <img src="assets/pen.svg" class="editicon">
            </div>
            <div class="iconwithtext">
                <img src="assets/place.svg" class="networkicon">
                <span>${data.city}</span>
                <img src="assets/pen.svg" class="editicon">
            </div>
            <hr>
            <div class="socialnetworks"></div>
            <hr>
            <div class="iconwithtext">
                <img src="assets/arrow.svg" class="networkicon">
                <span class="bold">Мероприятия</span>
            </div>
            <div class="metings"></div>
        </div>
        <div class="rightcolumn">
            <div class="iconwithtext">
                <img src="assets/diamond.svg" class="meticon">
                <span class="bold">Навыки</span>
                <img src="assets/pen.svg" class="editicon" id="skillsimg">
            </div>
            <span class="margin10" id="skills">
                ${data.skills}
            </span>
            <div class="iconwithtext">
                <img src="assets/search.svg" class="meticon">
                <span class="bold">Интересы</span>
                <img src="assets/pen.svg" class="editicon" id="interestingsimg">
            </div>
            <span class="margin10" id="interesting">
                ${data.interestings}
            </span>
            <div class="iconwithtext">
                <img src="assets/education.svg" class="meticon">
                <span class="bold">Образование</span>
                <img src="assets/pen.svg" class="editicon" id="educationimg">
            </div>
            <span class="margin10" id="education">
                ${data.education}
            </span>
            <div class="iconwithtext">
                <img src="assets/job.svg" class="meticon">
                <span class="bold">Карьера</span>
                <img src="assets/pen.svg" class="editicon" id="jobid">
            </div>
            <span class="margin10" id="job">  
                ${data.job}
            </span>
            <div class="iconwithtext">
                <img src="assets/aim.svg" class="meticon">
                <span class="bold">Цели</span>
                <img src="assets/pen.svg" class="editicon" id="aimsid">
            </div>
            <span class="margin10" id="aims">  
                ${data.aims}
            </span>
        </div>
    </main>
    `;

    const func = parentItem => {
        return obj => {
            const iconwithtext = document.createElement('div');
            iconwithtext.classList.add('iconwithtext');

            const img = document.createElement('img');
            img.src = obj.imgSrc;
            img.classList.add('networkicon');

            const link = document.createElement('a');
            link.classList.add('link');
            link.innerHTML = obj.text;

            iconwithtext.appendChild(img);
            iconwithtext.appendChild(link);
            
            parentItem.appendChild(iconwithtext);
        };
    };

    const metings = tmp.getElementsByClassName('metings')[0];
    data.metings.forEach(func(metings));

    const networks = tmp.getElementsByClassName('socialnetworks')[0];
    data.networks.forEach(func(networks));

    return tmp.firstElementChild;
}

function ajax(method, url, callback, body=null) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        callback(xhr.status, xhr.responseText);
    });

    if (body) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
        xhr.send(JSON.stringify(body));
        return;
    }

    xhr.send();
}

function createProfilePage() {
    application.innerHTML = '';
    createHeader();
    ajax('POST', '/ajax/user', (status, responseText) => {
        if (status !== 200) {
            return;
        }

        let data = JSON.parse(responseText);
        application.appendChild(createProfile(data.userInfo));

        document.getElementById('skillsimg').addEventListener('click', (evt) => {
            console.log('hello')
            const mainText = document.getElementById('skills');
            
            const input = document.createElement('textarea');
            input.innerHTML = mainText.innerHTML;
            input.rows = '10';
            input.cols = '10';

            mainText.parentNode.insertBefore(input, mainText.nextSibling);
            mainText.remove();
        });

    }, {userId: 52});
}

createMetPage();

application.addEventListener('click', (evt) => {
    const {target} = evt;

    if (target.dataset.section in appConfig) {
        evt.preventDefault();
        appConfig[target.dataset.section].open();
    }
});
