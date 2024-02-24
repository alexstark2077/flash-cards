'use strict'

// orchestration, actions

/* POSSIBLE IMPROVEMENTS:
- make the 'Play with new' button in header operational?
- play without quiz (input field) -- caveat: misspelling an AR word
*/

console.log(`

MAKE IT POSSIBLE TO CHANGE WORDS-PER-PAGE?



randomIndexes sometimes can return 2 same indexes - 2 same words for choices 

maybe check getEntriesIndexes

randomIndexes and Logic.otherOptions can sometimes have the same numbers

Logic.getOtherOptions fails sometimes


`)

/* sessions it took to build it:
1 -- 2h 10m
2 -- 3h
3 -- 4h
4 -- 3h 10m
5 -- 2h
6 -- 3h
7 -- 1h
8 -- 2h 20m
9 -- 2h 40m
10 -- 
*/

// ========================================================================================================================================================================

const Logic = new App()
const Visual = new Visuals()

const addBtn = document.querySelector('.add__form-btn')
const addInfoBlock = document.querySelector('.add__form-information')
const formInputs = document.querySelectorAll('.add__form-input')

const wordsSection = document.querySelector('.recent-words')
const wordsSectionTitle = document.querySelector('.recent-words__title')
const wordsBox = document.querySelector('.recent-words__items')

const gameNextBtn = document.querySelector('.game__question-btn')

const allWordsSection = document.querySelector('.all')
const allCardsBlock = document.querySelector('.all__items')
const paginationCount = document.querySelector('.pagination-count')

const numOfWords = document.querySelector('.all__stat')

let questionNumber = 0
let isGameOn = false
const randomIndexes = []
let currentPageShowAll = 1
let startSlicingIndex, endSlicingIndex

// ================================================================================================
// ================================================================================================
// ========================================================================================================================================================================

// updating .time-now in .footer :
Visual.updateNowElement( Logic.getTime() )

// updating it every minute:
setInterval(() => { Visual.updateNowElement( Logic.getTime() ) }, 60000)

// ================================================================================================

// if any input has some text, its placeholder stays on top:
Visual.checkInputEmpty()

// ================================================================================================

// adding a new word to the database:
function addNewWord() {
    addBtn.addEventListener('click', function() {
        Visual.cancelFormSubmission()

        const [word, translation] = [...formInputs].map(x => x.value)  // grabbing the input values

        if( !Logic.validateInput(word, translation) ) {    //  runs if the input validation failed
            Visual.flashNotification(addInfoBlock, 'error')
            return  
        }    

        Visual.animateAddBtn(addBtn) // animating the add btn as if you clicked on it
        
        if(addBtn.textContent === 'Add') addingFunctionality(word, translation)

        if(addBtn.textContent === 'Edit') editingFunctionality(word, translation)
        
    })
}

addNewWord()

// ================================================================================================

// a small subfunction for addNewWord()
function addingFunctionality(word, translation) {
    Visual.resetInputs(formInputs)  // reset form inputs and put the focus on the 1st one
    Visual.checkInputEmpty()    // what it does: if any input has some text, its placeholder stays on top
    Visual.flashNotification(addInfoBlock, 'success')
    Logic.addToDB( {word, translation} )
    Logic.pushToLocalStorage()
}

// ================================================================================================

// a small subfunction for addNewWord()
function editingFunctionality(word, translation) {
    Visual.resetInputs(formInputs, 'nofocus')
    Visual.checkInputEmpty('thorough')   // what it does: if any input has some text, its placeholder stays on top
    Logic.editItem(word, translation)
    Logic.pushToLocalStorage()
    Visual.flashNotification(addInfoBlock, 'edited')
    setTimeout(() => {
        Visual.toggleAddSection()
        Visual.toggleWordsSection()
        // renderWords()
        showRecentWords()
    }, 1500)
}

// ================================================================================================

// renders the word cards
/* 
function renderWords() {
    if(Logic.getDB().length > 0) {   // if the dict length is more than 0, render them:
        wordsSectionTitle.textContent = 'Refresh your memory:'
        const wordsInDB = Logic.getDB()
        wordsBox.innerHTML = ''
        Visual.createWordElements(wordsInDB)
    }
    else {
        wordsSectionTitle.textContent = 'No words to show. Add some!'
        return
    }
}
*/

// renderWords() 

// ================================================================================================

