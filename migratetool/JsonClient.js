import axios from 'axios';

export class JsonClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.jsonClient = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
            headers: {'Content-Type': 'application/json'}
        });
    }

    async login(username, password) {
        let response = await this.jsonClient.post('/account/user/login', {username, password});
        if ((response.status === 200 || response.status === 201) && response.data) {
            console.log(`login user ${username} succeeded`, response.data);
            this.token = response.data.token;
        } else {
            console.error(`login user ${username} failed`, response.data);
        }

        return this.token;
    }

    async addOne(url, json) {
        try {
            let response = await this.jsonClient.post(url, json, {headers: {'Authorization': `Bearer ${this.token}`}});
            if ((response.status === 200 || response.status === 201) && response.data) {
                // console.log(`addOne ${url} succeeded`, response.data);
            } else {
                console.error(`addOne ${url} failed`, response.data);
            }

            return response.data;
        } catch (exception) {
            console.error(`addOne ${url} failed`, exception);
        }

    }
}

export default JsonClient;