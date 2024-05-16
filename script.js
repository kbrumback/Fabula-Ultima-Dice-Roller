function modifyDiceSize(attribute, change) {
    const select = document.getElementById(attribute);
    let currentDie = parseInt(select.value);
    if (change === 1 && currentDie < 12) {
        select.value = currentDie + 2; // Go to next available die size
    } else if (change === -1 && currentDie > 6) {
        select.value = currentDie - 2; // Go to previous available die size
    }
}

function rollSelectedDice() {
    const attributes = ['might', 'dexterity', 'insight', 'willpower'];
    const results = {};
    let total = 0;
    let diceResults = [];
    let selectedAttributes = [];

    // Collect selected attributes
    attributes.forEach(attr => {
        if (document.getElementById(attr + '-roll').checked) {
            selectedAttributes.push(attr);
        }
    });

    // Roll dice based on the number of selected attributes
    if (selectedAttributes.length > 1) {
        selectedAttributes.forEach(attr => {
            const dieSize = parseInt(document.getElementById(attr).value);
            const modifier = parseInt(document.getElementById(attr + '-mod').value) || 0;
            const rollResult = rollSingleDie(dieSize) + modifier;
            results[attr] = { rolls: [rollResult], dieSize: dieSize };
            total += rollResult;
            diceResults.push({ attr, rollResult });
        });
        analyzeResults(diceResults, results, total);
    } else if (selectedAttributes.length === 1) {
        const attr = selectedAttributes[0];
        const dieSize = parseInt(document.getElementById(attr).value);
        const modifier = parseInt(document.getElementById(attr + '-mod').value) || 0;
        const rollResult1 = rollSingleDie(dieSize) + modifier;
        const rollResult2 = rollSingleDie(dieSize) + modifier;
        results[attr] = { rolls: [rollResult1, rollResult2], dieSize: dieSize };
        total += rollResult1 + rollResult2;
        analyzeSingleAttributeResults(results[attr], total, attr);
    } else {
        alert('Please select at least one attribute to roll.');
    }
}

function analyzeResults(diceResults, results, total) {
    // Determine highest and lowest rolls
    diceResults.forEach(d => {
        d.highest = d.rollResult;
        d.lowest = d.rollResult;
    });
    diceResults.sort((a, b) => a.highest - b.highest);
    const highest = diceResults[diceResults.length - 1].attr;
    const lowest = diceResults[0].attr;
    results[highest].status = 'HR'; // Highest Roll
    results[lowest].status = 'LR'; // Lowest Roll

    displayResults(results, total);
    checkForCriticalHits(diceResults);
}

function analyzeSingleAttributeResults(result, total, attr) {
    const highest = Math.max(result.rolls[0], result.rolls[1]);
    const lowest = Math.min(result.rolls[0], result.rolls[1]);
    result.status = `HR: ${highest}, LR: ${lowest}`;
    displayResults({ [attr]: result }, total);
    if (result.rolls[0] === result.rolls[1] && result.rolls[0] >= 6) {
        animateCriticalHit();
    }
}

function displayResults(results, total) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<strong>Total Roll: ${total}</strong><br/>`; // Display total roll
    Object.keys(results).forEach(key => {
        const rollText = results[key].rolls.length > 1 ? `${key.toUpperCase()}+${key.toUpperCase()}` : key.toUpperCase();
        const resultElement = document.createElement('div');
        resultElement.textContent = `${rollText}: ${results[key].rolls.join(' + ')} (${results[key].status || ''})`;
        resultsContainer.appendChild(resultElement);
    });
    resultsContainer.style.display = 'block';
}

function checkForCriticalHits(diceResults) {
    diceResults.forEach(d => {
        if (d.rollResult1 === d.rollResult2 && d.rollResult1 >= 6) {
            animateCriticalHit();
        }
    });
}

function rollSingleDie(dieSize) {
    return Math.floor(Math.random() * dieSize) + 1;
}

function animateCriticalHit() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.classList.add('critical-hit');
    setTimeout(() => {
        resultsContainer.classList.remove('critical-hit');
    }, 2000); // Animation duration of 2 seconds
}
