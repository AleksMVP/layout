'use strict';

function createIconWithText() {
    const wrap = document.createElement('div');
    wrap.classList.add('iconwithtext');

    return wrap;
}

function createMetIcon(iconSrc) {
    const icon = document.createElement('img');
    icon.classList.add('meticon');
    icon.src = iconSrc;

    return icon;
}

function createBoldSpan(text) {
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('bold');
    nameSpan.innerHTML = text;

    return nameSpan;
}

function createLink(href) {
    const link = document.createElement('a');
    link.classList.add('link');
    link.innerHTML = href;

    return link;
}

function fillRightColumn(rightColumn, data) {
    const fillRigthColumn = [
        {
            iconSrc: 'assets/diamond.svg',
            name: 'Навыки',
            key: 'skills',
        },
        {
            iconSrc: 'assets/search.svg',
            name: 'Интересы',
            key: 'interestings',
        },
        {
            iconSrc: 'assets/education.svg',
            name: 'Образование',
            key: 'education',
        },
        {
            iconSrc: 'assets/job.svg',
            name: 'работа',
            key: 'job',
        },
        {
            iconSrc: 'assets/aim.svg',
            name: 'Цели',
            key: 'aims',
        },
    ];


    for (let i = 0; i < fillRigthColumn.length; i++) {
        const id = fillRigthColumn[i].key;

        const wrap = createIconWithText();
        const editicon = createEditIcon('assets/pen.svg');

        wrap.appendChild(createMetIcon(fillRigthColumn[i].iconSrc));
        wrap.appendChild(createBoldSpan(fillRigthColumn[i].name));
        wrap.appendChild(editicon);

        const mainText = document.createElement('span');
        mainText.classList.add('margin10');
        mainText.innerHTML = data[id];

        const input = createTextArea(mainText.innerHTML);

        rightColumn.appendChild(wrap);
        rightColumn.appendChild(mainText);

        addListener(editicon, mainText, input, () => {
            mainText.innerHTML = input.value;

            ajax('POST', '/ajax/editprofile', (status, responseText) => {
                if (status !== 200) {
                    alert('Permission denied');
                }
            }, {field: id, text: mainText.innerHTML});
        });
    }
}

function createNameField(name) {
    const wrap = createIconWithText();
    const editicon = createEditIcon("assets/pen.svg");

    const mainText = document.createElement('h2');
    mainText.classList.add('name');
    mainText.innerHTML = name;

    wrap.appendChild(mainText);
    wrap.appendChild(editicon);

    const input = document.createElement('input');
    input.value = mainText.innerHTML;

    addListener(editicon, mainText, input, () => {
        mainText.innerHTML = input.value;

        ajax('POST', '/ajax/editprofile', (status, responseText) => {
            if (status !== 200) {
                alert('Permission denied');
            }
        }, {field: 'name', text: mainText.innerHTML});
    });

    return wrap;
}

function createCityField(cityName) {
    const wrap = createIconWithText();
    const mainText = document.createElement('span');
    mainText.classList.add('city');
    mainText.innerHTML = cityName;

    const editicon = createEditIcon('assets/pen.svg');

    wrap.appendChild(createMetIcon('assets/place.svg'));
    wrap.appendChild(mainText);
    wrap.appendChild(editicon);

    const input = document.createElement('input');
    input.value = mainText.innerHTML;

    addListener(editicon, mainText, input, () => {
        mainText.innerHTML = input.value;

        ajax('POST', '/ajax/editprofile', (status, responseText) => {
            if (status !== 200) {
                alert('Permission denied');
            }
        }, {field: 'city', text: mainText.innerHTML});
    });

    return wrap;
}

function createAvatarField(imgSrc) {
    const avatarWraper = document.createElement('div');
    avatarWraper.classList.add('avatarwraper');

    const overlay = document.createElement('div');
    overlay.classList.add('layout');

    const fileChoser = document.createElement('input');
    fileChoser.type = 'file';
    fileChoser.classList.add('button');

    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Сохранить';
    saveButton.classList.add('button');

    saveButton.hidden = true;

    const avatar = document.createElement('img');
    avatar.classList.add('avatar');
    avatar.src = imgSrc;

    fileChoser.onchange = (event) => {
        var file = event.target.files[0];
        var FR = new FileReader();
        
        FR.onload = function(event) {
            console.dir(event);
            avatar.src = event.target.result;
            saveButton.hidden = false;
        };
        
        FR.readAsDataURL(file);
    };

    overlay.appendChild(fileChoser);
    overlay.appendChild(saveButton);

    avatarWraper.appendChild(overlay);
    avatarWraper.appendChild(avatar);

    return avatarWraper;
}

