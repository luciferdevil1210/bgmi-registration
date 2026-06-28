# AirPilot Gesture Control

AirPilot is a browser-based prototype for controlling an interactive laptop-style workspace with hand and finger gestures.
It uses the webcam with MediaPipe Hands to move a virtual cursor, click with a pinch, scroll with two fingers, and run file/folder/text commands.

## Run locally

Because camera APIs require a secure context, serve the folder through localhost instead of opening `index.html` directly:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> and allow camera access.

## Gesture controls

- Point with the index finger to move the cursor.
- Pinch thumb and index finger to click.
- Raise index and middle fingers to scroll.
- Show an open palm to safely hover without clicking.
- Make a fist to jump to the workspace.
- Raise three fingers to run the text command.

## Full laptop control note

Browsers cannot directly control every operating-system window, file, folder, or text field for security reasons.
This prototype demonstrates the interface and interaction model; full laptop control would require a trusted desktop app with accessibility permissions.
