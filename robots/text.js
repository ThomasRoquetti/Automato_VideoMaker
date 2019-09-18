const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {
  await fetchContentFromWikipedia(content)
  sanitizeContent(content.sourceContentOriginal)
  breakContentIntoSentences(content.sourceContentSanitized)


  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia('simK3ySDLgdiJr8/F61tTekynoi1')
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2?timeout=300")
    const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm)
    const wikipediaContent = wikipediaResponde.get()

    content.sourceContentOriginal = wikipediaContent.content
    console.log('> [text-robot] Fetching done!')
  }


  function sanitizeContent(originalContent) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(originalContent)
    const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

    content.sourceContentSanitized = withoutDatesInParentheses

    function removeBlankLinesAndMarkdown(text){
      const allLines = text.split('\n')

      const withoutBlankLinesAndMarkdown = allLines.filter((line) =>{
        if (line.trim().length === 0 || line.trim().startsWith('=')) {
          return false
      }

        return true
    })

      return withoutBlankLinesAndMarkdown.join(' ')
    }


    function removeDatesInParentheses(text) {
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }

    console.log('> [text-robot] Sanitizing done!')
  }

  function breakContentIntoSentences(sanitizedText) {
    content.sentences = []

    const sentences = sentenceBoundaryDetection.sentences(sanitizedText)
    sentences.forEach((sentence) =>{
      content.sentences.push({
        text: sentence,
        keywords: [],
        image: []
      })
    })

    console.log('> [text-robot] Breaking content done!')
  }

}
module.exports = robot
