const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = (items) => items[randomInt(0, items.length - 1)];

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const parseLines = (value) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const parseOptions = (value) =>
  value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

const showToast = (message) => {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 1800);
};

const safeStore = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // The page still works when browser storage is unavailable.
    }
  },
};

const setButtonBusy = (button, busy) => {
  button.disabled = busy;
  button.setAttribute("aria-busy", String(busy));
};

// Hero and navigation
const refreshHeroNumber = () => {
  $("#heroNumber").textContent = randomInt(1, 99);
};

refreshHeroNumber();

$("#backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#surpriseMe").addEventListener("click", () => {
  const visibleTools = $$("[data-tool]").filter((tool) => !tool.hidden);
  const destination = randomItem(visibleTools);
  refreshHeroNumber();
  destination.scrollIntoView({ behavior: "smooth", block: "center" });
  destination.classList.remove("spotlight");
  window.setTimeout(() => destination.classList.add("spotlight"), 350);
  window.setTimeout(() => destination.classList.remove("spotlight"), 1700);
});

// Wheel picker
const wheelCanvas = $("#nameWheel");
const wheelContext = wheelCanvas.getContext("2d");
const wheelNamesInput = $("#wheelNames");
const wheelColours = [
  "#ff6b4a",
  "#ffd95a",
  "#72d6b1",
  "#7b61ff",
  "#59a7ff",
  "#ff94ba",
  "#b9dc62",
  "#ff9c50",
];
let wheelRotation = 0;
let wheelSpinning = false;

const storedWheelNames = safeStore.get("oddly-wheel-names");
if (storedWheelNames) wheelNamesInput.value = storedWheelNames;

const drawWheel = (names = parseLines(wheelNamesInput.value), rotation = wheelRotation) => {
  const width = wheelCanvas.width;
  const center = width / 2;
  const radius = center - 10;
  wheelContext.clearRect(0, 0, width, width);

  if (!names.length) {
    wheelContext.beginPath();
    wheelContext.arc(center, center, radius, 0, Math.PI * 2);
    wheelContext.fillStyle = "#eae5d8";
    wheelContext.fill();
    wheelContext.strokeStyle = "#171817";
    wheelContext.lineWidth = 5;
    wheelContext.stroke();
    wheelContext.fillStyle = "#6c6d68";
    wheelContext.font = '500 25px "DM Mono", monospace';
    wheelContext.textAlign = "center";
    wheelContext.fillText("ADD SOME NAMES", center, center - 85);
    return;
  }

  const slice = (Math.PI * 2) / names.length;
  names.forEach((name, index) => {
    const start = -Math.PI / 2 + rotation + index * slice;
    const end = start + slice;
    wheelContext.beginPath();
    wheelContext.moveTo(center, center);
    wheelContext.arc(center, center, radius, start, end);
    wheelContext.closePath();
    wheelContext.fillStyle = wheelColours[index % wheelColours.length];
    wheelContext.fill();
    wheelContext.strokeStyle = "#171817";
    wheelContext.lineWidth = 4;
    wheelContext.stroke();

    wheelContext.save();
    wheelContext.translate(center, center);
    wheelContext.rotate(start + slice / 2);
    wheelContext.textAlign = "right";
    wheelContext.textBaseline = "middle";
    wheelContext.fillStyle =
      wheelColours[index % wheelColours.length] === "#7b61ff" ? "#fffdf8" : "#171817";
    const fontSize = names.length > 14 ? 17 : names.length > 9 ? 21 : 27;
    wheelContext.font = `700 ${fontSize}px Manrope, sans-serif`;
    const displayName =
      name.length > 15 ? `${name.slice(0, 14).trim()}…` : name;
    wheelContext.fillText(displayName, radius - 34, 0);
    wheelContext.restore();
  });
};