// on app start: shows random 6 words from the DB
function showRecentWords() {
    const inDB = Logic.getDB()   
    if(inDB.length === 0) {
        console.log(`No words to show. The database is empty.`)
        document.querySelector('.recent-words__title').textContent = 'No words to show. Add some!'
        return
    }
    const howManyElements = Logic.wordcardsPerPage   // how many elements will be shown on the page
    const randomIndexes = []
    let randomIndex 

    for (let i = 0; i < howManyElements; i++) {    // looping and getting 6 random indexes
        randomIndex = Logic.generateRandomNumber(inDB.length)
        while(randomIndexes.length>0 && randomIndexes.includes(randomIndex)) {
            randomIndex = Logic.generateRandomNumber(inDB.length)
            if(!randomIndexes.includes(randomIndex)) break
        }
        randomIndexes.push(randomIndex)
    }

    const my6Elements = randomIndexes.map(x => inDB[x])
    wordsBox.innerHTML = ''
    Visual.createWordElements(my6Elements)
    Visual.blinkAllCards()
}

showRecentWords()

// ================================================================================================

// the editing functionality:
Visual.handleEditBtnClick( editCard )

function editCard(e) {
    const itemClicked = e.target.closest('.wordcard')
    const editingWord = itemClicked.querySelector('.wordcard__name span:nth-child(2)').textContent
    const editingMeaning = itemClicked.querySelector('.wordcard__translation span:nth-child(2)').textContent
    Visual.toggleWordsSection('hide')
    Visual.toggleAllSection('hide')
    Visual.toggleAddSection('edit')
    Visual.showEditingWord(editingWord, editingMeaning)  // put the data (word and its meaning) in the form inputs so you could edit
    Visual.checkInputEmpty(`thorough`)  // move the placeholder up
    Logic.oldValues = [editingWord, editingMeaning]
}

// ================================================================================================

// showing new 6 words when clicking on the H1:
Visual.handleTitleClick(() => {
    Visual.showNewBatch()
    showRecentWords()
});

// ================================================================================================

// when you start playing the quiz:      fires on click on 'Play with added'
function startTheGame() { 
    if(Logic.getDB().length === 0) return console.log(`the database is empty.`)
    isGameOn = true
    randomIndexes.length = 0      // resetting it all...
    Logic.userAnswers.length = 0
    Logic.correctAnswers.length = 0
    questionNumber = 0

    // get 10 (or less) random indexes from my dict:    (result is pushed to randomIndexes)
    getEntriesIndexes()

    // in every question, get 3 more options along with the right one: 3 more random meanings, grab them:
    Logic.otherOptions = Logic.getOtherOptions(randomIndexes)

    // generate the question: change question title, the options, count and indicator:
    genQuestion()

    // on clicking the Answer btn: record the answer to a special arr and generate the next question
    Visual.selectGameBtn()
}

// ================================================================================================

Visual.handleGameNextBtn( gameNextStep )

// ================================================================================================

// a small subfunction:
function genQuestion() {
    const wordObj = Logic.getEntry(randomIndexes[questionNumber])
    const optionsObj = Logic.getOtherOptionsArrays(Logic.otherOptions[questionNumber]) // wordObj.translation
    // console.log(wordObj)
    // console.log(optionsObj)
    document.querySelector('.game__question-count span:nth-child(2)').textContent = randomIndexes.length    // showing the total num of questions
    Visual.generateQuestion(wordObj, optionsObj)
}

// ================================================================================================

// a small subfunction for startTheGame():
function getEntriesIndexes() {     
    const currentDictLength = Logic.getDB().length
    const numberOfQuestions = currentDictLength>=Logic.howManyQuestions ? Logic.howManyQuestions : currentDictLength
    let randomIndex 
    for (let i = 0; i < numberOfQuestions; i++) {    // getting 10 (or less) random indexes...
        randomIndex = Logic.generateRandomNumber(currentDictLength)
        while(randomIndexes.length>1 || randomIndexes.includes(randomIndex)) {
            randomIndex = Logic.generateRandomNumber(currentDictLength)
            if(!randomIndexes.includes(randomIndex)) break
        }
        randomIndexes.push(randomIndex)
    }
    // console.log(randomIndexes)
}

// ================================================================================================

// linked with Visual.handleGameNextBtn:
function gameNextStep() {

    const questionNow = +document.querySelector('.game__question-count span').textContent
    const questionsAll = +document.querySelector('.game__question-count span:nth-child(2)').textContent

    const yourAnswer = document.querySelector('.button--active').textContent
    Logic.userAnswers.push(yourAnswer)

    if(questionNow === questionsAll) {
        endTheGame()
        return
    }

    questionNumber++
    
    // generate the question: change question title, the options, count and indicator:
    genQuestion()
    // setTimeout(() => { genQuestion() }, 200)
    
    Visual.blinkTheQuestion()

    if(questionNumber+1 === randomIndexes.length)  gameNextBtn.textContent = 'Finish'

}

