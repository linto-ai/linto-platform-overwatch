const debug = require('debug')('linto-overwatch:overwatch:watcher:logic:mongodb:models:workflows_application')

const MongoModel = require('../model.js')

class ScopesModel extends MongoModel {
  constructor() {
    super('workflows_application')
  }

  async getScopesById(id) {
    try {
      return await this.mongoRequest({ _id: this.getObjectId(id) })
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async getScopesByListId(idList) {
    try {
      let listWorkflow = []
      for (let id of idList) {
        let workflowRaw = await this.mongoRequest({ _id: this.getObjectId(id) })
        if (workflowRaw.length !== 0) {
          workflowRaw = workflowRaw[0]

          for (let node of workflowRaw.flow.configs) {
            if (node.type === 'linto-config-mqtt') {
              listWorkflow.push(
                {
                  topic: node.scope,
                  name: workflowRaw.name,
                  description: "desc"
                }
              )
              break;
            }
          }
        }
      }

      return listWorkflow
    } catch (err) {
      console.error(err)
      return err
    }
  }
}

module.exports = new ScopesModel()