const spinWheel = () => {
  const names = parseLines(wheelNamesInput.value);
  if (!names.length || wheelSpinning) {
    if (!names.length) showToast("Add at least one name first");
    return;
  }

  wheelSpinning = true;
  const spinButtons = [$("#spinWheel"), $("#spinWheelAlt")];
  spinButtons.forEach((button) => setButtonBusy(button, true));
  $("#wheelResult").innerHTML =
    '<span class="result-label">SPINNING</span><strong>Round and round…</strong>';

  const chosenIndex = randomInt(0, names.length - 1);
  const slice = (Math.PI * 2) / names.length;
  const targetModulo = -(chosenIndex + 0.5) * slice;
  const tau = Math.PI * 2;
  const normalisedCurrent = ((wheelRotation % tau) + tau) % tau;
  const normalisedTarget = ((targetModulo % tau) + tau) % tau;
  const adjustment = (normalisedTarget - normalisedCurrent + tau) % tau;
  const startRotation = wheelRotation;
  const endRotation = wheelRotation + tau * randomInt(5, 8) + adjustment;
  const startTime = performance.now();
  const duration = 3600;

  const animate = (time) => {
    const progress = clamp((time - startTime) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    wheelRotation = startRotation + (endRotation - startRotation) * eased;
    drawWheel(names, wheelRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    wheelRotation = ((endRotation % tau) + tau) % tau;
    drawWheel(names, wheelRotation);
    $("#wheelResult").innerHTML =
      '<span class="result-label">WINNER</span><strong></strong>';
    $("#wheelResult strong").textContent = names[chosenIndex];
    wheelSpinning = false;
    spinButtons.forEach((button) => setButtonBusy(button, false));
  };

  requestAnimationFrame(animate);
};

wheelNamesInput.addEventListener("input", () => {
  safeStore.set("oddly-wheel-names", wheelNamesInput.value);
  wheelRotation = 0;
  drawWheel();
});
$("#spinWheel").addEventListener("click", spinWheel);
$("#spinWheelAlt").addEventListener("click", spinWheel);
$("#shuffleWheelNames").addEventListener("click", () => {
  wheelNamesInput.value = shuffle(parseLines(wheelNamesInput.value)).join("\n");
  safeStore.set("oddly-wheel-names", wheelNamesInput.value);
  wheelRotation = 0;
  drawWheel();
});
$("#clearWheelNames").addEventListener("click", () => {
  wheelNamesInput.value = "";
  safeStore.set("oddly-wheel-names", "");
  wheelRotation = 0;
  $("#wheelResult").innerHTML =
    '<span class="result-label">WINNER</span><strong>Add some names</strong>';
  drawWheel();
  wheelNamesInput.focus();
});
drawWheel();

// Team maker
const teamNamesInput = $("#teamNames");
const storedTeamNames = safeStore.get("oddly-team-names");
if (storedTeamNames) teamNamesInput.value = storedTeamNames;

teamNamesInput.addEventListener("input", () => {
  safeStore.set("oddly-team-names", teamNamesInput.value);
});

$("#teamMode").addEventListener("change", (event) => {
  const sizeMode = event.target.value === "size";
  $("#teamAmountLabel").textContent = sizeMode ? "People per team" : "Teams";
  $("#teamAmount").value = sizeMode ? 4 : 2;
});

const renderTeams = (teams) => {
  const output = $("#teamsOutput");
  output.replaceChildren();
  const wrapper = document.createElement("div");
  wrapper.className = "generated-teams";

  teams.forEach((members, index) => {
    const team = document.createElement("section");
    team.className = "team";
    const heading = document.createElement("h4");
    heading.textContent = `Team ${index + 1}`;
    const list = document.createElement("ol");
    members.forEach((member) => {
      const item = document.createElement("li");
      item.textContent = member;
      list.append(item);
    });
    team.append(heading, list);
    wrapper.append(team);
  });

  output.append(wrapper);
};

$("#makeTeams").addEventListener("click", () => {
  const people = shuffle(parseLines(teamNamesInput.value));
  if (people.length < 2) {
    showToast("Add at least two people");
    return;
  }

  const amount = Math.max(1, Number.parseInt($("#teamAmount").value, 10) || 1);
  const mode = $("#teamMode").value;
  const teamCount =
    mode === "size"
      ? Math.ceil(people.length / clamp(amount, 1, people.length))
      : clamp(amount, 1, people.length);
  const teams = Array.from({ length: teamCount }, () => []);

  people.forEach((person, index) => {
    teams[index % teamCount].push(person);
  });

  renderTeams(teams);
});

// Random number
$("#generateNumbers").addEventListener("click", () => {
  let min = Number.parseInt($("#numberMin").value, 10);
  let max = Number.parseInt($("#numberMax").value, 10);
  const count = clamp(Number.parseInt($("#numberCount").value, 10) || 1, 1, 50);
  const unique = $("#uniqueNumbers").checked;

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    showToast("Enter a valid range");
    return;
  }
  if (min > max) [min, max] = [max, min];
  const rangeSize = max - min + 1;
  if (unique && count > rangeSize) {
    showToast("That range is too small for unique results");
    return;
  }

  const results = [];
  while (results.length < count) {
    const value = randomInt(min, max);
    if (!unique || !results.includes(value)) results.push(value);
  }

  const resultNode = $("#numberResult");
  resultNode.classList.toggle("multi", results.length > 1);
  resultNode.replaceChildren();
  if (results.length === 1) {
    resultNode.textContent = results[0];
  } else {
    results.forEach((result) => {
      const pill = document.createElement("span");
      pill.textContent = result;
      resultNode.append(pill);
    });
  }
});

// Dice
$("#rollDice").addEventListener("click", () => {
  const count = clamp(Number.parseInt($("#diceCount").value, 10) || 1, 1, 20);
  const sides = Number.parseInt($("#diceSides").value, 10);
  const rolls = Array.from({ length: count }, () => randomInt(1, sides));
  const result = $("#diceResult");
  result.replaceChildren();
  rolls.forEach((roll) => {
    const die = document.createElement("div");
    die.className = "die";
    die.textContent = roll;
    result.append(die);
  });
  const total = document.createElement("span");
  total.className = "dice-total";
  total.innerHTML = `TOTAL <strong>${rolls.reduce((sum, roll) => sum + roll, 0)}</strong>`;
  result.append(total);
});

// Coin
$("#flipCoin").addEventListener("click", () => {
  const coin = $("#coin");
  const outcome = Math.random() < 0.5 ? "Heads" : "Tails";
  coin.classList.remove("flipping");
  void coin.offsetWidth;
  coin.classList.add("flipping");
  window.setTimeout(() => {
    coin.querySelector("span").textContent = outcome === "Heads" ? "O" : "X";
    $("#coinResult").textContent = outcome;
  }, 500);
});

// Playing cards
const ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
const rankMarks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
const suitMarks = ["♣", "♦", "♥", "♠"];
let deck = shuffle(Array.from({ length: 52 }, (_, index) => index + 1));

const resetDeck = () => {
  deck = shuffle(Array.from({ length: 52 }, (_, index) => index + 1));
  $("#cardFace").hidden = true;
  $("#cardBack").hidden = false;
  $("#cardName").textContent = "Fresh deck";
  $("#cardsLeft").textContent = "52 cards left";
};

$("#drawCard").addEventListener("click", () => {
  if (!deck.length) {
    resetDeck();
    showToast("The deck was empty, so we reshuffled");
  }
  const card = deck.pop();
  const rankIndex = (card - 1) % 13;
  const suitIndex = Math.floor((card - 1) / 13);
  const rank = ranks[rankIndex];
  const suit = suits[suitIndex];
  const cardFace = $("#cardFace");
  $("#cardBack").hidden = true;
  cardFace.hidden = false;
  cardFace.setAttribute("aria-label", `${rank} of ${suit}`);
  cardFace.classList.toggle("red-card", suit === "Diamonds" || suit === "Hearts");
  $$('[data-card-rank]', cardFace).forEach((node) => {
    node.textContent = rankMarks[rankIndex];
  });
  $$('[data-card-suit]', cardFace).forEach((node) => {
    node.textContent = suitMarks[suitIndex];
  });
  $("#cardName").textContent = `${rank} of ${suit}`;
  $("#cardsLeft").textContent = `${deck.length} card${deck.length === 1 ? "" : "s"} left`;
});
$("#resetDeck").addEventListener("click", resetDeck);

// Quick picker
$("#quickPick").addEventListener("click", () => {
  const options = parseOptions($("#quickOptions").value);
  if (!options.length) {
    showToast("Add a few options first");
    return;
  }
  $("#quickResult").textContent = randomItem(options);
});

// Oracle
const oracleAnswers = [
  // YES
  "Absolutely!",
  "Without a doubt.",
  "100% yes.",
  "Go for it!",
  "The stars approve.",
  "Everything points to yes.",
  "Today is your lucky day.",
  "Destiny agrees.",
  "You already know the answer.",
  "It would be rude not to.",
  "This is the way.",
  "The universe is smiling.",
  "Fortune favours you.",
  "Very likely.",
  "Extremely promising.",
  "Signs point to success.",
  "All roads lead to yes.",
  "Yes... and sooner than you think.",
  "Do it. Seriously.",
  "Full send.",

  // MAYBE
  "Maybe...",
  "Ask again later.",
  "Not enough information.",
  "Sleep on it.",
  "Flip a coin instead.",
  "Trust your gut.",
  "A cautious yes.",
  "A soft maybe.",
  "Only if you're feeling brave.",
  "Patience will help.",
  "The timing isn't quite right.",
  "Give it another day.",
  "Could go either way.",
  "It's up to you this time.",
  "Only after coffee.",
  "One step at a time.",
  "Wait for a better opportunity.",
  "You'll know when the time comes.",
  "Don't overthink it.",
  "Interesting question...",

  // NO
  "Probably not.",
  "Definitely not.",
  "I'd avoid that.",
  "Not today.",
  "The odds aren't great.",
  "The outlook is cloudy.",
  "Hard pass.",
  "Don't risk it.",
  "Maybe next time.",
  "Save your energy.",
  "That's a no from me.",
  "You can do better.",
  "The answer is hiding behind 'no'.",
  "Not unless you enjoy consequences.",
  "Your future self says no.",
  "That's bait.",
  "Abort mission.",
  "Danger detected.",
  "Nope.",
  "Absolutely not.",

  // FUNNY
  "Plot twist: yes.",
  "Plot twist: no.",
  "The pigeon outside knows.",
  "42.",
  "Ask your mum.",
  "Roll a dice.",
  "The cat said yes.",
  "The dog disagrees.",
  "Your Wi-Fi has better judgement.",
  "You'll blame me if it goes wrong.",
  "You've asked weirder.",
  "My lawyer says I shouldn't answer.",
  "The answer was yes until you asked.",
  "I'm just a magic ball.",
  "Computer says... maybe.",
  "Congratulations, you've confused the universe.",
  "Even Google isn't sure.",
  "Loading...",
  "404: Answer not found.",
  "This feels like a Tuesday problem.",

  // MOTIVATIONAL
  "Believe in yourself.",
  "You miss 100% of the chances you don't take.",
  "The first step is the hardest.",
  "You've got this.",
  "Take the leap.",
  "Be brave today.",
  "Success loves action.",
  "Make your future self proud.",
  "Small risks create big stories.",
  "Trust the process.",
  "Why not?",
  "Go make something happen.",
  "This could be the beginning of something great.",
  "Fear is temporary.",
  "You'll regret not trying more than failing.",

  // CHAOTIC
  "Only if you wear odd socks.",
  "Not before eating a snack.",
  "After exactly 17 minutes.",
  "Only on a Wednesday.",
  "Dance first, decide later.",
  "Consult a duck.",
  "Only if nobody is watching.",
  "Ask again after touching grass.",
  "Try again after one biscuit.",
  "The moon isn't convinced.",
  "Only if the playlist is good.",
  "If your phone battery is above 50%.",
  "Only if you say 'please'.",
  "One more shuffle should do it.",
  "Only after winning a game of Rock Paper Scissors.",
  "If you can make someone laugh first.",
  "Eat some cheese and reconsider.",
  "Check back after a power nap.",
  "Spin around three times and ask again.",
  "The vibes are... questionable."
];

$("#askOracle").addEventListener("click", () => {
  const ball = $(".oracle-ball");
  ball.classList.remove("shaking");
  void ball.offsetWidth;
  ball.classList.add("shaking");
  $("#oracleResult").textContent = "…";
  window.setTimeout(() => {
    $("#oracleResult").textContent = randomItem(oracleAnswers);
  }, 470);
});

// List shuffler
$("#shuffleList").addEventListener("click", () => {
  const items = parseLines($("#shuffleInput").value);
  if (items.length < 2) {
    showToast("Add at least two items");
    return;
  }
  $("#shuffleInput").value = shuffle(items).join("\n");
});

$("#copyShuffle").addEventListener("click", () => {
  copyText($("#shuffleInput").value, "Shuffled list copied");
});

// Lottery
$("#drawLottery").addEventListener("click", () => {
  const max = clamp(Number.parseInt($("#lotteryMax").value, 10) || 59, 2, 999);
  const count = clamp(Number.parseInt($("#lotteryCount").value, 10) || 6, 1, 20);
  if (count > max) {
    showToast("The highest number must be at least the ball count");
    return;
  }
  const numbers = shuffle(Array.from({ length: max }, (_, index) => index + 1))
    .slice(0, count)
    .sort((a, b) => a - b);
  const result = $("#lotteryResult");
  result.replaceChildren();
  numbers.forEach((number) => {
    const ball = document.createElement("span");
    ball.textContent = number;
    result.append(ball);
  });
});

// Password
$("#passwordLength").addEventListener("input", (event) => {
  $("#passwordLengthValue").textContent = event.target.value;
});

const secureIndex = (max) => {
  if (window.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return buffer[0] % max;
  }
  return randomInt(0, max - 1);
};

const makePassword = () => {
  const length = Number.parseInt($("#passwordLength").value, 10);
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const symbols = "!@#$%&*+-=?";
  let characters = lower + upper;
  if ($("#passwordNumbers").checked) characters += numbers;
  if ($("#passwordSymbols").checked) characters += symbols;

  const password = Array.from(
    { length },
    () => characters[secureIndex(characters.length)]
  ).join("");
  $("#passwordResult").textContent = password;
};

$("#makePassword").addEventListener("click", makePassword);

// Colour
$("#makeColour").addEventListener("click", () => {
  const colour = `#${randomInt(0, 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;
  $("#colourResult").textContent = colour;
  $("#colourSwatch").style.background = colour;
});

// Date
$("#makeDate").addEventListener("click", () => {
  const start = new Date(`${$("#dateStart").value}T00:00:00`);
  const end = new Date(`${$("#dateEnd").value}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    showToast("Choose two valid dates");
    return;
  }
  const earliest = Math.min(start.getTime(), end.getTime());
  const latest = Math.max(start.getTime(), end.getTime());
  const chosen = new Date(earliest + Math.random() * (latest - earliest));
  const dayMonth = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
  }).format(chosen);
  const weekdayYear = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    year: "numeric",
  }).format(chosen);
  $("#dateResult").innerHTML = `<strong>${dayMonth}</strong><span>${weekdayYear}</span>`;
});

