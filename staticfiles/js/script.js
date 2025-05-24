(function () {
    /**********************
     *  DOM Element Setup *
     **********************/
    const inputField = document.getElementById("user_input");
    const errorMsg = document.getElementById("error-msg");
    const inputContainer = document.getElementById("inputContainer");
    const form = document.getElementById("myForm");
    const submitBtn = document.getElementById("submit-btn");

    // Mobile menu elements
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    /********************************
     *  Mobile Menu Functionality   *
     ********************************/
    function toggleMenu() {
        // Ensure required elements exist
        if (!hamburger || !sidebar || !overlay) return;

        // Check if sidebar is active
        const isActive = sidebar.classList.contains('active');

        // Toggle 'active' class on hamburger, sidebar, and overlay
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');

        // Toggle body scroll: disable scrolling when menu is open
        document.body.style.overflow = !isActive ? 'hidden' : '';
    }

    // Initialize mobile menu event listeners
    if (hamburger && sidebar && overlay) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Toggle menu on overlay click (closes menu)
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Add event listeners to all links inside the sidebar
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Stop propagation to avoid accidental menu closing
                e.stopPropagation();
                toggleMenu();
                // Allow time for transition before navigating to the link
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            });
        });

        // Close menu when Escape key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Prevent clicks inside the sidebar from bubbling up and closing the menu
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /***************************
     *  Input Validation Logic *
     ***************************/
    function checkValidity(value) {
        // Allow only Arabic letters and spaces
        if (!/^[\u0600-\u06FF\s]*$/.test(value)) {
            return "❌ يُسمح فقط بإدخال الحروف العربية!";
        }
        // Disallow Arabic numbers (covers common Arabic and Persian digits)
        if (/[\u0660-\u0669\u06F0-\u06F9]/.test(value)) {
            return "❌ غير مسموح بإدخال الأرقام العربية!";
        }
        // Limit input to a maximum of 5 words
        const words = value.split(/\s+/).filter(Boolean);
        if (words.length > 5) {
            return "⚠️ يُسمح بإدخال 5 كلمات كحد أقصى!";
        }
        return "";
    }

    // Real-time validation on input events
    if (inputField) {
        inputField.addEventListener("input", () => {
            const trimmedValue = inputField.value.trim();

            // Reset error message and hide submit button if input is empty
            if (trimmedValue === "") {
                errorMsg.textContent = "";
                errorMsg.style.display = "none";
                submitBtn.style.display = "none";
                inputContainer.classList.remove("error");
                return;
            }

            // Validate input and display error if found
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

    /*********************************
     *  Form Submission Handling     *
     *********************************/
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent immediate form submission
            const trimmedValue = inputField.value.trim();
            if (trimmedValue === "") return;

            // Validate input before submitting
            const error = checkValidity(trimmedValue);
            if (error) return;

            // Show a loading spinner by hiding button text and displaying the spinner element
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.spinner');
            if (btnText && spinner) {
                btnText.style.display = 'none';
                spinner.style.display = 'inline-block';
            }

            // Delay form submission to allow spinner effect to be visible
            setTimeout(() => {
                form.submit();
            }, 1000);
        });
    }

    /***********************
     *  Clock Functionality *
     ***********************/
    function updateClock() {
        const now = new Date();
        // Format hours as 12-hour clock
        const hours = (now.getHours() % 12) || 12;
        // Format time string as HH:MM:SS
        const timeString =
            ("0" + hours).slice(-2) + ":" +
            ("0" + now.getMinutes()).slice(-2) + ":" +
            ("0" + now.getSeconds()).slice(-2);
        // Update the clock element if it exists
        const mainClock = document.getElementById("clock");
        if (mainClock) {
            mainClock.textContent = timeString;
        }
    }
    // Initialize the clock and update every second
    updateClock();
    setInterval(updateClock, 1000);

    /***********************************
     *  Random Arabic Text Generation  *
     ***********************************/
    function generateRandomText() {
        const arabicPhrases = [
            'السلام عليكم',
            'سبحان الله',
            'بسم الله الرحمن الرحيم',
            'الحمد لله',
            'لا إله إلا الله'
        ];
        // Pick a random phrase from the array
        const randomPhrase = arabicPhrases[Math.floor(Math.random() * arabicPhrases.length)];
        if (inputField) {
            inputField.value = randomPhrase;
            // Trigger input event to validate the newly set text
            inputField.dispatchEvent(new Event('input'));
        }
    }
    // Expose the function globally if needed
    window.generateRandomText = generateRandomText;

    /********************************************
     *  Typewriter Effect for Placeholder Text  *
     ********************************************/
    document.addEventListener("DOMContentLoaded", () => {
        if (!inputField) return;

        const placeholderText = "اكتب النص...";
        let currentIndex = 0;
        // Clear any existing placeholder text
        inputField.placeholder = "";
        let typeAnimationTimeout = null;

        // Function to animate typing of the placeholder text
        function typeAnimation() {
            if (currentIndex < placeholderText.length) {
                inputField.placeholder += placeholderText.charAt(currentIndex);
                currentIndex++;
                typeAnimationTimeout = setTimeout(typeAnimation, 150);
            }
        }
        // Start the typewriter animation on page load
        typeAnimation();

        // Stop the animation and clear placeholder when user focuses on the input
        inputField.addEventListener("focus", () => {
            if (typeAnimationTimeout) {
                clearTimeout(typeAnimationTimeout);
                typeAnimationTimeout = null;
            }
            inputField.placeholder = "";
        });

        // Restart the typewriter animation if input is empty upon blur
        inputField.addEventListener("blur", () => {
            if (inputField.value.trim() === "") {
                currentIndex = 0;
                inputField.placeholder = "";
                typeAnimation();
            }
        });
    });


    /**************************************
     *  Download Image Functionality      *
     **************************************/
    function downloadImage() {
        // Retrieve the image element from the DOM
        const img = document.getElementById('generated-image');
        // If image exists and has a source, create a download link
        if (img && img.src) {
            const link = document.createElement('a');
            link.download = 'مخطوطة.png';
            link.href = img.src;
            // Trigger the download by simulating a click on the link
            link.click();
        }
    }
    // Expose the function globally if needed
    window.downloadImage = downloadImage;
})();
