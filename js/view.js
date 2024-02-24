'use strict'

// only visuals, no logic

class Visuals {

    wittyAnswers = {
        0: `Well, you've managed to achieve the remarkable feat of exploring every incorrect answer! That's dedication! If only it was applied right...`,
        10: `You're the 10% trailblazer, boldly exploring the uncharted territories of trivia! You've found the rarest answers, the ones nobody else even knew existed!`,
        20: `Twenty percent? You've managed to uncover a fifth of the mystery. One-fifth of the way to enlightenment! Keep digging for treasure!`,
        30: `Thirty percent? That's practically a passing grade in some alternate universe, right? You're mastering the art of selective knowledge acquisition!`,
        40: `Forty percent? That's enough to make a coin flip jealous! You're hitting the trivia sweet spot, striking a perfect balance between luck and skill!`,
        50: `Fifty-fifty, eh? A perfect balance between knowing and guessing! Fifty shades of correct! You're walking the fine line between guesswork and expertise!`,
        60: `Sixty percent is more than half the battle won! You're practically a walking encyclopedia by now! You're scaling the peaks of trivia mastery with finesse!`,
        70: `Seventy percent? You're in the trivia big leagues now, hitting those answers out of the park! That's seventy steps closer to trivia nirvana!`,
        80: `Eighty percent! You're so close to perfection, it's almost scary! Eighty levels deep in the trivia dungeon! Keep climbing those mountains of knowledge!`,
        90: `Ninety percent? You're in a league of your own! Consider yourself a trivia titan! Ninety notes of triumph in the symphony of trivia! Keep playing that tune of success!`,
        100: `A perfect score! You're officially the trivia king/queen, basking in the glory of your knowledge, reigning supreme with your expertise! Bow down, mere mortals! The pinnacle of trivia excellence conquered!`,
    }


    // ================================================================================================

    updateNowElement(arr) {
        const nowEl = document.querySelector('.time-now')
        const [year, month, date, hours, minutes] = arr

        // SHOW THE WORLDLY TIME:
        const hoursRegular = hours>12 ? hours-12 : hours
        nowEl.innerHTML = `${year-4500}:${month}:${date} — ${hoursRegular}<span>:</span>${minutes.toString().padStart(2,0)}`
        // nowEl.innerHTML = `${hoursRegular}<span>:</span>${minutes.toString().padStart(2,0)}`
        return

        const hoursRemain = 60-minutes !== 60 ? 23-hours : 23-hours+1
        const minutesRemain = 60-minutes === 60 ? 0 : 60-minutes
        nowEl.innerHTML = `${year}:${month}:${date} — ${hoursRemain}<span>:</span>${minutesRemain}`
        if(hours>=0 && hours<=7) {nowEl.innerHTML = `${year}:${month}:${date} — ${hours}<span>:</span>${minutes}`; return}
        nowEl.setAttribute('title', `Explanation:\nYear ${year-4500}+4500 before the so-called birth of JC\nMonth ${month}, Day ${date}\n${hoursRemain}h ${minutesRemain}m until midnight`)
    }

    // ================================================================================================