// UUID
const makeUuid = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = randomInt(0, 15);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

$("#makeUuid").addEventListener("click", () => {
  $("#uuidResult").textContent = makeUuid();
});

// Letters, words and emoji
const words = [
  "Adventure", "Anchor", "Apple", "Aurora", "Avalanche", "Backpack",
  "Banana", "Beacon", "Bear", "Bee", "Blizzard", "Bloom",
  "Blueprint", "Bonfire", "Boomerang", "Breeze", "Bridge", "Bubble",
  "Burger", "Butterfly", "Cactus", "Campfire", "Cannon", "Caramel",
  "Castle", "Champion", "Chaos", "Charger", "Cherry", "Chess",
  "Cloud", "Clover", "Comet", "Compass", "Cookie", "Cosmos",
  "Crystal", "Curious", "Cyclone", "Daisy", "Dazzle", "Desert",
  "Diamond", "Discovery", "Dolphin", "Dragon", "Dream", "Drift",
  "Echo", "Eclipse", "Electric", "Emerald", "Explorer", "Falcon",
  "Fantasy", "Feather", "Firefly", "Firework", "Flame", "Flash",
  "Forest", "Fortune", "Fox", "Galaxy", "Garden", "Ghost",
  "Glacier", "Glow", "Gold", "Gravity", "Guitar", "Harbour",
  "Harmony", "Hero", "Hidden", "Horizon", "Hurricane", "Iceberg",
  "Infinity", "Island", "Journey", "Jubilee", "Jungle", "Justice",
  "Kangaroo", "Kingdom", "Knight", "Lantern", "Laser", "Legend",
  "Lightning", "Lighthouse", "Magic", "Mango", "Maple", "Marble",
  "Marshmallow", "Meadow", "Meteor", "Midnight", "Mirror", "Mischief",
  "Moonlight", "Mountain", "Mystery", "Nebula", "Ninja", "Noodle",
  "Northern", "Nova", "Ocean", "Octopus", "Orbit", "Origami",
  "Pancake", "Parrot", "Pebble", "Penguin", "Phoenix", "Picnic",
  "Pirate", "Pixel", "Planet", "Pocket", "Potion", "Puzzle",
  "Quantum", "Quest", "Rainbow", "Raindrop", "Ranger", "Rocket",
  "Safari", "Sapphire", "Shadow", "Shark", "Shield", "Skyline",
  "Snowflake", "Solar", "Spark", "Spider", "Spirit", "Splash",
  "Spring", "Star", "Storm", "Strawberry", "Summit", "Sunrise",
  "Sunset", "Supernova", "Surprise", "Thunder", "Tiger", "Treasure",
  "Tropical", "Twilight", "Universe", "Velvet", "Victory", "Village",
  "Volcano", "Voyage", "Waterfall", "Whisper", "Wild", "Willow",
  "Wizard", "Wonder", "Woodland", "Zenith", "Zephyr", "Zigzag"
];

