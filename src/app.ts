require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';


const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use('/api', routes);

const PORT = parseInt('3000');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
