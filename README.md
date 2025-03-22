# Spotify Clone - Audio Library

A streamlined web-based audio library application inspired by Spotify. This project includes a responsive user interface with playlist management and audio playback functionality, focused on simplicity.

## Features

- 🎵 Browse and play audio tracks from different playlists
- 🎧 Custom audio player with play/pause, next/previous, and volume controls
- 📱 Responsive design that works on desktop and mobile devices
- 🌙 Beautiful dark-themed UI similar to popular music streaming services

## Technologies Used

- Vanilla JavaScript
- HTML5 Audio API
- CSS3 with modern flexbox layout
- Vite for fast development and bundling

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `index.html` - Main application structure and layout
- `main.js` - Core application logic and event handlers
- `style.css` - Application styling
- `public/audio/` - Directory containing audio files organized by genre

## Adding Your Music

1. Place your audio files in the appropriate folders under `/public/audio/`
2. Rename files to match the track numbering (track1.mp3, track2.mp3, etc.)
3. Update the track information in `main.js` to match your files

## Custom Playlist Images

The application now supports custom images for playlists. To add custom images:

1. Place your image files in the `/public/images/` directory
2. For the Hip Hop playlist, replace the placeholder file at `/public/images/hip-hop.jpg` with your preferred image
3. Make sure your image has a good aspect ratio (1:1 recommended) for best display

For more detailed instructions on adding music and customizing playlists, please refer to the GUIDE.md file.

## Manual Management

This application is designed to be simple and directly managed. Playlist tracks are added manually by placing files in the appropriate folders and updating the track information in the HTML if needed.

## Building for Production

To create a production build:

```
npm run build
```

The build files will be generated in the `dist` directory.

## License

This project is open source and available under the MIT License. 