import { BackendService } from './parse-backend/lib/BackendService';
import Client from "./parse-backend/lib/Client";
import JsonClient from "./JsonClient";

export class Migrator {
    constructor(baseUrl, config) {
        this.jsonClient = new JsonClient(baseUrl);
        this.config = config;
        this.backendService = new BackendService({appId: ''});
    }

    async start() {
        await this.backendService.initialize();

        await this.backendService.login({username: this.config.usernameV1, password: this.config.passwordV1});

        const token = await this.jsonClient.login(this.config.usernameV2, this.config.passwordV2);
        if (!token) {
            throw "Login to armysystemv2 failed.";
        }

        console.log('login armysystemv2 return: ', token)

        await this.migrateDictionary();
    }

    async migrateDictionary() {
        const models = ['GroupTrainMethod', 'GunnerType', 'MotorType', 'OrdnanceType', 'OrgProperty', 'OrgCategory',
            'PlaceType', 'SpecialMission', 'SportCategory', 'SupporterMajor', 'TrainerLevel', 'TrainStep', 'WeatherType'];

        for (let model of models) {
            let query = new Client.Query(Client[model]);
            query.addAscending(['createdAt']);
            let result = await this.backendService.queryListAll(model, query);
            let newList = result.list.map((item, index) => {
                item.id = item.objectId;
                item.order = index+1;
                return item;
            });
            console.log(`get list for ${model}`, newList);

            for (let item of newList) {
                await this.jsonClient.addOne(`/dictionary/${model.toLocaleLowerCase()}`, item);
            }
        }

        let list = [];
        let query = new Client.Query(Client['Position']);
        query.addAscending(['sortCode']);
        let result = await this.backendService.queryListAll('Position', query);
        list = list.concat(result.list);

        query = new Client.Query(Client['Position2']);
        query.addAscending(['sortCode']);
        result = await this.backendService.queryListAll('Position2', query);
        list = list.concat(result.list);

        let newList = list.map((item) => {
            item.id = item.objectId;
            item.order = item.sortCode;
            return item;
        });
        console.log(`get list for Position`, newList);

        for (let item of newList) {
            await this.jsonClient.addOne(`/dictionary/position`, item);
        }

        query = new Client.Query(Client['MilitaryRank']);
        query.addAscending(['sortCode']);
        result = await this.backendService.queryListAll('MilitaryRank', query);
        newList = result.list.map((item) => {
            item.id = item.objectId;
            item.order = item.levelCode;
            return item;
        });
        console.log(`get list for MilitaryRank`, newList);

        for (let item of newList) {
            await this.jsonClient.addOne(`/dictionary/militaryrank`, item);
        }
    }
}

export default Migrator;