    buttonHandler(handler) {
        const self = this
        document.querySelector('.header__box').addEventListener('click', function(e) {
            // if(!e.target.classList.contains('button')) return
            if(!e.target.closest('button')) return
            const btnClicked = [...e.target.closest('button').classList].find(x => x.startsWith('header__btn--')).replace('header__btn--','')
            const addForm = document.querySelector('.add')
            if(btnClicked === 'new') {
                // console.log(`Add new word...`)
                self.toggleAllSection('hide')
                self.toggleWordsSection('hide')
                self.toggleGameSection('hide')
                self.toggleResultsSection('hide')
                self.toggleAddSection('show')
                document.querySelector('.add__title').textContent = 'Add a new word:'
                document.querySelectorAll('input').forEach(x => x.value = '')
                document.querySelector('.add__form-btn').textContent = 'Add'
            }
            if(btnClicked === 'play1') {
                // console.log(`Play with added...`)
                handler('quiz')
            }
            // if(btnClicked === 'play2') {
            //     console.log(`Play with new...`)
            // }
        })

        document.querySelector('.result__box').addEventListener('click', function(e) {
            if(!e.target.classList.contains('result__btn')) return

            if(e.target.textContent === 'See the details') {
                // console.log('toggle details')
                self.toggleBodyOverflow('permit')
                document.querySelector('.result__details').classList.remove('hidden')
                e.target.textContent = 'Hide the details'
            }
            else if(e.target.textContent === 'Hide the details') {
                // console.log('toggle details')
                // self.toggleBodyOverflow('forbid')
                // document.querySelector('.result__details').classList.add('hidden')
                // e.target.textContent = 'See the details'
                self.restoreOverflowBtnResults()
            }
            
            if(e.target.textContent === 'Play again') {
                // console.log('Playing again...')
                startTheGame()
                self.toggleResultsSection()
                self.toggleGameSection()
                // self.toggleBodyOverflow('forbid')
                // document.querySelector('.result__details').classList.add('hidden')
                // e.target.previousElementSibling.textContent = 'See the details'
                self.restoreOverflowBtnResults()
                document.querySelector('.game__question-btn').textContent = "Answer"
            }
        })

        document.querySelector('.footer__right').addEventListener('click', function(e) {
            if(!e.target.classList.contains('footer__btn')) return
            if(e.target.textContent === 'Add as JSON') handler('add-json')
            if(e.target.textContent === 'Export as JSON') handler('export-json')
            if(e.target.textContent === 'See all words') handler(`see-all`)
        })

        document.querySelector('.all__footer').addEventListener('click', function(e) {
            if(!e.target.classList.contains('pgn-btn')) return
            if(e.target.textContent === `>`) handler('next-page')
            else if(e.target.textContent === `<`) handler('prev-page')
            else if(typeof +e.target.textContent === 'number') handler(+e.target.textContent)
        })
    }

    // ================================================================================================

    restoreOverflowBtnResults() {
        this.toggleBodyOverflow('forbid')
        document.querySelector('.result__details').classList.add('hidden')
        document.querySelector('.result__btn--details').textContent = 'See the details'
    }

    // ================================================================================================

    toggleBodyOverflow(flag) {
        if(flag === 'permit') {
            document.querySelector('html').style.overflowY = 'initial'
            document.querySelector('body').style.overflowY = 'initial'
        }
        if(flag === 'forbid') {
            document.querySelector('html').style.overflowY = 'hidden'
            document.querySelector('body').style.overflowY = 'hidden'
        }
    }

    // ================================================================================================

    toggleAddSection(flag='add') {
        this.restoreOverflowBtnResults()
        const addForm = document.querySelector('.add')
        const addTitle = document.querySelector('.add__title')
        const formBtn = document.querySelector('.add__form-btn')
        
        if(flag === 'hide') {
            // addForm.style.opacity = 0
            addForm.classList.add('invisible')
            addForm.classList.add('hidden')
            // setTimeout(() => { addForm.classList.add('hidden') }, 300)
            return
        }
        
        addForm.classList.remove('hidden')
        addForm.classList.add('invisible')
        setTimeout(() => { addForm.classList.remove('invisible') }, 50)
        setTimeout(() => { addForm.querySelector('input').focus() }, 700)

        document.querySelectorAll('.placeholder-changed').forEach(x => x.classList.remove('placeholder-changed'))

        if(flag === 'add') {
            addTitle.textContent = 'Add a new word:'
            formBtn.textContent = `Add`
        }
        if(flag === 'edit') {
            addTitle.textContent = 'Edit your word:'
            formBtn.textContent = `Edit`
        }
    }

    // ================================================================================================

    checkInputEmpty(flag='regular') {
        const allInputs = document.querySelectorAll('input')

        allInputs.forEach(x => {
            x.addEventListener('blur', function() {
                if(x.value.length > 0) x.nextElementSibling.classList.add('placeholder-changed')
                else x.nextElementSibling.classList.remove('placeholder-changed')
            })
        })

        if(flag === 'thorough') {
            allInputs.forEach(x => {
                if(x.value.length > 0) x.nextElementSibling.classList.add('placeholder-changed')
                else x.nextElementSibling.classList.remove('placeholder-changed')
            })
        }

    }

    // ================================================================================================

    cancelFormSubmission() {
        const allForms = document.querySelectorAll('form')
        allForms.forEach(x => x.addEventListener('submit', e => {  e.preventDefault()  }))
    }

    // ================================================================================================

    animateAddBtn(btn) {
        btn.classList.add('button--active')
        setTimeout(() => {   btn.classList.remove('button--active')   }, 300)
    }

    // ================================================================================================

