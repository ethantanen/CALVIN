const request = require('request-promise')

// get a words definiton id
async function getWordId (word) {
  let options = {
    url: 'https://od-api.oxforddictionaries.com:443/api/v1/search/en?q=' + word + '&prefix=false&limit=1',
    json: true,
    headers: {
      'Accept': 'application/json',
      'app_id': 'cc6e997e',
      'app_key': '338188178e90dabb74c11e91fe57136d'
    }
  }
  let json = await request(options)
  return json.results[0].id
}

// get definiton of a word based on an id
async function getDefinitionOfId (wordId) {
  let options = {
    url: 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + wordId,
    json: true,
    headers: {
      'Accept': 'application/json',
      'app_id': 'cc6e997e',
      'app_key': '338188178e90dabb74c11e91fe57136d'
    }
  }
  let json = await request(options)
  return json
}

// get a words definition by first finding its defintion id, then querying oxfords api
async function getDefinition (word) {
  try {
    let id = await getWordId(word)
    let data = await getDefinitionOfId(id)
    let ety = data.results[0].lexicalEntries[0].entries[0].etymologies[0]
    let def = data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]
    return {text: word + '\'s definition is as follows: ' + def, extras: 'word: ' + word + '\ndefinition: ' + def + '\netymology: ' + id }
  } catch (err) {
    text = "My apologies, it appears as though the provided word is not recognized by the Oxford dictionary."
    return {text: text, extras: text + " Sorry!!"}
  }
}

async function getTranslation (word, language1, language2) {

}


module.exports = {
  getDefinition: getDefinition

}
