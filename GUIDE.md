# Guide: How to Add Playlists and Tracks

This guide explains how to manually add playlists and tracks to your audio library.

## Adding Audio Files

1. Navigate to the `public/audio/` directory
2. Choose an existing genre folder (electronic, ambient, classical, jazz, rock) or create a new one
3. Place your MP3 files in the appropriate folder
4. Name your files sequentially: `track1.mp3`, `track2.mp3`, etc.

## Adding a New Playlist

To add a new playlist, you'll need to update the HTML, JavaScript, and create a matching folder for audio files.

### Step 1: Create a folder for your playlist

Create a new folder in `public/audio/` with your playlist name (use lowercase and no spaces).

For example: `public/audio/country/`

### Step 2: Add your playlist to the sidebar menu

Open `index.html` and locate the playlist menu section:

```html
<div class="nav-section">
  <h2 class="nav-title">Playlists</h2>
  <ul class="playlist-menu">
    <li class="playlist-link" data-playlist="electronic">Electronic Mix</li>
    <li class="playlist-link" data-playlist="ambient">Ambient Sounds</li>
    <li class="playlist-link" data-playlist="classical">Classical Collection</li>
    <li class="playlist-link" data-playlist="jazz">Jazz Essentials</li>
    <li class="playlist-link" data-playlist="rock">Rock Classics</li>
  </ul>
</div>
```

Add a new line for your playlist:

```html
<li class="playlist-link" data-playlist="country">Country Hits</li>
```

Make sure the `data-playlist` attribute matches your folder name.

### Step 3: Add your playlist to the Home section

Locate the playlist grid in the Home section:

```html
<div class="playlist-grid">
  <div class="playlist-card" data-playlist="electronic">
    <div class="playlist-art">🎧</div>
    <div class="playlist-title">Electronic Mix</div>
    <div class="playlist-info">12 tracks</div>
  </div>
  <!-- Other playlist cards -->
</div>
```

Add a new card for your playlist:

```html
<div class="playlist-card" data-playlist="country">
  <div class="playlist-art">🤠</div>
  <div class="playlist-title">Country Hits</div>
  <div class="playlist-info">8 tracks</div>
</div>
```

Choose an appropriate emoji for your playlist art and update the track count.

### Step 4: Add your playlist to the tracks data

Open `main.js` and locate the tracks data object in the `loadPlaylistTracks` function:

```javascript
const tracks = {
  'electronic': [
    { title: 'Digital Dreams', artist: 'Electronic', duration: '3:24' },
    // more tracks...
  ],
  // other playlists...
};
```

Add your new playlist's tracks:

```javascript
'country': [
  { title: 'Country Roads', artist: 'Country', duration: '3:18' },
  { title: 'Jolene', artist: 'Country', duration: '2:41' },
  { title: 'Ring of Fire', artist: 'Country', duration: '2:35' },
  // Add more tracks as needed
]
```

### Step 5: Add a description for your playlist

In the same function, find the descriptions object:

```javascript
const descriptions = {
  'electronic': 'A collection of electronic tracks to energize your day',
  // other descriptions...
};
```

Add a description for your new playlist:

```javascript
'country': 'Classic country hits and modern favorites',
```

## Customizing Track Information

The track information is now generated dynamically from the JavaScript data. To customize it:

1. Find the tracks object in the `loadPlaylistTracks` function in `main.js`
2. Update the track titles, artists, and durations for each playlist
3. Make sure your audio files match the order of the tracks in the data

## How the Playlist System Works

When you click on a playlist (either from the sidebar or the home page):

1. The system switches to the Playlists section
2. It updates the playlist title and description
3. It generates track elements based on the selected playlist's data
4. The audio paths are set to `/audio/[playlist-name]/track[number].mp3`

## Adding Custom Playlist Images

The application now supports custom images for playlists. Here's how to add and manage playlist images:

### Replacing the Hip Hop Playlist Image

1. Prepare a square image (1:1 aspect ratio) for the best visual result
2. Place your image in the `/public/images/` directory
3. Name the file `hip-hop.jpg` to replace the default Hip Hop playlist image
4. Refresh the application to see your new image

### Adding Images for Other Playlists

If you want to add images for other playlists:

1. Add your image to the `/public/images/` directory (e.g., `rock.jpg`, `jazz.jpg`)
2. Update the HTML in `index.html` for the playlist card:
   ```html
   <div class="playlist-card" data-playlist="jazz">
     <div class="playlist-art">
       <img src="/images/jazz.jpg" alt="Jazz Playlist" class="playlist-image">
     </div>
     <div class="playlist-title">Jazz Essentials</div>
     <div class="playlist-info">10 tracks</div>
   </div>
   ```
3. Update the `playTrack` function in `main.js` to use the image:
   ```javascript
   // Inside the playTrack function
   if (sectionTitle.includes('Jazz') || currentPlaylist === 'jazz') {
     trackArtElement.innerHTML = '<img src="/images/jazz.jpg" alt="Jazz" class="track-art-img">';
   } else {
     // other conditions...
   }
   ```

## Tips for Good Playlist Images

- Use square images with 300x300 pixels or higher resolution
- Choose images that represent the mood or genre of the playlist
- Use JPG format for photos and PNG for graphics with transparency
- Keep file sizes reasonable (under 200KB) for faster loading

## Important Notes

1. Make sure all audio files are in MP3 format
2. Keep file names sequential (track1.mp3, track2.mp3, etc.)
3. Ensure all paths and folder names are lowercase with no spaces
4. After making changes to the HTML or JavaScript, refresh the application to see them
5. The "Play All" button will play the first track in the current playlist 