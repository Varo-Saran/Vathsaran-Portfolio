// Global variables and functions for site-wide functionality

const pages = ['index.html', 'about.html', 'skills.html', 'projects.html', 'contact.html'];

// Search Suggestions & Results
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

// Theme toggle functionality
function initThemeToggle() {
  // Create theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.id = 'themeToggle';
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle Dark/Light Mode');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Default icon (dark mode)
  document.body.appendChild(themeToggle);
  
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme based on saved preference or system preference
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
  
  // Toggle theme function
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply transition class for smooth color changes
    document.documentElement.classList.add('theme-transition');
    
    // Set new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button icon
    themeToggle.innerHTML = newTheme === 'dark' 
      ? '<i class="fas fa-moon"></i>' 
      : '<i class="fas fa-sun"></i>';
    
    // Add animation class
    themeToggle.classList.add('rotate-animation');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      themeToggle.classList.remove('rotate-animation');
    }, 500);
    
    // Remove transition class after transitions complete
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  }
  
  // Add click event to toggle button
  themeToggle.addEventListener('click', toggleTheme);
}

// Theme toggle functionality
function initThemeToggle() {
  // Create theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.id = 'themeToggle';
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle Dark/Light Mode');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Default icon (dark mode)
  document.body.appendChild(themeToggle);
  
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme based on saved preference or system preference
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
  
  // Toggle theme function
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply transition class for smooth color changes
    document.documentElement.classList.add('theme-transition');
    
    // Set new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button icon
    themeToggle.innerHTML = newTheme === 'dark' 
      ? '<i class="fas fa-moon"></i>' 
      : '<i class="fas fa-sun"></i>';
    
    // Add animation class
    themeToggle.classList.add('rotate-animation');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      themeToggle.classList.remove('rotate-animation');
    }, 500);
    
    // Remove transition class after transitions complete
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  }
  
  // Add click event to toggle button
  themeToggle.addEventListener('click', toggleTheme);
}

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
            slider.style.transition = 'none';
            slider.style.transform = `translateX(0%)`;
            slider.offsetHeight;
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = `translateX(0%)`;
            currentSlide = 0;
        } else if (index < 0) {
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${(slideCount - 1) * 100}%)`;
            slider.offsetHeight;
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = `translateX(-${(slideCount - 1) * 100}%)`;
            currentSlide = slideCount - 1;
        } else {
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
        slideInterval = setInterval(nextSlide, 7000);
    }

    function typeTexts(slide) {
        const heading = slide.querySelector('h2');
        const paragraph = slide.querySelector('p');
        
        if (heading) {
            if (paragraph) {
                paragraph.style.opacity = '0';
                paragraph.style.visibility = 'hidden';
            }
            
            typeText(heading, () => {
                if (paragraph) {
                    paragraph.style.visibility = 'visible';
                    paragraph.style.opacity = '1';
                    paragraph.textContent = '';
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
        }, 70);
    }

    createDots();
    showSlide(0);
    resetInterval();

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
}

// Filter projects functionality
function initProjectFilter() {
  if (!document.querySelector('.project-grid')) return;
  
  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-container fade-in-up';
  
  const filterTitle = document.createElement('h3');
  filterTitle.textContent = 'Filter Projects by Skills';
  filterTitle.className = 'filter-title';
  filterContainer.appendChild(filterTitle);
  
  const skillsSet = new Set();
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    const techTags = card.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
      skillsSet.add(tag.textContent.trim());
    });
  });
  
  const skillsContainer = document.createElement('div');
  skillsContainer.className = 'skills-filter-buttons';
  
  const allButton = document.createElement('button');
  allButton.textContent = 'All';
  allButton.className = 'filter-btn active';
  allButton.setAttribute('data-skill', 'all');
  skillsContainer.appendChild(allButton);
  
  skillsSet.forEach(skill => {
    const skillButton = document.createElement('button');
    skillButton.textContent = skill;
    skillButton.className = 'filter-btn';
    skillButton.setAttribute('data-skill', skill);
    skillsContainer.appendChild(skillButton);
  });
  
  filterContainer.appendChild(skillsContainer);
  
  const projectSection = document.querySelector('.project-grid').parentElement;
  projectSection.insertBefore(filterContainer, document.querySelector('.project-grid'));
  
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const skill = button.getAttribute('data-skill');
      
      projectCards.forEach(card => {
        if (skill === 'all') {
          card.style.display = 'flex';
          card.classList.add('fade-in-up');
          return;
        }
        
        const techTags = Array.from(card.querySelectorAll('.tech-tag'))
          .map(tag => tag.textContent.trim());
        
        if (techTags.includes(skill)) {
          card.style.display = 'flex';
          card.classList.add('fade-in-up');
        } else {
          card.style.display = 'none';
        }
      });
    });
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

    initThemeToggle();

    initParticles();

    if (document.querySelector('.hero-slider')) {
        initSlider();
    }

    initProjectFilter();

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
                        const targetElement = document.getElementById(anchor);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
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

    searchInput.addEventListener('focus', () => {
        searchInput.style.boxShadow = `0 0 10px var(--accent-color)`;
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.boxShadow = 'none';
    });

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSuggestionsAndResults(searchInput.value);
    });

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

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

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
                feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

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

    handleScrollAnimation();
});

window.addEventListener('scroll', debounce(handleScrollAnimation));

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

// --------------------------
// Enhanced Chatbot Implementation
// --------------------------

// Enhanced chatbot implementation for Vathsaran's portfolio
// Replace the existing knowledgeBase array in script.js with this enhanced version

const knowledgeBase = [
  // Greeting responses
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Good day! I'm Jarvis, Vathsaran's digital assistant. How may I help you explore his data analytics and design expertise today?"
  },
  {
    keywords: ['how are you', "how's it going", "what's up"],
    response: "I'm functioning optimally! I'd be happy to tell you about Vathsaran's projects, skills in data analytics, or help you navigate his portfolio. What are you most interested in learning about?"
  },
  
  // Data Analytics Specific Responses
  {
    keywords: ['data analytics', 'data analysis', 'analytics', 'analyze data'],
    response: "Vathsaran specializes in data analytics, transforming complex datasets into actionable insights. He's proficient in Python, SQL, and statistical analysis. His analytics approach combines technical precision with visual storytelling to make data accessible and impactful. Would you like to see specific data analytics projects he's worked on?"
  },
  {
    keywords: ['data visualization', 'visualize data', 'charts', 'graphs', 'dashboard'],
    response: "Data visualization is where Vathsaran's analytics and design skills converge. He creates interactive dashboards and visual narratives that make complex data intuitive and compelling. He uses tools like Plotly, Tableau, and custom Python visualizations to transform numbers into visual stories. His E-commerce Analytics Tool project is a great example of this work."
  },
  {
    keywords: ['python', 'pandas', 'numpy', 'jupyter'],
    response: "Vathsaran uses Python extensively in his data analysis workflow. He's skilled with essential libraries like Pandas for data manipulation, NumPy for numerical analysis, and various visualization libraries. His approach typically involves exploratory data analysis, statistical modeling, and creating reproducible research in Jupyter notebooks. Would you like to see Python-specific projects?"
  },
  {
    keywords: ['sql', 'database', 'queries'],
    response: "Vathsaran is experienced with SQL for data extraction and analysis. He can write complex queries to aggregate and analyze data from relational databases. He's used SQL in projects like the Leave Management System and E-commerce Analytics Tool, working with both transaction and analytical databases. Need more specific information about his SQL expertise?"
  },
  {
    keywords: ['machine learning', 'ml', 'algorithms', 'ai'],
    response: "Vathsaran has foundational knowledge in machine learning, focusing on practical applications for business problems. His skills include basic regression, classification, and clustering models. While he's still developing advanced ML expertise as part of his data analytics studies, he approaches these techniques with a critical thinking mindset, focusing on interpretability and business value."
  },
  {
    keywords: ['statistical', 'statistics', 'analysis'],
    response: "Statistical analysis is central to Vathsaran's data approach. He's knowledgeable about descriptive statistics, hypothesis testing, correlation analysis, and regression modeling. He ensures statistical soundness in his data projects, balancing technical rigor with clear communication of findings for non-technical stakeholders."
  },
  {
    keywords: ['tableau', 'power bi', 'data tools'],
    response: "Vathsaran is skilled with data visualization platforms like Tableau, which he used in his E-commerce Analytics Tool project. His background in design gives him an edge in creating dashboards that are both insightful and visually appealing. He focuses on creating interactive visualizations that allow stakeholders to explore data and discover insights themselves."
  },
  
  // Design Specific Responses
  {
    keywords: ['design', 'graphic design', 'visual design'],
    response: "Vathsaran has substantial experience in graphic design with a Diploma from AMDT College. His design approach emphasizes clean aesthetics and meaningful communication. This background uniquely enhances his data visualization work, allowing him to present complex information with visual clarity and impact. Would you like to see examples of his design work?"
  },
  {
    keywords: ['adobe', 'creative suite', 'photoshop', 'illustrator'],
    response: "Vathsaran is highly proficient in Adobe Creative Suite. His skills include Photoshop (80%), Illustrator (95%), InDesign (60%), Premiere Pro (50%), After Effects (40%), and Animate (60%). This expertise allows him to create professional graphics, layouts, and visual assets for both design projects and data visualization work."
  },
  {
    keywords: ['ui', 'ux', 'user interface', 'user experience'],
    response: "Vathsaran applies user interface design principles in both his web development and data visualization work. He focuses on creating intuitive, accessible interfaces that enhance user engagement with information. His approach balances aesthetic appeal with functional clarity, ensuring that interfaces serve both information and experience goals."
  },
  {
    keywords: ['brand', 'branding', 'identity'],
    response: "Vathsaran has created comprehensive brand identities for various clients, developing cohesive visual systems including logos, color palettes, typography, and brand guidelines. His Brand Identity Design projects demonstrate his ability to translate brand values and positioning into compelling visual expressions."
  },
  
  // Project Specific Responses
  {
    keywords: ['leave management', 'leave system'],
    response: "The Leave Management System was developed for Grifindor Toys using C#, SQL, and WinForms. This enterprise application streamlined the leave request workflow, improving efficiency by 40% and employee satisfaction. The system features automated approval routing, leave balance tracking, and analytical reporting for HR management."
  },
  {
    keywords: ['colonist', 'colonist management', 'space'],
    response: "The Colonist Management Software, created for E-Space Solutions, is a resource planning system for space colonization simulations. Built with Python, SQLite, and Tkinter, it helps manage personnel schedules, resource allocation, and habitat systems. The software includes predictive modeling for resource consumption and interactive visualization of colony metrics."
  },
  {
    keywords: ['vortixa', 'website', 'web development'],
    response: "The Vortixa Website project showcases Vathsaran's web development skills. Using HTML5, CSS3, and JavaScript, he created a responsive, modern website for this IT services company. The site features smooth animations, mobile-friendly design, and optimized performance. The project demonstrates his ability to blend technical implementation with compelling visual design."
  },
  {
    keywords: ['visualization dashboard', 'data dashboard'],
    response: "Vathsaran's Data Visualization Dashboard project transformed complex datasets into interactive, user-friendly visualizations. Built with Python, Pandas, and Plotly, this dashboard enables stakeholders to explore data through customizable views and filters. The project demonstrates his ability to make data accessible and actionable through thoughtful visual design and technical implementation."
  },
  {
    keywords: ['e-commerce', 'retail', 'sales analytics'],
    response: "The E-commerce Analytics Tool analyzes customer behavior and sales trends for online retailers. Developed using Python, SQL, and Tableau, it provides insights on customer segments, purchase patterns, and product performance. The tool includes predictive features for inventory planning and marketing optimization, demonstrating Vathsaran's ability to deliver business value through data analysis."
  },
  
  // Education and Background Responses
  {
    keywords: ['education', 'study', 'degree', 'qualifications'],
    response: "Vathsaran is currently pursuing a Higher National Diploma in Data Analytics at Esoft Metro Campus (2024-Present). His educational background includes a Diploma in Information Technology from ICBT Campus (2017) and a Diploma in Graphic Design from AMDT College (2019). This multidisciplinary education combines technical and creative foundations, positioning him uniquely at the intersection of data and design."
  },
  {
    keywords: ['experience', 'work history', 'background'],
    response: "Vathsaran's professional journey includes freelance graphic design (2018-2020), diverse creative projects (2021-2023), and design tutoring (2023-2024). He's now focusing on data analytics while leveraging his design expertise. This combination of analytical and creative experience enables him to bridge technical data work with effective visual communication."
  },
  {
    keywords: ['career goals', 'aspirations', 'future plans'],
    response: "Vathsaran aims to become a leading data analyst who excels in both technical analysis and visual storytelling. His goals include mastering advanced statistical methods and machine learning, creating innovative data visualizations, contributing to data-driven decision-making in creative industries, and eventually leading analytics initiatives. He's committed to continuous learning in this rapidly evolving field."
  },
  
  // Contact and Collaboration Responses
  {
    keywords: ['contact', 'reach', 'get in touch', 'hire'],
    response: "You can reach Vathsaran via email at varosaran@gmail.com, by phone at +94777275526, through LinkedIn (Vathsaran Yasotharan), or via GitHub (github.com/Varo-Saran). The Contact page also includes a form to send messages directly. He's open to discussing freelance projects, collaboration opportunities, and permanent positions."
  },
  {
    keywords: ['freelance', 'hire', 'collaboration', 'work with'],
    response: "Vathsaran is available for freelance projects and collaborations in data analytics, data visualization, and graphic design. His multidisciplinary skill set makes him ideal for projects requiring both analytical rigor and visual communication. For inquiries about rates, availability, or specific project needs, please use the contact form or email directly at varosaran@gmail.com."
  },
  {
    keywords: ['portfolio', 'website', 'site'],
    response: "You're currently exploring Vathsaran's portfolio website, which showcases his data analytics and design capabilities. The site features sections on his skills, projects, background, and contact information. The futuristic, interactive design reflects his aesthetic sensibilities. Is there a particular section you'd like me to help you navigate to?"
  },
  
  // Personality and Conversational Responses
  {
    keywords: ['joke', 'funny', 'laugh'],
    response: "Why don't data scientists get invited to parties? Because they're too busy trying to find the correlation between 'chips' and 'dips'! Would you like another data joke?"
  },
  {
    keywords: ['who are you', 'what are you', 'about you'],
    response: "I'm Jarvis, Vathsaran's AI assistant. I'm here to help you learn about his skills in data analytics and design, explore his projects, and connect if you're interested in collaboration. Unlike Vathsaran, I can't create stunning visualizations, but I can certainly tell you all about how he does it!"
  },
  {
    keywords: ['thank you', 'thanks'],
    response: "You're welcome! I'm always here to help showcase Vathsaran's data analytics and design expertise. If you have more questions later or want to discuss a potential project, feel free to use the contact form. Wishing you a data-driven day!"
  },
  {
    keywords: ['bye', 'goodbye', 'later'],
    response: "Thank you for exploring Vathsaran's portfolio! If you'd like to see his work in action or discuss potential collaborations, don't hesitate to reach out through the contact form. Have a great day, and may your datasets always be clean and your visualizations insightful!"
  },
  
  // Technical Skill Questions
  {
    keywords: ['technical skills', 'tech skills', 'what can you do'],
    response: "Vathsaran's key technical skills include: data analysis with Python (Pandas, NumPy) and SQL, data visualization (Plotly, Tableau), statistical analysis, basic machine learning, Adobe Creative Suite (Photoshop 80%, Illustrator 95%), web development (HTML 90%, CSS 60%, JavaScript 20%), and database management. Would you like more details about any specific skill area?"
  },
  {
    keywords: ['languages', 'programming languages', 'coding'],
    response: "Vathsaran is proficient in several programming and markup languages, including Python (50%) for data analysis, SQL (40%) for database queries, C# (30%) for application development, HTML (90%) and CSS (60%) for web development, and JavaScript (20%) for interactive elements. These technical skills complement his analytical and design capabilities."
  },
  
  // Data-specific conversation starters
  {
    keywords: ['data project', 'analytics project', 'case study'],
    response: "Vathsaran has worked on several data analytics projects, including: an E-commerce Analytics Tool that increased sales conversion by 15%, a Data Visualization Dashboard that reduced decision-making time by 30%, and predictive models for inventory management. Which type of analytics project are you most interested in hearing about?"
  },
  {
    keywords: ['business intelligence', 'bi', 'reporting'],
    response: "Vathsaran approaches Business Intelligence as the bridge between raw data and strategic decision-making. He creates analytical reports and dashboards that translate complex metrics into actionable insights. His work emphasizes self-service BI tools that empower stakeholders to explore data independently while maintaining analytical rigor in the underlying data modeling."
  },
  {
    keywords: ['data ethics', 'privacy', 'responsible'],
    response: "Vathsaran is committed to ethical data practices, including privacy protection, transparent methodology, and avoiding biased analysis. He believes responsible data use builds trust and creates sustainable value. In his projects, he implements data anonymization, clear documentation of assumptions, and careful consideration of the societal implications of analytical work."
  },
  {
    keywords: ['big data', 'large datasets', 'data processing'],
    response: "While continuing to develop his big data skills, Vathsaran understands the principles of working with large datasets. He focuses on efficient data processing techniques, appropriate sampling methods, and scalable visualization approaches. He's currently expanding his knowledge of distributed computing tools and cloud-based analytics platforms through his data analytics program."
  },
  
  // Fallback responses
  {
    keywords: ['unknown', 'not sure', 'confused'],
    response: "I'm not quite sure I understood your question about Vathsaran's data analytics and design work. Could you rephrase? I'm happy to tell you about his technical skills, projects, visualization expertise, or how to get in touch for collaboration opportunities."
  },
  {
    keywords: ['default'],
    response: "That's an interesting question! While I don't have specific information about that, I'd be happy to tell you about Vathsaran's data analytics skills, design work, or ongoing projects. Or would you prefer information about contacting him for collaboration opportunities?"
  }
];

const dataAnalyticsResponses = [
  // Data methodology responses
  {
    keywords: ['data methodology', 'data process', 'analytics approach'],
    response: "Vathsaran follows a structured data analytics methodology: 1) Problem Definition - clarifying business questions, 2) Data Collection & Cleaning - ensuring quality and relevance, 3) Exploratory Analysis - discovering patterns and relationships, 4) Advanced Analysis - applying statistical methods, 5) Visualization & Communication - translating findings into actionable insights. This systematic approach ensures rigorous analysis with business-relevant outcomes."
  },
  {
    keywords: ['data cleaning', 'data preparation', 'preprocessing'],
    response: "Vathsaran understands that data cleaning is often 80% of a data project. He's experienced in handling missing values, outlier detection, data normalization, and feature engineering. His approach emphasizes documentation of cleaning steps for reproducibility. He uses Python's Pandas for transformations and maintains data quality through automated validation checks."
  },
  {
    keywords: ['data sources', 'data collection', 'data gathering'],
    response: "Vathsaran works with diverse data sources including relational databases, CSV files, APIs, and web scraping. He emphasizes proper data collection planning to ensure representativeness and relevance to business questions. For the E-commerce Analytics Tool, he integrated customer transaction data, website behavior logs, and product information to create a comprehensive analytical view."
  },
  
  // Technical data skills
  {
    keywords: ['data tools', 'analytics tools', 'software'],
    response: "Vathsaran's technical toolkit includes: Python with Pandas, NumPy, Matplotlib, and Plotly for analysis and visualization; SQL for database queries; Tableau for interactive dashboards; Excel for quick analysis; Git for version control; and Jupyter Notebooks for reproducible research. He continues expanding his toolset through his data analytics studies, focusing on tools that enable efficient, insightful analysis."
  },
  {
    keywords: ['exploratory data analysis', 'eda', 'data exploration'],
    response: "Exploratory Data Analysis is central to Vathsaran's approach. He starts by understanding variable distributions, identifying patterns and correlations, and generating initial hypotheses. He uses visualization techniques extensively during EDA to reveal insights that might be missed in purely numerical analysis. This exploratory phase informs his subsequent statistical modeling and ensures analysis directions align with the data's natural patterns."
  },
  {
    keywords: ['excel', 'spreadsheet', 'spreadsheet analysis'],
    response: "While Vathsaran focuses on programmatic analysis with Python and SQL for scalability, he's also proficient with Excel for quick analyses and stakeholder-friendly outputs. He's skilled with pivot tables, VLOOKUP functions, and Excel's analytical tools. For smaller datasets or initial explorations, Excel remains a valuable tool in his workflow, complementing his more advanced technical approaches."
  },
  
  // Specific analytical approaches
  {
    keywords: ['predictive analytics', 'prediction', 'forecasting'],
    response: "Vathsaran's approach to predictive analytics combines statistical methods with business context. He's worked with time series analysis for forecasting, regression models for outcome prediction, and classification algorithms for category prediction. His focus is on creating interpretable models that balance accuracy with practical usability, ensuring predictions can be easily understood and applied by decision-makers."
  },
  {
    keywords: ['descriptive analytics', 'business metrics', 'kpis'],
    response: "Vathsaran excels at descriptive analytics, transforming raw data into meaningful business metrics and KPIs. In his E-commerce Analytics Tool, he designed comprehensive dashboards showing customer acquisition costs, lifetime value, conversion rates, and product performance metrics. He focuses on creating clear, actionable metrics that align with strategic goals and provide actionable insights."
  },
  {
    keywords: ['segmentation', 'clustering', 'customer segments'],
    response: "In the E-commerce Analytics Tool project, Vathsaran implemented customer segmentation using clustering algorithms to identify distinct customer groups based on purchase behavior, preferences, and engagement patterns. This allowed for targeted marketing strategies and personalized customer experiences. His approach combines algorithmic segmentation with business logic to ensure segments are both statistically valid and commercially meaningful."
  },
  
  // Data visualization specifics
  {
    keywords: ['visualization principles', 'data viz principles', 'visualization best practices'],
    response: "Vathsaran applies key data visualization principles in his work: 1) Focus on the core message, 2) Choose appropriate chart types for the data, 3) Minimize clutter and maximize data-to-ink ratio, 4) Use color purposefully, 5) Design for the intended audience, and 6) Enable interactive exploration when beneficial. His background in design enhances his visualizations, making complex data accessible without sacrificing accuracy."
  },
  {
    keywords: ['interactive dashboards', 'interactive visualizations'],
    response: "Vathsaran creates interactive dashboards that allow users to explore data dynamically. His Data Visualization Dashboard project features filters, drill-down capabilities, and parameterized views that enable users to answer their own questions through data exploration. He balances guided insights with exploratory freedom, ensuring dashboards are both informative and engaging for both technical and non-technical users."
  },
  {
    keywords: ['data storytelling', 'narrative visualization', 'storytelling with data'],
    response: "Data storytelling is where Vathsaran's analytics and design backgrounds converge most powerfully. He crafts data narratives that guide audiences through insights in a compelling, structured way. This involves sequencing visualizations logically, highlighting key patterns, providing necessary context, and creating a cohesive flow that leads to actionable conclusions. His approach ensures data doesn't just inform but persuades and motivates action."
  },
  
  // Business application of data
  {
    keywords: ['business impact', 'data roi', 'business value'],
    response: "Vathsaran focuses on generating tangible business impact from data. His E-commerce Analytics Tool helped increase customer retention by 18% through targeted interventions, while his inventory analysis reduced stockouts by 25%. He approaches every project with a clear understanding of business objectives, ensuring analyses directly address key performance indicators and deliver measurable return on investment."
  },
  {
    keywords: ['decision making', 'data-driven decisions'],
    response: "Vathsaran believes effective data analytics should enhance decision-making at all levels. His visualization work emphasizes clarity and actionability, helping stakeholders move quickly from insight to action. He designs analytics outputs specifically for decision support, balancing comprehensive information with focused recommendations, and adapting detail levels for different decision-makers from executives to operational teams."
  },
  {
    keywords: ['data strategy', 'analytics strategy'],
    response: "While still developing expertise in organizational data strategy, Vathsaran understands the importance of aligning analytics work with broader business goals. He approaches projects with consideration for how they fit into the organization's data ecosystem and long-term analytics needs, focusing on sustainable solutions that build analytics capabilities rather than one-off analyses."
  },
  
  // Industry-specific data analytics
  {
    keywords: ['retail analytics', 'e-commerce data', 'retail data'],
    response: "Vathsaran has specific experience with retail and e-commerce analytics. His E-commerce Analytics Tool project involved customer segmentation, purchase pattern analysis, product recommendation systems, and inventory optimization. He's familiar with key metrics like average order value, customer acquisition cost, and lifetime value, as well as analytical approaches for pricing optimization and market basket analysis."
  },
  {
    keywords: ['hr analytics', 'people analytics', 'workforce data'],
    response: "Vathsaran's Leave Management System project demonstrated his capability in HR analytics. The system tracked leave patterns, identified departments with unusual absence rates, and provided predictive insights on staffing needs. While not his primary focus, this experience gave him familiarity with workforce analytics applications and HR data structures."
  },
  
  // Learning and growth
  {
    keywords: ['learning', 'studying', 'improving'],
    response: "As a data analytics student, Vathsaran is actively expanding his skills in advanced statistical methods, machine learning, and big data technologies. He takes a structured approach to learning, combining formal education with hands-on projects and independent study. Current focus areas include machine learning algorithms, cloud-based analytics platforms, and advanced data visualization techniques."
  },
  {
    keywords: ['data trends', 'analytics trends', 'future of data'],
    response: "Vathsaran stays current with data analytics trends including the rise of augmented analytics, responsible AI, embedded analytics in applications, and data democratization. He's particularly interested in how visualization techniques are evolving to handle increasingly complex datasets and how design principles can make advanced analytics more accessible to non-technical users."
  },
  
  // Interesting data questions
  {
    keywords: ['favorite visualization', 'best chart', 'best graph'],
    response: "Vathsaran has a particular appreciation for thoughtfully designed interactive visualizations that reveal multiple dimensions of data. While he values classic forms like well-constructed bar and line charts for their clarity, he enjoys creating more innovative forms like network diagrams, treemaps, and custom visualizations when they're appropriate for the data. His design background helps him know when to stick with proven formats and when to innovate."
  },
  {
    keywords: ['data challenge', 'analytics problem', 'difficult data'],
    response: "One of Vathsaran's most challenging data projects involved reconciling inconsistent customer data from multiple systems for the E-commerce Analytics Tool. He developed a robust entity resolution system that used fuzzy matching and machine learning to create a unified customer view across platforms. This challenge taught him valuable lessons about data integration and quality management in real-world environments."
  },
  {
    keywords: ['data mistake', 'analytics error', 'common mistake'],
    response: "Vathsaran believes the most common mistake in data projects is rushing to analysis without properly understanding business context and data limitations. He advocates for thorough exploratory analysis and stakeholder consultation before drawing conclusions. He's learned from experience that skipping these steps can lead to technically correct analyses that miss the actual business need or fail to account for important data nuances."
  }
];
// Enhanced chatbot intelligence functions

// Combine knowledge bases
knowledgeBase.push(...dataAnalyticsResponses);

// Context tracking for more natural conversation
let conversationContext = {
  topics: [],
  recentFocus: null,
  greeting: false,
  questionCount: 0,
  preferredArea: null
};

// Process user message and generate response with context awareness
function getBotResponse(message) {
  const lowerMessage = message.toLowerCase();
  conversationContext.questionCount++;
  if (['hello', 'hi', 'hey', 'greetings'].some(word => lowerMessage.includes(word)) && 
      !conversationContext.greeting) {
    conversationContext.greeting = true;
  }
  detectUserInterest(lowerMessage);
  let response = findDirectResponse(lowerMessage);
  if (!response) {
    response = generateContextualResponse(lowerMessage);
  }
  updateConversationContext(lowerMessage, response);
  return response;
}

function findDirectResponse(message) {
  const sortedResponses = [...knowledgeBase].sort((a, b) => {
    if (conversationContext.preferredArea) {
      const aRelated = a.keywords.some(k => k.includes(conversationContext.preferredArea));
      const bRelated = b.keywords.some(k => k.includes(conversationContext.preferredArea));
      if (aRelated && !bRelated) return -1;
      if (!aRelated && bRelated) return 1;
    }
    return b.keywords.join(' ').length - a.keywords.join(' ').length;
  });
  for (const item of sortedResponses) {
    if (item.keywords.some(keyword => message.includes(keyword))) {
      return item.response;
    }
  }
  return null;
}

function generateContextualResponse(message) {
  if (conversationContext.recentFocus) {
    const focusResponses = knowledgeBase.filter(item => 
      item.keywords.some(k => k.includes(conversationContext.recentFocus)));
    if (focusResponses.length > 0) {
      return `Based on our conversation about ${conversationContext.recentFocus}, ${focusResponses[0].response}`;
    }
  }
  if (conversationContext.preferredArea) {
    const areaResponses = knowledgeBase.filter(item => 
      item.keywords.some(k => k.includes(conversationContext.preferredArea)));
    if (areaResponses.length > 0) {
      const randomIndex = Math.floor(Math.random() * areaResponses.length);
      return `Since you're interested in ${conversationContext.preferredArea}, you might want to know that ${areaResponses[randomIndex].response}`;
    }
  }
  if (conversationContext.greeting && conversationContext.questionCount <= 2) {
    return "I'd be happy to tell you about Vathsaran's work in data analytics and design. His portfolio includes projects in data visualization, analytics dashboards, and creative design. What specific area would you like to explore?";
  }
  const defaultResponse = knowledgeBase.find(item => item.keywords.includes('default'));
  return defaultResponse.response;
}

