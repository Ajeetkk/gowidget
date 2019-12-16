import BaseApiService from './baseapiservice';
import { pipe, map } from 'rxjs/operators';
export default class UserService {
    constructor(url) {
        this.baseApiService = new BaseApiService();
        this.BaseUrl = url;
    }

    getAllUserList(config) {
        let query = '';
        let isAnyFilter = false;
        if (config.search !== '' && config.search !== null) {
            isAnyFilter = true;
            query += `search=${encodeURIComponent(config.search)}&`;
        }
        if (config.types !== '' && config.types !== null) {
            isAnyFilter = true;
            query += `isinternal=${config.types}&`;
        }
        if (config.isActive !== null) {
            isAnyFilter = true;
            query += `isactive=${config.isActive}&`;
        }
        if (config.roles !== '' && config.roles !== null) {
            isAnyFilter = true;
            query += `roles=${config.roles}&`;
        }
        if (config.sort !== '' && config.sort !== null) {
            isAnyFilter = true;
            query += `sort=${encodeURIComponent(config.sort)}&`;
        }
        if (isAnyFilter) {
            query = `&${query}`;
        }
        query = query.slice(0, -1);
        return this.baseApiService.get(`${this.BaseUrl}/users?pagesize=${config.pagesize}&pageindex=${config.pageindex}${query}`,
            {}, true);
    }

    getInviteUsers(config) {
        let query = '';
        let isAnyFilter = false;
        if (config.search !== '' && config.search !== null) {
            isAnyFilter = true;
            query += `search=${encodeURIComponent(config.search)}&`;
        }
        if (config.types !== '' && config.types !== null) {
            isAnyFilter = true;
            query += `isinternal=${config.types}&`;
        }
        if (config.roles !== '' && config.roles !== null) {
            isAnyFilter = true;
            query += `roles=${config.roles}&`;
        }
        if (config.sort !== '' && config.sort !== null) {
            isAnyFilter = true;
            query += `sort=${encodeURIComponent(config.sort)}&`;
        }
        if (isAnyFilter) {
            query = `&${query}`;
        }
        query = query.slice(0, -1);
        return this.baseApiService.get(`${this.BaseUrl}/userinvitations?pagesize=${config.pagesize}&pageindex=${config.pageindex}${query}`,
            {}, true);
    }

    edituser(user) {
        return this.baseApiService.put(`${this.BaseUrl}/users/${user.userId}`, user, true)
            .then(data => {
                if (data.status !== 200) {
                    this.baseApiService.error(data.title);
                } else {
                    this.baseApiService.success('User Updated');
                }
                return data;
            });
    }

    deleteuser(userId) {
        return this.baseApiService.patch(`${this.BaseUrl}/users/${userId}/deactivate`, {}, false).then(data => {
            if (data.status !== 200) {
                this.baseApiService.error(data.title);
            } else {
                this.baseApiService.success('User Reactivated');
            }
            return data;
        });
    }

    reactivateUser(userId) {
        return this.baseApiService.patch(`${this.BaseUrl}/users/${userId}/activate`, {}, true)
            .then(data => {
                if (data.status !== 200) {
                    this.baseApiService.error(data.title);
                } else {
                    this.baseApiService.success('User Reactivated');
                }
                return data;
            });
    }

    getUsersMasterRoles() {
        return this.baseApiService.get(`${this.BaseUrl}/access/applications`, {}, false);
    }

    getUsersCompanies(lookupType) {
        return this.baseApiService.get(`${this.BaseUrl}/companies`, {}, false);
    }

    updateRoles(roleData) {
        return this.baseApiService.post(`${this.BaseUrl}/users/${roleData.userId}/roles`, roleData, true)
            .then(data => {
                if (data.status !== 200) {
                    this.baseApiService.error(data.title);
                } else {
                    this.baseApiService.success('Role updated');
                }
                return data;
            });
    }

    updateInviteUserRoles(roleData) {
        return this.baseApiService.post(`${this.BaseUrl}/userinvitations/${roleData.userId}/roles`, roleData, true)
            .then(data => {
                if (data.status !== 200) {
                    this.baseApiService.error(data.title);
                } else {
                    this.baseApiService.success('Role updated');
                }
                return data;
            });
    }

    exportUser(exportUserModel) {
        return this.httpservice.post(this.BaseUrl + '/users/export', exportUserModel,
            { responseType: 'blob' })
            .subscribe(
                (response) => {
                    const blob = new Blob([response], { type: 'application/csv' });
                    const date = new Date().toLocaleDateString();
                    const fileName = 'user-';
                    const numdate = Math.floor(Math.random() * 9000000) + 10000;
                    //saveAs(blob, fileName + numdate + '.csv');
                });
    }

    validateInviteUser(emails) {
        console.log(emails);
        return this.baseApiService.post(`${this.BaseUrl}/userinvitations/validate`, emails, true).then(data => {
            const result = data;
            if (result.status !== 200) {
                this.baseApiService.error(data.title);
            }
            return data;
        });
    }

    inviteUser(inviteUser) {
        return this.baseApiService.post(`${this.BaseUrl}/userinvitations`, inviteUser, true)
            .then(data => {
                const result = data;
                if (!result.hasErrors) {
                    const respMessage = inviteUser.emailIds.length + ' user(s) invited successfully.';
                    this.baseApiService.success(respMessage);
                } else {
                    const sucessLength = (inviteUser.emailIds.length - data.errors.length);
                    const respMessage = sucessLength + ' user(s) invited successfully.';
                    this.baseApiService.success(respMessage);
                }
                return data;
            });
    }

    resendInvite(userId) {
        return this.baseApiService.post(`${this.BaseUrl}/userinvitations/${userId}/resend`, {}, false)
            .then(data => {
                if (data.status !== 200) {
                    this.baseApiService.error(data.title);
                } else {
                    this.baseApiService.success('Invite Resend ');
                }
                return data;
            });
    }

    revokeInvite(userId) {
        return this.baseApiService.delete(`${this.BaseUrl}/userinvitations/${userId}`, true)
            .then(data => {
                if (data.status !== 200) {
                    this.baseApiService.error(data.title);
                } else {
                    this.baseApiService.success('Revoked User');
                }
                return data;
            });
    }
}
