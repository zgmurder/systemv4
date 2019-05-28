import Parse from './parse';
import config from '../../../app.config';

Parse._initialize(config.AppId, config.JsKey, config.MasterKey);
Parse.serverURL = config.ServerURL;

// export default Parse;