const emojis = [
  "😀","😂","🤣","😎","🥳","🤩","😍","🤯","😴","🤔",
  "🙃","😜","🤪","🥸","🤖","👻","💀","👽","🤡","👾",
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🦁",
  "🐯","🐸","🐵","🦄","🐙","🐧","🦖","🦕","🐢","🐬",
  "🦋","🐝","🕷️","🦩","🦜","🐳","🦈","🐉","🦥","🦦",
  "🍕","🍔","🌭","🍟","🌮","🌯","🍣","🍜","🍩","🍪",
  "🍰","🧁","🍫","🍿","🍉","🍓","🍍","🥭","🍒","🍋",
  "⚽","🏀","🏈","⚾","🎾","🏐","🥏","🎳","🎯","♟️",
  "🎮","🕹️","🎲","🧩","🎸","🥁","🎤","🎧","🎷","🎹",
  "🚗","🏎️","🏍️","🚲","✈️","🚀","🛸","🚁","⛵","🚂",
  "🌍","🌎","🌏","🌙","☀️","⭐","🌟","☄️","🌈","❄️",
  "🔥","💧","🌊","⛰️","🌋","🏝️","🌲","🌳","🌵","🌸",
  "🍀","🌺","🌻","🌼","🍄","🪨","💎","⚡","🌀","☁️",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💕",
  "💖","✨","💫","🌠","🎉","🎊","🎁","🏆","🥇","👑",
  "📸","📱","💻","⌨️","🖥️","🕶️","🎈","🪁","🪩","🫧",
  "🧃","🥨","🧸","🪙","🗝️","📚","📝","🔮","🧿","🎪"
];

