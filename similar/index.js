// get compare button
const compareButton = document.getElementById('compare');

// get output div
const outputDiv = document.getElementById('output');

// on click of compare button
compareButton.addEventListener('click', () => {
    // clear output div
    outputDiv.innerHTML = '';
    // get first input value
    const firstInput = document.getElementById('input1').value;

    // get second input value
    const secondInput = document.getElementById('input2').value;

    // check if both inputs are empty
    if (checkEmpty(firstInput, secondInput)) {
        alert('Please enter two documents to compare');
        return;
    }
    // get campare button text
    const compareButtonText = compareButton.textContent;
    // change compare button text to comparing... while comparing
    compareButton.textContent = 'Comparing...';
    // disable compare button while comparing
    compareButton.disabled = true;

    // sleep for 3 seconds to simulate comparing
    setTimeout(() => {

        // convert first input to word list
        const firstWordList = convertToWordList(firstInput);

        // convert second input to word list
        const secondWordList = convertToWordList(secondInput);

        console.log(firstWordList);
        console.log(secondWordList);

        // calculate cosine similarity
        const cosineSimilarity = calculateCosineSimilarity(firstWordList, secondWordList);

        console.log(cosineSimilarity);

        // multiply cosine similarity by 100 to get percentage, to 2dp
        const percentage = (cosineSimilarity * 100).toFixed(2);

        // show percentage in output div
        outputDiv.innerHTML += `<span class="output-percentage">The documents are  <b>${percentage}%</b> similar</span><br><br>`;
        // show word lists in output div
        showWordLists(firstWordList, secondWordList);

        // highlight similar words
        highlightSimilarWords(firstWordList, secondWordList);

        // change compare button text back to original text
        compareButton.textContent = compareButtonText;
        // enable compare button
        compareButton.disabled = false;
    }, 3000);
});

// function to check if two strings are empty
function checkEmpty(firstInput, secondInput) {
    if (firstInput === '' || secondInput === '') {
        return true;
    } else {
        return false;
    }
}

// function to show word lists in output div in a table
function showWordLists(firstWordList, secondWordList) {
    // create a table
    const table = document.createElement('table');
    // create a table row for headers
    const tableRow = document.createElement('tr');
    // create a table header for the word
    const wordHeader = document.createElement('th');
    // create a table header for document 1
    const firstDocHeader = document.createElement('th');
    // create a table header for document 2
    const secondDocHeader = document.createElement('th');
    // set the text content of the word header
    wordHeader.textContent = 'Word';
    // set the text content of the document 1 header
    firstDocHeader.textContent = 'Document 1';
    // set the text content of the document 2 header
    secondDocHeader.textContent = 'Document 2';
    // append the word header to the table row
    tableRow.appendChild(wordHeader);
    // append the document 1 header to the table row
    tableRow.appendChild(firstDocHeader);
    // append the document 2 header to the table row
    tableRow.appendChild(secondDocHeader);
    // append the table row to the table
    table.appendChild(tableRow);

    // get the keys from both word lists and merge them into a single array
    const allWords = [...new Set([...Object.keys(firstWordList), ...Object.keys(secondWordList)])];

    // loop through each word
    for (let i = 0; i < allWords.length; i++) {
        const word = allWords[i];
        // create a table row
        const tableRow = document.createElement('tr');
        // create a table data for the word
        const wordData = document.createElement('td');
        // set the text content of the word data
        wordData.textContent = word;
        // append the word data to the table row
        tableRow.appendChild(wordData);

        // create a table data for the word count in document 1
        const firstDocWordCountData = document.createElement('td');
        // set the text content of the word count data
        firstDocWordCountData.textContent = firstWordList[word] || '0';
        // append the word count data to the table row
        tableRow.appendChild(firstDocWordCountData);

        // create a table data for the word count in document 2
        const secondDocWordCountData = document.createElement('td');
        // set the text content of the word count data
        secondDocWordCountData.textContent = secondWordList[word] || '0';
        // append the word count data to the table row
        tableRow.appendChild(secondDocWordCountData);

        // append the table row to the table
        table.appendChild(tableRow);
    }

    // append the table to the output div
    outputDiv.appendChild(table);
}

