/**
 * MonPortfolio - Blog JavaScript
 * @author Amazigh BELHADDAD
 */
'use strict';

(function() {
    const POSTS_JSON_PATH = 'posts.json';
    const POSTS_DIR = 'posts/';

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }

    function getSlugFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function parseMarkdown(markdown) {
        let html = markdown;

        // Code blocks (```language ... ```)
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
            const escapedCode = escapeHtml(code.trim());
            const langClass = lang ? ' class="language-' + lang + '"' : '';
            return '<pre><code' + langClass + '>' + escapedCode + '</code></pre>';
        });

        // Inline code (`code`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers (# to ######)
        html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
        html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
        html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Bold (**text** or __text__)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

        // Italic (*text* or _text_)
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

        // Links [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Images ![alt](url)
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // Blockquotes (> text)
        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

        // Horizontal rules (---, ***, ___)
        html = html.replace(/^([-*_]){3,}$/gm, '<hr>');

        // Unordered lists (- item or * item)
        html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

        // Ordered lists (1. item)
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

        // Paragraphs (double newlines)
        html = html.replace(/\n\n+/g, '</p><p>');
        html = '<p>' + html + '</p>';

        // Clean up empty paragraphs and fix structure
        html = html.replace(/<p><(h[1-6]|ul|ol|pre|blockquote|hr)/g, '<$1');
        html = html.replace(/<\/(h[1-6]|ul|ol|pre|blockquote)><\/p>/g, '</$1>');
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<hr><\/p>/g, '<hr>');
        html = html.replace(/<p>\s*<\/p>/g, '');

        // Line breaks
        html = html.replace(/\n/g, '<br>');
        html = html.replace(/<br><br>/g, '');
        html = html.replace(/<(\/?(ul|ol|li|pre|code|blockquote|h[1-6]))><br>/g, '<$1>');
        html = html.replace(/<br><(\/?(ul|ol|li|pre|code|blockquote|h[1-6]))>/g, '<$1>');

        return html;
    }

    function createPostCard(post) {
        const tagsHTML = post.tags.map(function(tag) {
            return '<li class="card__tag">' + escapeHtml(tag) + '</li>';
        }).join('');

        return '<article class="card">' +
            '<a href="post.html?slug=' + encodeURIComponent(post.slug) + '" class="blog-card__link">' +
                '<div class="card__content">' +
                    '<time class="blog-card__date" datetime="' + post.date + '">' + formatDate(post.date) + '</time>' +
                    '<h3 class="card__title card__title--hover">' + escapeHtml(post.title) + '</h3>' +
                    '<p class="blog-card__excerpt">' + escapeHtml(post.excerpt) + '</p>' +
                    '<ul class="card__tags">' + tagsHTML + '</ul>' +
                '</div>' +
            '</a>' +
        '</article>';
    }

    function renderPostsList(container) {
        fetch(POSTS_JSON_PATH)
            .then(function(response) {
                if (!response.ok) throw new Error('Erreur chargement posts.json');
                return response.json();
            })
            .then(function(data) {
                const posts = data.posts.sort(function(a, b) {
                    return new Date(b.date) - new Date(a.date);
                });

                const html = posts.map(createPostCard).join('');
                container.innerHTML = html;
            })
            .catch(function(error) {
                container.innerHTML = '<p class="blog__error">Impossible de charger les articles.</p>';
                console.error(error);
            });
    }

    function renderPost(container) {
        const slug = getSlugFromURL();

        if (!slug) {
            container.innerHTML = '<p class="blog__error">Article non trouvé.</p>';
            return;
        }

        fetch(POSTS_JSON_PATH)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                const post = data.posts.find(function(p) {
                    return p.slug === slug;
                });

                if (!post) {
                    throw new Error('Article non trouvé');
                }

                document.title = post.title + ' | Amazigh BELHADDAD';

                return fetch(POSTS_DIR + slug + '.md');
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Erreur chargement article');
                return response.text();
            })
            .then(function(markdown) {
                container.innerHTML = parseMarkdown(markdown);
            })
            .catch(function(error) {
                container.innerHTML = '<p class="blog__error">Impossible de charger l\'article.</p>';
                console.error(error);
            });
    }

    function init() {
        const blogList = document.getElementById('blog-list');
        const postContent = document.getElementById('post-content');

        if (blogList) {
            renderPostsList(blogList);
        }

        if (postContent) {
            renderPost(postContent);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
