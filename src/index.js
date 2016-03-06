import bbva from './routes/bbva';
import express from 'express';
import bodyParser from 'body-parser';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/bbva', bbva);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('BankBotsBank running on port', port));
