'use strict';

const application = document.body;

const appConfig = {
    forMe: {
        text: 'Для меня',
        href: '/forme',
    },
    meetings: {
        text: 'Мероприятия',
        href: '/meetings',
        open: () => {
            createMetPage(application);
        },
    },
    people: {
        text: 'Люди',
        href: '/peoples',
        open: () => {
            createPeoplesPage(application);
        },
    },
    profile: {
        text: 'Профиль',
        href: '',
        open: () => {
            profilePage(application);
        },
    },
    registration: {
        text: "Регистрация",
        href: "/registration",
        open: () => {
            signUpPage(application);
        },
    },
    login: {
        text: "Логин",
        href: "/login",
        open: () => {
            loginPage(application);
        },
    }
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

function profilePage(application) {
    ajax('GET', '/ajax/me', (status, responseText) => {
        let isAuthorized = false;

        if (status === 200) {
            isAuthorized = true;
        }

        if (status === 401) {
            isAuthorized = false;
        }

        if (isAuthorized) {
            createProfilePage(application);
            return;
        }

        loginPage(application);
    });
}

function loginPage(application) {
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
                    createProfilePage(application);
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

function signUpPage(application) {
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

createMetPage(application);

application.addEventListener('click', (evt) => {
    const {target} = evt;

    if (target.dataset.section in appConfig) {
        evt.preventDefault();
        appConfig[target.dataset.section].open();
    }
});
