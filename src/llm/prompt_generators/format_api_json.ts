
const createFormatjSONPrompt = (jSON: string): string => {
  const llmPrompt = `Format the numbers, phones, amounts  and dates in a human readable way for the following jSON, return only the jSON with the correct formats. Remove unused fields from the 'fields' list and from each row in the 'rows' list:
  ${jSON}`;
  return llmPrompt;
}

export { createFormatjSONPrompt };



