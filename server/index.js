'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'static')));
app.use(body.json());
app.use(cookie());

app.post('/signup', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  const age = req.body.age;
  if (
      !password || !email || !age ||
      !password.match(/^\S{4,}$/) ||
      !email.match(/@/) ||
      !(typeof age === 'number' && age > 10 && age < 100)
  ) {
    return res.status(400).json({error: 'Не валидные данные пользователя'});
  }
  if (users[email]) {
    return res.status(400).json({error: 'Пользователь уже существует'});
  }
  const id = 1;
  const user = {password, email, age, score: 0, images: []};
  ids[id] = email;
  users[email] = user;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(201).json({id});
});

app.post('/ajax/peoples', function (req, res) {
    const userId = req.body.id;

    res.status(200).json({
        cardId: 51,
        imgSrc: 'assets/luckash.jpeg',
        name: 'Александр',
        job: 'Главный чекист КГБ',
        interestings: ['Картофель', 'Хоккей'],
        skills: ['Разгон митингов', 'Сбор урожая'],
    });
    return;
  const password = req.body.password;
  const email = req.body.email;
  if (!password || !email) {
    return res.status(400).json({error: 'Не указан E-Mail или пароль'});
  }
  if (!users[email] || users[email].password !== password) {
    return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
  }

  const id = 1
  ids[id] = email;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(200).json({id});
});

app.post('/ajax/metings', function (req, res) {
    const metId = req.userId;
    res.status(200).json({
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
    });
    return;
  const password = req.body.password;
  const email = req.body.email;
  if (!password || !email) {
    return res.status(400).json({error: 'Не указан E-Mail или пароль'});
  }
  if (!users[email] || users[email].password !== password) {
    return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
  }

  const id = 1
  ids[id] = email;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
  res.status(200).json({id});
});

app.get('/me', function (req, res) {
  const id = req.cookies['podvorot'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }

  users[email].score += 1;

  res.json(users[email]);
});

const port = process.env.PORT || 8000;

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
});
