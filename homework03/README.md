1. Зробити простий express healthcheck application на 2 endpoints:
   GET / - повертає "Hello world"
   GET /healthcheck - повертає json:
   {
   "live": true,
   "timestamp": <current datetime in UTC>
   }
   для запуску севрера виконати команду:
   node server.js

2) допрацювати свій логгер що б він писав і у консоль і у файл 'server.log' у папці /logs
   записи повинні робитися за допомогою Streams

3. зробити middleware http log який використовує Ваш логгер з домашки №2
