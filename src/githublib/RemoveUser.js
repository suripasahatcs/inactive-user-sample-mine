
module.exports = class RemoveUser {

    constructor(octokit) {
        if(!octokit) {
            throw new Error('An octokit client must be provided');
        }
        this._octokit = octokit;
    }

    getRemoveUserFrom(org, user) {
        
        return this.octokit.paginate("DELETE /orgs/:org/members/:user", 
            {
                org: org, 
                user:user
            }
        ).then(members => {
                return {
                    status: 'success',
                    message: `${members} - user removed from organization`
                }
        }).catch(error => {
            return {status:'error',message: error};
        })
    }

    get octokit() {
        return this._octokit;
    }
}