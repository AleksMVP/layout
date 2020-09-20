const application = document.body;
const head = document.head;

const cssHrefs = {
    header: [
        'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;1,100&display=swap',
        'css/header.css',
    ],
    navigation: [
        'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;1,100&display=swap',
        'css/header.css',
    ],
    metcard: [
        'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;1,100&display=swap',
        'css/metcard.css',
        'css/main.css',
    ],
    main: [
        'css/main.css',
    ],
    usercard: [
        'css/usercard.css'
    ]
}

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
            <img src="assets/pericon.svg" class="icon" onclick="window.open('profile.html')">
        </header>
    `

    addCSS('header');
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

    addCSS('navigation');
    
    application.appendChild(navigation);
}

function createMetCard(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <div class="metcard">
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
    data.labels.forEach(labelText => {
        const label = document.createElement('span');
        label.classList.add('chips');
        label.innerHTML = labelText;

        labels.appendChild(label);
    });

    addCSS('metcard'); 

    return tmp.firstElementChild;
}


function createUserCard(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <div class="usercard">
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
        </div>`;

    const interestings = tmp.getElementsByClassName('tabels')[0];
    data.interestings.forEach(labelText => {
        const label = document.createElement('span');
        label.classList.add('chips');
        label.innerHTML = labelText;

        interestings.appendChild(label);
    });

    const skills = tmp.getElementsByClassName('tabels')[1];
    data.skills.forEach(labelText => {
        const label = document.createElement('span');
        label.classList.add('chips');
        label.innerHTML = labelText;

        skills.appendChild(label);
    });

    addCSS('usercard');
    
    return tmp.firstElementChild;
}

function createMetPage() {
    application.innerHTML = '';
    createHeader();
    createNavigation();

    const main = document.createElement('main');
    main.classList.add('main');

    for (let i = 0; i < 10; i++) {
        main.appendChild(createMetCard({
            text: `Lorem ipsum dolor sit amet,
                   consectetur adipiscing elit, sed
                   do eiusmod tempor incididunt ut
                   labore et dolore magna aliqua.
                   Ut enim ad minim veniam, quis
                   nostrud exercitation ullamco labori`,
            imgSrc: 'assets/paris.jpg',
            labels: ['Rust', 'Забив', 'В падике'],
            title: 'Забив с++',
            place: 'Дом Пушкина, улица Калатушкина',
            date: '12 сентября 2020',
        }));
    }

    application.appendChild(main);
}

function createPeoplesPage() {
    application.innerHTML = '';
    createHeader();
    createNavigation();

    const main = document.createElement('main');
    main.classList.add('main');

    for (let i = 0; i < 10; i++) {
        main.appendChild(createUserCard({
            imgSrc: 'assets/luckash.jpeg',
            name: 'Александр',
            job: 'Главный чекист КГБ',
            interestings: ['Картофель', 'Хоккей'],
            skills: ['Разгон митингов', 'Сбор урожая'],
        }));
    }

    application.appendChild(main);
}


createMetPage();

application.addEventListener('click', (evt) => {
    const {target} = evt;
 
    if (target instanceof HTMLAnchorElement) {
        evt.preventDefault();
        appConfig[target.dataset.section].open();
    }
 });
