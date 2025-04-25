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
                    window.location.href = addLink.href;
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
