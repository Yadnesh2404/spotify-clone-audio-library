# Guide: How to Add Playlists and Tracks

This guide explains how to manually add playlists and tracks to your audio library.

## Adding Audio Files

1. Navigate to the `public/audio/` directory
2. Choose one of the numbered playlist folders (playlist1, playlist2, playlist3, playlist4)
3. Place your MP3 files in the appropriate folder
4. Name your files sequentially: `track1.mp3`, `track2.mp3`, etc.

## Customizing Playlists

To customize your playlists, you'll need to update the HTML and JavaScript files.

### Step 1: Add your audio files

Add your MP3 files to the appropriate playlist folder in `public/audio/`.

For example: `public/audio/playlist1/track1.mp3`

### Step 2: Update playlist information

Open `main.js` and locate the descriptions object in the `loadPlaylistTracks` function:

```javascript
const descriptions = {
  'playlist1': 'Add your custom tracks to Playlist 1',
  'playlist2': 'Add your custom tracks to Playlist 2',
  'playlist3': 'Add your custom tracks to Playlist 3',
  'playlist4': 'Add your custom tracks to Playlist 4'
};
```

Customize the descriptions to match your playlist content.

### Step 3: Create track information

To add tracks to a playlist, you need to modify the `loadPlaylistTracks` function in `main.js`. Find this function and add code to create and display tracks for your playlist.

Here's an example of how to add tracks:

```javascript
// After the line: const folderPath = playlistId;

// Replace the empty state message with track listings if there are tracks
if (playlistId === 'playlist1') {
  // Create track list for playlist1
  const tracks = [
    { title: 'My Song 1', artist: 'Artist Name', duration: '3:45' },
    { title: 'My Song 2', artist: 'Artist Name', duration: '4:20' }
    // Add more tracks as needed
  ];
  
  // Clear the empty state
  trackList.innerHTML = '';
  
  // Create HTML for each track
  tracks.forEach((track, index) => {
    const trackElement = document.createElement('div');
    trackElement.className = 'track-item';
    
    trackElement.dataset.src = `/audio/${folderPath}/track${index + 1}.mp3`;
    
    trackElement.innerHTML = `
      <div class="track-info">
        <span class="track-number">${(index + 1).toString().padStart(2, '0')}</span>
        <div class="track-details">
          <div class="track-title">${track.title}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
      </div>
      <div class="track-duration">${track.duration}</div>
    `;
    
    // Add click event to the new track element
    trackElement.addEventListener('click', () => {
      playTrack(trackElement);
    });
    
    trackList.appendChild(trackElement);
  });
}
```

Repeat this pattern for each playlist that has tracks.

## Adding Custom Playlist Images

If you want to add images for your playlists:

1. Add your image to the `/public/images/` directory (e.g., `playlist1.jpg`, `playlist2.jpg`)
2. Update the HTML in `index.html` for the playlist card:
   ```html
   <div class="playlist-card" data-playlist="playlist1">
     <div class="playlist-art">
       <img src="/images/playlist1.jpg" alt="Playlist 1" class="playlist-image">
     </div>
     <div class="playlist-title">Playlist 1</div>
     <div class="playlist-info">0 tracks</div>
   </div>
   ```
3. Update the `playTrack` function in `main.js` to show your image:
   ```javascript
   if (sectionTitle.includes('Playlist 1') || audioSrc.includes('/playlist1/') || currentPlaylist === 'playlist1') {
     trackArtElement.innerHTML = '<img src="/images/playlist1.jpg" alt="Playlist 1" class="track-art-img">';
   }
   ```

## Tips for Good Playlist Images

- Use square images with 300x300 pixels or higher resolution
- Choose images that represent the mood or theme of your playlist
- Use JPG format for photos and PNG for graphics with transparency
- Keep file sizes reasonable (under 200KB) for faster loading

## Important Notes

1. Make sure all audio files are in MP3 format
2. Keep file names sequential (track1.mp3, track2.mp3, etc.)
3. Ensure all paths and folder names are lowercase with no spaces
4. After making changes to the HTML or JavaScript, refresh the application to see them
5. The "Play All" button will play the first track in the current playlist 