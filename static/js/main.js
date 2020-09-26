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

function createProfilePage(application) {
    application.innerHTML = '';
    createHeader(application);
    let icon = document.getElementsByClassName('icon')[0];
    let span = document.createElement('span');
    const signout = document.createElement('a');
    signout.href = '/meetings'
    signout.textContent = 'Выйти';
    signout.dataset.section = 'meetings';

    // span.textContent = 'Выйти';
    span.appendChild(signout);
    span.classList.add('popuptext');
    span.id = 'signout';

    const wrapperIcon = document.createElement('div');
    wrapperIcon.classList.add('popup');
    wrapperIcon.append(icon, span);

    document.getElementsByClassName('header')[0].appendChild(wrapperIcon);

    icon.onmouseover = () => {
        let popup = document.getElementById('signout');
        popup.classList.toggle('show');
    }

    signout.addEventListener('click', (evt) => {
        evt.preventDefault();

        ajax('POST',
            '/signout',
            (status, responseText) => {

            })
    });

    const fields = ['skills', 'interestings', 'education', 'job', 'aims', 'name', 'city'];
    ajax('POST', '/ajax/user', (status, responseText) => {
        if (status !== 200) {
            return;
        }

        createNavigation(application);

        let data = JSON.parse(responseText);
        application.appendChild(createProfile(data.userInfo));
        for (let i = 0; i < fields.length; i++) {
            addListener(fields[i]);
        }

    }, {userId: 52});
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

function signUpPage(application) {
    application.innerHTML = '';

    createHeader(application);
    createNavigation(application);
    const form = document.createElement('form');

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
        {type: 'text', placeholder: 'Полное имя', name: 'name', required: 'true'}));

    const emailInput = createLabeledElements('Адрес электронной почты', createInput(
        {type: 'email', placeholder: 'Электронная почта', name: 'email', required: 'true'}));

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

    const signupBtnBlock = document.createElement('div')
    signupBtnBlock.appendChild(createBtn('Зарегестрироваться!',
        {type: 'submit', classList: ['stdBtn', 'activable', 'done']}));
    signupBtnBlock.classList.add('center');
    persInfoBlock.appendChild(signupBtnBlock);

    form.appendChild(formsBlock);
    form.appendChild(separator);
    form.appendChild(persInfoBlock);
    application.appendChild(form);

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
        {type:'radio', id: btnId, value: value, name: name}));
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