// function to convert a document to a list of words if a word occurs more than once and count the number of times it occurs
function convertToWordList(input) {
    // convert input to lowercase
    const lowerCaseInput = input.toLowerCase();

    // split input into words
    const wordList = lowerCaseInput.split(' ');

    // create an object to store words and their count
    const wordCount = {};

    // loop through word list
    for (let i = 0; i < wordList.length; i++) {
        // check if word is in word count object
        if (wordCount[wordList[i]]) {
            // increment word count
            wordCount[wordList[i]]++;
        } else {
            // add word to word count object
            wordCount[wordList[i]] = 1;
        }
    }

    return wordCount;
}

// function to calculate cosine similarity, treating each word as a dimension and the word count as a vector
function calculateCosineSimilarity(firstWordList, secondWordList) {
    // get the dot product of the two vectors
    const dotProduct = getDotProduct(firstWordList, secondWordList);

    // get the magnitude of the first vector
    const firstVectorMagnitude = getVectorMagnitude(firstWordList);

    // get the magnitude of the second vector
    const secondVectorMagnitude = getVectorMagnitude(secondWordList);

    // calculate cosine similarity
    const cosineSimilarity = dotProduct / (firstVectorMagnitude * secondVectorMagnitude);

    return cosineSimilarity;
}

// function to get the dot product of two vectors
function getDotProduct(firstWordList, secondWordList) {
    // create a variable to store the dot product
    let dotProduct = 0;

    // loop through first word list
    for (let word in firstWordList) {
        // check if word is in second word list
        if (secondWordList[word]) {
            // multiply the word count in the first word list by the word count in the second word list and add to dot product
            dotProduct += firstWordList[word] * secondWordList[word];
        }
    }

    return dotProduct;
}

// function to get the magnitude of a vector
function getVectorMagnitude(wordList) {
    // create a variable to store the magnitude
    let magnitude = 0;

    // loop through word list
    for (let word in wordList) {
        // square the word count and add to magnitude
        magnitude += Math.pow(wordList[word], 2);
    }

    // get the square root of the magnitude
    magnitude = Math.sqrt(magnitude);

    return magnitude;
}

// function to get the euclidean distance between two vectors
function getEuclideanDistance(firstWordList, secondWordList) {
    // create a variable to store the euclidean distance
    let euclideanDistance = 0;

    // loop through first word list
    for (let word in firstWordList) {
        // check if word is in second word list
        if (secondWordList[word]) {
            // square the difference between the word count in the first word list and the word count in the second word list and add to euclidean distance
            euclideanDistance += Math.pow(firstWordList[word] - secondWordList[word], 2);
        }
    }

    // get the square root of the euclidean distance
    euclideanDistance = Math.sqrt(euclideanDistance);

    return euclideanDistance;
}
function highlightSimilarWords(firstWordList, secondWordList) {
    // Get the input elements once outside the loop
    const firstInput = document.getElementById('input1');
    const secondInput = document.getElementById('input2');

    // Split the input values into an array of words
    const firstWords = firstInput.value.trim().split(/\s+/);
    const secondWords = secondInput.value.trim().split(/\s+/);

    // Get the intersection of the two word lists
    const similarWords = firstWords.filter(word => secondWords.includes(word));

    // Create a regular expression that matches all similar words
    const regex = new RegExp(`\\b(${similarWords.join('|')})\\b`, 'gi');

    // Highlight the similar words in both input values using the regular expression
    const firstHighlighted = firstInput.value.replace(regex, '<span class="highlight">$1</span>');
    const secondHighlighted = secondInput.value.replace(regex, '<span class="highlight">$1</span>');

    // Output the highlighted inputs to the output div
    outputDiv.innerHTML += `<h3>Summary</h3><br><br><h4>Document 1</h4>${firstHighlighted}<br><h4>Document 2</h4><br>${secondHighlighted}<br><br>`;
}


// function to get the words that are similar in the two documents
function getSimilarWords(firstWordList, secondWordList) {
    // create a variable to store the similar words
    const similarWords = [];

    // loop through first word list
    for (let word in firstWordList) {
        // check if word is in second word list
        if (secondWordList[word]) {
            // add word to similar words
            similarWords.push(word);
        }
    }

    return similarWords;
}