function detectUserInterest(message) {
  const interestAreas = [
    {area: 'data analytics', keywords: ['data', 'analytics', 'analysis', 'statistics', 'python', 'sql']},
    {area: 'design', keywords: ['design', 'graphic', 'creative', 'visual', 'adobe', 'photoshop']},
    {area: 'projects', keywords: ['project', 'portfolio', 'work', 'case study', 'example']},
    {area: 'skills', keywords: ['skill', 'ability', 'proficiency', 'capable', 'experience']}
  ];
  for (const interest of interestAreas) {
    if (interest.keywords.some(k => message.includes(k))) {
      conversationContext.preferredArea = interest.area;
      break;
    }
  }
}

function updateConversationContext(message, response) {
  const topicWords = message.split(' ')
    .filter(word => word.length > 3)
    .filter(word => !['what', 'when', 'where', 'which', 'would', 'could'].includes(word));
  if (topicWords.length > 0) {
    conversationContext.topics = [...new Set([...conversationContext.topics, ...topicWords])];
    conversationContext.recentFocus = topicWords[0];
  }
  if (conversationContext.topics.length > 10) {
    conversationContext.topics = conversationContext.topics.slice(-10);
  }
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning! I'm Jarvis, Vathsaran's digital assistant.";
  else if (hour < 18) return "Good afternoon! I'm Jarvis, Vathsaran's digital assistant.";
  else return "Good evening! I'm Jarvis, Vathsaran's digital assistant.";
}

