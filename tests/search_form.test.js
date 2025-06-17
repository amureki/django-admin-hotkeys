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
        test('should trigger click on the add link on "n" key press', () => {
            const html = `
                <ul class="object-tools">
                    <li><a href="/admin/app/model/add/" class="addlink">Add</a></li>
                </ul>
                <button>Some Button</button>
            `;
            initializeDOMAndRunScript(html);

            document.querySelector('button').focus();

            const addLink = document.querySelector('.object-tools .addlink');
            const clickSpy = jest.spyOn(addLink, 'click').mockImplementation(() => {});

            const event = new KeyboardEvent('keydown', {key: 'n', bubbles: true});
            document.body.dispatchEvent(event);

            expect(clickSpy).toHaveBeenCalled();

            clickSpy.mockRestore();
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
                const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
                document.body.dispatchEvent(event);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
                preventDefaultSpy.mockRestore();
            }).not.toThrow();
        });
    });
});