    flashNotification(el, flag) {
        if(flag === 'error') {
            el.style.backgroundColor = 'red'
            el.style.boxShadow = '0 0 10px red'
            el.textContent = 'Invalid input'
        }
        if(flag === 'success') {
            el.style.backgroundColor = 'lime'
            el.style.boxShadow = '0 0 10px lime'
            el.textContent = 'Added successfully!'
        }
        if(flag === 'edited') {
            el.style.backgroundColor = 'orange'
            el.style.boxShadow = '0 0 10px orange'
            el.textContent = 'Edited successfully!'
        }
        el.style.opacity = 0
        el.classList.remove('hidden')
        el.style.transition = 'opacity .9s'
        setTimeout(() => { el.style.opacity = 1 }, 50)
        setTimeout(() => {   el.classList.add('hidden')   }, 2500)    
    }

    // ================================================================================================

    // reset form inputs
    resetInputs(inputsArr, flag='regular') {
        inputsArr.forEach(x => x.value = '')
        if(flag!=='nofocus') inputsArr[0].focus()    
        else inputsArr.forEach(x => x.blur())
    }

    // ================================================================================================

    // toggles .recent-words
    toggleWordsSection(flag='regular') {
        this.restoreOverflowBtnResults()
        if(flag === 'show') {
            wordsSection.classList.remove('invisible')
            wordsSection.style.marginTop = '0'
            wordsSection.classList.remove('hidden')
            // setTimeout(() => { wordsSection.classList.remove('hidden') }, 300)
            return
        }
        if(flag === 'hide') {
            wordsSection.classList.add('invisible')
            // wordsSection.style.marginTop = '0'
            wordsSection.classList.add('hidden')
            // setTimeout(() => { wordsSection.classList.remove('hidden') }, 300)
            return
        }
        wordsSection.classList.toggle('invisible')
        wordsSection.style.marginTop = '-100px'
        setTimeout(() => {
            wordsSection.classList.toggle('hidden')
            wordsSection.classList.toggle('invisible')
            wordsSection.style.marginTop = '0'
        }, 400)
    }

    // ================================================================================================

    createWordElements(arr) {

        arr.forEach(x => {
            const wordEl = `<div class="recent-words__item wordcard">
                                <button class="recent-words__item-btn wordcard__btn">✏</button>
                                <div class="recent-words__item-name wordcard__name"><span>Word:&nbsp;</span> <span>${x.word}</span></div>
                                <div class="recent-words__item-translation wordcard__translation"><span>Means:</span> <span>${x.translation}</span></div>
                            </div>`
            wordsBox.insertAdjacentHTML('beforeend', wordEl)
        })

    }

    // ================================================================================================

    handleEditBtnClick(handler) {
        wordsBox.addEventListener('click', function(e) {
            if(!e.target.classList.contains('wordcard__btn')) return
            handler(e)
        })

        allCardsBlock.addEventListener('click', function(e) {
            if(!e.target.classList.contains('wordcard__btn')) return
            handler(e)
        })
    }

    // ================================================================================================

    handleTitleClick(handler) {
        document.querySelector('.title').addEventListener('click', function(e) {
            handler()
        })
    }
    
    // ================================================================================================

    blinkAllCards() {
        document.querySelectorAll('.recent-words__item').forEach(x => {
            x.querySelectorAll('div').forEach(div => {
                div.style.opacity = 0
                setTimeout(() => { div.style.opacity = 1 }, 300)
            })
        })
    }

    // ================================================================================================

    showNewBatch() {
        const self = this
        Visual.toggleAddSection('hide')
        Visual.toggleGameSection('hide')
        Visual.toggleAllSection('hide')
        Visual.toggleAllSection('hide')
        Visual.toggleResultsSection('hide')
        Visual.toggleWordsSection('show')
    }

    // ================================================================================================

    selectGameBtn() {
        if(!isGameOn) return
        document.querySelector('.game__question-options').addEventListener('click', function(e) {
            if(!e.target.closest('.game__question-option')) return
            // if(!e.target.classList.contains('game__question-option')) return
            e.target.closest('.game__question-options').querySelectorAll('button').forEach(x => x.classList.remove('button--active'))
            e.target.closest('.game__question-option').classList.add('button--active')
        })
    }

    // ================================================================================================

