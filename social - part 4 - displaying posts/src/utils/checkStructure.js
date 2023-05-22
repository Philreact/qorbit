// check the structure of blog posts
export const checkStructure = (content) => {
  console.log({ content })
  let isValid = true

  if (!content?.version) isValid = false
  if (!content?.text) isValid = false
  if (typeof content?.text !== 'string') isValid = false

  return isValid
}
