let choosenCards = [];
let openedCards = [];
let finalAnswer = [];
function shuffleCards(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const addElement = function (content, id) {
  const imgId = content.id;
  const cardContainer = document.createElement("div");
  cardContainer.setAttribute("id", `key_${id}`);
  cardContainer.onclick = () => clickHandler(id, imgId);
  cardContainer.innerHTML = `
    <div class="flip-card-inner" id="img-${imgId}">
      <div class="flip-card-front">
      </div>
      <div class="flip-card-back">
        <img class="pokeImg" src=${content.img}>
      </div>
    </div>
  `;
  const currentDiv = document.getElementById("board");
  currentDiv.appendChild(cardContainer);
};

function loadDetails(pokemons) {
  return new Promise((resolve, reject) => {
    try {
      Promise.all(pokemons.map((poke) => fetch(poke.url)))
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
        .then((result) => {
          resolve(result);
        });
    } catch (error) {
      console.log(error);
    }
  });
}

const getPokemons = async function () {
  return new Promise((resolve, reject) => {
    const random = Math.random() * 100;
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=6&offset=${random}`).then(
      (response) => {
        response
          .json()
          .then((res) => {
            console.log(res);
            if (res.results) {
              const pokemons = res.results;
              loadDetails(pokemons).then((data) => {
                resolve(data);
              });
            }
          })
          .catch((error) => console.log(error));
      }
    );
  });
};

const normalizer = function (data) {
  if (!data.length) return [];

  const pokemons = data.map((poke) => {
    return {
      id: poke.id,
      img: poke.sprites.front_default,
    };
  });
  return pokemons;
};

window.onload = function () {
  let pokemonArr = [];
  getPokemons().then((pokes) => {
    pokemonArr = normalizer(pokes);
    const pokeCards = [
      ...shuffleCards(pokemonArr),
      ...shuffleCards(pokemonArr),
    ];
    for (let i = 0; i < pokeCards.length; i++) {
      addElement(pokeCards[i], i);
    }
  });

  // create board
};

const matchingPokeBall = function () {
  const fCards = choosenCards[0];
  const sCards = choosenCards[1];

  if (fCards === sCards) {
    for (let i = 0; i < openedCards.length; i++) {
      if (openedCards[i].classList.contains("flip")) {
        openedCards[i].classList.add("disabled");
      }
    }
    finalAnswer.push([...choosenCards]);
  } else {
    for (let i = 0; i < openedCards.length; i++) {
      console.log(openedCards[i]);
      if (openedCards[i].classList.contains("flip")) {
        openedCards[i].classList.remove("flip");
      }
    }
  }

  choosenCards = [];
  openedCards = [];
};

function clickHandler(id, imgId) {
  const selectedCard = document.querySelector(`#key_${id}`);
  if (selectedCard.classList.contains(".disabled")) return;
  selectedCard.setAttribute("class", "card flip");

  openedCards.push(selectedCard);
  choosenCards.push(imgId);

  if (choosenCards.length === 2) {
    setTimeout(matchingPokeBall, 500);
  }
}

// challenge:
// find bug.
// double click a card. it will be disabled