$("#makeTextBits").addEventListener("click", () => {
  $("#letterResult").textContent = String.fromCharCode(randomInt(65, 90));
  $("#wordResult").textContent = randomItem(words);
  $("#emojiResult").textContent = randomItem(emojis);
});

// Rock paper scissors
const rpsOptions = [
  { name: "Rock", emoji: "✊" },
  { name: "Paper", emoji: "✋" },
  { name: "Scissors", emoji: "✌️" },
];

$("#playRps").addEventListener("click", () => {
  const result = $("#rpsResult");
  result.classList.remove("throwing");
  void result.offsetWidth;
  result.classList.add("throwing");
  const choice = randomItem(rpsOptions);
  window.setTimeout(() => {
    result.querySelector("span").textContent = choice.emoji;
    result.querySelector("strong").textContent = choice.name;
  }, 260);
});

// Coordinates sampled evenly across Earth's surface
$("#makeLocation").addEventListener("click", () => {
  const latitude = (Math.asin(2 * Math.random() - 1) * 180) / Math.PI;
  const longitude = Math.random() * 360 - 180;
  $("#latitudeResult").textContent = `${latitude.toFixed(4)}°`;
  $("#longitudeResult").textContent = `${longitude.toFixed(4)}°`;
});

const ideas = {
  activity: [
    "Play chess.",
    "Play bullet chess for 30 minutes.",
    "Go for a random walk and take 10 interesting photos.",
    "Visit a café you've never been to.",
    "Go bowling.",
    "Play crazy golf.",
    "Go to the arcade.",
    "Play pool.",
    "Go to the cinema and watch whatever starts next.",
    "Have a board game night.",
    "Build the best pillow fort possible.",
    "Have a nerf gun battle.",
    "Go to a trampoline park.",
    "Go karting.",
    "Play badminton.",
    "Play tennis.",
    "Go to the driving range.",
    "Kick a football around.",
    "Shoot some hoops.",
    "Try pickleball.",
    "Go swimming.",
    "Go to a climbing wall.",
    "Explore a woodland trail.",
    "Visit a castle or historical site nearby.",
    "Watch the sunset somewhere scenic.",
    "Go geocaching.",
    "Visit a charity shop and buy each other the funniest £5 gift.",
    "Play hide and seek in IKEA.",
    "Have a Mario Kart tournament.",
    "Play Minecraft together.",
    "Try an escape room.",
    "Go to a museum.",
    "Go to the zoo.",
    "Visit an aquarium.",
    "Take a train somewhere you've never been.",
    "Have a photography competition.",
    "Watch planes at an airport viewing area.",
    "Go fishing.",
    "Go for a bike ride.",
    "Build the ultimate LEGO creation.",
    "Play frisbee in the park.",
    "Make paper aeroplanes and compete.",
    "Have a water balloon fight.",
    "Play table tennis.",
    "Go to a car meet.",
    "Watch a local football match.",
    "Go to a theme park.",
    "Try axe throwing.",
    "Visit an animal sanctuary.",
    "Do an escape room at home."
  ],

  food: [
    "Order food you've never tried before.",
    "Cook homemade burgers.",
    "Make pizzas from scratch.",
    "Get sushi.",
    "Have a Chinese takeaway.",
    "Cook fajitas.",
    "Make pancakes.",
    "Have breakfast for dinner.",
    "Try Korean BBQ.",
    "Build the biggest ice cream sundae possible.",
    "Go for afternoon tea.",
    "Bake cookies together.",
    "Make brownies.",
    "Try making homemade pasta.",
    "Have a picnic.",
    "Cook only with ingredients already in the house.",
    "Make loaded nachos.",
    "Get fish and chips by the sea.",
    "Have a snack tasting challenge.",
    "Try Japanese snacks.",
    "Have a cheese board night.",
    "Cook a three-course meal together.",
    "Try a new restaurant.",
    "Go to an all-you-can-eat buffet.",
    "Build ridiculous milkshakes.",
    "Have a BBQ.",
    "Order everyone's favourite takeaway.",
    "Make homemade pizzas with random toppings.",
    "Try making bubble tea.",
    "Have a chocolate tasting night."
  ],

  film: [
    "Watch a comedy from the 2000s.",
    "Watch the highest-rated IMDb film you've never seen.",
    "Watch a horror film with the lights off.",
    "Watch a Disney classic.",
    "Watch a Studio Ghibli film.",
    "Watch a documentary about space.",
    "Watch an old James Bond film.",
    "Watch a Marvel movie.",
    "Watch a Christopher Nolan film.",
    "Watch an animated film.",
    "Watch a film chosen entirely by someone else.",
    "Watch a terrible film and rate how bad it is.",
    "Watch a zombie film.",
    "Watch a sports documentary.",
    "Watch a true crime documentary.",
    "Watch a foreign-language film.",
    "Watch the shortest film on your watchlist.",
    "Watch a classic you've always meant to see.",
    "Watch something nostalgic from childhood.",
    "Watch a random Netflix recommendation."
  ],

  creative: [
    "Draw each other without looking at the paper.",
    "Write a terrible movie script together.",
    "Invent a new board game.",
    "Create your own superhero.",
    "Design your dream house.",
    "Take aesthetic photos around town.",
    "Make a funny TikTok.",
    "Record a fake podcast.",
    "Write a rap together.",
    "Write a song chorus.",
    "Design your own Pokémon.",
    "Create a fake business.",
    "Draw using only one continuous line.",
    "Create the world's worst invention.",
    "Build something from cardboard.",
    "Make a paper tower competition.",
    "Make a meme from today's photos.",
    "Create your own flag.",
    "Invent a new sport.",
    "Write a bucket list of 50 things."
  ],

  gaming: [
    "Play Mario Kart.",
    "Play Rocket League.",
    "Play Minecraft.",
    "Play Fortnite.",
    "Play Fall Guys.",
    "Play Among Us.",
    "Play Phasmophobia.",
    "Play Golf With Your Friends.",
    "Play UNO.",
    "Play Jackbox Games.",
    "Play GeoGuessr.",
    "Play Codenames.",
    "Play Human Fall Flat.",
    "Play Gang Beasts.",
    "Play Overcooked.",
    "Play Keep Talking and Nobody Explodes.",
    "Play a random Steam game you forgot you owned.",
    "Challenge each other to 10 games of chess."
  ],

  couple: [
    "Go on a spontaneous ice cream date.",
    "Watch the sunset together.",
    "Go stargazing.",
    "Cook dinner together.",
    "Go for a long drive with no destination.",
    "Build a blanket fort and watch films.",
    "Look through old photos together.",
    "Plan your dream holiday.",
    "Have a no-phone evening.",
    "Take silly couple photos.",
    "Go to IKEA and design your dream home.",
    "Visit a garden centre.",
    "Buy each other a £10 surprise gift.",
    "Go to a cat café.",
    "Play two-player board games."
  ],

  random: [
    "Flip a coin and let fate decide your next hour.",
    "Phone your funniest friend.",
    "Learn five words in a random language.",
    "Try juggling.",
    "Clean one room while blasting music.",
    "Go outside for exactly 23 minutes.",
    "Read ten pages of a book.",
    "Watch YouTube videos about a topic you've never heard of.",
    "Do 50 press-ups throughout the evening.",
    "Attempt a handstand.",
    "Organise one messy drawer.",
    "Try meditation for 10 minutes.",
    "Build the tallest card tower possible.",
    "Learn a magic trick.",
    "Learn to solve a Rubik's Cube.",
    "Plan your next holiday.",
    "Start a 30-day challenge.",
    "Make a bucket list together.",
    "Visit somewhere you've driven past hundreds of times.",
    "Do absolutely nothing for ten minutes."
  ]
};

