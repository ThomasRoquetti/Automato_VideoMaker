const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')
const watsonApiKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js')

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
})

async function robot(content) {
  await fetchContentFromWikipedia(content)
  sanitizeContent(content.sourceContentOriginal)
  breakContentIntoSentences(content.sourceContentSanitized)
  limitMaximumSentences(content)
  await fetchKeywordsOfAllSentences(content)

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia('simK3ySDLgdiJr8/F61tTekynoi1')
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2?timeout=300")
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
    const wikipediaContent = wikipediaResponse.get()

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

  function limitMaximumSentences(content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences )
  }

  async function fetchKeywordsOfAllSentences(content) {
    for (const sentence of content.sentences) {
      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
    }
  }

  async function fetchWatsonAndReturnKeywords(sentence){
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      }, (error, response) => {
        if (error) {
          throw error
        }

        const keywords = response.keywords.map((keyword) => {
          return keyword.text
        })

        resolve(keywords)
      })
    })
  }



}
module.exports = robot
