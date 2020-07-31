const debug = require('debug')('linto-overwatch:overwatch:webserver:lib:workflow')

const UsersAndroid = require(process.cwd() + '/lib/overwatch/mongodb/models/android_users')
const UsersWeb = require(process.cwd() + '/lib/overwatch/mongodb/models/webapp_users')

const Workflow = require(process.cwd() + '/lib/overwatch/mongodb/models/workflows_application')


class WorkflowsApplicationApi {
  constructor() {
  }

  async getWorkflowApp(userData) {
    if (userData.email) {
      let user = await UsersAndroid.findOne({ email: userData.email })
      let application = await Workflow.getScopesByListId(user.applications)
      return application
    }

    if (user.originUrl) {
      let user = await UsersWeb.findOne({ originUrl: user.originUrl })
      let application = await Workflow.getScopesByListId(user.applications)
      return application
    }
  }
}


module.exports = new WorkflowsApplicationApi()