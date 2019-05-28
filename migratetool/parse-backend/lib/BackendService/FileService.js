/**
 * Created by tangjunfen on 2018/3/15.
 */
import axios from 'axios';

export class FileService {
    constructor() {
    }
    uploadImage(data,cb) {
        axios({
            method: 'POST',
            url: '/image/',
            contentType: 'multipart/form-data',
            processData: false,
            data: data,
        }).then(function (path) {
            cb(path.data);
        });
    }
}

export default FileService;