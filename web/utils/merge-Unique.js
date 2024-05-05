export async function mergeUnique(existingArray, newArray, key) {
    const uniqueValues = new Set(existingArray.map(obj => obj[key]));
  
    newArray.forEach(newObj => {
      if (!uniqueValues.has(newObj[key])) {
        existingArray.push(newObj);
      }
    });
  
    return existingArray;
  }