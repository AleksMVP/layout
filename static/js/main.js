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
        open: profilePage,
    },
    registration: {
        text: "Регистрация",
        href: "/registration",
        open: signUpPage,
    },
    login: {
        text: "Логин",
        href: "/login",
        open: loginPage,
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
                <h2 class="name" id="name">${data.name}</h2>
                <img src="assets/pen.svg" class="editicon" id="nameimg">
            </div>
            <div class="iconwithtext">
                <img src="assets/place.svg" class="networkicon">
                <span id="city">${data.city}</span>
                <img src="assets/pen.svg" class="editicon" id="cityimg">
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
            <span class="margin10" id="interestings">
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
                <img src="assets/pen.svg" class="editicon" id="jobimg">
            </div>
            <span class="margin10" id="job">  
                ${data.job}
            </span>
            <div class="iconwithtext">
                <img src="assets/aim.svg" class="meticon">
                <span class="bold">Цели</span>
                <img src="assets/pen.svg" class="editicon" id="aimsimg">
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

function createEditIcon(imgPath) {
    const element = document.createElement('img');
    element.src = imgPath;
    element.classList.add('editicon');

    return element;
}

function createTextArea(value) {
    const input = document.createElement('textarea');
    input.value = value;
    input.rows = '5';
    input.cols = '10';
    input.classList.add('block');

    return input;
}

function createPenAndRemoveChecks(checkMark, crossMark, id) {
    const penImg = createEditIcon("assets/pen.svg");
    penImg.id = id + 'img';

    checkMark.parentNode.insertBefore(penImg, checkMark.nextSibling);
    addListener(id);

    checkMark.remove();
    crossMark.remove();
}

function addListener(id) {
    const penImg = document.getElementById(`${id}img`);
    penImg.addEventListener('click', (evt) => {
        const mainText = document.getElementById(id);
        
        const input = createTextArea(mainText.innerHTML);
        const checkMark = createEditIcon("assets/check-mark.svg");
        const crossMark = createEditIcon("assets/x-mark.svg");

        checkMark.addEventListener('click', (evt) => {
            mainText.innerHTML = input.value;
            input.parentNode.insertBefore(mainText, input.nextSibling);

            createPenAndRemoveChecks(checkMark, crossMark, id);

            input.remove();
            ajax('POST', '/ajax/editprofile', (status, responseText) => {
                if (status !== 200) {
                    alert('Permission denied');
                }
            }, {field: id, text: mainText.innerHTML});
        });

        crossMark.addEventListener('click', (evt) =>{
            input.parentNode.insertBefore(mainText, input.nextSibling);

            createPenAndRemoveChecks(checkMark, crossMark, id);

            input.remove();
        });

        penImg.parentNode.insertBefore(checkMark, penImg.nextSibling);
        penImg.parentNode.insertBefore(crossMark, penImg.nextSibling);
        penImg.remove();
    
        mainText.parentNode.insertBefore(input, mainText.nextSibling);
        mainText.remove();
    });
}

function createProfilePage() {
    application.innerHTML = '';
    createHeader();

    const fields = ['skills', 'interestings', 'education', 'job', 'aims', 'name', 'city'];
    ajax('POST', '/ajax/user', (status, responseText) => {
        if (status !== 200) {
            return;
        }

        createNavigation();

        let data = JSON.parse(responseText);
        application.appendChild(createProfile(data.userInfo));
        for (let i = 0; i < fields.length; i++) {
            addListener(fields[i]);
        }

    }, {userId: 52});
}

function profilePage() {
    ajax('GET', '/ajax/me', (status, responseText) => {
        let isAuthorized = false;

        if (status === 200) {
            isAuthorized = true;
        }

        if (status === 401) {
            isAuthorized = false;
        }

        if (isAuthorized) {
            createProfilePage();
            return;
        }

        loginPage();
    });
}

function loginPage() {
    application.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('login');

    const form = document.createElement('form');
    const main = document.createElement('main');
    const footer = document.createElement('footer');

    const loginInput = createLabeledElements('Логин',
        createInput({type: 'text', placeholder: 'телефон или email', name: 'login'}));
    const pwdInput = createLabeledElements('Пароль',
        createInput({type: 'password', placeholder: 'пароль', name: 'password'}));
    main.appendChild(loginInput);
    main.appendChild(pwdInput);

    const submitBtn = document.createElement('button');
    const p = document.createElement('p');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Войти';
    p.innerHTML =
        `Нету аккаунта? 
        <a href="${appConfig.registration.href}" data-section="registration">
            Зарегестрироваться
        </a>`;
    p.classList.add('message');
    footer.appendChild(submitBtn);
    footer.appendChild(p);

    form.appendChild(main);
    form.appendChild(footer);
    div.appendChild(form);

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        let input = document.getElementsByName('login')[0];
        const login = input.value.trim();

        input = document.getElementsByName('password')[0];
        const password = input.value.trim();

        ajax('POST',
            '/login',
            (status, response) => {
                if (status === 200) {
                    createProfilePage();
                } else {
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            },
            {login, password},
        )
    })

    application.appendChild(div);
}

