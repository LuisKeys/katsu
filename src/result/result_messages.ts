const getNoresultsMessage = (userPrompt: string) => {
  return `No results found for your question "${userPrompt}".
  Please try with a different prompt or check the Help 
  typing 'help' or clicking the help button.
  `;
}

export { getNoresultsMessage };