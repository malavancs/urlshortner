import 'dotenv/config';
import App from './app';
import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import validateEnv from './utils/validateEnv';
import UrlRoute from './routes/urls.routes';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new UrlRoute()]);

app.listen();
