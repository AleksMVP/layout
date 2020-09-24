'use strict';

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
