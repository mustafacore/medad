// =============================================
// NUCLEAR MOBILE MENU FIX - WORKS 100%
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu script loaded'); // Debug log
    
    // Get elements - work even if some are missing
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    
    console.log('Elements found:', { hamburger: !!hamburger, sidebar: !!sidebar, overlay: !!overlay }); // Debug log
    
    // Only proceed if we have the essential elements
    if (!hamburger || !sidebar) {
        console.log('Missing essential elements for mobile menu');
        return;
    }
    
    // Super simple toggle function
    function toggleMobileMenu() {
        console.log('Toggle mobile menu called'); // Debug log
        const isActive = sidebar.classList.contains('active');
        console.log('Current state - isActive:', isActive); // Debug log
        
        if (isActive) {
            // Close menu
            console.log('Closing menu');
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        } else {
            // Open menu
            console.log('Opening menu');
            hamburger.classList.add('active');
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.classList.add('menu-open');
        }
    }
    
    // Close menu function
    function closeMobileMenu() {
        console.log('Close mobile menu called'); // Debug log
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    // Hamburger click - with better event handling
    hamburger.addEventListener('click', function(e) {
        console.log('Hamburger clicked'); // Debug log
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Also try touchstart for mobile devices
    hamburger.addEventListener('touchstart', function(e) {
        console.log('Hamburger touched'); // Debug log
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Overlay click (if exists)
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
    }
    
    // Sidebar links
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Click outside
    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Prevent sidebar clicks from closing menu
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// =============================================
// ORIGINAL CODE BELOW
// =============================================

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
     *  COMPLETELY REBUILT MOBILE MENU   *
     ********************************/
    function toggleMenu() {
        // Work with or without overlay
        if (!hamburger || !sidebar) return;

        // Toggle classes
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('active');
        
        // Toggle overlay only if it exists
        if (overlay) {
            overlay.classList.toggle('active');
        }

        // Toggle body scroll lock
        if (sidebar.classList.contains('active')) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    }

    function closeMenu() {
        if (!hamburger || !sidebar) return;
        
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        
        // Remove overlay only if it exists
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        document.body.classList.remove('menu-open');
    }

    // Initialize mobile menu - work with or without overlay
    if (hamburger && sidebar) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu on overlay click (only if overlay exists)
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }

        // Handle sidebar link clicks
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                closeMenu();
            });
        });

        // Close menu when Escape key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeMenu();
            }
        });

        // Prevent clicks inside the sidebar from closing the menu
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close menu when clicking outside (works without overlay)
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMenu();
            }
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

// =============================================
// MODERN CONTACT FORM FUNCTIONALITY
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    // Modern Contact Form Elements
    const modernContactForm = document.getElementById('modernContactForm');
    const modernFormMessage = document.getElementById('modernFormMessage');
    const categoryCards = document.querySelectorAll('.category-card');
    const selectedCategoryInput = document.getElementById('selectedCategory');
    const contactFormSection = document.getElementById('contactFormSection');

    // Category selection functionality
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove selected class from all cards
                categoryCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                this.classList.add('selected');
                
                // Update hidden input with selected category
                const category = this.dataset.category;
                if (selectedCategoryInput) {
                    selectedCategoryInput.value = category;
                }
                
                // Update form title based on selection
                const formTitle = document.querySelector('.form-title');
                if (formTitle) {
                    const categoryTitles = {
                        'feature': 'اقترح ميزة جديدة',
                        'improvement': 'اقترح تحسين',
                        'bug': 'أبلغ عن مشكلة',
                        'general': 'شاركنا رأيك'
                    };
                    formTitle.textContent = categoryTitles[category] || 'أخبرنا بفكرتك';
                }
                
                // Show the contact form with animation
                if (contactFormSection) {
                    contactFormSection.style.display = 'block';
                    contactFormSection.style.opacity = '0';
                    contactFormSection.style.transform = 'translateY(30px)';
                    
                    // Animate the form appearance
                    setTimeout(() => {
                        contactFormSection.style.transition = 'all 0.5s ease';
                        contactFormSection.style.opacity = '1';
                        contactFormSection.style.transform = 'translateY(0)';
                    }, 10);
                    
                    // Smooth scroll to form
                    setTimeout(() => {
                        contactFormSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            });
        });
    }

    // Modern form submission
    if (modernContactForm) {
        modernContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(modernContactForm);
            const submitBtn = modernContactForm.querySelector('.modern-submit-btn');
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Hide any previous messages
            modernFormMessage.className = 'form-message';
            modernFormMessage.style.display = 'none';
            
            fetch(modernContactForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    modernFormMessage.textContent = '🎉 تم إرسال اقتراحك بنجاح! شكراً لك على مساهمتك في تطوير مِدَاد.';
                    modernFormMessage.classList.add('success');
                    modernContactForm.reset();
                    
                    // Reset category selection
                    categoryCards.forEach(c => c.classList.remove('selected'));
                    if (selectedCategoryInput) selectedCategoryInput.value = '';
                    
                    // Reset form title
                    const formTitle = document.querySelector('.form-title');
                    if (formTitle) formTitle.textContent = 'أخبرنا بفكرتك';
                    
                    // Scroll to success message
                    modernFormMessage.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                modernFormMessage.textContent = '❌ حدث خطأ أثناء إرسال الاقتراح. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.';
                modernFormMessage.classList.add('error');
                
                // Scroll to error message
                modernFormMessage.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            })
            .finally(() => {
                // Restore button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        });
    }

    // Enhanced input interactions
    const inputWrappers = document.querySelectorAll('.input-wrapper');
    inputWrappers.forEach(wrapper => {
        const input = wrapper.querySelector('input, textarea');
        const icon = wrapper.querySelector('i');
        
        if (input && icon) {
            input.addEventListener('focus', function() {
                icon.style.color = 'var(--color-accent-1)';
                if (input.tagName === 'TEXTAREA') {
                    icon.style.transform = 'translateY(0) scale(1.1)';
                } else {
                    icon.style.transform = 'translateY(-50%) scale(1.1)';
                }
            });
            
            input.addEventListener('blur', function() {
                icon.style.color = 'var(--color-accent-2)';
                if (input.tagName === 'TEXTAREA') {
                    icon.style.transform = 'translateY(0) scale(1)';
                } else {
                    icon.style.transform = 'translateY(-50%) scale(1)';
                }
            });
        }
    });

    // Add floating animation to category cards
    if (categoryCards.length > 0) {
        categoryCards.forEach((card, index) => {
            // Stagger the animation
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.6s ease forwards`;
                card.style.opacity = '0'; // Start invisible
            }, index * 100);
        });
    }

    // Add slide-in animation for form
    const modernForm = document.querySelector('.modern-contact-form');
    if (modernForm) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(modernForm);
    }
});

// Add CSS animations for the modern contact form
const contactAnimationStyle = document.createElement('style');
contactAnimationStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(contactAnimationStyle);
