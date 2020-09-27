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

var currentTab = 0;

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
    createHeader(application);
    createNavigation(application);
    const div = document.createElement('div');
    div.classList.add('login');

    const form = document.createElement('form');
    form.classList.add('vertical-center');
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

function createSignupFormLayout() {
    const form = document.createElement('form');

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

    const tab1 = document.createElement('div');
    tab1.classList.add('tab');

    const formsBlock = document.createElement('div');
    formsBlock.classList.add('signup');

    const nameInput = createLabeledElements('Имя', createInput(
        {type: 'text', placeholder: 'Полное имя', name: 'name', required: 'true', maxLength: '30'}));

    const emailInput = createLabeledElements('Адрес электронной почты', createInput(
        {type: 'email', placeholder: 'Электронная почта', name: 'email', required: 'true', maxLength: '250'}));

    const profilePhotoBtnLabel = createLabeledElements('Фото профиля');
    const fileUploader = document.createElement('div');
    fileUploader.innerHTML = '<input type="file" name="photos" id="photos" class="inputfile" data-multiple-caption="{count} files selected" multiple="">'
    fileUploader.innerHTML += `<label for="photos"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"> 
        <path d='M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z'>
        </path></svg> <span>Выберите файл…</span></label>`

    const leftCol = createColumn({classList: ['leftcolumn', 'col-2-3']},
        nameInput, emailInput, profilePhotoBtnLabel, fileUploader);

    formsBlock.appendChild(leftCol);

    const radioBtnWrapper = document.createElement('div');
    radioBtnWrapper.classList.add('form_radio_btn_wrapper');

    radioBtnWrapper.append(
        createRadioBtn('male', 'Мужчина', 'gender', 'male', {classList:['form_radio_btn']}),
        createRadioBtn('female', 'Женщина',  'gender', 'female', {classList:['form_radio_btn']}));
    const sexSelectorLabel = createLabeledElements('Пол', radioBtnWrapper);

    const birthDateLabel = createLabeledElements('День рождения',
        createInput({classList: ['birthDay'], name: 'day', placeholder: 'ДД', maxLength: '2'}),
        createInput({classList: ['birthDay'], name: 'month', placeholder: 'ММ', maxLength: '2'}),
        createInput({classList: ['birthDay'], name: 'year', placeholder: 'ГГГГ', maxLength: '4'}),
    );

    const cityInput = createLabeledElements('Город',
        createInput({style: "width: 80%", name: "city", placeholder: "Ваш текущий город", maxLength: '30', required: 'true'}
    ));

    const rightCol = createColumn({classList: ['rightcolumn', 'col-1-3']},
        sexSelectorLabel, birthDateLabel, cityInput);
    formsBlock.appendChild(rightCol);

    const separator1 = createLineSeparator('Информация о себе', {classList: ['signup']});

    const rowsLbls = {'Ключевые навыки' : 'skills',
        'Основные интересы' : 'interests',
        'Цели' : 'goals'};

    let rows = [];
    Object.keys(rowsLbls).forEach((lbl) => {
        let persInfoRow = document.createElement('div');
        persInfoRow.classList.add('pers-info-row');

        let textArea = document.createElement('textarea');
        textArea.name = rowsLbls[lbl];
        textArea.maxLength = 300;

        let textAreaWrapper = document.createElement('span');
        textAreaWrapper.appendChild(textArea);
        textAreaWrapper.classList.add('textarea-wrapper');

        persInfoRow.appendChild(createLabeledElements(lbl, textAreaWrapper));
        rows.push(persInfoRow);
    });
    let persInfoRow = document.createElement('div');

    persInfoRow.classList.add('pers-info-row');
    persInfoRow.appendChild(createLabeledElements(
        'В каких сферах вы бы хотели получать рекоммендации?',
        createBtn('+ Добавить рекоммендации', {type: 'button', classList: ['stdBtn', 'secondary', 'activable']})));
    rows.push(persInfoRow);

    const persInfoBlock = createColumn({classList: ['signup', 'pers-info-block']}, ...rows);

    tab1.append(formsBlock, separator1, persInfoBlock);

    const tab2 = document.createElement('div');
    tab2.classList.add('tab');

    const loginPassBlock = document.createElement('div');
    loginPassBlock.classList.add('signup', 'center');

    const loginInput = createLabeledElements('Логин', createInput(
        {type: 'text', placeholder: 'Ваш логин', name: 'login', required: 'true', maxLength: '30'}));

    const passwordInput = createLabeledElements('Придумайте пароль', createInput(
        {type: 'password', placeholder: 'Пароль', name: 'password', required: 'true', maxLength: '30', minLength: '5'}));

    const repeatPasswordInput = createLabeledElements('Повторите пароль', createInput(
        {type: 'password', placeholder: 'Пароль', name: 'repeatPassword', required: 'true', maxLength: '30'}));

    const col = createColumn({classList: ['leftcolumn', 'col-2-3']},
        loginInput, passwordInput, repeatPasswordInput);

    loginPassBlock.appendChild(col);
    tab2.appendChild(loginPassBlock);

    const signupBtnBlock = document.createElement('div')
    signupBtnBlock.classList.add('center');

    const prevBtn = createBtn('Вернуться',
        {id: 'prevBtn', type: 'button', classList: ['stdBtn', 'activable', 'done']});
    prevBtn.onclick = () => nextPrev(-1);

    const nextBtn = createBtn('Далее',
        {id: 'nextBtn', type: 'button', classList: ['stdBtn', 'activable', 'done']});
    nextBtn.onclick = () => nextPrev(1);

    signupBtnBlock.append(prevBtn, nextBtn);

    form.append(tab1,tab2, signupBtnBlock);

    return form;
}

