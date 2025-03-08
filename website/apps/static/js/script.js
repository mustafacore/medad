// --- Real-time Validation and Typewriter Effect ---

// Get references to DOM elements
const inputField = document.getElementById("user_input");
const errorMsg = document.getElementById("error-msg");
const inputContainer = document.getElementById("inputContainer");
const form = document.getElementById("myForm");

// Function to check the validity of the input value
function checkValidity(value) {
    // Check if input contains only Arabic letters and spaces
    if (!value.match(/^[\u0600-\u06FF\s]*$/)) {
        return "❌ يُسمح فقط بإدخال الحروف العربية!";
    }
    // Check if input contains any Arabic numbers
    if (value.match(/[\u0660-\u0669١٢٣٤٥٦٧٨٩٠]/)) {
        return "❌ غير مسموح بإدخال الأرقام العربية!";
    }
    // Check word limit
    let words = value.split(/\s+/).filter(Boolean);
    if (words.length > 10) {
        return "⚠️ يُسمح بإدخال 10 كلمات كحد أقصى!";
    }
    return ""; // no error found
}

// Listen for input events to validate text in real-time
if (inputField) {
  inputField.addEventListener("input", () => {
      const trimmedValue = inputField.value.trim();
      const error = checkValidity(trimmedValue);
      if (error) {
          errorMsg.textContent = error;
          inputContainer.classList.add("error");
      } else {
          errorMsg.textContent = "";
          inputContainer.classList.remove("error");
      }
  });
}

// Validate on form submission and show spinner if valid
form.addEventListener("submit", function(e) {
    e.preventDefault(); // prevent immediate submission
    const trimmedValue = inputField.value.trim();
    const error = checkValidity(trimmedValue);
    if (error) {
        alert(error);
        return;
    }
    
    // Show spinner and hide button text
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.spinner').style.display = 'inline-block';
    
    // Delay submission to allow the spinner to be visible
    setTimeout(() => {
        form.submit();
    }, 1000); // Adjust the delay as needed
});

// Generate random Arabic text and trigger validation
function generateRandomText() {
    const arabicPhrases = [
        'السلام عليكم',
        'سبحان الله',
        'بسم الله الرحمن الرحيم',
        'الحمد لله',
        'لا إله إلا الله'
    ];
    const randomPhrase = arabicPhrases[Math.floor(Math.random() * arabicPhrases.length)];
    inputField.value = randomPhrase;
    inputField.dispatchEvent(new Event('input'));
}

// Typewriter effect for the input's placeholder
document.addEventListener("DOMContentLoaded", function() {
    const placeholderText = "اكتب النص...";
    let currentIndex = 0;
    inputField.placeholder = ""; // start with an empty placeholder

    function typeAnimation() {
        if (currentIndex < placeholderText.length) {
            inputField.placeholder += placeholderText.charAt(currentIndex);
            currentIndex++;
            setTimeout(typeAnimation, 150); // adjust speed as needed
        }
    }
    typeAnimation();
});
