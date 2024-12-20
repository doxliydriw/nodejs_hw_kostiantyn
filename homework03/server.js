import express from 'express';
import httpLogger from './middleware/httpLogger.js';

// 1) Зробити простий express healthcheck application на 2 endpoints: 
const app = express();
const port = 3000;

//зробити middleware http log який використовує Ваш логгер з домашки №2
app.use(httpLogger)

//GET / - повертає "Hello world"
app.get('/', (req, res) =>
{
    res.send('Hello world');
});

/* GET /healthcheck - повертає json:
{
  "live": true, 
  "timestamp": <current datetime in UTC>
}
*/

app.get('/healthcheck', (req, res) =>
{
    const healthStatus = {
        live: true,
        timestamp: new Date().toISOString(),
    };
    res.json(healthStatus);
});

// server start:
app.listen(port, () =>
{
    console.log(`Server is running on http://localhost:${port}`);
});