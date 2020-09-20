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
    const header = document.createElement('header');
    header.classList.add('header');

    const logo = document.createElement('img');
    logo.src = 'assets/google.png';
    logo.classList.add('logo');

    const searchbar = document.createElement('input');
    searchbar.type = 'search';
    searchbar.placeholder = 'Люди, мероприятия';
    searchbar.classList.add('searchinput');

    const icon = document.createElement('img');
    icon.src = 'assets/pericon.svg';
    icon.classList.add('icon');

    header.appendChild(logo);
    header.appendChild(searchbar);
    header.appendChild(icon);

    addCSS('header');

    console.log(application);
    application.appendChild(header);
}

function createNavigation() {
    const navigation = document.createElement('nav');
    navigation.classList.add('navigation');

    const navSettings = {
        forMe: {
            text: 'Для меня',
            href: '',
            class: ['navpoint'],
        },
        meetings: {
            text: 'Мероприятия',
            href: '',
            class: ['navpoint'],
        },
        people: {
            text: 'Люди',
            href: '',
            class: ['navpoint'],
        },
    }

    Object.keys(navSettings).forEach(key => {
        option = navSettings[key];

        const navPoint = document.createElement('a');
        navPoint.innerHTML = option.text;
        navPoint.href = option.href;
        navPoint.classList = option.class;

        navigation.appendChild(navPoint);
    });

    addCSS('navigation');
    
    application.appendChild(navigation);
}

createHeader();
createNavigation();
