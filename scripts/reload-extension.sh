#!/bin/bash

# Reload Chrome extension using AppleScript
# Reads extension name from manifest.json for single source of truth

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MANIFEST_PATH="$SCRIPT_DIR/../manifest.json"

# Extract extension name from manifest.json
EXTENSION_NAME=$(grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' "$MANIFEST_PATH" | head -1 | sed 's/.*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

if [ -z "$EXTENSION_NAME" ]; then
    echo "⚠️  Could not read extension name from manifest.json"
    exit 0
fi

RESULT=$(osascript 2>&1 <<EOF
-- Save the currently active app to restore later
set previousApp to (path to frontmost application as text)

tell application "Google Chrome"
    activate

    -- Check if extensions page is already open
    set extensionsTabIndex to 0
    set windowIndex to 0

    repeat with w from 1 to (count windows)
        repeat with t from 1 to (count tabs of window w)
            if URL of tab t of window w starts with "chrome://extensions" then
                set extensionsTabIndex to t
                set windowIndex to w
                exit repeat
            end if
        end repeat
        if extensionsTabIndex > 0 then exit repeat
    end repeat

    -- Track if we opened a new tab (so we know to close it)
    set openedNewTab to false

    if extensionsTabIndex > 0 then
        set active tab index of window windowIndex to extensionsTabIndex
        tell active tab of window windowIndex to reload
    else
        tell front window
            make new tab with properties {URL:"chrome://extensions"}
            set openedNewTab to true
        end tell
    end if

    delay 0.5

    -- Execute JavaScript to click the reload button
    tell active tab of front window
        set jsResult to execute javascript "
            (function() {
                const extensionName = '$EXTENSION_NAME';
                const manager = document.querySelector('extensions-manager');
                if (!manager || !manager.shadowRoot) return 'error: no extensions manager found';

                const itemList = manager.shadowRoot.querySelector('extensions-item-list');
                if (!itemList || !itemList.shadowRoot) return 'error: no item list found';

                const items = itemList.shadowRoot.querySelectorAll('extensions-item');
                for (const item of items) {
                    const name = item.shadowRoot.querySelector('#name');
                    if (name && name.textContent.includes(extensionName)) {
                        const reloadBtn = item.shadowRoot.querySelector('#dev-reload-button');
                        if (reloadBtn) {
                            reloadBtn.click();
                            return 'success: ' + extensionName + ' reloaded';
                        }
                        return 'error: reload button not found (is Developer Mode on?)';
                    }
                }
                return 'error: ' + extensionName + ' extension not found';
            })();
        "
    end tell

    -- Close the extensions tab if we opened it
    if openedNewTab then
        delay 0.2
        tell front window
            close active tab
        end tell
    end if
end tell

-- Restore focus to the previous app
delay 0.1
activate application previousApp

return jsResult
EOF
)

if [[ "$RESULT" == *"success"* ]]; then
    echo "✓ $RESULT"
    exit 0
elif [[ "$RESULT" == *"JavaScript through AppleScript is turned off"* ]] || [[ "$RESULT" == *"Apple Events"* ]]; then
    echo ""
    echo "⚠️  Enable JavaScript from AppleScript (one-time setup):"
    echo "   Chrome → View → Developer → Allow JavaScript from Apple Events"
    echo ""
    exit 0
else
    echo "⚠️  $RESULT"
    exit 0
fi
