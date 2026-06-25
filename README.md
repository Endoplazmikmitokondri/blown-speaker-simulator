# Blown Speaker Simulator
Turn your browser tab into a cheap, blown-out car subwoofer! This Chrome Extension uses the Web Audio API to capture tab audio, heavily boost the low-end frequencies, and apply dynamic wave-shaping distortion.

## Features
* Real-time audio distortion using BiquadFilter and WaveShaper nodes.
* Adjustable distortion level slider with memory.
* Lightweight, using Manifest V3 offscreen API.

## Usage

1. Navigate to a tab actively playing audio (e.g., YouTube, Spotify).
2. Open the extension menu and click **Blow the Speakers!**.
3. Use the **Distortion Level** slider to adjust the intensity of the wave-shaping effect in real-time.
4. Click **Stop Audio / Normal** to terminate the audio processing and revert to the original output.

**Volume Warning & Best Practices:**
This extension utilizes a heavy gain stage (+28dB) followed by a hard-clipping distortion filter to isolate and overdrive low-end frequencies. Consequently, the digital audio output can peak at extremely high levels. 

To prevent sudden audio clipping and protect your equipment, **reduce the media player's internal volume (e.g., the YouTube volume slider) to 20-30%** before initiating the effect. Rely on your operating system's master volume for overall loudness.