    generateQuestion(wordObj, otherOptionsIndexesArr) {
        // change question title:
        const title = document.querySelector('.game__question-title span')
        title.textContent = wordObj.word

        // change the options:
        const onlyMeanings = otherOptionsIndexesArr.map(x => x.translation)
        onlyMeanings.push(wordObj.translation)
        this.generateOptions(onlyMeanings)

        // change count:
        const countEl = document.querySelector('.game__question-count span')
        // questionNumber++
        countEl.textContent = questionNumber+1

        // change indicator:
        const indicatorEl = document.querySelector('.game__question-indicator span')
        const questionsInGeneral = +document.querySelector('.game__question-count span:nth-child(2)').textContent
        const percentage = ((questionNumber+1)/questionsInGeneral)*100
        indicatorEl.style.width = `${percentage}%`
    }

    // ================================================================================================

    generateOptions(arr) {
        const optionsBox = document.querySelector('.game__question-options')
        const randomComparator = () => Math.random() - 0.5;
        const arrShuffled = arr.slice().sort(randomComparator)
        optionsBox.innerHTML = ''
        arrShuffled.forEach(x => {
            // const html = `<button class="game__question-option button">${x}</button>`
            const html = `<button class="game__question-option button"><span>${x}</span></button>`
            optionsBox.insertAdjacentHTML('beforeend', html)
        })
    }

    // ================================================================================================

    handleGameNextBtn(handler) {
        gameNextBtn.addEventListener('click', function(e) {
            handler()
        })
    }

    // ================================================================================================

    toggleGameSection(flag='regular') {
        this.restoreOverflowBtnResults()
        const gameBlock = document.querySelector('.game')
        if(flag === 'hide') {
            gameBlock.classList.add('invisible')
            gameBlock.classList.add('hidden')
            return
        }
        if(flag === 'show') {
            gameBlock.classList.remove('invisible')
            gameBlock.classList.remove('hidden')
            return
        }
        gameBlock.classList.toggle('invisible')
        setTimeout(() => { gameBlock.classList.toggle('hidden') }, 400)
    }

    // ================================================================================================

    toggleResultsSection(flag='regular') {
        this.restoreOverflowBtnResults()
        const resultsBox = document.querySelector('.result')
        if(flag === 'hide') {
            resultsBox.classList.add('invisible')
            resultsBox.classList.add('hidden')
            return
        }
        if(flag === 'show') {
            resultsBox.classList.remove('hidden')
            setTimeout(() => { resultsBox.classList.remove('invisible') }, 900)
            return
        }
        resultsBox.classList.toggle('invisible')
        setTimeout(() => { resultsBox.classList.toggle('hidden') }, 400)
    }

    // ================================================================================================

    renderResults(howManyCorrectNum) {
        const resultPercentEl = document.querySelector('.result__percent')
        const resultNumberEl = document.querySelector('.result__number')
        const resultVerdictEl = document.querySelector('.result__verdict')

        const percent = ((howManyCorrectNum/randomIndexes.length)*100).toFixed(0)

        resultPercentEl.textContent = `${percent}%`
        resultNumberEl.textContent = `${howManyCorrectNum} out of ${randomIndexes.length}`

        let witticismNo = Number(percent.toString().slice(0,1) + '0')
        if(howManyCorrectNum === randomIndexes.length) witticismNo = 100
        resultVerdictEl.textContent = this.wittyAnswers[witticismNo]
    }

    // ================================================================================================

    renderResultsDetails(userAnswers, allQuestionsData) {

        const questionsWords = allQuestionsData.map(x => x.word)
        const questionsMeanings = allQuestionsData.map(x => x.translation)
        
        const detailsBox = document.querySelector('.result__details')
        detailsBox.innerHTML = ''

        userAnswers.forEach((x,i) => {
            const html = `<div class="result__details-item ${questionsMeanings[i] !== x ? 'incorrect-answer' : null}">
                             <div class="result__details-item-number">${i+1}.</div>
                             <div class="result__details-item-word">Word: ${questionsWords[i]}</div>
                             <div class="result__details-item-answer-correct">Correct answer: ${questionsMeanings[i]}</div>
                             <div class="result__details-item-answer-user">Your answer: ${x}</div>
                         </div>`
            detailsBox.insertAdjacentHTML('beforeend', html)
        })

    }

    // ================================================================================================

    doubleClickingOnCard(handler) {
        document.querySelector('.recent-words__items').addEventListener('dblclick', function(e) {
            if(!e.target.closest('.wordcard')) return
            handler(e.target.closest('.wordcard'))
        })
        document.querySelector('.all__items').addEventListener('dblclick', function(e) {
            if(!e.target.closest('.wordcard')) return
            handler(e.target.closest('.wordcard'))
        })
    }

