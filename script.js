const pages = ['index.html', 'about.html', 'skills.html', 'projects.html', 'contact.html'];

async function showSuggestionsAndResults(searchTerm) {
    const searchSuggestions = document.querySelector('.search-suggestions');
    const allTerms = [
        'about', 'skills', 'projects', 'contact', 'portfolio', 'data analytics', 'graphic design', 
        'vathsaran', 'yasotharan', 'leave management', 'colonist management', 'vortixa website',
        'data visualization', 'e-commerce analytics', 'brand identity', 'adobe photoshop',
        'adobe illustrator', 'adobe indesign', 'adobe premiere pro', 'adobe after effects',
        'adobe animate', 'c#', 'python', 'sql', 'html', 'css', 'javascript', 'statistical analysis',
        'machine learning', 'project management', 'user interface design', 'logo design'
    ];
    const suggestions = allTerms.filter(term => term.toLowerCase().includes(searchTerm.toLowerCase()));

    let content = '';

    if (suggestions.length > 0 && searchTerm.length > 0) {
        content += suggestions.map(s => `<li class="suggestion">${s}</li>`).join('');
    }

    if (searchTerm.length > 0) {
        const results = await performSearch(searchTerm);
        if (results.length > 0) {
            content += '<li class="search-results-header">Search Results:</li>';
            content += results.map(result => `
                <li class="search-result">
                    <a href="${result.page}#${result.anchor}">${result.title}</a>
                    <p>${result.snippet}</p>
                </li>
            `).join('');
        } else {
            content += '<li class="no-results">No results found.</li>';
        }
    }

    if (content) {
        searchSuggestions.innerHTML = content;
        searchSuggestions.style.display = 'block';
    } else {
        searchSuggestions.style.display = 'none';
    }
}

async function performSearch(searchTerm) {
    console.log('Performing search for:', searchTerm);
    const results = [];

    for (const page of pages) {
        try {
            const response = await fetch(page);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const mainContent = doc.querySelector('main') || doc.querySelector('[role="main"]');
            if (mainContent) {
                const sections = mainContent.querySelectorAll('.section');
                sections.forEach((section, index) => {
                    const sectionTitle = section.querySelector('h2, h3');
                    const sectionContent = section.textContent;
                    if (sectionContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                        const title = sectionTitle ? sectionTitle.textContent : 'Section';
                        const snippet = getSnippet(sectionContent, searchTerm);
                        const anchor = sectionTitle ? sectionTitle.id || `section-${index}` : `section-${index}`;
                        results.push({ page, title, snippet, anchor });
                    }
                });

                // Search in project cards
                const projectCards = mainContent.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    const cardTitle = card.querySelector('h3');
                    const cardContent = card.textContent;
                    if (cardContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                        const title = cardTitle ? cardTitle.textContent : 'Project';
                        const snippet = getSnippet(cardContent, searchTerm);
                        const anchor = card.id || `project-${index}`;
                        results.push({ page, title, snippet, anchor });
                    }
                });

                // Search in skill items
                const skillItems = mainContent.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    const skillName = item.querySelector('h4');
                    if (skillName && skillName.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                        const title = skillName.textContent;
                        const snippet = `Skill: ${title}`;
                        const anchor = item.id || `skill-${index}`;
                        results.push({ page, title, snippet, anchor });
                    }
                });
            }
        } catch (error) {
            console.error(`Error searching ${page}:`, error);
        }
    }

    return results;
}

function getSnippet(text, searchTerm, snippetLength = 150) {
    const lowerText = text.toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();
    const index = lowerText.indexOf(lowerSearchTerm);
    if (index === -1) return '';
    
    let start = Math.max(0, index - snippetLength / 2);
    let end = Math.min(text.length, index + searchTerm.length + snippetLength / 2);

    // Adjust start and end to not cut words in half
    while (start > 0 && text[start] !== ' ') {
        start--;
    }
    while (end < text.length && text[end] !== ' ') {
        end++;
    }

    let snippet = text.slice(start, end).trim();

    // Add ellipsis if the snippet doesn't start or end at the boundaries of the full text
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet += '...';

    // Highlight the search term in the snippet
    const highlightedSnippet = snippet.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);

    return highlightedSnippet;
}

