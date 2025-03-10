import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { BD_CONFIG } from './constants/index';
import router from './api/routes';

const app = express();
const port = BD_CONFIG.port || 3000;

const { allowedOrigin } = BD_CONFIG;
app.use(
  cors({
    origin: allowedOrigin,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.listen(port, () => {
  console.log(
    `:white_check_mark: Server is running at http://localhost:${port}`,
  );
});