$("#makeIdea").addEventListener("click", () => {
  $("#ideaResult").textContent = randomItem(ideas[$("#ideaType").value]);
});

// Truth or dare
const truths = [
  "Who in this room do you think would survive longest in a zombie apocalypse?",
  "Who here would be the worst roommate?",
  "What's the weirdest dream you've ever had?",
  "What's something you've pretended to know but actually had no idea about?",
  "Who was your first celebrity crush?",
  "What's the most childish thing you still do?",
  "If you swapped lives with someone here for a week, who would you choose?",
  "What's your most useless skill?",
  "What's the worst haircut you've ever had?",
  "Have you ever accidentally sent a message to the wrong person?",
  "What's the weirdest thing you've ever Googled?",
  "If your search history was shown right now, how worried would you be?",
  "What's the most expensive mistake you've made?",
  "Have you ever blamed someone else for something you did?",
  "What's your biggest irrational fear?",
  "Have you ever laughed at the wrong moment?",
  "What's the strangest thing you've ever eaten?",
  "What's one thing you're secretly really competitive about?",
  "What's your guilty pleasure TV show?",
  "What's the worst gift you've ever received?",
  "What's the best lie you've ever gotten away with?",
  "What's the funniest nickname you've ever had?",
  "What's the longest you've gone without showering?",
  "Who was your childhood cartoon crush?",
  "Have you ever walked into the wrong room confidently?",
  "What's your biggest pet peeve?",
  "What's something everyone seems to like but you don't?",
  "What's your most embarrassing drunk story?",
  "Have you ever pretended to be ill to avoid plans?",
  "What's the funniest thing you've done to impress someone?",
  "What's your biggest green flag in a partner?",
  "What's your biggest red flag?",
  "If you became famous tomorrow, what would it be for?",
  "What's your most awkward first date story?",
  "Who in this room would win a reality TV show?",
  "Who would lose first on Survivor?",
  "What's your biggest ick?",
  "Have you ever stalked someone's social media for over an hour?",
  "What's the worst fashion trend you've followed?",
  "What's your most embarrassing childhood memory?",
  "What's one thing you wish you were naturally good at?",
  "If money wasn't a problem, what ridiculous thing would you buy?",
  "What's something you've never admitted until now?",
  "Have you ever accidentally broken something and blamed someone else?",
  "What's your most embarrassing autocorrect fail?",
  "What's the funniest excuse you've ever made?",
  "If everyone here had to date each other, who would be the best couple?",
  "What's your weirdest habit nobody knows about?",
  "Who here would survive prison best?",
  "What's something you were terrified of as a kid?",
  "If animals could talk, which would be the rudest?",
  "Have you ever laughed so hard you cried?",
  "If your life was a movie, what would it be called?",
  "What's one conspiracy theory that's almost convincing?",
  "What's the weirdest compliment you've ever received?",
  "If you had to delete every app except three, which stay?",
  "What's your biggest 'I instantly regretted that' moment?",
  "What's one thing you'd never tell your parents?",
  "What's your funniest school memory?",
  "Who in this room would be most likely to accidentally start a cult?",
  "Have you ever been caught singing to yourself?",
  "If you could erase one embarrassing memory, what would it be?",
  "What's something you've bought that was a complete waste of money?",
  "If you could swap one personality trait with someone here, what would it be?",
  "What's the pettiest reason you've disliked someone?",
  "Have you ever laughed at your own joke before finishing it?",
  "What's the weirdest thing you've done out of boredom?",
  "What's your most random flex?",
  "Have you ever faked confidence and somehow pulled it off?"
];

