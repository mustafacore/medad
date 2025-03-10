(function () {
    // Get references to DOM elements
    const inputField = document.getElementById("user_input");
    const errorMsg = document.getElementById("error-msg");
    const inputContainer = document.getElementById("inputContainer");
    const form = document.getElementById("myForm");
    const submitBtn = document.getElementById("submit-btn");

    // Function to check the validity of the input value
    function checkValidity(value) {
        if (!value.match(/^[\u0600-\u06FF\s]*$/)) {
            return "❌ يُسمح فقط بإدخال الحروف العربية!";
        }
        if (value.match(/[\u0660-\u0669\s١۲۳٤٥٦٧۸٩۰]/)) {
            return "❌ غير مسموح بإدخال الأرقام العربية!";
        }
        let words = value.split(/\s+/).filter(Boolean);
        if (words.length > 10) {
            return "⚠️ يُسمح بإدخال 10 كلمات كحد أقصى!";
        }
        return "";
    }

    // Listen for input events to validate text in real time
    if (inputField) {
        inputField.addEventListener("input", () => {
            const trimmedValue = inputField.value.trim();
            if (trimmedValue === "") {
                errorMsg.textContent = "";
                errorMsg.style.display = "none";
                submitBtn.style.display = "none";
                inputContainer.classList.remove("error");
                return;
            }

            const error = checkValidity(trimmedValue);
            if (error) {
                errorMsg.textContent = error;
                errorMsg.style.display = "inline-block";
                submitBtn.style.display = "none";
                inputContainer.classList.add("error");
            } else {
                errorMsg.textContent = "";
                errorMsg.style.display = "none";
                submitBtn.style.display = "inline-block";
                inputContainer.classList.remove("error");
            }
        });
    }

    // Validate on form submission and show spinner if valid
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const trimmedValue = inputField.value.trim();
        if (trimmedValue === "") {
            return;
        }

        const error = checkValidity(trimmedValue);
        if (error) {
            return;
        }

        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.spinner').style.display = 'inline-block';

        setTimeout(() => {
            form.submit();
        }, 1000);
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

    // Expose generateRandomText to the global scope if needed
    window.generateRandomText = generateRandomText;

    // Typewriter effect for the input's placeholder
    document.addEventListener("DOMContentLoaded", function() {
        const placeholderText = "اكتب النص...";
        let currentIndex = 0;
        inputField.placeholder = "";
        let typeAnimationTimeout = null;  // store timeout ID
    
        function typeAnimation() {
            if (currentIndex < placeholderText.length) {
                inputField.placeholder += placeholderText.charAt(currentIndex);
                currentIndex++;
                typeAnimationTimeout = setTimeout(typeAnimation, 150);
            }
        }
        // Start the animation on page load.
        typeAnimation();
    
        // When the input field is focused, stop the animation and clear the placeholder.
        inputField.addEventListener("focus", function() {
            if (typeAnimationTimeout) {
                clearTimeout(typeAnimationTimeout);
                typeAnimationTimeout = null;
            }
            inputField.placeholder = "";
        });
    
        // When the input field loses focus, if it's empty, restart the animation.
        inputField.addEventListener("blur", function() {
            if (inputField.value.trim() === "") {
                // Reset the animation variables and restart the animation.
                currentIndex = 0;
                inputField.placeholder = "";
                typeAnimation();
            }
        });
    });

})();