function createSocialNetworks(data) {
    const networksConfig = {
        vk: {
            src: 'assets/vk.png',
        },
        telegram: {
            src: 'assets/telegram.png',
        },
    };  

    const networkWraper = document.createElement('div');
    networkWraper.classList.add('socialnetworks');

    Object.keys(data.networks).forEach(key => {
        const input = document.createElement('input');
        const href = data.networks[key];
        const link = createLink("");

        let editicon;
        if (href === "") {
            editicon = createEditIcon('assets/plus.svg');
        } else {
            link.href = href;
            link.innerHTML = href;
            input.value = href;

            editicon = createEditIcon('assets/pen.svg');
        }

        addListener(editicon, link, input, () => {
            link.href = input.value;
            link.innerHTML = input.value;

            editicon.src = 'assets/pen.svg';
            ajax('POST', '/ajax/editprofile/social', (status, responseText) => {
                if (status !== 200) {
                    alert('Permission denied');
                }
            }, {field: key, text: link.innerHTML});
        });

        const elem = createIconWithText();
        elem.appendChild(createMetIcon(networksConfig[key].src));
        elem.appendChild(link);
        elem.appendChild(editicon);

        networkWraper.appendChild(elem);
    });

    return networkWraper;
}

function createMetings(data) {
    const metings = document.createElement('div');
    metings.classList.add('metings');

    data.metings.forEach(obj => {
        const iconwithtext = createIconWithText();

        iconwithtext.appendChild(createMetIcon(obj.imgSrc));
        iconwithtext.appendChild(createLink(obj.text));
        
        metings.appendChild(iconwithtext);
    });

    return metings;
}

function fillLeftColumn(leftColumn, data) {
    leftColumn.appendChild(createAvatarField(data.imgSrc));
    leftColumn.appendChild(createNameField(data.name));
    leftColumn.appendChild(createCityField(data.city));
    leftColumn.appendChild(document.createElement('hr'));
    leftColumn.appendChild(createSocialNetworks(data));
    leftColumn.appendChild(document.createElement('hr'));

    const wrap = createIconWithText();
    wrap.appendChild(createMetIcon('assets/arrow.svg'));
    wrap.appendChild(createBoldSpan('Мероприятия'));

    leftColumn.appendChild(wrap);
    leftColumn.appendChild(createMetings(data));
}

function createProfile(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
    <main class="profilemain">
        <div class="leftcolumn"></div>
        <div class="rightcolumn"></div>
    </main>
    `;

    const rightColumn = tmp.getElementsByClassName('rightcolumn')[0];
    fillRightColumn(rightColumn, data);

    const leftColumn = tmp.getElementsByClassName('leftcolumn')[0];
    fillLeftColumn(leftColumn, data);


    return tmp.firstElementChild;
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

function addListener(actor, mainText, input, action) {
    actor.addEventListener('click', (evt) => {
        const checkMark = createEditIcon("assets/check-mark.svg");
        const crossMark = createEditIcon("assets/x-mark.svg");

        const returnMainRemoveMarks = (evt) => {
            input.parentNode.insertBefore(mainText, input.nextSibling);
            checkMark.parentNode.insertBefore(actor, checkMark.nextSibling);

            checkMark.remove();
            crossMark.remove();
            input.remove();
        };

        checkMark.addEventListener('click', (evt) => {
            action();
            returnMainRemoveMarks(evt);
        });
        crossMark.addEventListener('click', returnMainRemoveMarks);

        actor.parentNode.insertBefore(checkMark, actor.nextSibling);
        actor.parentNode.insertBefore(crossMark, actor.nextSibling);
        actor.remove();
    
        mainText.parentNode.insertBefore(input, mainText.nextSibling);
        mainText.remove();
    });
}

function addQuitLink() {
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
}