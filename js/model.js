'use strict'

// only logic, no visuals

class App {

    #database = JSON.parse(localStorage.getItem('flashCardsData')) || []

    oldValues = []
    correctAnswers = []
    userAnswers = []
    otherOptions
    howManyQuestions = 3   // in a quiz
    wordcardsPerPage = 6

    // ================================================================================================

    getTime(flag='my') {
        const now = new Date()
        const year = now.getFullYear() + 4500
        const month = now.getMonth() + 1
        const date = now.getDate()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        return [year, month, date, hours, minutes]
    }

    // ================================================================================================

    addToDB(obj) {  this.#database.push(obj)  }

    // ================================================================================================

    getDB() {  return this.#database  }

    // ================================================================================================

    validateInput(word, translation) {
        if(word.trim().length < 2 || translation.trim().length < 2) return false
        else return true
    }

    // ================================================================================================

    pushToLocalStorage() {
        localStorage.setItem('flashCardsData', JSON.stringify(this.#database))
        console.log( 'in localStorage:', JSON.parse(localStorage.getItem('flashCardsData')) )
    }

    // ================================================================================================

    fetchLocalStorage() {  return JSON.parse(localStorage.getItem('flashCardsData'))  }

    // ================================================================================================

    clearLocalStorage() {  localStorage.removeItem('flashCardsData')  }

    // ================================================================================================

    generateRandomNumber(topLimit) {  return Math.trunc(Math.random() * topLimit)  }

    // ================================================================================================

    editItem(word, translation) {
        const wordFound = this.#database.find(x => x.word === this.oldValues[0])
        wordFound.word = word
        wordFound.translation = translation
    }

    // ================================================================================================

    getOtherOptions(arrOfIndexes) {
        console.log(`randomIndexes`,arrOfIndexes)
        const thePicked = []
        let randomIndex
        
        const otherOptionsArr = arrOfIndexes.map((x,y) => {   // to return 10 things...
            const subarray = []
            
            for (let i = 0; i < 3; i++) {   // ... and each of those 10 things has 3 things within it
                randomIndex = this.generateRandomNumber(this.#database.length)
                while((subarray.length>0 && subarray.includes(randomIndex)) || (randomIndex === x) || (randomIndex === arrOfIndexes[y]) || (subarray.includes(randomIndex))) {
                    randomIndex = this.generateRandomNumber(this.#database.length)
                    if(!subarray.includes(randomIndex) || randomIndex !== arrOfIndexes[y]) break
                }
                subarray.push(randomIndex)
            }

            thePicked.push(subarray)
            
        })
        thePicked.forEach(x=>console.log(x))
        return thePicked
    }

    // ================================================================================================

    getEntry(index) {  return this.#database[index]  }

    // ================================================================================================

    getOtherOptionsArrays(indexesArr) {
        const output = indexesArr.map(x => {
            return this.#database[x]
        })
        return output
    }

    // ================================================================================================

    getResults(arrOfIndexesOfQuestions) {
        let correctAnswers = []
        for (let i = 0; i < arrOfIndexesOfQuestions.length; i++) {
            correctAnswers.push(this.#database[arrOfIndexesOfQuestions[i]])
        }
        return correctAnswers.map(x => x.translation)
    }

    // ================================================================================================

    getHowManyCorrect(userArr, correctArr) {
        let counter = 0
        correctArr.forEach((x,i) => {
            if(x === userArr[i]) counter+=1
        })
        return counter
    }

    // ================================================================================================

    deleteWord(word) {
        const itsIndex = this.#database.findIndex(x => x.word === word)
        this.#database.splice(itsIndex,1)
    }

    // ================================================================================================

    getQuestionsData(randomIndexesArr) {
        const output = []

        randomIndexesArr.forEach(x => {
            output.push(this.#database.find((word,i) => i === x))
        })

        return output
    }

    // ================================================================================================

    addNewData(arrOfObjs) {  arrOfObjs.forEach(x => this.#database.push(x))  }

}