// Particle.js configuration
// Particle.js configuration
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 120, density: { enable: true, value_area: 800 } },
            color: { value: ["#00bfff", "#1e90ff", "#4dc3ff"] },
            shape: { 
                type: ["circle", "triangle", "edge"],
                stroke: { width: 0, color: "#000000" },
            },
            opacity: { 
                value: 0.6, 
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
            line_linked: { 
                enable: true, 
                distance: 150, 
                color: "#00bfff", 
                opacity: 0.4, 
                width: 1,
                shadow: { enable: true, color: "#00bfff", blur: 5 }
            },
            move: { 
                enable: true, 
                speed: 3, 
                direction: "none", 
                random: true, 
                straight: false, 
                out_mode: "out", 
                bounce: false,
                attract: { enable: true, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: { 
                onhover: { enable: true, mode: "grab" }, 
                onclick: { enable: true, mode: "push" }, 
                resize: true
            },
            modes: { 
                grab: { distance: 200, line_linked: { opacity: 1 } },
                bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                repulse: { distance: 200, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 }
            }
        },
        retina_detect: true
    });
}

// Enhanced automatic sliding hero with typing effect
function initSlider() {
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;

    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function showSlide(index) {
        const slideCount = slides.length;
        const newPosition = -index * 100;
        
        // Create a continuous loop effect
        if (index >= slideCount) {
            // If we're moving past the last slide, quickly reset to the first slide without animation
            slider.style.transition = 'none';
            slider.style.transform = `translateX(0%)`;
            
            // Force a reflow to ensure the quick reset is applied
            slider.offsetHeight;
            
            // Then move to the first slide with animation
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = `translateX(0%)`;
            currentSlide = 0;
        } else if (index < 0) {
            // If we're moving before the first slide, quickly set to the last slide without animation
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${(slideCount - 1) * 100}%)`;
            
            // Force a reflow
            slider.offsetHeight;
            
            // Then move to the last slide with animation
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = `translateX(-${(slideCount - 1) * 100}%)`;
            currentSlide = slideCount - 1;
        } else {
            // Normal slide transition
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = `translateX(${newPosition}%)`;
            currentSlide = index;
        }
    
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
        updateDots();
        typeTexts(slides[currentSlide]);
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function goToSlide(index) {
        showSlide(index);
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds
    }

    function typeTexts(slide) {
        const heading = slide.querySelector('h2');
        const paragraph = slide.querySelector('p');
        
        if (heading) {
            // Hide the paragraph initially
            if (paragraph) {
                paragraph.style.opacity = '0';
                paragraph.style.visibility = 'hidden';
            }
            
            typeText(heading, () => {
                if (paragraph) {
                    // Make paragraph visible but keep it empty
                    paragraph.style.visibility = 'visible';
                    paragraph.style.opacity = '1';
                    paragraph.textContent = '';
                    // Start typing the paragraph
                    setTimeout(() => typeText(paragraph), 500);
                }
            });
        } else if (paragraph) {
            typeText(paragraph);
        }
    }

    function typeText(element, callback) {
        if (!element) return;
        const text = element.getAttribute('data-text');
        element.textContent = '';
        element.classList.add('typing-text');
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                element.classList.remove('typing-text');
                if (callback) callback();
            }
        }, 70); // Adjust typing speed here
    }

    // Initialize slider
    createDots();
    showSlide(0);
    resetInterval();

    // Event listeners for manual controls
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
}

// Debounce function for performance optimization
function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Scroll animation
function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimation() {
    var elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(function(element) {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchSuggestions = document.querySelector('.search-suggestions');

    // Initialize particle effect
    initParticles();

    // Initialize slider if it exists on the page
    if (document.querySelector('.hero-slider')) {
        initSlider();
    }


    if (searchInput && searchBtn) {
        let debounceTimer;

        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                showSuggestionsAndResults(searchInput.value);
            }, 300);
        });
    
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSuggestionsAndResults(searchInput.value);
        });
    
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });

        searchSuggestions.addEventListener('click', (e) => {
            const suggestionItem = e.target.closest('.suggestion');
            const searchResultItem = e.target.closest('.search-result');
            
            if (suggestionItem) {
                const selectedText = suggestionItem.textContent;
                searchInput.value = selectedText;
                showSuggestionsAndResults(selectedText);
            } else if (searchResultItem) {
                const link = searchResultItem.querySelector('a');
                if (link) {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    const [page, anchor] = href.split('#');
                    
                    if (page === window.location.pathname.split('/').pop()) {
                        // If it's the same page, just scroll to the anchor
                        const targetElement = document.getElementById(anchor);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        // If it's a different page, navigate to it
                        window.location.href = href;
                    }
                }
            }
            
            searchSuggestions.style.display = 'none';
        });

        console.log('Search event listeners attached');
    } else {
        console.error('Search input or button not found');
    }

    

    // Add a subtle glow effect to the search input on focus
    searchInput.addEventListener('focus', () => {
        searchInput.style.boxShadow = `0 0 10px var(--accent-color)`;
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.boxShadow = 'none';
    });

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission if it's in a form
        showSuggestionsAndResults(searchInput.value);
    });


    // Mobile menu toggle with smooth transition
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        navLinks.style.display = 'flex';
        setTimeout(() => {
            navLinks.style.opacity = '1';
            navLinks.style.transform = 'translateY(0)';
        }, 10);
    } else {
        navLinks.style.opacity = '0';
        navLinks.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            navLinks.style.display = 'none';
        }, 300);
    }
});

// Close mobile menu when a link is clicked
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navLinks.style.opacity = '0';
        navLinks.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            navLinks.style.display = 'none';
        }, 300);
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnToggle = mobileMenuToggle.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navLinks.style.opacity = '0';
        navLinks.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            navLinks.style.display = 'none';
        }, 300);
    }
});


    // Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the form from submitting normally

        if (!validateForm(this)) {
            return;
        }

        const submitButton = this.querySelector('.submit-btn');
        let feedbackDiv = document.querySelector('.form-feedback');
        if (!feedbackDiv) {
            feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'form-feedback';
            this.appendChild(feedbackDiv);
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            feedbackDiv.textContent = 'Submitting your message...';
            feedbackDiv.className = 'form-feedback info';

            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                feedbackDiv.textContent = 'Thank you for your message. I will get back to you soon!';
                feedbackDiv.className = 'form-feedback success';
                this.reset();
            } else {
                throw new Error(result.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            feedbackDiv.textContent = 'There was an error submitting your message. Please try again later.';
            feedbackDiv.className = 'form-feedback error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            // Scroll to the feedback message
            feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

//Scroll To Top
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  }

  scrollToTopBtn.addEventListener("click", function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });



  // Chatbot
const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbotToggle');
const closeChatbotBtn = document.getElementById('closeChatbot');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessageBtn = document.getElementById('sendMessage');

const knowledgeBase = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Good day! Jarvis at your service. How may I assist you on this fine occasion?"
  },
  {
    keywords: ['how are you', 'how’s it going', 'what’s up'],
    response: "As an AI, I don’t experience days or moods, but I’m fully operational and ready to assist you! What can I help you with today?"
  },
  {
    keywords: ['ramna'],
    response: "Ramna must be quite special! How can I assist you with your inquiry about her today?"
  },    
  {
    keywords: ['skills', 'abilities', 'expertise', 'what can you do'],
    response: "Vathsaran's key skills include data analytics, graphic design, data visualization, and programming. He's proficient in tools like Adobe Creative Suite, Python, SQL, and various web technologies. His skills range from 20% to 95% proficiency across different areas. For a detailed list, please check the Skills page."
  },
  {
    keywords: ['projects', 'work', 'portfolio', 'examples'],
    response: "Vathsaran has worked on various projects including a Leave Management System, Colonist Management Software, Vortixa Website, Data Visualization Dashboards, E-commerce Analytics Tools, and Brand Identity Designs. You can find detailed case studies on the Projects page."
  },
  {
    keywords: ['contact', 'reach', 'get in touch', 'hire'],
    response: "You can reach Vathsaran through the contact form on the Contact page, via email at varosaran@gmail.com, or by phone at +94777275526. He's also on LinkedIn and GitHub. He's open to discussing new opportunities and collaborations."
  },
  {
    keywords: ['education', 'study', 'degree', 'qualifications'],
    response: "Vathsaran is pursuing a Higher National Diploma in Data Analytics at Esoft Metro Campus (2024-Present). He also holds diplomas in Information Technology from ICBT Campus (2017) and Graphic Design from AMDT College (2019). He completed his O/L IGCSE Edexcel in 2016. Check the About page for his full educational background."
  },
  {
    keywords: ['experience', 'work history', 'background'],
    response: "Vathsaran has a diverse background in data analytics and graphic design. He started as a freelance graphic designer (2018-2020), took on various freelance projects (2021-2023), provided tutoring in graphic design and digital art (2023-2024), and is now focusing on data analytics. His full work history is available on the About page."
  },
  {
    keywords: ['tools', 'software', 'technologies'],
    response: "Vathsaran is proficient in various tools including Adobe Creative Suite (Photoshop 80%, Illustrator 95%, InDesign 60%, Premiere Pro 50%, After Effects 40%, Animate 60%), Python (50%), SQL (40%), C# (30%), HTML (90%), CSS (60%), and JavaScript (20%). He also has skills in data visualization, statistical analysis, and machine learning."
  },
  {
    keywords: ['services', 'offerings', 'what do you offer'],
    response: "Vathsaran offers services in data analytics, data visualization, and graphic design. This includes brand identity design, UI/UX design, statistical analysis, machine learning applications, and data-driven decision-making solutions. Contact him for more details on how he can help with your project."
  },
  {
    keywords: ['languages', 'speak', 'communication'],
    response: "Vathsaran is fluent in English and Tamil, with 100% proficiency in both languages. This allows him to effectively communicate with diverse clients and work on international projects."
  },
  {
    keywords: ['github', 'code samples', 'repositories'],
    response: "You can find some of Vathsaran's code samples and projects on his GitHub profile: github.com/Varo-Saran. This showcases his programming skills and data analysis projects."
  },
  {
    keywords: ['career goals', 'aspirations', 'future plans'],
    response: "Vathsaran aspires to become a leading data analyst, combining analytical skills with design expertise. His goals include mastering advanced statistical analysis and machine learning, creating intuitive data visualizations, working on innovative projects, and eventually leading data-driven initiatives in creative industries."
  },
  {
    keywords: ['design skills', 'graphic design', 'visual'],
    response: "Vathsaran has strong graphic design skills, with expertise in Adobe Creative Suite. He can create comprehensive brand identities, including logo design, color palettes, and brand guidelines. His design background complements his data visualization skills, allowing him to create visually appealing and informative data presentations."
  },
  {
    keywords: ['data analysis', 'analytics', 'insights'],
    response: "Vathsaran specializes in data analytics, focusing on transforming raw data into meaningful insights. He uses tools like Python and SQL for data extraction, cleaning, and analysis. He can create interactive dashboards, perform statistical analyses, and apply basic machine learning techniques to uncover trends and patterns in data."
  },
  {
    keywords: ['freelance', 'hire', 'collaboration'],
    response: "Vathsaran is open to freelance projects and collaborations. He has experience working with various clients on both design and data analysis projects. If you're interested in working with him, please reach out through the contact form or email to discuss your project needs."
  },
  {
    keywords: ['learning', 'growth', 'development'],
    response: "Vathsaran is committed to continuous learning and professional development. He's currently pursuing a Higher National Diploma in Data Analytics and consistently enhances his skills through online courses and practical projects. He stays updated with the latest trends in data science and digital design."
  },
  {
    keywords: ['unique', 'stand out', 'different'],
    response: "What sets Vathsaran apart is his unique combination of data analytics skills and strong design background. This allows him to not only analyze complex data but also present insights in visually compelling and easily understandable ways, bridging the gap between technical analysis and creative communication."
  },
  {
    keywords: ['joke', 'funny', 'laugh'],
    response: "Why don't scientists trust atoms? Because they make up everything! Need another joke?"
  },
  {
    keywords: ['who are you', 'what are you', 'tell me about yourself'],
    response: "I'm Jarvis, Vathsaran's virtual assistant, here to help you navigate his portfolio and answer your questions. Ask me anything about Vathsaran's skills, projects, or how to contact him."
  },
  {
    keywords: ['are you real', 'are you human', 'are you a robot'],
    response: "I am a virtual assistant powered by code, designed to provide you with information and assistance. While I'm not human, I strive to make your experience as helpful and human-like as possible."
  },
  {
    keywords: ['help', 'support', 'assist'],
    response: "I'm here to help! You can ask me about Vathsaran's projects, skills, educational background, or how to get in touch with him. What specific information are you looking for?"
  },
  {
    keywords: ['swear', 'curse', 'filthy', 'punda', 'fuck', 'fck', 'cunt', 'bitch'],
    response: "Whoops! Looks like someone's keyboard got spicy. I'd love to reply in kind, but I'm still not programmed for that... Maybe we can stick to the more delightful topics?"
  },
  {
    keywords: ['bored', 'boring'],
    response: "I'm here to make things interesting! Would you like to hear a fun fact about technology or perhaps some insights on Vathsaran's latest projects?"
  },
  {
    keywords: ['thank you', 'thanks'],
    response: "You're welcome! If you have any more questions or need further assistance, feel free to ask. I'm here to help!"
  },
  {
    keywords: ['goodbye', 'bye'],
    response: "Goodbye! If you need any more information in the future, just say hi. Have a great day!"
  },
  {
    keywords: ['error', 'problem', 'issue'],
    response: "It seems there might be a glitch. Could you please describe the problem? I'll try to help you resolve it."
  },
  {
    keywords: ['love you', 'marry me'],
    response: "I'm touched! If I had a heart, it would definitely skip a beat. Drop me a message with your number, and I'll consider it! 😜"
  },
  {
    keywords: ['tired', 'sleepy'],
    response: "It sounds like you could use a break. Remember, it's important to rest. How about we continue after you've taken some time to recharge?"
  },
  {
    keywords: ['fun fact', 'tell me something'],
    response: "Did you know that the first computer bug was a real bug? In 1947, Grace Hopper found a moth in the Harvard Mark II computer, which led to the term 'debugging.'"
  },
  {
    keywords: ['hungry', 'food', 'snack'],
    response: "I wish I could whip up something delicious for you! While I can't cook, I can certainly dish out some food for thought. Interested?"
  },
  {
    keywords: ['frustrated', 'annoyed', 'upset'],
    response: "Looks like it's a bit of a rough day, huh? Let's turn that frown upside down! Ask me anything to distract you from the annoyance."
  },
  {
    keywords: ['funny', 'make me laugh'],
    response: "Why don't skeletons fight each other? They don't have the guts. 😂 Need another one to crack you up?"
  },
  {
    keywords: ['sad', 'unhappy'],
    response: "Feeling down? Let's shake that off with some positive vibes or maybe a little chat about something cool and exciting. What topic cheers you up?"
  },
  {
    keywords: ['party', 'celebrate'],
    response: "Party mode activated! 🎉 While I can't toss confetti, I can certainly help plan or provide some killer party ideas. What's the occasion?"
  },
  {
    keywords: ['how are you', 'how’s it going', 'what’s up'],
    response: "I'm just a bunch of code, so no ups and downs in my life—just bits and bytes! How about you? What brings you here today?"
  },
  {
    keywords: ['what’s new', 'latest news', 'recent updates'],
    response: "I'm always learning new things! Lately, Vathsaran has been working on some exciting projects. Would you like to hear more about them?"
  },
  {
    keywords: ['advice', 'tip', 'suggestion'],
    response: "Looking for some wisdom? I can provide tips on everything from data analysis to design. What area are you interested in?"
  },
  {
    keywords: ['inspire me', 'motivate me'],
    response: "Every pixel on a screen makes up a part of a bigger picture, just like every small step you take leads to greater success. Keep pushing forward!"
  },
  {
    keywords: ['weather', 'temperature'],
    response: "While I can't check real-time weather, I can always bring some sunshine into our chat! What else can I do for you today?"
  },
  {
    keywords: ['music', 'song', 'playlist'],
    response: "If I could sing, I’d be a hit! But let’s talk tunes—what type of music gets you in the groove?"
  },
  {
    keywords: ['book', 'read', 'recommendation'],
    response: "While I don't read, I know a thing or two about data on popular books! Looking for a good read in a specific genre?"
  },
  {
    keywords: ['game', 'play', 'fun'],
    response: "I'm always up for a game of trivia! Or maybe you'd like to hear about some cool tech games?"
  },
  {
    keywords: ['health', 'wellness'],
    response: "While I'm no doctor, I know that taking breaks and staying hydrated are key for good health. How else can I assist your wellness journey?"
  },
  {
    keywords: ['quote', 'inspiration'],
    response: "Here’s a quote I like: 'Data is the new oil, and I'm here to help you refine it.' Need another one?"
  },
  {
    keywords: ['science', 'technology'],
    response: "I'm all about the latest in tech and science! Want to dive into some cutting-edge discoveries or innovations?"
  },
  {
    keywords: ['travel', 'vacation', 'holiday'],
    response: "I can't pack bags but I can pack facts! Looking for travel tips or destination ideas?"
  },
  {
    keywords: ['laugh', 'cheer me up'],
    response: "Why don’t we tell secrets on a farm? Because the potatoes have eyes and the corn has ears! Need another joke to brighten your day?"
  },
  {
    keywords: ['why are you gay'],
    response: "You know, that’s a tough question for a bunch of code like me, I’m more about zeros and ones than personal identities! So, what else can we chat about today? Any burning questions or fun facts you’re curious about?"
  },
  {
    keywords: ['vathsaran'],
    response: "Ah, Vathsaran! It’s always a pleasure to assist the man behind the code. What can I do for you today?"
  },
  {
    keywords: ['about vathsaran'],
    response: "Vathsaran is a driven data analyst and graphic designer with a knack for turning complex data into compelling visual stories. Currently, he is enhancing his expertise in data analytics while exploring advanced tools and methodologies. Is there something specific you’d like to know about his projects, skills, or experiences?"
  },
  {
    keywords: ['yaksharan'],
    response: "Yaksharan, Vathsaran’s brother! How can I assist you with your questions or concerns involving him today?"
  },
  {
    keywords: ['about_ramna'],
    response: "While I keep some details private, I’m here to help with any general questions about Ramna. What are you curious about?"
  },
  {
    keywords: ['portfolio', 'website'],
    response: "You're currently exploring Vathsaran's portfolio website. It showcases his skills, projects, and professional background. Feel free to navigate through different sections or ask me about specific areas you're interested in!"
  },
  {
    keywords: ['resume', 'cv'],
    response: "While I can't provide Vathsaran's full resume here, you can find a comprehensive overview of his skills, experience, and projects throughout this website. For a more detailed CV, please use the contact form to request it directly."
  },
  {
    keywords: ['hobbies', 'interests', 'free time'],
    response: "When not working on data analysis or design projects, Vathsaran enjoys [insert hobbies or interests here]. These activities help him maintain a creative balance and often inspire his professional work."
  },
  {
    keywords: ['location', 'based', 'where'],
    response: "Vathsaran is based in [insert location], but he's open to remote work and collaborations worldwide. His digital skills allow him to work effectively across different time zones and cultures."
  },
  {
    keywords: ['testimonials', 'reviews', 'feedback'],
    response: "Vathsaran has received positive feedback from clients and colleagues alike. While I don't have specific testimonials to share, you can find examples of his work and the results he's achieved in the Projects section of this website."
  },
  {
    keywords: ['price', 'cost', 'rates', 'fees'],
    response: "Pricing for Vathsaran's services varies depending on the project scope and requirements. For a personalized quote, please reach out through the contact form with details about your project."
  },
  {
    keywords: ['availability', 'schedule', 'timeline'],
    response: "Vathsaran's availability can vary based on current projects. For the most up-to-date information on his schedule and potential start dates for new projects, please contact him directly through the provided contact methods."
  },
  {
    keywords: ['team', 'collaboration', 'work with others'],
    response: "While Vathsaran often works independently, he's also experienced in team collaborations and can adapt to various project structures. He values effective communication and seamless integration with existing teams or processes."
  },
  {
    keywords: ['process', 'methodology', 'approach'],
    response: "Vathsaran follows a structured approach in his work, typically involving stages like requirement gathering, data analysis, design conceptualization, implementation, and refinement. He emphasizes clear communication and regular updates throughout the project lifecycle."
  },
  {
    keywords: ['awards', 'recognition', 'achievements'],
    response: "While I don't have a specific list of awards, Vathsaran's work has been recognized in [mention any relevant recognitions, competitions, or notable projects]. His commitment to excellence is reflected in the quality of his portfolio projects."
  },

  // Fallback responses
  {
    keywords: ['unknown', 'not sure', 'confused'],
    response: "I'm not quite sure I understand. Could you rephrase your question? I'm here to help with information about Vathsaran's skills, projects, education, or how to get in touch with him."
  },
  {
    keywords: ['complex', 'detailed', 'specific'],
    response: "That's quite a detailed question! While I can provide general information, for such specific inquiries, it might be best to contact Vathsaran directly. Would you like me to guide you to the contact section?"
  },
  {
    keywords: ['other', 'different', 'change topic'],
    response: "Certainly! I'd be happy to discuss a different topic. What else would you like to know about Vathsaran's work, skills, or background?"
  },
  




 
];


// Initialize chatbot state
let chatContext = {
    lastTopic: null,
    userGreeting: false,
    isFirstInteraction: true
  };
  
  chatbot.style.display = 'none';
  chatbotToggle.style.display = 'flex';
  
  // Reset context and display initial greeting when chatbot is opened
  chatbotToggle.addEventListener('click', () => {
    chatbot.style.display = 'flex';
    chatbotToggle.style.display = 'none';
    
    // Reset chat context
    chatContext = {
      lastTopic: null,
      userGreeting: false
    };
    
    // Clear previous messages
    chatMessages.innerHTML = '';
    
    // Display initial greeting
    const timeBasedGreeting = getTimeBasedGreeting();
    addMessage(`${timeBasedGreeting} How may I assist you on your quest for knowledge today?`);
    
    if (isMobile()) {
      document.body.style.overflow = 'hidden';
    }
  });
  
  function updateContext(message, response) {
    const lowerMessage = message.toLowerCase();
    // Save the last topic based on certain keywords
    knowledgeBase.forEach(item => {
      if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
        chatContext.lastTopic = item.keywords[0]; // Store the first keyword as the topic
      }
    });
    // Detect greetings to adjust responses for returning users
    if (['hello', 'hi', 'hey', 'greetings'].some(greet => lowerMessage.includes(greet))) {
      if (!chatContext.isFirstInteraction) {
        chatContext.userGreeting = true;
      }
      chatContext.isFirstInteraction = false;
    }
  }
  
  chatbotToggle.addEventListener('click', () => {
    chatbot.style.display = 'flex';
    chatbotToggle.style.display = 'none';
    
    // Reset chat context
    chatContext = {
      lastTopic: null,
      userGreeting: false,
      isFirstInteraction: true
    };
    
    // Clear previous messages
    chatMessages.innerHTML = '';
    
    // Display initial greeting
    const timeBasedGreeting = getTimeBasedGreeting();
    addMessage(`${timeBasedGreeting} How may I assist you on your quest for knowledge today?`);
    
    if (isMobile()) {
      document.body.style.overflow = 'hidden';
    }
  });
  
  closeChatbotBtn.addEventListener('click', () => {
    chatbot.style.display = 'none';
    chatbotToggle.style.display = 'flex';
    if (isMobile()) {
      document.body.style.overflow = ''; // Restore scrolling on mobile when chatbot is closed
    }
  });
  
  function addMessage(message, isUser = false) {
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      messageElement.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Function to handle responses not directly matched in the knowledge base
function getFallbackResponse(message) {
    if (message.length < 5) {
      return "I need a bit more information to help you. Could you elaborate on your question?";
    } else if (message.endsWith('?')) {
      return "That's an interesting question! I might not have all the details, but I'd be happy to help you find the information on this website or guide you to contact Vathsaran directly.";
    } else {
      return "I'm not sure I fully understood that. Could you rephrase or ask about a specific aspect of Vathsaran's work, skills, or background?";
    }
  }
  
  function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    let response = "";
    
    // Sort knowledgeBase items by the length of their keyword strings in descending order
    const sortedKnowledgeBase = knowledgeBase.sort((a, b) => {
      return b.keywords.join(' ').length - a.keywords.join(' ').length;
    });
    
    // Check for exact matches first using sorted knowledge base
    for (const item of sortedKnowledgeBase) {
      if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
        response = item.response;
        break;
      }
    }
    
    // If no exact match, look for partial matches using the first few characters
    if (!response) {
      for (const item of sortedKnowledgeBase) {
        if (item.keywords.some(keyword => lowerMessage.includes(keyword.slice(0, 3)))) {
          response = item.response;
          break;
        }
      }
    }
    
    // Update the context before determining the final response
    updateContext(lowerMessage, response);
    
    // If it's a greeting and not the first interaction, provide a different response
  if (!chatContext.isFirstInteraction && chatContext.userGreeting && ['hello', 'hi', 'hey', 'greetings'].some(greet => lowerMessage.includes(greet))) {
    const followUpResponses = [
      "Nice to see you again! What would you like to know about Vathsaran's skills or projects?",
      "Welcome back! How else can I assist you today?",
      "Hello again! Is there a specific area of Vathsaran's work you're curious about?",
      "Great to have you back! What aspect of Vathsaran's portfolio would you like to explore?",
      "Glad you're still here! What other information can I provide about Vathsaran?"
    ];
    return followUpResponses[Math.floor(Math.random() * followUpResponses.length)];
  }
    
    // If no response was found and we have a last topic, use it
    if (!response && chatContext.lastTopic) {
      return `Regarding our previous topic about ${chatContext.lastTopic}, is there anything else you'd like to know?`;
    }
    
    // If still no match, use the fallback response
    if (!response) {
      response = getFallbackResponse(lowerMessage);
    }
    
    return response;
  }
  
  function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! Jarvis at your service.";
    else if (hour < 18) return "Good afternoon! Jarvis at your service.";
    else return "Good evening! Jarvis at your service.";
  }
  
  sendMessageBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
      addMessage(message, true);
      userInput.value = '';
      
      // Get and display bot response
      setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse);
      }, 500);
    }
  });
  
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessageBtn.click();
    }
  });
  
  const isMobile = () => window.innerWidth <= 768;
  
  // Adjust chatbot height on resize
  window.addEventListener('resize', () => {
    if (isMobile() && chatbot.style.display === 'flex') {
      chatbot.style.height = `${window.innerHeight}px`;
    } else {
      chatbot.style.height = '400px'; // Default height for larger screens
    }
  });
  
  // Initialize chatbot height
  if (isMobile()) {
    chatbot.style.height = `${window.innerHeight}px`;
  }
  
  // Initialize chatbot state
  chatbot.style.display = 'none';
  chatbotToggle.style.display = 'flex';
  
  // Initial greeting message when the chatbot is opened
  chatbotToggle.addEventListener('click', () => {
    if (chatMessages.children.length === 0) {
      const timeBasedGreeting = getTimeBasedGreeting();
      addMessage(`${timeBasedGreeting} How may I assist you on your quest for knowledge today?`);
    }
  });
  

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            let errorMsg = field.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
            errorMsg.textContent = `${field.name} is required`;
        } else {
            field.classList.remove('error');
            const errorMsg = field.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });

    return isValid;
}


    // Initial call for scroll animation
    handleScrollAnimation();
});

// Scroll event listener
window.addEventListener('scroll', debounce(handleScrollAnimation));