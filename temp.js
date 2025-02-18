function moveToStart(arr, element) {
    // Find the index of the element
    const index = arr.indexOf(element);

    // If the element is not found or is already at index 0, return the array as is
    if (index === -1 || index === 0) {
        return arr;
    }

    // Remove the element from its current position
    arr.splice(index, 1);

    // Insert the element at the 0th index
    arr.unshift(element);

    return arr;
}

// Example usage:
console.log(moveToStart(['3ed35751-da54-4ecc-8d26-c57618c02ae6', '54a3783c-8cd5-41b9-82eb-7ec68a05d273', '226c6253-b7ba-4d5f-99a4-3575dc5802df', '23a9634b-df0b-4b6e-b8a1-3711174c8880'], '226c6253-b7ba-4d5f-99a4-3575dc5802df')); // [2, 3, 5, 8, 1]
// console.log(moveToStart([3, 5, 2, 8, 1], 10)); // [3, 5, 2, 8, 1] (element not found)
// console.log(moveToStart([5], 5)); // [5] (only one element)
// console.log(moveToStart([5, 3, 2], 5)); // [5, 3, 2] (already at index 0)
