# Audio Files

This directory is where you should place your audio files to make the audio library work.

## Directory Structure

Please organize your audio files as follows:

```
public/audio/
  ├── playlist1/
  │   ├── track1.mp3
  │   ├── track2.mp3
  │   └── track3.mp3
  │   
  ├── playlist2/
  │   ├── track1.mp3
  │   ├── track2.mp3
  │   └── track3.mp3
  │   
  ├── playlist3/
  │   ├── track1.mp3
  │   ├── track2.mp3
  │   └── track3.mp3
  │
  └── playlist4/
      ├── track1.mp3
      ├── track2.mp3
      └── track3.mp3
```

## Important Notes

1. File names must follow the pattern `track1.mp3`, `track2.mp3`, etc.
2. Files must be in MP3 format for maximum compatibility
3. The application expects at least 3 tracks per playlist for optimal performance

You can add your own music by placing MP3 files in these directories. Make sure you have the proper rights or licenses to use any audio files you add.

## Testing the Application Without Audio Files

If you just want to test the UI without adding actual audio files, the application will still load and you'll be able to click on tracks, but no sound will play. 