function nextPrev(n) {
    // This function will figure out which tab to display
    let x = document.getElementsByClassName("tab");
    if (n === 1 && !validateSignupForm()) {
        return false;
    }
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        const submBtn = document.getElementById('nextBtn');
        submBtn.type = 'submit';
        submBtn.click();
        currentTab = 0;
        appConfig.login.open();

        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateSignupForm() {
    let valid = true;
    let x = document.getElementsByClassName("tab");
    let y = x[currentTab].querySelectorAll('input[required]');
    for (let i = 0; i < y.length; i++) {
        if (y[i].value === "") {
            y[i].className += " invalid";
            valid = false;
        }
    }


    switch (currentTab) {
        case 0: // first tab
            const dayInput = document.getElementsByName('day')[0];
            const monthInput = document.getElementsByName('month')[0];
            const yearInput = document.getElementsByName('year')[0];

            if (!isValidDate(
                    parseInt(dayInput.value, 10),
                    parseInt(monthInput.value, 10),
                    parseInt(yearInput.value, 10))) {
                dayInput.classList.add('invalid');
                monthInput.classList.add('invalid');
                yearInput.classList.add('invalid');
                valid = false;
            }
            break;
        case 1:
            const pwd = document.getElementsByName('password')[0];
            const repeatPwd = document.getElementsByName('repeatPassword')[0];

            if (!isValidPassword(pwd.value.trim(), repeatPwd.value.trim())) {
                pwd.classList.add('invalid');
                repeatPwd.classList.add('invalid');

                valid = false;
            }
    }

    return valid;
}

function isValidPassword(pwd, repeatPwd) {
    return pwd === repeatPwd;

}

function isValidDate(day, month, year) {
    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month === 0 || month > 12)
        return false;

    let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

function showTab(n) {
    // This function will display the specified tab of the form...
    let x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n === 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n === (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Зарегестрироваться!";
    } else {
        document.getElementById("nextBtn").innerHTML = "Далее";
    }
}

function signUpPage(application) {
    application.innerHTML = '';

    createHeader(application);
    createNavigation(application);
    const form = createSignupFormLayout();

    application.appendChild(form);

    showTab(currentTab);

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        let gender = 'male';
        if (document.getElementById('male').checked) {
            gender = 'male';
        } else if (document.getElementById('female').checked) {
            gender = 'female';
        }

        const form = document.querySelector('form');
        let formData = new FormData(form);
        formData.append('gender', gender);

        const photos = document.getElementById('photos').files;
        let cnt = photos.length;
        for (let i = 0; i < cnt; i++) {
            formData.append(photos[i].name, photos[i]);
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/signup", true);
        xhr.onload = function(oEvent) {
            if (xhr.status == 200) {
                console.log('200');
            } else {
                oOutput.innerHTML = "Error " + xhr.status + " occurred when trying to upload your file.<br \/>";
            }
        };

        xhr.send(formData);
    });

    const inputs = document.querySelectorAll( '.inputfile' );
    Array.prototype.forEach.call( inputs, function( input )
    {
        let label	 = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener( 'change', function( e )
        {
            let fileName = '';
            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
                fileName = e.target.value.split( '\\' ).pop();

            if( fileName )
                label.querySelector( 'span' ).innerHTML = fileName;
            else
                label.innerHTML = labelVal;
        });
    });
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
            case 'required':
                if (options[opt] === 'true') {
                    el.required = true;
                } else if (options[opt] === 'false') {
                    el.required = false;
                }
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

function createRadioBtn(btnId, text, name, value, options) {
    const div = document.createElement('div');
    applyOptionsTo(div, options)
    div.appendChild(createInput(
        {type:'radio', id: btnId, value: value, name: name, required: 'true'}));
    const lbl = document.createElement('label');
    lbl.htmlFor = btnId;
    lbl.textContent = text;
    div.appendChild(lbl);
    return div;
}

createMetPage(application);

application.addEventListener('click', (evt) => {
    const {target} = evt;

    if (target.dataset.section in appConfig) {
        evt.preventDefault();
        appConfig[target.dataset.section].open();
    }
});
