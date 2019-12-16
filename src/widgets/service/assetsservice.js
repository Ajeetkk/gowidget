import BaseApiService from './baseapiservice';
export default class AssetsService {
    constructor(url) {
        this.baseApiService = new BaseApiService();
        this.baseUrl= url;
    }

    getAssets(config) {
        let query = '';
        if (config.search !== '' && config.search !== null) {
            query = '&search=' + encodeURIComponent(config.search);
        }
        
        return this.baseApiService.get(this.baseUrl + 'companies/1446/assets?pagesize='+ config.pagesize+'&pageindex=' + config.pageindex + '&isactive=true&include=All'
        +'&sort='+encodeURIComponent(config.sort) + query, "", false);
    }
    
    addAssets(data)
    {
        const url = this.baseUrl + 'assets';
        return this.baseApiService.post(url, data, true);
    }

    deleteAsset(assetId) {
        const url = this.baseUrl + 'assets/' + assetId;
        return this.baseApiService.delete(url, {}, false);
    }
    getCountries(baseurl) {
        const url = baseurl + 'lookup?LookupType=country';
        return this.baseApiService.get(url, {}, true);
    }

    getAssetType(baseurl) {
        const url = baseurl + 'assets/AssetTypes';
        return this.baseApiService.get(url, {}, true);
    }
    getApplicationType(baseurl) {
        const url = baseurl + 'assets/ApplicationTypes';
        return this.baseApiService.get(url, {}, true);
    }

   
}
