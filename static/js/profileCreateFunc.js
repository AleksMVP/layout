'use strict';

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
            if (obj === null) {
                
            }
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
    Object.keys(data.networks).forEach(key => {
        const obj = data.networks[key];

        const elem = tmp.getElementsByClassName(key)[0];

        if (obj === null) {
            const span = document.createElement('span');
            
            const editicon = createEditIcon('assets/plus.svg');
            createListener(elem, editicon, key);

            elem.appendChild(span);
            elem.appendChild(editicon);
        } else {
            const link = document.createElement('a');
            link.classList.add('link');
            link.href = obj;
            link.innerHTML = obj;

            const editicon = createEditIcon('assets/pen.svg');
            createListenerSecond(elem, editicon, link, key);
            elem.appendChild(link);
            elem.appendChild(editicon);
        }
    });

    return tmp.firstElementChild;
}

function createListenerSecond(elem, editicon, link, key) {
    editicon.addEventListener('click', (event) => {
        const input = document.createElement('input');
        input.value = link.innerHTML;
        const checkMark = createEditIcon("assets/check-mark.svg");
        const crossMark = createEditIcon("assets/x-mark.svg");

        checkMark.addEventListener('click', (event) => {
            link.href = input.value;
            link.innerHTML = input.value;

            elem.appendChild(link);
            elem.appendChild(editicon);

            crossMark.remove();
            input.remove();
            checkMark.remove();

            ajax('POST', '/ajax/editprofile/social', (status, responseText) => {
                if (status !== 200) {
                    alert('Permission denied');
                }
            }, {field: key, text: link.innerHTML});
        });

        crossMark.addEventListener('click', (event) => {
            elem.appendChild(link);
            elem.appendChild(editicon);

            crossMark.remove();
            input.remove();
            checkMark.remove();
        });

        elem.appendChild(input);
        elem.appendChild(checkMark);
        elem.appendChild(crossMark);

        link.remove();
        editicon.remove();
    });
}

function createListener(elem, editicon, key) {
    editicon.addEventListener('click', (event) => {
        const input = document.createElement('input');
        const checkMark = createEditIcon("assets/check-mark.svg");
        const crossMark = createEditIcon("assets/x-mark.svg");

        checkMark.addEventListener('click', (event) => {
            const newEditicon = createEditIcon('assets/pen.svg');

            const link = document.createElement('a');
            link.classList.add('link');
            link.href = input.value;
            link.innerHTML = input.value;

            createListenerSecond(elem, newEditicon, link);

            elem.appendChild(link);
            elem.appendChild(newEditicon);

            crossMark.remove();
            input.remove();
            checkMark.remove();

            ajax('POST', '/ajax/editprofile/social', (status, responseText) => {
                if (status !== 200) {
                    alert('Permission denied');
                }
            }, {field: key, text: link.innerHTML});
        });

        crossMark.addEventListener('click', (event) => {
            elem.appendChild(editicon);

            crossMark.remove();
            input.remove();
            checkMark.remove();
        });

        elem.appendChild(input);
        elem.appendChild(checkMark);
        elem.appendChild(crossMark);

        editicon.remove();
    });
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