const fs = require('fs');
const path = require('path');

const scriptPath = path.resolve(__dirname, '../django_admin_hotkeys/static/django_admin_hotkeys/search_form.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

function initializeDOMAndRunScript(html) {
    document.body.innerHTML = html;
    eval(scriptContent);
}

let documentAddListenerSpy;

describe('django-admin-hotkeys search_form.js', () => {
    beforeEach(() => {
        documentAddListenerSpy = jest.spyOn(document, 'addEventListener');
    });

    afterEach(() => {
        // Remove listeners spied on during the test
        if (documentAddListenerSpy) {
            for (const call of documentAddListenerSpy.mock.calls) {
                if (call.length >= 2 && call[0] === 'keydown') {
                    const eventType = call[0];
                    const listener = call[1];
                    document.removeEventListener(eventType, listener);
                }
            }
            documentAddListenerSpy.mockRestore();
            documentAddListenerSpy = null;
        }

        document.body.innerHTML = '';
    });

    describe('initSearchHotkey', () => {
        test('should set placeholder text on search input', () => {
            const html = `<input id="searchbar" type="text">`;
            initializeDOMAndRunScript(html);

            const searchInput = document.getElementById('searchbar');

            expect(searchInput).not.toBeNull();
            expect(searchInput.getAttribute('placeholder')).toBe('Type "/" to search');
        });

        test('should focus search input on "/" key press outside input fields', () => {
            const html = `
                <input id="searchbar" type="text">
                <button>Some Button</button>
            `;
            initializeDOMAndRunScript(html);
            const searchInput = document.getElementById('searchbar');
            const button = document.querySelector('button');
            button.focus(); // Ensure focus is initially somewhere else

            expect(document.activeElement).not.toBe(searchInput);

            const event = new KeyboardEvent('keydown', {key: '/', bubbles: true});
            document.body.dispatchEvent(event);

            expect(document.activeElement).toBe(searchInput);
        });

        test('should not prevent default or focus search input if "/" is pressed in an input field', () => {
            const html = `
                <input id="searchbar" type="text">
                <input id="otherInput" type="text">
            `;
            initializeDOMAndRunScript(html);
            const otherInput = document.getElementById('otherInput');
            otherInput.focus(); // Focus the other input

            expect(document.activeElement).toBe(otherInput);

            const event = new KeyboardEvent('keydown', {key: '/', bubbles: true});
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
            otherInput.dispatchEvent(event);

            expect(document.activeElement).toBe(otherInput);
            expect(preventDefaultSpy).not.toHaveBeenCalled();
        });

        test('should not throw error if search input does not exist', () => {
            const html = `<div>Some other content</div>`;
            initializeDOMAndRunScript(html);

            expect(() => {
                const event = new KeyboardEvent('keydown', {key: '/', bubbles: true});
                const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
                document.body.dispatchEvent(event);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
                preventDefaultSpy.mockRestore();
            }).not.toThrow();

            expect(document.getElementById('searchbar')).toBeNull();
        });
    });

    describe('initAddHotkey', () => {
        const originalLocation = window.location;
        beforeEach(() => {
            delete window.location;
            window.location = {href: '', assign: jest.fn()}; // Simple mock
        });

        afterEach(() => {
            window.location = originalLocation;
        });

        test('should navigate to add link URL on "n" key press', () => {
            const addUrl = '/admin/app/model/add/';
            const html = `
                <ul class="object-tools">
                    <li><a href="${addUrl}" class="addlink">Add</a></li>
                </ul>
                <button>Some Button</button>
            `;
            initializeDOMAndRunScript(html);
            const button = document.querySelector('button');
            button.focus();

            const event = new KeyboardEvent('keydown', {key: 'n', bubbles: true});
            document.body.dispatchEvent(event);

            const addLink = document.querySelector('.object-tools .addlink');

            expect(addLink).not.toBeNull(); // Ensure link exists before checking href
            expect(window.location.href).toBe(addLink.href);
        });

        test('should not add listener or throw error if add link does not exist', () => {
            const html = `<div>Some other content</div>`;
            if (documentAddListenerSpy) documentAddListenerSpy.mockClear();
            initializeDOMAndRunScript(html);

            let nKeyListenerFound = false;
            if (documentAddListenerSpy) {
                for (const call of documentAddListenerSpy.mock.calls) {
                    if (call[0] === 'keydown') {
                        nKeyListenerFound = true;
                        break;
                    }
                }
            }

            expect(nKeyListenerFound).toBe(false);

            expect(() => {
                const event = new KeyboardEvent('keydown', {key: 'n', bubbles: true});
                const preventDefaultSpy = jest.spyOn(event, 'preventDefault'); // Check preventDefault too
                const initialHref = window.location.href;
                document.body.dispatchEvent(event);
                expect(window.location.href).toBe(initialHref); // Href shouldn't change
                expect(preventDefaultSpy).not.toHaveBeenCalled(); // preventDefault shouldn't be called
                preventDefaultSpy.mockRestore();
            }).not.toThrow();
        });
    });
});
