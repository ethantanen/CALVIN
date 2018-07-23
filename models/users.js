// custom modules
const ddb = require('../utilities/dynamoDB')

// tables name
const NAME = process.env.NAME

// create table, faceprint as primary-key
function createTable () {
  return ddb.createTable(NAME, 'USER_ID')
}

// delete table
function deleteTable () {
  return ddb.deleteTable(NAME)
}

// add user
function addUser (profile) {
  profile = {
    'USER_ID': {
      S: profile.USER_ID
    },
    'EMAIL': {
      S: profile.EMAIL
    },
    'FIRST_NAME': {
      S: profile.FIRST_NAME
    },
    'LAST_NAME': {
      S: profile.LAST_NAME
    },
    'POSITION': {
      S: profile.POSITION
    }
  }
  return ddb.putItem(NAME, profile)
}

// get user
function getUser (id) {
  return ddb.getItem(NAME, id)
}

// delete user
function deleteUser (id) {
  return ddb.deleteItem(NAME, id)
}

// query table
function scanUsers (attrName, attrValue) {
  return ddb.scan(NAME, attrName, attrValue)
}

// query table by name
async function scanUsersByName (attrValue) {
  res = await ddb.scan(NAME, 'FIRST_NAME', attrValue)
  return dynamoCleanArray(res)
}

// query table by email
async function scanUsersByEmail (attrValue) {
  res = await ddb.scan(NAME, 'EMAIL', attrValue)
  return dynamoCleanArray(res)
}

// query table by position
async function scanUsersByPosition (attrValue) {
  res = await ddb.scan(NAME, 'POSITION', attrValue)
  return dynamoCleanArray(res)
}

// clean an array of dynamoDB query results
function dynamoCleanArray (array) {
  cleanRes = []
  array.Items.forEach((ele) => {
    cleanRes.push(dynamoClean(ele))
  })
  return cleanRes
}
// clean an dynamo db result
function dynamoClean (entry) {
  ret = {
    FIRST_NAME: entry.FIRST_NAME.S,
    LAST_NAME: entry.LAST_NAME.S,
    EMAIL: entry.EMAIL.S,
    POSITION: entry.POSITION.S
  }
  return ret
}

// retrieve a user and return a cleaned version of the data
async function getUserClean (id) {
  try {
    user = await getUser(id)
    console.log(user)
    return dynamoClean(user.Item)
  } catch (err) {
    return "can't find user"
  }
}

module.exports = {
  deleteTable: deleteTable,
  addUser: addUser,
  getUser: getUser,
  deleteUser: deleteUser,
  dynamoClean: dynamoClean,
  getUserClean: getUserClean,
  scanUsers: scanUsers,
  scanUsersByName: scanUsersByName,
  scanUsersByEmail: scanUsersByEmail,
  scanUsersByPosition: scanUsersByPosition
}