function resetChatbotContext() {
  conversationContext = {
    topics: [],
    recentFocus: null,
    greeting: false,
    questionCount: 0,
    preferredArea: null
  };
}

function adjustChatbotForKeyboard() {
  const chatbot = document.getElementById('chatbot');
  const userInput = document.getElementById('userInput');
  const chatMessages = document.getElementById('chatMessages');
  let initialWindowHeight = window.innerHeight;
  let isKeyboardOpen = false;

  // Smooth transition for position changes
  chatbot.style.transition = 'bottom 0.3s ease, height 0.3s ease';

  // Function to adjust chatbot position
  function updateChatbotPosition() {
    if (isKeyboardOpen) {
      const keyboardHeight = initialWindowHeight - window.innerHeight;
      const safeBottom = keyboardHeight + 20; // 20px buffer above keyboard
      chatbot.style.bottom = `${safeBottom}px`;
      chatbot.style.height = `calc(100vh - ${safeBottom + 100}px)`; // Adjust height to fit screen
      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    } else {
      chatbot.style.bottom = '20px'; // Reset to original position
      chatbot.style.height = '400px'; // Reset to original height
    }
  }

  // Detect keyboard opening on resize
  window.addEventListener('resize', () => {
    const newHeight = window.innerHeight;
    if (newHeight < initialWindowHeight * 0.9) { // Keyboard likely open
      if (!isKeyboardOpen) {
        isKeyboardOpen = true;
        updateChatbotPosition();
      }
    } else if (isKeyboardOpen && newHeight >= initialWindowHeight * 0.9) {
      isKeyboardOpen = false;
      updateChatbotPosition();
    }
    initialWindowHeight = newHeight; // Update reference height
  });

  // Handle input focus (keyboard opening)
  userInput.addEventListener('focus', () => {
    if (!isKeyboardOpen) {
      isKeyboardOpen = true;
      setTimeout(() => {
        updateChatbotPosition();
        userInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300); // Delay to allow keyboard to fully appear
    }
  });

  // Handle input blur (keyboard closing)
  userInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (isKeyboardOpen) {
        isKeyboardOpen = false;
        updateChatbotPosition();
      }
    }, 100); // Small delay to ensure keyboard is fully closed
  });

  // Ensure visibility on iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.body.style.height = '100vh'; // Fix iOS viewport height issue
    userInput.addEventListener('focus', () => {
      setTimeout(() => {
        window.scrollTo(0, 0); // Prevent iOS scrolling issues
      }, 400);
    });
  }
}

