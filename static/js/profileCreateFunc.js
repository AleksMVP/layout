'use strict';

function createIconWithText(iconSrc, name) {
    const wrap = document.createElement('div');
    wrap.classList.add('iconwithtext');

    const icon = document.createElement('img');
    icon.classList.add('meticon');
    icon.src = iconSrc;

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('bold');
    nameSpan.innerHTML = name;

    const editicon = createEditIcon('assets/pen.svg');

    wrap.appendChild(icon);
    wrap.appendChild(nameSpan);
    wrap.appendChild(editicon);

    return wrap;
}

function createProfile(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
    <main class="profilemain">
        <div class="leftcolumn">
            <div class="avatarwraper">
                <form enctype="multipart/form-data" method="post" class="layout">
                    <input type="file" class="button" value="Выбрать">
                    <input type="submit" value="Save" class="savebutton">
                </form>
                <img src="assets/luckash.jpeg" class="avatar">
            </div>
            <div class="iconwithtext">
                <h2 class="name" id="name">${data.name}</h2>
                <img src="assets/pen.svg" class="editicon nameediticon" id="nameimg">
            </div>
            <div class="iconwithtext">
                <img src="assets/place.svg" class="networkicon">
                <span class="city" id="city">${data.city}</span>
                <img src="assets/pen.svg" class="editicon cityediticon" id="cityimg">
            </div>
            <hr>
            <div class="socialnetworks">
                <div class="iconwithtext telegram">
                    <img src="assets/telegram.png" class="networkicon">
                </div>
                <div class="iconwithtext vk">
                    <img src="assets/vk.png" class="networkicon">
                </div>
            </div>
            <hr>
            <div class="iconwithtext">
                <img src="assets/arrow.svg" class="networkicon">
                <span class="bold">Мероприятия</span>
            </div>
            <div class="metings"></div>
        </div>
        <div class="rightcolumn"></div>
    </main>
    `;

    const button = tmp.getElementsByClassName('button')[0];
    const avatar = tmp.getElementsByClassName('avatar')[0];
    const saveButton = tmp.getElementsByClassName('savebutton')[0];
    saveButton.hidden = true;

    button.onchange = (event) => {
        var file = event.target.files[0];
        var FR = new FileReader();
        
        FR.onload = function(event) {
            console.dir(event);
            avatar.src = event.target.result;
            saveButton.hidden = false;
        };
        
        FR.readAsDataURL(file);
    };

    /*let form = tmp.getElementsByClassName('layout')[0];
    saveButton.addEventListener('click', function(ev) {
        let oData = new FormData(form);

        oData.append("CustomField", "This is some extra data");
        oData.append("myfile", button.files[0], "filename.txt");

        var oReq = new XMLHttpRequest();
        oReq.open("POST", "/ajax/helloworld", true);
        oReq.onload = function(oEvent) {
            if (oReq.status == 200) {
                console.log("Uploaded!");
            } else {
                console.log("Error " + oReq.status + " occurred when trying to upload your file.<br \/>");
            }
        };
        console.log(oData);
        oReq.send(oData);
        ev.preventDefault();
    }, false);*/


    const rightColumn = tmp.getElementsByClassName('rightcolumn')[0];
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
        const wrap = createIconWithText(
            fillRigthColumn[i].iconSrc,
            fillRigthColumn[i].name,
        );

        const mainText = document.createElement('span');
        mainText.classList.add('margin10');

        rightColumn.appendChild(wrap);
        rightColumn.appendChild(mainText);

        const id = fillRigthColumn[i].key;
        mainText.innerHTML = data[id];

        const input = createTextArea(mainText.innerHTML);
        const editicon = wrap.getElementsByClassName('editicon')[0];

        addListener(editicon, mainText, input, () => {
            mainText.innerHTML = input.value;

            ajax('POST', '/ajax/editprofile', (status, responseText) => {
                if (status !== 200) {
                    alert('Permission denied');
                }
            }, {field: id, text: mainText.innerHTML});
        });
    }

    const fillLeftColumn = [
        'name',
        'city',
    ];

    for (let i = 0; i < fillLeftColumn.length; i++) {
        const id = fillLeftColumn[i];
        const mainText = tmp.getElementsByClassName(id)[0];
        const editicon = tmp.getElementsByClassName(id + 'editicon')[0];
        const input = document.createElement('input');
        input.value = mainText.innerHTML;

        addListener(editicon, mainText, input, () => {
            mainText.innerHTML = input.value;

            ajax('POST', '/ajax/editprofile', (status, responseText) => {
                if (status !== 200) {
                    alert('Permission denied');
                }
            }, {field: id, text: mainText.innerHTML});
        });
    }

    const metings = tmp.getElementsByClassName('metings')[0];
    data.metings.forEach(obj => {
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
        
        metings.appendChild(iconwithtext);
    });

    Object.keys(data.networks).forEach(key => {
        const href = data.networks[key];
        const elem = tmp.getElementsByClassName(key)[0];
        const input = document.createElement('input');
        const link = document.createElement('a');
        link.classList.add('link');

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

        elem.appendChild(link);
        elem.appendChild(editicon);
    });

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