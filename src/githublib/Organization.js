module.exports = class Organization {

  constructor(octokit) {
    if (!octokit) {
      throw new Error('An octokit client must be provided');
    }
    this._octokit = octokit;
  }

  getRepositories(org) {
    return this.octokit.paginate("GET /orgs/:org/repos", {org: org, per_page: 100})
      .then(repos => {
        console.log(`Processing ${repos.length} repositories`);
        return repos.map(repo => { return {
          name: repo.name,
          owner: org, //TODO verify this in not in the payload
          full_name: repo.full_name,
          has_issues: repo.has_issues,
          has_projects: repo.has_projects,
          url: repo.html_url,
        }});
      })
  }

  getOrgs(org) {
    return this.octokit.paginate("GET /orgs/:org",
      {
        org: org
      }
    ).then(orgs => {
        console.log(`Searching ${org} organization`);
        const data =  {
          name: org,
          status: 'success'
        }
        return data;
      })
      .catch(err => {
        console.log(`Invalid name of Organization ===>> ${org} `)
        if (err.status === 404) {
            return {
              name: org,
              status: 'error'
            }
        } else {
          console.error(err)
          throw err;
        }
      })
  }

  findUsers(org) {
    return this.octokit.paginate("GET /orgs/:org/members", {org: org, per_page: 100})
      .then(members => {
        return members.map(member => {
          return {
            login: member.login,
            email: member.email || '',
            orgs: org
          };
        });
      });
  }

  get octokit() {
    return this._octokit;
  }
}