// ================================================================================================

// ends the game
function endTheGame() {
    isGameOn = false
    Visual.toggleGameSection('hide')
    Visual.toggleResultsSection('show')
    const correctAnswers = Logic.getResults(randomIndexes)
    const howManyCorrect = Logic.getHowManyCorrect(Logic.userAnswers, correctAnswers)
    Visual.renderResults(howManyCorrect)
    const allQuestionsData = Logic.getQuestionsData(randomIndexes)
    Visual.renderResultsDetails(Logic.userAnswers, allQuestionsData)
}

// ================================================================================================

// the deleting functionality
Visual.doubleClickingOnCard( deleteCard )

function deleteCard(cardEl) {
    const isSure = confirm("Do you want to delete this word?")
    if(!isSure) return
    const word = cardEl.querySelector('.recent-words__item-name span:nth-child(2)').textContent
    Logic.deleteWord(word)
    Logic.pushToLocalStorage()
    Visual.removeElement(cardEl)
    Visual.updateEntries( Logic.getDB().length )
    Visual.showNewBatch()
    showRecentWords()
}

// ================================================================================================

// handles the click on any button in .header__box :
Visual.buttonHandler( btnsFunctionality )

function btnsFunctionality(flag) {
    if(flag === 'add-json')  addAsJSON()

    if(flag === 'export-json')  exportAsJSON()

    if(flag === 'see-all')  seeAllWords()

    if(flag === 'next-page')  Visual.renderAll(Logic.getDB(), 'next')

    if(flag === 'prev-page')  Visual.renderAll(Logic.getDB(), 'prev')

    if(flag === 'quiz')  runTheQuiz()

}

// ================================================================================================

// a small subfunction for btnsFunctionality()
function addAsJSON() {
    alert('You can use one of these 2 prompts for GPT...')
    alert(`1) Give me the list of vocabulary on this topic: TOPIC in LANGUAGE with their pronunciation. Give it in the form of a JSONified array of objects, each object has only 2 properties: 'word' with the value of the pronunciation of this word in English letters and 'translation' with the value of this word in English.`)
    alert(`2) Give me the list of vocabulary on this topic: TOPIC in LANGUAGE. Give it in the form of a JSONified array of objects, each object has only 2 properties: 'word' with the value of this word in LANGUAGE and 'translation' with the value of this word in English.`)
    
    const input = prompt(`Paste your JSON here:`)
    if(!input) return console.log(`input was empty`)
    const parsedInput = JSON.parse(input)

    if(!parsedInput || (!parsedInput[0]['word'] || !parsedInput[0]['translation'])) return console.error('Passed data is missing or invalid.')

    Logic.addNewData(parsedInput)
    Logic.pushToLocalStorage()
    Visual.showNewBatch()
    showRecentWords()
    document.querySelector('.recent-words__title').textContent = `Refresh your memory:`
}

// ================================================================================================

// a small subfunction for btnsFunctionality()
function exportAsJSON() {
    const allDictData = JSON.stringify(Logic.getDB())
    console.log(`=================================================`)
    console.log(`Grab your JSON below:`)
    console.log(`'${allDictData}'`)
    console.log(`=================================================`)
    alert('Grab your JSON in the Console in Browser Developer Tools.')
}

// ================================================================================================

// a small subfunction for btnsFunctionality()
function seeAllWords() {
    Visual.toggleWordsSection('hide')
    Visual.toggleAddSection('hide')
    Visual.toggleGameSection('hide')
    Visual.toggleResultsSection('hide')
    Visual.toggleAllSection('show')
    Visual.renderAll( Logic.getDB() )
}

// ================================================================================================

// a small subfunction for btnsFunctionality()
function runTheQuiz() {
    if(Logic.getDB().length < 3) {
        alert('No or too few words to play with! Add more.')
        return 
    }
    Visual.toggleAllSection('hide')
    Visual.toggleWordsSection('hide')
    Visual.toggleAddSection('hide')
    Visual.toggleResultsSection('hide')
    startTheGame()
    Visual.toggleGameSection('show')
}

// ================================================================================================

// handles the Enter clicking when playing the quiz:
Visual.handleKeyboardEvents()

// ================================================================================================