const dares = [
  "Talk like a pirate until your next turn.",
  "Only answer questions with another question until your next turn.",
  "Do your best dinosaur impression.",
  "Pretend the floor is lava for one minute.",
  "Narrate everything you do dramatically for the next two minutes.",
  "Speak with an accent chosen by the group.",
  "Moonwalk across the room.",
  "Pretend you're auditioning for a toothpaste advert.",
  "Sing everything you say until your next turn.",
  "Act like a cat until your next turn.",
  "Do your best evil villain laugh.",
  "Pretend you're an NPC from a video game.",
  "Walk backwards until your next turn.",
  "Speak incredibly slowly until your next turn.",
  "Dance with absolutely no music for 30 seconds.",
  "Balance something on your head for one minute.",
  "Invent a superhero and explain their terrible power.",
  "Pretend you're giving a TED Talk about potatoes.",
  "Attempt to juggle three random objects.",
  "Freeze every time someone says your name.",
  "Do your best celebrity impression.",
  "Let someone style your hair for two minutes.",
  "Create a handshake with the person opposite you.",
  "Draw yourself with your eyes closed.",
  "Do 15 squats while making animal noises.",
  "Make up a rap about someone in the room.",
  "Pretend you're underwater until your next turn.",
  "Do your best runway walk.",
  "Read the next truth dramatically like Shakespeare.",
  "Laugh like a supervillain for 30 seconds.",
  "Pretend you're a weather presenter describing this room.",
  "Speak like Yoda until your next turn.",
  "Wear socks on your hands for five minutes.",
  "Give everyone a motivational speech.",
  "Pretend to be a waiter taking everyone's imaginary order.",
  "Do your best chicken dance.",
  "Act like you've won the lottery.",
  "Make up a new dance move and teach it.",
  "Pretend you're an influencer reviewing a spoon.",
  "Do your best robot impression.",
  "Speak only in song lyrics until your next turn.",
  "Invent a completely fake animal and describe it.",
  "High-five everyone in a unique way.",
  "Pretend you're invisible for one minute.",
  "Explain TikTok to a Victorian king.",
  "Pretend to host a cooking show using invisible ingredients.",
  "Do your best impression of someone in the room.",
  "Stand like a flamingo until your next turn.",
  "Try to lick your elbow.",
  "Pretend you're a football commentator describing someone drinking water.",
  "Do ten jumping jacks while smiling the entire time.",
  "Speak only using movie titles until your next turn.",
  "Create a new national anthem for pizza.",
  "Pretend you're a detective investigating who stole the biscuits.",
  "Do your best monkey impression.",
  "Act like you've just discovered gravity.",
  "Pretend you're an excited shopping channel host selling a banana.",
  "Walk like a penguin until your next turn.",
  "Compliment everyone in the room.",
  "Pretend you're a wizard casting spells on everyone.",
  "Attempt to whistle a famous song.",
  "Speak without using the letter E until your next turn.",
  "Do your best slow-motion action scene.",
  "Pretend you're on Love Island introducing yourself.",
  "Give an acceptance speech for winning 'Most Average Person'.",
  "Act like a confused tourist for two minutes.",
  "Pretend your chair is a horse.",
  "Make up a slogan for the person to your right.",
  "Attempt your best breakdance move.",
  "Pose like a superhero until your next turn."
];

let truthDareMode = "mix";

