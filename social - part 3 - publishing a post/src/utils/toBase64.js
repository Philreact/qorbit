export function objectToBase64(obj) {
  // Step 1: Convert the object to a JSON string
  const jsonString = JSON.stringify(obj)

  // Step 2: Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' })

  // Step 3: Create a FileReader to read the Blob as a base64-encoded string
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove 'data:application/json;base64,' prefix
        const base64 = reader.result.replace(
          'data:application/json;base64,',
          ''
        )
        resolve(base64)
      } else {
        reject(new Error('Failed to read the Blob as a base64-encoded string'))
      }
    }
    reader.onerror = () => {
      reject(reader.error)
    }
    reader.readAsDataURL(blob)
  })
}
