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
  return phrase.replace("#name#", name);
}

module.exports = {
  getAnswerPhrase
};