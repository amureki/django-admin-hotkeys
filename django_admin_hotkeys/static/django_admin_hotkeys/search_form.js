'use strict';
{
    function initSearchHotkey() {
        const searchInput = document.querySelector('input[id="searchbar"]');
        if (searchInput) {
            searchInput.setAttribute('placeholder', 'Type "/" to search');
            document.addEventListener('keydown', function (event) {
                if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
                    event.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }
            });
        }
    }

    function initAddHotkey() {
        const addLink = document.querySelector('.object-tools .addlink');
        if (addLink) {
            document.addEventListener('keydown', function (event) {
                if (event.key === 'n' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
                    event.preventDefault();
                    // Trigger a click on the "Add" link instead of directly manipulating
                    // `window.location`. This approach keeps the real browser behaviour
                    // (navigation is handled by the anchor) while allowing tests that run
                    // in jsdom to easily spy on `addLink.click` without dealing with the
                    // non-configurable `window.location` object (which cannot be mocked in
                    // Jest 30 / jsdom 26).
                    addLink.click();
                }
            });
        }
    }

    // Call function fn when the DOM is loaded and ready. If it is already
    // loaded, call the function now.
    // http://youmightnotneedjquery.com/#ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function() {
        initSearchHotkey();
        initAddHotkey();
    });
}
