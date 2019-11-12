document.addEventListener('DOMContentLoaded', () => {
    
    let gamesURL = "http://localhost:3000/games"
    let usersURL = "http://localhost:3000/users"
    let tilesURL = "http://localhost:3000/tiles"
    const signinForm = document.getElementsByClassName("signin-form")[0]
    const signupForm = document.getElementsByClassName("signup-form")[0]
    let userContainer = document.getElementsByClassName("user-container")[0]
    let startButton = document.getElementById("start")
    let gameContainer = document.getElementsByClassName("memory-game")[0]

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

      let userH3 = document.getElementById("user-name")
      userH3.innerText = `Welcome, ${element.name}`

      let levelH4 = document.getElementById("level")
      let sortLevel = element.games.sort(function(a, b){return a.level - b.level})
      let highestLevel = sortLevel[sortLevel.length-1].level
      levelH4.innerText = `You are on level: ${highestLevel}`
      levelH4.dataset.level = highestLevel

      let scoreH4 = document.getElementById("score")
      let sortScore = element.games.sort(function(a, b){return a.score - b.score})
      let highestScore = sortScore[sortScore.length-1].score //maybe revisit later to use score sum as high score
      scoreH4.innerText = `Your score is: ${highestScore}`
    }

    startButton.addEventListener("click", startHandler)

    function startHandler(event){
      //create new game instance in DB


      //render the tiles
      startButton.style.display = "none"
      gameContainer.style.display = "block"
      let currentLevel = event.target.parentNode.querySelector("h4").dataset.level
      let numTiles = (parseInt(currentLevel)+2)**2
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

    let firstCard
    let secondCard

    function flipCard(event) {
      this.classList.toggle('flip');
      if (!firstCard && !secondCard) {
        firstCard = event.target.parentNode.getElementsByClassName("front-face")[0]
        console.log(firstCard)
      } else if (firstCard && !secondCard){
        secondCard = event.target.parentNode.getElementsByClassName("front-face")[0]
        console.log(secondCard)
      } 
      // else if (firstCard && secondCard){
      //   firstCard.parentNode.flipCard()
      // }
    }



  })//end of DOM Loading