function initEnhancedChatbot() {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const closeChatbotBtn = document.getElementById('closeChatbot');
  const chatbot = document.getElementById('chatbot');
  const chatMessages = document.getElementById('chatMessages');
  const userInput = document.getElementById('userInput');
  const sendMessageBtn = document.getElementById('sendMessage');
  
  chatbot.style.display = 'none';
  chatbotToggle.style.display = 'flex';
  
  chatbotToggle.addEventListener('click', () => {
    chatbot.style.display = 'flex';
    chatbotToggle.style.display = 'none';
    chatMessages.innerHTML = '';
    resetChatbotContext();
    const timeBasedGreeting = getTimeBasedGreeting();
    addMessage(`${timeBasedGreeting} How may I help you learn about Vathsaran's data analytics and design work today?`);
    if (isMobile()) {
      document.body.style.overflow = 'hidden';
    }
  });
  
  closeChatbotBtn.addEventListener('click', () => {
    chatbot.style.display = 'none';
    chatbotToggle.style.display = 'flex';
    if (isMobile()) {
      document.body.style.overflow = ''; 
    }
  });
  
  sendMessageBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
      addMessage(message, true);
      userInput.value = '';
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        const botResponse = getBotResponse(message);
        addMessage(botResponse);
      }, calculateResponseTime(message));
    }
  });
  
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessageBtn.click();
    }
  });
  
  function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot-message typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    typingIndicator.id = 'typingIndicator';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  function calculateResponseTime(message) {
    let responseTime = 1000;
    responseTime += message.length * 20;
    responseTime = Math.max(1000, Math.min(responseTime, 3000));
    return responseTime;
  }
  
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Call the function
  adjustChatbotForKeyboard();
}

document.addEventListener('DOMContentLoaded', initEnhancedChatbot);