    // ================================================================================================

    removeElement(el) {
        el.remove()
    }

    // ================================================================================================

    // renders the current page (if clicked 'See all words') -- instead of rendering all on one giant page
    renderAll(dictArr, flag='regular') {
        const wordsPerPage = 6
        const pagesInTotal = Math.ceil(dictArr.length/wordsPerPage)
        
        if(flag==='next') {
            currentPageShowAll += 1
        }
        
        if(flag==='next' && (currentPageShowAll > pagesInTotal)) {
            // console.log(`last page reached`)
            currentPageShowAll = 1
        }

        if(flag==='prev' && currentPageShowAll === 1) {
            // console.log(`you're on the 1st page!`)
            currentPageShowAll = pagesInTotal
        }

        else if(flag==='prev') {
            currentPageShowAll -= 1
        }

        numOfWords.textContent = `Entries: ${dictArr.length}`
        paginationCount.querySelector('span').textContent = pagesInTotal===0 ? 0 : currentPageShowAll
        paginationCount.querySelector('span:nth-child(2)').textContent = pagesInTotal
        
        
        startSlicingIndex = wordsPerPage*currentPageShowAll-wordsPerPage < 0 ? 0 : wordsPerPage*currentPageShowAll-wordsPerPage
        endSlicingIndex = startSlicingIndex+wordsPerPage > dictArr.length ? dictArr.length : startSlicingIndex+wordsPerPage
        const currentBatch = dictArr.slice(startSlicingIndex, endSlicingIndex)

        allCardsBlock.innerHTML = ''
        currentBatch.forEach(x => {
            const wordEl = `<div class="recent-words__item wordcard">
                                <button class="recent-words__item-btn wordcard__btn">✏</button>
                                <div class="recent-words__item-name wordcard__name"><span>Word:&nbsp;</span> <span>${x.word}</span></div>
                                <div class="recent-words__item-translation wordcard__translation"><span>Means:</span> <span>${x.translation}</span></div>
                            </div>`
            allCardsBlock.insertAdjacentHTML('beforeend', wordEl)
        })
    }

    // ================================================================================================

    toggleAllSection(flag) {
        this.restoreOverflowBtnResults()
        if(flag === 'hide') {
            allWordsSection.classList.add('hidden')
            allWordsSection.classList.add('invisible')
        }
        if(flag === 'show') {
            allWordsSection.classList.remove('hidden')
            allWordsSection.classList.remove('invisible')
        }
    }

    // ================================================================================================

    updateEntries(dictLength) {
        numOfWords.textContent = `Entries: ${dictLength}`
    }
    
    // ================================================================================================

    showEditingWord(word,meaning) {
        const formInputs = document.querySelectorAll('.add__form-input')
        formInputs[0].value = word
        formInputs[1].value = meaning
    }

    // ================================================================================================


    handleKeyboardEvents() {
        window.addEventListener('keydown', function(e) {
            const gameNextBtn = document.querySelector('.game__question-btn')
            if(e.code !== 'Enter') return
            // clicking Enter only works if the game block is active, if the game/quiz is on
            if(document.querySelector('.game').classList.contains('hidden')) return
            const activeBtn = [...document.querySelectorAll('.game__question-option')].find(x => x.classList.contains('button--active'))
            if(!activeBtn) return
            gameNextBtn.classList.add('button--active')
            setTimeout(() => {   gameNextBtn.classList.remove('button--active'), gameNextBtn.click()   }, 300)
        })
    }

    // ================================================================================================

    // blinks the question title and the options:
    blinkTheQuestion() {
        const questionTitle = document.querySelector('.game__question-title')
        const options = document.querySelectorAll('.game__question-options button span')

        questionTitle.style.transition = `none`
        questionTitle.classList.add('invisible')
        options.forEach(x => {
            x.style.transition = `none`
            x.classList.add('invisible')
            // x.style.color = 'transparent'
        })

        // const fontColour = 'lime'

        setTimeout(() => {   
            questionTitle.style.transition = `all .2s`
            questionTitle.classList.remove('invisible')
            options.forEach(x => {
                x.style.transition = `all .2s`
                x.classList.remove('invisible')
                // x.style.color = fontColour
            })
        }, 200)
    }   

    // ================================================================================================

}