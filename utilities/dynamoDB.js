/*
 * createTable, listTables, describeTable, deleteTable, putItem,
 * getItem, deleteItem
 */

// Publishes modules
const AWS = require('aws-sdk')

// Create DynamoDB service object
AWS.config.update({region: 'us-east-1'})
let ddb = new AWS.DynamoDB({
  apiVersion: '2012-10-08'
})

// Create Table
function createTable (table, key) {
  let params = {
    AttributeDefinitions: [
      {
        AttributeName: key,
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: key,
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    TableName: table,
    StreamSpecification: {
      StreamEnabled: false
    }
  }
  return new Promise((resolve, reject) => {
    ddb.createTable(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// List Tables
function listTables () {
  return new Promise((resolve, reject) => {
    ddb.listTables({Limit: 10}, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Describe Table
function describeTable (table) {
  let params = {
    TableName: table
  }
  return new Promise((resolve, reject) => {
    ddb.describeTable(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data.Table.KeySchema)
    })
  })
}

// Delete Table
function deleteTable (table) {
  let params = {
    TableName: table
  }
  return new Promise((resolve, reject) => {
    ddb.deleteTable(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Put Item
// TODO: add key to item's object for each new feature
function putItem (table, item) {
  let params = {
    Item: item,
    ReturnConsumedCapacity: 'TOTAL',
    TableName: table
  }
  return new Promise((resolve, reject) => {
    ddb.putItem(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Get Item
function getItem (table, key) {
  let params = {
    Key: {
      USER_ID: {
        S: key
      }
    },
    TableName: table
  }
  return new Promise((resolve, reject) => {
    ddb.getItem(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Delete Item
function deleteItem (table, userId) {
  let params = {
    Key: {
      USER_ID: {
        S: userId
      }
    },
    TableName: table
  }
  return new Promise((resolve, reject) => {
    ddb.deleteItem(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

// Query Table
function scan (table, filter, value) {
  let params = {
    TableName: table,
    ExpressionAttributeValues: {
      ':fil': {
        S: value
      }
    },
    ExpressionAttributeNames: {
      '#filter': filter
    },

    FilterExpression: 'contains (#filter, :fil)'
  }
  return new Promise((resolve, reject) => {
    ddb.scan(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

module.exports = {
  createTable: createTable,
  listTables: listTables,
  describeTable: describeTable,
  deleteTable: deleteTable,
  putItem: putItem,
  getItem: getItem,
  deleteItem: deleteItem,
  scan: scan
}
