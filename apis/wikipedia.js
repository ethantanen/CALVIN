const wiki = require('wikijs').default;

function searchWiki(text) {
  return wiki().page(text)
   .then(page => page.summary())
   .then((data) => {
     text = data.substr(0,500).split('.')
     console.log(text)
     text = text.splice(0,text.length-1).toString('. ') + "."
     return {text: text}
   })
   .catch((err) => {
      return {text: "It appears you query produced no results!"}
   })
}

module.exports = {
  searchWiki: searchWiki,
}
