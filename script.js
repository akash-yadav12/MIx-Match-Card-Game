class AudioController{
    constructor(){
        this.bgMusic = new Audio('assets/audio/creepy.mp3');
        this.flipSound = new Audio('assets/audio/flip.wav');
        this.matchSound = new Audio('assets/audio/match.wav');
        this.vitorySound = new Audio('assets/audio/victory.wav');
        this.gameOverSound = new Audio('assets/audio/gameOver.wav');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip(){
        this.flipSound.play()
    }
    match(){
        this.matchSound.play()
    }
    victory(){
        this.stopMusic()
        this.vitorySound.play()
    }
    gameOver(){
        this.stopMusic()
        this.gameOverSound.play()
    }
}


class MixOrMatch{
    constructor(totalTime, cards){
        this.cardsArray = cards
        this.totalTime = totalTime
        this.timeRemaining = this.totalTime
        this.timer = document.getElementById('timeRemaining')
        this.ticker = document.getElementById('flips')
        this.audioController = new AudioController()
    }
    startGame(){
        this.cardToCheck = null
        this.totalClicks = 0
        this.timeRemaining = this.totalTime
        this.matchedCards = []
        this.busy = true
        setTimeout(()=>{
            this.audioController.startMusic()
            this.shuffleCards()
            this.countdown = this.startCountDown()
            this.busy = false
        },500)
        this.hideCards()
        this.timer.innerText = this.timeRemaining
        this.ticker.innerText = this.totalClicks
    }
    flipCards(card){
        if(this.canFlipCards(card)){
            this.audioController.flip()
            this.totalClicks += 1
            this.ticker.innerText = this.totalClicks
            card.classList.add('visible')
            if(this.cardToCheck){
                this.checkForCardMatch(card)
            }else{
                this.cardToCheck = card
            }
        }
    }
    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
            this.cardMatch(card,this.cardToCheck)
        }else{
            this.cardMisMatch(card,this.cardToCheck)
        }
        this.cardToCheck = null
    }
    cardMatch(card1,card2){
        this.matchedCards.push(card1)
        this.matchedCards.push(card2)
        card1.classList.add('matched')
        card2.classList.add('matched')
        this.audioController.match()
        if(this.matchedCards.length == this.cardsArray.length){
            this.victory()
        }
    }
    cardMisMatch(card1,card2){
        this.busy = true
        setTimeout(()=>{
            card1.classList.remove('visible')
            card2.classList.remove('visible')
            this.busy = false
        },1000)
    }
    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }
    shuffleCards(){
        for ( let i = this.cardsArray.length-1; i>0; i--){
            let rand = Math.floor(Math.random()* (i+1))
            this.cardsArray[rand].style.order = i
            this.cardsArray[i].style.order = rand
        }
    }
    canFlipCards(card){
        return (!this.busy && !this.matchedCards.includes(card) && card != this.cardToCheck)
    }
    hideCards(){
        this.cardsArray.forEach(card=>{
            card.classList.remove('visible')
            card.classList.remove('matched')
        })
    }
    gameOver(){
        clearInterval(this.countdown)
        this.audioController.gameOver()
        document.getElementById('game-over-text').classList.add('visible')
    }
    startCountDown(){
        return setInterval(()=>{
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining
            if(this.timeRemaining === 0){
                this.gameOver()
            }
        },1000)
    }
    victory(){
        clearInterval(this.countdown)
        this.audioController.victory()
        document.getElementById('victory-text').classList.add('visible')
        this.hideCards()
    }
}


const overlays = Array.from(document.getElementsByClassName('overlay-text'));
const cards = Array.from(document.getElementsByClassName('card'));

overlays.forEach(overlay=>{
    overlay.addEventListener('click',()=>{
        overlay.classList.remove('visible')
        game.startGame()
    })
})

cards.forEach(card=>{
    card.addEventListener('click', ()=>{
        game.flipCards(card)
    })
})

let musicController = new AudioController()
// musicController.startMusic()

let game = new MixOrMatch(100, cards)
