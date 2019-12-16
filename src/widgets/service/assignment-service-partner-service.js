import BaseApiService from "./baseapiservice";
export default class UserService {
  constructor() {
    this.baseApiService = new BaseApiService();
  }

  getAssignmentServicePartners(config, url) {
    let query = "";
    if (config.search !== "" && config.search !== null) {
      query = "&SearchKey=" + encodeURIComponent(config.search);
    }
    return this.baseApiService.get(
      url +
        "assets/asset/" +
        config.pageindex +
        "/" +
        config.pagesize +
        "?IsDeleted=false" +
        query
    );
  }
}