$$("#truthDareMode button").forEach((button) => {
  button.addEventListener("click", () => {
    truthDareMode = button.dataset.mode;
    $$("#truthDareMode button").forEach((candidate) =>
      candidate.classList.toggle("active", candidate === button)
    );
  });
});

$("#makeTruthDare").addEventListener("click", () => {
  const mode =
    truthDareMode === "mix"
      ? randomItem(["truth", "dare"])
      : truthDareMode;
  const prompt = randomItem(mode === "truth" ? truths : dares);
  $("#truthDareResult").textContent = `${mode.toUpperCase()} — ${prompt}`;
});

// Random timer
let timerSeconds = 73;
let timerInterval = null;
let timerRunning = false;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const updateTimer = () => {
  $("#timerResult").textContent = formatTime(timerSeconds);
};

const stopTimer = () => {
  window.clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  $("#startTimer").textContent = "▶";
  $("#startTimer").setAttribute("aria-label", "Start timer");
};

$("#makeTimer").addEventListener("click", () => {
  stopTimer();
  let min = Math.max(1, Number.parseInt($("#timerMin").value, 10) || 1);
  let max = Math.max(1, Number.parseInt($("#timerMax").value, 10) || 1);
  if (min > max) [min, max] = [max, min];
  timerSeconds = randomInt(min, max);
  $("#timerResult").classList.remove("done");
  updateTimer();
});

$("#startTimer").addEventListener("click", () => {
  if (timerRunning) {
    stopTimer();
    return;
  }
  if (timerSeconds <= 0) {
    $("#makeTimer").click();
  }
  timerRunning = true;
  $("#startTimer").textContent = "Ⅱ";
  $("#startTimer").setAttribute("aria-label", "Pause timer");
  $("#timerResult").classList.remove("done");
  timerInterval = window.setInterval(() => {
    timerSeconds -= 1;
    updateTimer();
    if (timerSeconds <= 0) {
      stopTimer();
      $("#timerResult").classList.add("done");
      showToast("Time is up!");
    }
  }, 1000);
});

// Search and filters
let activeFilter = "all";

const filterTools = () => {
  const query = $("#toolSearch").value.trim().toLowerCase();
  let visibleCount = 0;
  $$(".tool-grid [data-tool]").forEach((tool) => {
    const categoryMatch =
      activeFilter === "all" ||
      tool.dataset.category.split(" ").includes(activeFilter);
    const text = `${tool.dataset.name || ""} ${tool.textContent}`.toLowerCase();
    const searchMatch = !query || text.includes(query);
    tool.hidden = !(categoryMatch && searchMatch);
    if (!tool.hidden) visibleCount += 1;
  });
  $("#noResults").hidden = visibleCount > 0;
};

$("#toolSearch").addEventListener("input", filterTools);
$$(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    $$(".filter-chip").forEach((candidate) =>
      candidate.classList.toggle("active", candidate === button)
    );
    filterTools();
  });
});

// Copy helpers
async function copyText(text, successMessage = "Copied!") {
  if (!text) {
    showToast("Nothing to copy yet");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.append(temporary);
    temporary.select();
    document.execCommand("copy");
    temporary.remove();
    showToast(successMessage);
  }
}

$$("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.copyTarget);
    copyText(target.textContent);
  });
});

// Keyboard-friendly shortcuts within the two large tools
wheelNamesInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") spinWheel();
});
teamNamesInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    $("#makeTeams").click();
  }
});

makePassword();
updateTimer();




async function loadNavbar() {
    const placeholder =
      document.getElementById(
        'nav-placeholder'
      );

    const candidates = [
      'navbar.html',
      './navbar.html',
      'Anime/navbar.html',
      '../navbar.html',
      '../../navbar.html'
    ];

    for (const path of candidates) {
      try {
        const response =
          await fetch(
            path,
            {
              cache: 'no-store'
            }
          );

        if (!response.ok) {
          continue;
        }

        placeholder.innerHTML =
          await response.text();

        const prefix =
          path.replace(
            /navbar\.html$/i,
            ''
          );

        placeholder
          .querySelectorAll('[src]')
          .forEach(element => {
            const source =
              element.getAttribute(
                'src'
              ) || '';

            const absolute =
              /^(data:|https?:|\/)/i.test(
                source
              );

            if (!absolute) {
              element.setAttribute(
                'src',
                prefix +
                source.replace(
                  /^\.\/+/,
                  ''
                )
              );
            }
          });

        const toggle =
          placeholder.querySelector(
            '.nav-toggle'
          );

        const menu =
          placeholder.querySelector(
            '#mainmenu'
          );

        toggle?.addEventListener(
          'click',
          () => {
            const expanded =
              toggle.getAttribute(
                'aria-expanded'
              ) === 'true';

            toggle.setAttribute(
              'aria-expanded',
              String(!expanded)
            );

            menu?.classList.toggle(
              'open'
            );
          }
        );

        const currentPage =
          window.location.pathname
            .split('/')
            .pop()
            ?.toLowerCase() || '';

        placeholder
          .querySelectorAll('.menu a')
          .forEach(anchor => {
            const target =
              anchor
                .getAttribute('href')
                ?.split('/')
                .pop()
                ?.toLowerCase() || '';

            if (
              target &&
              target === currentPage
            ) {
              anchor.classList.add(
                'active'
              );

              anchor.setAttribute(
                'aria-current',
                'page'
              );
            }
          });

        return;
      } catch (error) {
        console.debug(
          `Navbar attempt failed: ${path}`,
          error
        );
      }
    }

    console.warn(
      'navbar.html was not found in the expected locations.'
    );
  }


  loadNavbar();