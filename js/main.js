/**
 * MonPortfolio - Main JavaScript
 * @author Amazigh BELHADDAD
 */
'use strict';

(function() {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    const STORAGE_KEY = 'theme-preference';

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function getStoredTheme() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function setTheme(theme) {
        if (theme === 'light') {
            root.classList.add('light-mode');
        } else {
            root.classList.remove('light-mode');
        }
        localStorage.setItem(STORAGE_KEY, theme);
    }

    function initTheme() {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            setTheme(getSystemTheme());
        }
    }

    function toggleTheme() {
        const currentTheme = root.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    initTheme();
    themeToggle.addEventListener('click', toggleTheme);

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        if (!getStoredTheme()) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });

    // Navigation mobile
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');

    function toggleMenu() {
        const isOpen = navList.classList.toggle('is-open');
        navToggle.classList.toggle('is-active');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        navList.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    // Focus trap pour le menu mobile
    document.addEventListener('keydown', function(e) {
        if (!navList.classList.contains('is-open')) return;

        const focusableElements = navList.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Escape') {
            closeMenu();
            navToggle.focus();
            return;
        }

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Fade-in animation on scroll
    const sections = document.querySelectorAll('section');

    sections.forEach(function(section) {
        section.classList.add('fade-in');
    });

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(function(section) {
        observer.observe(section);
    });

    // Projects loader
    const projectsGrid = document.getElementById('projects-grid');

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function createProjectCard(project) {
        const tagsHtml = project.tags.map(function(tag) {
            return '<li class="card__tag">' + escapeHtml(tag) + '</li>';
        }).join('');

        return '<article class="card">' +
            '<div class="project-card__banner"></div>' +
            '<div class="card__content">' +
                '<h3 class="card__title">' + escapeHtml(project.name) + '</h3>' +
                '<p class="card__description">' + escapeHtml(project.description) + '</p>' +
                '<ul class="card__tags card__tags--spaced">' + tagsHtml + '</ul>' +
                '<a href="' + encodeURI(project.url) + '" class="card__link" target="_blank" rel="noopener noreferrer">' +
                    'Voir le projet ' + escapeHtml(project.name) +
                    '<span class="sr-only"> (s\'ouvre dans un nouvel onglet)</span>' +
                '</a>' +
            '</div>' +
        '</article>';
    }

    function loadProjects() {
        if (!projectsGrid) return;

        fetch('data/projects.json')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(function(data) {
                const html = data.projects.map(createProjectCard).join('');
                projectsGrid.innerHTML = html;
            })
            .catch(function(error) {
                console.error('Erreur chargement projets:', error);
                projectsGrid.innerHTML = '<p class="projects__error">Impossible de charger les projets.</p>';
            });
    }

    loadProjects();

    // Validation du formulaire de contact accessible
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');

        function showError(input, message) {
            const errorElement = document.getElementById(input.id + '-error');
            input.classList.add('form__input--error');
            input.setAttribute('aria-invalid', 'true');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }

        function clearError(input) {
            const errorElement = document.getElementById(input.id + '-error');
            input.classList.remove('form__input--error');
            input.removeAttribute('aria-invalid');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }

        function validateField(input) {
            clearError(input);

            if (input.validity.valueMissing) {
                showError(input, 'Ce champ est obligatoire.');
                return false;
            }

            if (input.type === 'email' && input.validity.typeMismatch) {
                showError(input, 'Veuillez entrer une adresse email valide.');
                return false;
            }

            return true;
        }

        contactForm.querySelectorAll('input, textarea').forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            input.addEventListener('input', function() {
                if (input.classList.contains('form__input--error')) {
                    validateField(input);
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputs = contactForm.querySelectorAll('input, textarea');
            let isValid = true;
            let firstInvalid = null;

            inputs.forEach(function(input) {
                if (!validateField(input)) {
                    isValid = false;
                    if (!firstInvalid) firstInvalid = input;
                }
            });

            if (!isValid) {
                firstInvalid.focus();
                return;
            }

            var submitButton = contactForm.querySelector('.form__button');
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            var formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function(response) {
                if (response.ok) {
                    formStatus.innerHTML = '<p class="form__success">Message envoyé avec succès !</p>';
                    formStatus.setAttribute('tabindex', '-1');
                    formStatus.focus();
                    contactForm.reset();
                } else {
                    throw new Error('Erreur serveur');
                }
            })
            .catch(function() {
                formStatus.innerHTML = '<p class="form__error">Erreur lors de l\'envoi. Veuillez réessayer.</p>';
                formStatus.setAttribute('tabindex', '-1');
                formStatus.focus();
            })
            .finally(function() {
                submitButton.disabled = false;
                submitButton.textContent = 'Envoyer';
            });
        });
    }
})();
