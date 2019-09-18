const readline = require('readline-sync')
const robots = {
  userInput: require('./robots/user-input.js'),
  text: require('./robots/text.js')
}

async function start(){

  content = robots.userInput()
  await robots.text(content)

  console.log(JSON.stringify(content, null, 4))
}

start()
