import BaseApiService from './baseapiservice';
export default class EngineService {
    constructor(url) {
        this.baseApiService = new BaseApiService();
        this.baseUrl = url;
    }

    getEngines(config) {
        let query = '';
        if (config.search !== '' && config.search !== null) {
            query = '&search=' + encodeURIComponent(config.search);
        }
        //config.assetId = '1524';
        return this.baseApiService.get(this.baseUrl + 'assets/' + config.assetId + '/devices'
            + '?include=All&pagesize=' + config.pagesize + '&pageindex=' + config.pageindex + '&sort=' + encodeURIComponent(config.sort) + query
            , '', false);

    }
    unAssignEngine(data) {
        return this.baseApiService.post(this.baseUrl + 'devices/unassign', data, false);
    }
    assignEngine(data, companyId, assetId) {
        return this.baseApiService.post(`${this.baseUrl}companies/${companyId}/assets/${assetId}/devices`, data, false);
    }
    getAssetList(companyId) {
        return this.baseApiService.get(`${this.baseUrl}companies/${companyId}/assets`, '', true);
    }

    editEngine(data) {
        //return this.baseApiService.put(this.baseUrl + 'assets/type=ENG', data, false);
        return this.baseApiService.put(this.baseUrl + 'devices/', data, false);
    }
}