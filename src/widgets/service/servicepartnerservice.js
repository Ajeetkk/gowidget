import BaseApiService from './baseapiservice';
export default class ServicePartnerService {
  constructor(url) {
    this.baseApiService = new BaseApiService();
    this.BaseUrl = url;
  }
  getDefaultServicePartnerDetails(parentcompanyid) {
    return this.baseApiService.get(this.BaseUrl + 'companies/' + parentcompanyid )
  }
  getServicePartners() {
    return this.baseApiService.get(this.BaseUrl + 'companies/'+'?IsActive=true' +'&CompanyTypes=2' + '&include=address')
  }
  getAdditionalServicePartners(parentcompanyid) {
    return this.baseApiService.get(this.BaseUrl + 'companies/'+ parentcompanyid +'/servicepartners')
  }  
  
  getAssignmentServicePartners(config, url) {
      let search = "";
      if (config.search !== "" && config.search !== null) {
          search = "&SearchKey=" + encodeURIComponent(config.search);
      }
      return this.baseApiService.get(
        url +
          "/assets?pagesize=" + config.pagesize + "&pageindex=" + config.pageindex + "&isactive=true" + "&include=All"
        );
  }
  changeDefaultServicePartner(parentCompanyId,servicePartnerId){
    return this.baseApiService.put(this.BaseUrl + 'companies/' + parentCompanyId + '/defaultservicepartner/' + servicePartnerId,true);
  }
  addServicePartner(parentcompanyid,data){
    return this.baseApiService.post(this.BaseUrl + 'companies/'+ parentcompanyid +'/servicepartners',data,true)
  }
  deleteservicePartner(parentcompanyid,servicepartnerid){
    return this.baseApiService.delete(this.BaseUrl + 'companies/' + parentcompanyid + '/servicepartners/' + servicepartnerid )
  }
  assignServicePartner(dataforAssign, url) {
      return this.baseApiService.post(this.BaseUrl + 'assets/type=asset/bulkassign', dataforAssign, true)
  }
  updateServicePartner(data, assetID) {
    return this.baseApiService.post(
      this.BaseUrl + "assets/" + assetID + "/servicepartners",
      data,
      true
    );
  }
}