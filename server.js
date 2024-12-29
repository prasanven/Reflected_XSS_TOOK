document.querySelectorAll('.level-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to the clicked button
        button.classList.add('active');

        const level = button.getAttribute('data-level');
        showVulnerabilityDemo(level);
    });
});


document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userInput = document.getElementById('userInput').value;
    showCodeExamples(userInput);
});

function showVulnerabilityDemo(level) {
    // Hide level selection
    document.getElementById('level-selection').style.display = 'none';

    // Show vulnerability demo
    document.getElementById('vulnerability-demo').style.display = 'block';

    // Clear any previous output
    document.getElementById('userInput').value = '';
    document.getElementById('output').innerHTML = '';
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('vulnerability-details').textContent = '';
    document.getElementById('vulnerableCode').textContent = '';
    document.getElementById('secureCode').textContent = '';
}

function showCodeExamples(userInput) {
    let vulnerabilityDetails = '';
    let vulnerableCode = '';
    let secureCode = '';

    // Sanitize input by trimming whitespace and checking for malicious patterns
    const sanitizedInput = userInput.trim().toLowerCase();
    const isMalicious = /<script.*?>.*?<\/script>|javascript:|onerror=|onload=|eval\(|alert\(|prompt\(|location\./i.test(sanitizedInput);

    // Example of vulnerable code and secure code based on selected level
    const level = document.querySelector('.level-btn.active')?.getAttribute('data-level') || 'basic';

    if (isMalicious) {
        // If malicious code is detected, show vulnerability details
        switch (level) {
            case 'basic':
                vulnerabilityDetails = 'This is a basic reflected XSS vulnerability, where user input is directly inserted into the HTML without sanitization.';
                vulnerableCode = `document.getElementById('output').innerHTML = userInput;`;
                secureCode = `document.getElementById('output').textContent = userInput;`;
                break;
            case 'intermediate':
                vulnerabilityDetails = 'This vulnerability involves event handlers like onclick, onerror, etc. that execute user input as JavaScript.';
                vulnerableCode = `document.getElementById('output').innerHTML = \`<img src="x" onerror="alert('${userInput}')">\`;`;
                secureCode = `const img = document.createElement('img'); img.src = 'valid-image.jpg'; img.alt = 'Image'; document.getElementById('output').appendChild(img);`;
                break;
            case 'expert':
                vulnerabilityDetails = 'This vulnerability involves injecting JavaScript into the href or src attribute, such as in an anchor or iframe tag.';
                vulnerableCode = `document.getElementById('output').innerHTML = \`<a href="javascript:alert('${userInput}')">Click here</a>\`;`;
                secureCode = `const a = document.createElement('a'); a.href = '#'; a.textContent = 'Click here'; document.getElementById('output').appendChild(a);`;
                break;
            case 'pro':
                vulnerabilityDetails = 'This advanced XSS attack involves complex scenarios like exfiltrating sensitive information (e.g., cookies) via payloads.';
                vulnerableCode = `document.getElementById('output').innerHTML = \`<iframe src="javascript:alert('${userInput}')"></iframe>\`;`;
                secureCode = `const iframe = document.createElement('iframe'); iframe.src = 'https://safe-domain.com'; document.getElementById('output').appendChild(iframe);`;
                break;
        }
    } else {
        // If input is safe, display a message indicating no vulnerability detected
        vulnerabilityDetails = 'No vulnerability detected. The input is secure.';
        vulnerableCode = '';
        secureCode = '';
    }

    // Display the code examples and explanation
    document.getElementById('vulnerability-details').textContent = vulnerabilityDetails;
    document.getElementById('vulnerableCode').textContent = vulnerableCode;
    document.getElementById('secureCode').textContent = secureCode;
}
document.getElementById('checkCode').addEventListener('click', function() {
    // Get the code from the practice area
    const practiceCode = document.getElementById('practiceArea').value.trim();

    // Check if the code contains any vulnerabilities
    const isMalicious = /<script.*?>.*?<\/script>|javascript:|onerror=|onload=|eval\(|alert\(|prompt\(|location\./i.test(practiceCode);

    // Display feedback based on whether the code is secure or not
    const feedbackElement = document.getElementById('practice-feedback');
    if (isMalicious) {
        feedbackElement.innerHTML = '<span style="color: red;">Your code contains vulnerabilities!</span>';
    } else {
        feedbackElement.innerHTML = '<span style="color: green;">Your code is secure!</span>';
    }
});