function signUpPage() {
    application.innerHTML = '';

    const formsBlock = document.createElement('div');
    formsBlock.classList.add('signup');

    let createColumn = function (options, ...elements) {
        let col = document.createElement('div');
        applyOptionsTo(col, options);

        let fieldSet = document.createElement('fieldset');

        elements.forEach((el) => {
           fieldSet.appendChild(el);
        });

        col.appendChild(fieldSet);

        return col;
    }

    const nameInput = createLabeledElements('Имя', createInput(
        {type: 'text', placeholder: 'Полное имя', name: 'name'}));

    const emailInput = createLabeledElements('Адрес электронной почты', createInput(
        {type: 'email', placeholder: 'Электронная почта', name: 'email'}));
    const profilePhotoBtnLabel = createLabeledElements('Фото профиля',
        createBtn('Загрузить с компьютера', {classList: ['stdBtn', 'activable']}));

    const leftCol = createColumn({classList: ['leftcolumn', 'col-2-3']},
        nameInput, emailInput, profilePhotoBtnLabel);

    formsBlock.appendChild(leftCol);

    const sexSelectorLabel = createLabeledElements('Пол',
        createBtn('Мужчина', {classList: ['stdBtn', 'focusable', 'sexBtns'], name: 'maleSelector'}),
        createBtn('Женщина', {classList: ['stdBtn', 'focusable', 'sexBtns'], name: 'femaleSelector'}),
    );

    const birthDateLabel = createLabeledElements('День рождения',
        createInput({classList: ['birthDay'], name: 'day', placeholder: 'ДД'}),
        createInput({classList: ['birthDay'], name: 'month', placeholder: 'ММ'}),
        createInput({classList: ['birthDay'], name: 'year', placeholder: 'ГГГГ'}),
        );

    const cityInput = createLabeledElements('Город', createInput({style: "width: 80%",
                                                                        name: "city",
                                                                        placeholder: "Ваш текущий город"}
                                                                        ));

    const rightCol = createColumn({classList: ['rightcolumn', 'col-1-3']},
        sexSelectorLabel, birthDateLabel, cityInput);
    formsBlock.appendChild(rightCol);

    const separator = createLineSeparator('Информация о себе', {classList: ['signup']});

    const persInfoBlock = document.createElement('div');
    applyOptionsTo(persInfoBlock, {classList: ['signup', 'pers-info-block']});

    const rows = {'Ключевые навыки' : 'Добавить навыки',
                    'Основные интересы' : 'Добавить интересы',
                     'Цели' : 'Добавить интересы'};

    const btnOptions = {classList: ['stdBtn', 'secondary', 'activable']}

    Object.keys(rows).forEach((lbl) => {
        let persInfoRow = document.createElement('div');
        persInfoRow.classList.add('pers-info-row');
        persInfoRow.appendChild(createLabeledElements(lbl, createBtn(rows[lbl], btnOptions)));
        persInfoBlock.appendChild(persInfoRow);
    });

    application.appendChild(formsBlock);
    application.appendChild(separator);
    application.appendChild(persInfoBlock);
}

function createInput(options) {
    const input = document.createElement('input');
    applyOptionsTo(input, options)

    return input;
}

function createLabeledElements(labelName, ...elements) {
    const label = document.createElement('label');
    label.textContent = labelName;

    const innerDiv = document.createElement('div');
    elements.forEach((el) => {
        innerDiv.appendChild(el);
    });

    label.appendChild(innerDiv);

    return label;
}

function createBtn(text, options) {
    const btn = document.createElement('button');
    btn.textContent = text;

    applyOptionsTo(btn, options);

    return btn;
}

function applyOptionsTo(el, options) {
    Object.keys(options).forEach((opt) => {
        switch (opt) {
            case 'classList':
                el.classList.add(...options[opt]);
                break;
            default :
                el[opt] = options[opt];
        }
    });
}

function createLineSeparator(text, options) {
    const sep = document.createElement('div');
    sep.classList.add('separator');

    if (Object.keys(options).length > 0) {
        applyOptionsTo(sep, options);
    }

    sep.textContent = text;
    return sep;
}

createMetPage();

application.addEventListener('click', (evt) => {
    const {target} = evt;

    if (target.dataset.section in appConfig) {
        evt.preventDefault();
        appConfig[target.dataset.section].open();
    }
});
