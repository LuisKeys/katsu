const { alignment } = require("excel4node/distribution/lib/types");

const getAnswerPhrase = (name) => {
  const phrases = [
    "Certainly #name#",
    "There you go",
    "Sure my friend",
    "Absolutely, #name#",
    "Here it is",
    "Of course, buddy",
    "Without a doubt, #name#",
    "Voilà",
    "Absolutely, my friend",
    "Certainly, there you have it",
    "Here you are",
    "Of course, mate",
    "Certainly mate",
    "Sure #name#",
    "Absolutely, mate",
    "Here it is #name#",
    "Of course, #name#",
    "Without a doubt, #name#",
    "Voilà #name#",
    "Absolutely, #name#",
    "Certainly, there you have it #name#",
    "Here you are #name#",
    "Of course, #name#"
  ];
    
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  const showFace = process.env.SHOW_EMOJI == "true";
  
  if (!showFace) {
    return phrase.replace("#name#", name);
  }

  return getRandomEmoji() + " " + phrase.replace("#name#", name);
}

const getRandomEmoji = () => {
  const emojis = [
    "smiley",
    "nerd_face",
    "sunglasses",
    "relaxed",
    "upside_down_face",
    "blush",
    "alien",
    "smiley_cat",
    "dog"
  ];

  const randomIndex = Math.floor(Math.random() * emojis.length);
  return ":" + emojis[randomIndex] + ":";
}

module.exports = {
  getAnswerPhrase
};