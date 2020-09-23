'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const uuid = require("uuid");
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'static')));
app.use(body.json());
app.use(cookie());

const userCards = {
    '51': {
        cardId: 51,
        imgSrc: 'assets/luckash.jpeg',
        name: 'Александр',
        job: 'Главный чекист КГБ',
        interestings: ['Картофель', 'Хоккей'],
        skills: ['Разгон митингов', 'Сбор урожая'],
    },
};

const meetCards = {
    '52': {
        cardId: 52,
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
    },
};

const usersProfiles = {
    '52': {
        imgSrc: 'assets/luckash.jpeg',
        name: 'Александр Лукашенко',
        city: 'Пертрозаводск',
        networks: [
            {
                imgSrc: 'assets/telegram.png',
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
                imgSrc: 'assets/telegram.png',
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
    },
};

const userSessions = {};
const userLoginPwdIdMap = {
    'lukash@mail.ru': {
        login: 'lukash@mail.ru',
        password: '123',
        id: '52',
    }
}


/*app.get('/helloworld', function(req, res) {
    const id = 1;
    res.cookie('id', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(201).json({id});
});*/

app.post('/ajax/peoples', function (req, res) {
    const userId = req.cookies['id'];
    const pageNum = req.body.pageNum;

    let users = [];
    for (let i = 0; i < 100; i++) {
        users.push(userCards[51]);
    }
    res.status(200).json(users);
});

app.post('/ajax/metings', function (req, res) {
    const userId = req.cookies['id'];
    const pageNum = req.body.pageNum;

    let meets = [];
    for (let i = 0; i < 100; i++) {
        meets.push(meetCards[52]);
    }
    res.status(200).json(meets);
});

app.post('/ajax/user', function(req, res) {
    const userId = req.body.userId;
    const ownId = req.cookies['id'];

    if (userId in usersProfiles) {
        res.status(200).json({
            userInfo: usersProfiles[userId],
            ownId: ownId,
        });
    } else {
        res.status(404);  
    }
});

app.get('/ajax/me', function (req, res) {
    const token = req.cookies['authToken'];
    const userId = userSessions[token];
    if (!userId) {
       return  res.status(401).end();
    }
    res.status(200).json(userId);
});

app.post('/login', function (req, res) {
    const password = req.body.password;
    const login = req.body.login;
    if (!password || !login) {
        return res.status(400).json({error: 'Не указан E-Mail или пароль'});
    }
    if (!userLoginPwdIdMap[login] || userLoginPwdIdMap[login].password !== password) {
        return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
    }

    const token = uuid();
    userSessions[token] = userLoginPwdIdMap[login].id;
    res.cookie('authToken', token, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(200).json({token});
});

const port = process.env.PORT || 8000;

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
});
