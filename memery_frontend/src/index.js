document.addEventListener('DOMContentLoaded', () => {
    
    let gamesURL = "http://localhost:3000/games"
    let usersURL = "http://localhost:3000/users"
    let tilesURL = "http://localhost:3000/tiles"
    const signinForm = document.getElementsByClassName("signin-form")[0]
    const signupForm = document.getElementsByClassName("signup-form")[0]
    let userContainer = document.getElementsByClassName("user-container")[0]
    let startButton = document.getElementById("start")
    let gameContainer = document.getElementsByClassName("memory-game")[0]
    let userH3 = document.getElementById("user-name")
    let levelH4 = document.getElementById("level")
    let firstCard
    let secondCard
    let matchCounter=0
    let currentLevel


    signinForm.addEventListener("submit", signinHandler)
    signupForm.addEventListener("submit", signupHandler)
    // console.log(form)

    function signinHandler(event){
      event.preventDefault()
      const userName = event.target[0].value
      //fetch users
      fetch(usersURL)
      .then(resp => resp.json())
      .then(data => {
        let user 
        data.find(function(element){
          if (element.name === userName){
            user = element
          }
        })
        if (user){
          renderUserInfo(user)
        } else {
          alert("please sign up")
          signinForm.style.display = "none"
          signupForm.style.display = "block"
          event.target.reset()
        }
      })
    }

    function signupHandler(event){
      event.preventDefault()
      let newUser = event.target[0].value
      fetch(usersURL, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({name: newUser})
      })
      .then(resp => resp.json())
      .then(data => {
        renderUserInfo(data)
      })
      event.target.reset()
    }

    function renderUserInfo(element){
      signinForm.style.display = "none"
      signupForm.style.display = "none"
      userContainer.style.display = "block"

      userH3.innerText = `Welcome, ${element.name}`
      userH3.dataset.id = element.id

      let highestLevel
      let highestScore

      if (!element.games){
        highestLevel = 1
        highestScore = 0
      } else{
        let sortLevel = element.games.sort(function(a, b){return a.level - b.level})
        highestLevel = sortLevel[sortLevel.length-1].level
        
        let sortScore = element.games.sort(function(a, b){return a.score - b.score})
        highestScore = sortScore[sortScore.length-1].score //maybe revisit later to use score sum as high score
      }

      
      levelH4.innerText = `You are on level: ${highestLevel}`
      levelH4.dataset.level = highestLevel
      currentLevel = parseInt(levelH4.dataset.level)

      let scoreH4 = document.getElementById("score")
      scoreH4.innerText = `Your score is: ${highestScore}`
    }

    startButton.addEventListener("click", startHandler)

    function startHandler(event){
      //create new game instance in DB


      //render the tiles
      startButton.style.display = "none"
      gameContainer.style.display = "flex"
      gameContainer.innerHTML = ""
      console.log("current level:", currentLevel)
      // let currentLevel = event.target.parentNode.querySelector("h4").dataset.level
      let numTiles = (currentLevel+2)**2
      let i
      let j
      let k
      for (j=1; j<=2; j++){
        for (i=0; i<((numTiles-currentLevel)/2); i++){
          let cardDiv = document.createElement("div")
          cardDiv.className = "memory-card"

          let front = document.createElement("img")
          front.src = tilesArray[i]
          front.className = "front-face"

          let back = document.createElement("img")
          back.src = tileBack
          back.className = "back-face"

          cardDiv.addEventListener('click', flipCard)
          cardDiv.appendChild(front)
          cardDiv.appendChild(back)
          gameContainer.appendChild(cardDiv)
        }}
      
      for (k=0; k<currentLevel; k++){
        let cardDiv = document.createElement("div")
          cardDiv.className = "memory-card"

          let front = document.createElement("img")
          front.src = tileBomb
          front.className = "front-face"

          let back = document.createElement("img")
          back.src = tileBack
          back.className = "back-face"

          cardDiv.addEventListener('click', flipCard)
          cardDiv.appendChild(front)
          cardDiv.appendChild(back)
          gameContainer.appendChild(cardDiv)
      }
      
      //randomize the tiles
    }//end of start game handler


    
    function flipCard(event) {
      this.classList.toggle('flip');
      if (!firstCard && !secondCard) {
        firstCard = event.target.parentNode.getElementsByClassName("front-face")[0]
        if (firstCard.src === tileBomb){
          firstCard=undefined
          lose()
        }
      } 
      else if (firstCard && !secondCard){
        secondCard = event.target.parentNode.getElementsByClassName("front-face")[0]
        
        if (firstCard.src===secondCard.src){
          //disable click handler
          firstCard.parentNode.removeEventListener("click", flipCard)
          secondCard.parentNode.removeEventListener("click", flipCard)
          //reset both cards
          firstCard = undefined
          secondCard = undefined
          matchCounter++
          console.log("match counter:", matchCounter)
          if (matchCounter===(((parseInt(currentLevel)+2)**2-currentLevel)/2)){
            console.log("match counter:", matchCounter)
            win()
          }
        } 
        else if (secondCard.src === tileBomb){
          firstCard=undefined
          secondCard=undefined
          lose()
        }
        else {
          //sleep for 2 seconds
          setTimeout(() => {
            //unflip both cards
            firstCard.parentNode.classList.toggle('flip');
            secondCard.parentNode.classList.toggle('flip');
            //reset both cards
            firstCard = undefined
            secondCard = undefined
          }, 2000)
        }
      } 
    }//end of flip card fn

    function win(){
      //level counter++
      currentLevel = currentLevel + 1
      let userID = userH3.dataset.id
      let newGameObj = {
        level: currentLevel,
        score: 0,     //need to come up with scoring logic
        user_id: userID}
        console.log(newGameObj)

      //fetch POST to /games
      fetch(gamesURL,{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(newGameObj)
      })

      //show a message
      startButton.style.display = "block"

      gameContainer.innerHTML = ""
      let winMessageDiv = document.createElement("div")
      winMessageDiv.className = "win-message"

      let winMessage = document.createElement("h1")
      winMessage.innerText = "YOU WON! Click Start Game button for a new game"
      winMessageDiv.appendChild(winMessage)
      gameContainer.appendChild(winMessageDiv)

      //resets match counter to 0
      levelH4.innerText = `You are on level: ${currentLevel}`
      matchCounter = 0
    } //end of win function

    function lose() {
      //invoke this fn via bomb logic
      //make the Start button show again
      //show a banner: you hit the bomb, to play again, press Start
      startButton.style.display = "block"

      gameContainer.innerHTML = ""

      let loseMessageDiv = document.createElement("div")
      loseMessageDiv.className = "lose-message"
      let loseMessage = document.createElement("h1")
      loseMessage.innerText = "YOU HIT THE BOMB! Game over, click Start Game button to try again"
      loseMessageDiv.appendChild(loseMessage)

      let bombGifDiv = document.createElement("div")
      bombGifDiv.className = "bomb-div"
      let bombImg = document.createElement("img")
      bombImg.src = tileBomb
      bombGifDiv.appendChild(bombImg)

      gameContainer.appendChild(loseMessageDiv)
      gameContainer.appendChild(bombGifDiv)

      //no change to currentLevel var
      // levelH4.innerText = `You are on level: ${currentLevel}`
      //resets match counter to 0
      matchCounter = 0
    }



  })//end of DOM Loading