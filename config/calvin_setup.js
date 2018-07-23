/*
* Creates a bucket, collection, and table with
* the same name.
*/

// Custom modules
const ddb = require('../utilities/dynamoDB')
const rk = require('../utilities/rekognition')

// Shared name
name = process.env.NAME

console.log('Setting up Calvin using name: %s', name)
setupSystem()
/*
 * Create necessary storage containers
 */
function setupSystem () {
  // create table to store users information
  p1 = ddb.createTable(name, 'USER_ID')

  // create collection for indexed faces
  p2 = rk.createCollection(name)

  // Wait until everythings setup before confirming Success or Failure
  Promise.all([p1, p2])
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log("Couldn't build system. Name may be taken.", err)
    })
}
