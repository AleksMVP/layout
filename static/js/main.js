const application = document.body;
const head = document.head;

const cssHrefs = {
    header: [
        'css/header.css',
    ],
    navigation: [
        'css/header.css',
    ],
    metcard: [
        'css/metcard.css',
        'css/main.css',
    ],
    main: [
        'css/main.css',
    ],
    usercard: [
        'css/usercard.css',
    ],
    profile: [
        'css/profile.css',
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

function createProfile(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
    <main>
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
            <div class="socialnetworks">
                <div class="iconwithtext">
                    <img src="assets/vk.png" class="networkicon">
                    <a href="" class="link">Александр Лукашенко</a>
                </div>
                <div class="iconwithtext">
                    <img src="assets/telegram.png" class="networkicon">
                    <a href="" class="link">Alexander Lukashenko</a>
                </div>
            </div>
            <hr>
            <div class="iconwithtext">
                <img src="assets/arrow.svg" class="networkicon">
                <span class="bold">Мероприятия</span>
            </div>
            <div class="metings">
                <div class="iconwithtext">
                    <img src="assets/vk.png" class="meticon">
                    <a href="" class="link">Somename</a>
                </div>
                <div class="iconwithtext">
                    <img src="assets/telegram.png" class="meticon">
                    <a href="" class="link">Somename</a>
                </div>
                <div class="iconwithtext">
                    <img src="assets/vk.png" class="meticon">
                    <a href="" class="link">Somename</a>
                </div>
                <div class="iconwithtext">
                    <img src="assets/telegram.png" class="networkicon">
                    <a href="" class="link">Somename</a>
                </div>
            </div>
        </div>
        <div class="rightcolumn">
            <div class="iconwithtext">
                <img src="assets/diamond.svg" class="meticon">
                <span class="bold">Навыки</span>
                <img src="assets/pen.svg" class="editicon">
            </div>
            <span class="margin10" id="skills">
                ${data.skills}
            </span>
            <div class="iconwithtext">
                <img src="assets/search.svg" class="meticon">
                <span class="bold">Интересы</span>
                <img src="assets/pen.svg" class="editicon">
            </div>
            <span class="margin10" id="interesting">
                ${data.interestings}
            </span>
            <div class="iconwithtext">
                <img src="assets/education.svg" class="meticon">
                <span class="bold">Образование</span>
                <img src="assets/pen.svg" class="editicon">
            </div>
            <span class="margin10" id="education">
                ${data.education}
            </span>
            <div class="iconwithtext">
                <img src="assets/job.svg" class="meticon">
                <span class="bold">Карьера</span>
                <img src="assets/pen.svg" class="editicon">
            </div>
            <span class="margin10" id="job">  
                ${data.job}
            </span>
            <div class="iconwithtext">
                <img src="assets/aim.svg" class="meticon">
                <span class="bold">Цели</span>
                <img src="assets/pen.svg" class="editicon">
            </div>
            <span class="margin10" id="aims">  
                ${data.aims}
            </span>
        </div>
    </main>
    `;

    const metings = tmp.getElementsByClassName('metings')[0];
    console.log(metings);
    data.metings.forEach(meet => {
        const iconwithtext = document.createElement('div');
        iconwithtext.classList.add('iconwithtext');

        const meetImg = document.createElement('img');
        meetImg.src = meet.imgSrc;
        meetImg.classList.add('networkicon');

        const meetLink = document.createElement('a');
        meetLink.classList.add('link');
        meetLink.innerHTML = meet.text;

        iconwithtext.appendChild(meetImg);
        iconwithtext.appendChild(meetLink);
        
        metings.appendChild(iconwithtext);
    });

    const networks = tmp.getElementsByClassName('socialnetworks')[0];
    data.networks.forEach(network => {
        const iconwithtext = document.createElement('div');
        iconwithtext.classList.add('iconwithtext');

        const meetImg = document.createElement('img');
        meetImg.src = network.imgSrc;
        meetImg.classList.add('networkicon');

        const meetLink = document.createElement('a');
        meetLink.classList.add('link');
        meetLink.innerHTML = network.text;

        iconwithtext.appendChild(meetImg);
        iconwithtext.appendChild(meetLink);
        
        networks.appendChild(iconwithtext);
    });

    return tmp.firstElementChild;
}

function createProfilePage() {
    application.innerHTML = '';
    createHeader();
    application.appendChild(createProfile({
        imgSrc: 'assets/luckash.jpeg',
        name: 'Александр Лукашенко',
        city: 'Пертрозаводск',
        networks: [
            {
                imgSrc: 'assets/vk.png',
                text: 'Александр Лукашенко',
            },
            {
                imgSrc: 'assets/vk.png',
                text: 'Александр Лукашенко',
            },
        ],
        metings: [
            {
                imgSrc: 'assets/vk.png',
                text: 'Александр Лукашенко',
            },
            {
                imgSrc: 'assets/vk.png',
                text: 'Александр Лукашенко',
            },
        ],
        interestings: `
                    Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit, sed 
                    do eiusmod tempor incididunt ut 
                    labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco 
                    laboris nisi ut aliquip ex ea 
                    commodo consequat. Duis aute 
                    irure dolor in reprehenderit 
                    in voluptate velit esse cillum 
        `,
        skills: `Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit, sed 
                do eiusmod tempor incididunt ut 
                labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis 
                nostrud exercitation ullamco 
        `,
        education: 'МГТУ им. Н. Э. Баумана до 2010',
        job: 'MAIL GROUP до 2008',
        aims: 'Хочу от жизни всего',
    }));
}

createMetPage();

application.addEventListener('click', (evt) => {
    const {target} = evt;
    evt.preventDefault();
    console.log(target.dataset.section);
    appConfig[target.dataset.section].open();
    /*if (target instanceof HTMLAnchorElement) {
        appConfig[target.dataset.section].open();
    }*/
 });
