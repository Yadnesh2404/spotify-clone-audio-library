// DOM Elements
const audioElement = document.getElementById('audio-element');
const trackList = document.querySelector('.track-list');
const currentTrackElement = document.getElementById('current-track');
const currentArtistElement = document.getElementById('current-artist');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const playlistCards = document.querySelectorAll('.playlist-card');
const trackArtElement = document.querySelector('.track-art');
const playerControls = document.querySelector('.player-controls');

// Audio Player Controls
let isPlaying = false;
let currentPlaylist = 'hip-hop'; // Default playlist
let useRenamedFiles = true; // Set to true to use track1.mp3, track2.mp3, etc.
let currentTrackIndex = 0;
// Create custom player controls
playerControls.innerHTML = `
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress"></div>
    </div>
    <div class="time-info">
      <span id="current-time">0:00</span>
      <span>/</span>
      <span id="duration">0:00</span>
    </div>
  </div>
  <div class="control-buttons">
    <button id="prev-button" class="control-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="19 20 9 12 19 4 19 20"></polygon>
        <line x1="5" y1="19" x2="5" y2="5"></line>
      </svg>
    </button>
    <button id="play-pause-button" class="control-button">
      <svg id="play-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <svg id="pause-icon" class="hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </button>
    <button id="next-button" class="control-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 4 15 12 5 20 5 4"></polygon>
        <line x1="19" y1="5" x2="19" y2="19"></line>
      </svg>
    </button>
  </div>
  <div class="volume-control">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
    <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1">
  </div>
`;

// Get new control elements
const playPauseButton = document.getElementById('play-pause-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.querySelector('.progress');
const currentTimeElement = document.getElementById('current-time');
const durationElement = document.getElementById('duration');

// Hide native audio controls
audioElement.removeAttribute('controls');

// Navigation
navItems.forEach(item => {
  item.addEventListener('click', () => {
    // Update active nav item
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');

    // Show corresponding section
    const sectionId = item.dataset.section;
    sections.forEach(section => {
      section.classList.remove('active');
      if (section.id === sectionId) {
        section.classList.add('active');
      }
    });
  });
});

// Initialize track items
const trackItems = document.querySelectorAll('.track-item');

// Play/Pause control
playPauseButton.addEventListener('click', togglePlayPause);

function togglePlayPause() {
  if (audioElement.paused) {
    audioElement.play();
  } else {
    audioElement.pause();
  }
}

// Update play/pause icons
audioElement.addEventListener('play', () => {
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  isPlaying = true;
});

audioElement.addEventListener('pause', () => {
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
  isPlaying = false;
});

// Update progress bar
audioElement.addEventListener('timeupdate', updateProgress);

function updateProgress() {
  const duration = audioElement.duration;
  const currentTime = audioElement.currentTime;
  const progressPercent = (currentTime / duration) * 100;
  
  progressBar.style.width = `${progressPercent}%`;
  
  // Update time display
  currentTimeElement.textContent = formatTime(currentTime);
  if (!isNaN(duration)) {
    durationElement.textContent = formatTime(duration);
  }
}

// Format time in mm:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Volume control
volumeSlider.addEventListener('input', () => {
  audioElement.volume = volumeSlider.value;
});

// Click on progress bar to seek
document.querySelector('.progress-bar').addEventListener('click', setProgress);

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioElement.duration;
  
  audioElement.currentTime = (clickX / width) * duration;
}

// Track functionality
trackItems.forEach((track, index) => {
  track.addEventListener('click', () => {
    playTrack(track);
  });
});

// Add a preload audio element for the next track
const preloadAudioElement = new Audio();

// Function to play a track
function playTrack(trackElement) {
  // Update UI for currently playing track
  document.querySelectorAll('.track-item').forEach(item => {
    item.classList.remove('playing');
  });
  trackElement.classList.add('playing');
  
  // Get track source
  const trackSrc = trackElement.dataset.src;
  console.log(`Attempting to play track: ${trackSrc}`);
  
  // Get track details
  const titleElement = trackElement.querySelector('.track-title');
  const artistElement = trackElement.querySelector('.track-artist');
  
  // Get track title and artist
  const trackTitle = titleElement ? titleElement.textContent : 'Unknown Title';
  const trackArtist = artistElement ? artistElement.textContent : 'Unknown Artist';
  
  // Update player bar info
  currentTrackElement.textContent = trackTitle;
  currentArtistElement.textContent = trackArtist;
  
  // Set track art based on current playlist
  const trackArtElement = document.querySelector('.track-art');
  
  if (currentPlaylist === 'hip-hop') {
    trackArtElement.innerHTML = '<img src="images/hip-hop.jpg" alt="Hip Hop" class="track-art-img">';
  } else if (currentPlaylist === 'bollywood-hits') {
    trackArtElement.innerHTML = '<img src="images/bollywood-hits.jpg" alt="Bollywood Hits" class="track-art-img">';
  } else if (currentPlaylist === 'marathi-hits') {
    trackArtElement.innerHTML = '<img src="images/marathi-hits.jpg" alt="Marathi Hits" class="track-art-img">';
  } else {
    trackArtElement.innerHTML = '<span class="track-art-emoji">🎵</span>';
  }
  
  // Show loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.textContent = 'Loading...';
  trackElement.appendChild(loadingIndicator);
  
  // Update buffer progress indicator
  document.querySelector('.progress-container').classList.add('loading');
  
  // Set the audio source and play
  audioElement.src = trackSrc;
  
  // Listen for buffering progress
  audioElement.addEventListener('progress', updateBufferProgress);
  
  // Start playing the track
  audioElement.play().catch(error => {
    console.error('Error playing audio:', error);
    // Only show alert if it's not a network error
    if (error.name !== 'NotFoundError' && error.name !== 'NotAllowedError') {
      alert('Could not play the audio file. The format may not be supported.');
    }
    
    // Remove playing class if there's an unrecoverable error
    if (error.name === 'NotSupportedError') {
      trackElement.classList.remove('playing');
    }
    
    // Remove loading indicator
    trackElement.querySelector('.loading-indicator')?.remove();
    document.querySelector('.progress-container').classList.remove('loading');
  });
  
  // Remove loading indicator when playback starts
  audioElement.onplaying = () => {
    trackElement.querySelector('.loading-indicator')?.remove();
    document.querySelector('.progress-container').classList.remove('loading');
    
    // Preload the next track
    preloadNextTrack();
  };
  
  // Enable player controls
  playPauseButton.disabled = false;
  nextButton.disabled = false;
  prevButton.disabled = false;
  
  // Show pause icon and hide play icon instead of changing HTML
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  playPauseButton.setAttribute('title', 'Pause');
  
  // Update current track index for next/prev functionality
  const trackItems = Array.from(document.querySelectorAll('.track-item'));
  currentTrackIndex = trackItems.indexOf(trackElement);
}

// Function to update buffer progress
function updateBufferProgress() {
  if (!audioElement.buffered.length) return;
  
  const bufferedEnd = audioElement.buffered.end(audioElement.buffered.length - 1);
  const duration = audioElement.duration;
  const bufferedPercent = (bufferedEnd / duration) * 100;
  
  // Update buffer progress bar
  const bufferBar = document.querySelector('.buffer-progress');
  if (bufferBar) {
    bufferBar.style.width = `${bufferedPercent}%`;
  }
}

// Function to preload the next track
function preloadNextTrack() {
  const trackItems = Array.from(document.querySelectorAll('.track-item'));
  if (trackItems.length === 0) return;
  
  // Calculate the index of the next track
  const nextIndex = (currentTrackIndex + 1) % trackItems.length;
  
  // Get the next track element
  const nextTrack = trackItems[nextIndex];
  if (nextTrack) {
    // Get the source URL of the next track
    const nextTrackSrc = nextTrack.dataset.src;
    
    // Set it as the source of the preload audio element
    preloadAudioElement.src = nextTrackSrc;
    
    // Begin loading the audio file
    preloadAudioElement.load();
    console.log(`Preloading next track: ${nextTrackSrc}`);
  }
}

// Next and Previous buttons
nextButton.addEventListener('click', playNextTrack);
prevButton.addEventListener('click', playPrevTrack);

// Function to play the next track
function playNextTrack() {
  const trackItems = Array.from(document.querySelectorAll('.track-item'));
  if (trackItems.length === 0) return;
  
  // Increment index or loop back to the beginning
  currentTrackIndex = (currentTrackIndex + 1) % trackItems.length;
  
  // Play the next track
  const nextTrack = trackItems[currentTrackIndex];
  if (nextTrack) {
    playTrack(nextTrack);
  }
}

// Function to play the previous track
function playPrevTrack() {
  const trackItems = Array.from(document.querySelectorAll('.track-item'));
  if (trackItems.length === 0) return;
  
  // Decrement index or loop back to the end
  currentTrackIndex = (currentTrackIndex - 1 + trackItems.length) % trackItems.length;
  
  // Play the previous track
  const prevTrack = trackItems[currentTrackIndex];
  if (prevTrack) {
    playTrack(prevTrack);
  }
}

// Auto-play next track
audioElement.addEventListener('ended', playNextTrack);

// Playlist Cards
playlistCards.forEach(card => {
  card.addEventListener('click', () => {
    // Switch to playlists section
    navItems.forEach(nav => {
      if (nav.dataset.section === 'playlists') {
        nav.click();
      }
    });
    
    // Get playlist ID from card data attribute
    const playlistId = card.dataset.playlist;
    
    // Update sidebar playlist links active state
    playlistLinks.forEach(pl => {
      if (pl.dataset.playlist === playlistId) {
        pl.classList.add('active');
      } else {
        pl.classList.remove('active');
      }
    });
    
    // Load tracks for the selected playlist
    loadPlaylistTracks(playlistId);
  });
});

// Add functionality for playlist links in sidebar
const playlistLinks = document.querySelectorAll('.playlist-link');
playlistLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Switch to playlists section
    navItems.forEach(nav => {
      if (nav.dataset.section === 'playlists') {
        nav.click();
      }
    });
    
    // Update playlist links active state
    playlistLinks.forEach(pl => pl.classList.remove('active'));
    link.classList.add('active');
    
    // Load tracks for the selected playlist
    loadPlaylistTracks(link.dataset.playlist);
  });
});

// Add functionality to the "Play All" button
const playAllButton = document.querySelector('.btn-play-all');
playAllButton.addEventListener('click', () => {
  const firstTrack = document.querySelector('.track-item');
  if (firstTrack) {
    playTrack(firstTrack);
  } else {
    alert('No tracks available in this playlist.');
  }
});

// Initialize all tracks on the page, not just in one section
const allTrackItems = document.querySelectorAll('.track-item');
allTrackItems.forEach((track, index) => {
  track.addEventListener('click', () => {
    playTrack(track);
  });
});

// Mobile Menu Toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const container = document.querySelector('.container');

// Function to toggle sidebar
function toggleSidebar() {
  container.classList.toggle('sidebar-open');
  document.body.classList.toggle('no-scroll');
}

// Event listeners for mobile menu
if (mobileMenuButton) {
  mobileMenuButton.addEventListener('click', toggleSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', toggleSidebar);
}

// Close sidebar when clicking a nav item on mobile
const allSidebarClickables = document.querySelectorAll('.nav-item, .playlist-link');
allSidebarClickables.forEach(item => {
  item.addEventListener('click', () => {
    // Only execute on mobile
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  });
});

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && container.classList.contains('sidebar-open')) {
    container.classList.remove('sidebar-open');
    document.body.classList.remove('no-scroll');
  }
});

// Load tracks for the selected playlist
function loadPlaylistTracks(playlistId) {
  console.log(`Loading playlist: ${playlistId}`);
  currentPlaylist = playlistId;

  // Clear existing tracks
  trackList.innerHTML = '';
  
  // Create mapping of playlist descriptions
  const descriptions = {
    'hip-hop': 'Hip Hop tracks collection',
    'bollywood-hits': 'Popular Bollywood songs - Selected Top Hits',
    'marathi-hits': 'Best Marathi songs collection - Selected Top Hits',
    'playlist4': 'Add your custom tracks to Playlist 4'
  };
  
  // Update playlist title and description
  document.querySelector('#playlists .section-title').textContent = 
    playlistId === 'hip-hop' ? 'Hip Hop' :
    playlistId === 'bollywood-hits' ? 'Bollywood Hits' :
    playlistId === 'marathi-hits' ? 'Marathi Hits' : 'Playlist 4';
  
  document.querySelector('.playlist-description').textContent = descriptions[playlistId] || '';

  if (useRenamedFiles) {
    console.log('Using renamed files (track1.mp3, track2.mp3, etc.)');
    
    // Define track lists for each playlist
    if (playlistId === 'hip-hop') {
      const tracks = [
        { title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:22' },
        { title: 'Die For You', artist: 'The Weeknd', duration: '4:10' },
        { title: 'Everybody Dies In Their Nightmares', artist: 'XXXTENTACION', duration: '1:58' },
        { title: 'FE!N (feat. Playboi Carti)', artist: 'Travis Scott', duration: '3:04' },
        { title: 'God\'s Plan', artist: 'Drake', duration: '3:19' },
        { title: 'Hope', artist: 'XXXTENTACION', duration: '1:50' },
        { title: 'Jimmy Cooks (feat. 21 Savage)', artist: 'Drake', duration: '3:38' },
        { title: 'luther (with sza)', artist: 'Don Toliver', duration: '2:53' },
        { title: 'Moonlight', artist: 'XXXTENTACION', duration: '2:15' },
        { title: 'Not Like Us', artist: 'Kendrick Lamar', duration: '4:38' },
        { title: 'peekaboo (feat. azchike)', artist: 'Kodak Black', duration: '2:33' },
        { title: 'SAD!', artist: 'XXXTENTACION', duration: '2:46' },
        { title: 'squabble up', artist: 'Kendrick Lamar', duration: '2:35' },
        { title: 'Starboy', artist: 'The Weeknd', duration: '3:51' },
        { title: 'tv off (feat. lefty gunplay)', artist: 'Drake', duration: '3:42' }
      ];
      
      // Create HTML for each track with renamed files
      tracks.forEach((track, index) => {
        createTrackElementWithNumberedFile(track, index, playlistId);
      });
    } else if (playlistId === 'bollywood-hits') {
      // Reduced from 14 to 9 tracks
      const tracks = [
        { title: 'Apna Bana Le', artist: 'Arijit Singh', duration: '4:25' },
        { title: 'Baarishein', artist: 'Anuv Jain', duration: '3:30' },
        { title: 'Dekhha Tenu (From "Mr. And Mrs. Mahi"))', artist: 'Jaani', duration: '4:41' },
        { title: 'Heeriye (feat. Arijit Singh)', artist: 'Jasleen Royal; Arijit Singh; Dulquer Salmaan; ', duration: '3:14' },
        { title: 'Husn', artist: 'Anuv Jain', duration: '3:37' },
        { title: 'Jo Tum Mere Ho', artist: 'Anuv Jain', duration: '4:11' },
        { title: 'Lambiya Judaiyan', artist: 'Bilal Saeed', duration: '3:12' },
        { title: 'Maula Mere Maula', artist: 'Roop Kumar Rathod', duration: '6:04' },
        { title: 'Naina (From "Crew")', artist: 'Diljit Dosanjh; Badshah; Raj Ranjodh', duration: '3:00' }
      ];
      
      // Create HTML for each track with renamed files
      tracks.forEach((track, index) => {
        createTrackElementWithNumberedFile(track, index, playlistId);
      });
    } else if (playlistId === 'marathi-hits') {
      // Reduced from 15 to 10 tracks
      const tracks = [
        { title: 'Shoor Amhi Sardar', artist: 'Ajay-Atul', duration: '3:55' },
        { title: 'Aga Aga Pori Faslis Ga', artist: 'Suresh Wadkar', duration: '4:24' },
        { title: 'Bai Bai Manmoracha', artist: 'Ajay-Atul', duration: '5:24' },
        { title: 'Dis Jatil Dis Yetil', artist: 'Avdhoot Gupte', duration: '4:05' },
        { title: 'Hi Chaal Turu Turu', artist: 'Shankar Mahadevan', duration: '4:15' },
        { title: 'Ekach Hya Janmi Janu', artist: 'Sonu Nigam', duration: '5:22' },
        { title: 'Reshmachya Reghani', artist: 'Shreya Ghoshal', duration: '4:30' },
        { title: 'Hi Navri Asli', artist: 'Ajay-Atul', duration: '5:05' },
        { title: 'Jambhul Pikalya Zadakhali', artist: 'Asha Bhosle; Ravindra', duration: '4:13' },
        { title: 'Labhale Aamhas Bhagya', artist: 'Ajay-Atul', duration: '8:15' }
      ];
      
      // Create HTML for each track with renamed files
      tracks.forEach((track, index) => {
        createTrackElementWithNumberedFile(track, index, playlistId);
      });
    } else {
      // Show empty state message for other playlists
      trackList.innerHTML = '<p>No tracks have been added to this playlist yet.</p>';
    }
  } else {
    console.log('Using original file names');
    // Check if there are any audio files in the folder
    trackList.innerHTML = '<p>No tracks found in this playlist. Please add audio files to the corresponding folder.</p>';
  }
}

// Helper function to create track elements with track numbers instead of file names
function createTrackElementWithNumberedFile(track, index, folderPath) {
  const trackElement = document.createElement('div');
  trackElement.className = 'track-item';
  
  // Use track number for the file name - Update to relative path
  trackElement.dataset.src = `audio/${folderPath}/track${index + 1}.mp3`;
  
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
}

// Function to toggle between original and renamed file modes
function toggleFileNamingMode() {
  useRenamedFiles = !useRenamedFiles;
  console.log(`File naming mode set to: ${useRenamedFiles ? 'Track Numbers' : 'Original Names'}`);
  
  // Reload the current playlist if one is active
  if (currentPlaylist) {
    loadPlaylistTracks(currentPlaylist);
  }
}

// IMPORTANT: After renaming your files using the rename-songs.ps1 script,
// run the following in the browser console to switch to track number mode:
// toggleFileNamingMode();

// Load default playlist on page load
window.addEventListener('load', () => {
  console.log('Page loaded, loading default playlist');
  
  // Set the first playlist link as active
  if (playlistLinks.length > 0) {
    playlistLinks[0].classList.add('active');
    
    // Load the first playlist
    const defaultPlaylist = playlistLinks[0].dataset.playlist;
    console.log('Loading default playlist:', defaultPlaylist);
    loadPlaylistTracks(defaultPlaylist);
  }
});

// Helper function to check if an audio file exists
function checkAudioFileStatus(url) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.open('HEAD', url, true);
    http.onreadystatechange = function() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          console.log(`File exists: ${url}`);
          resolve(true);
        } else {
          console.warn(`File does not exist: ${url}`);
          resolve(false);
        }
      }
    };
    http.onerror = function() {
      console.error(`Error checking file: ${url}`);
      reject(new Error('Network error when checking file'));
    };
    http.send();
  });
}

// Create buffer progress bar if it doesn't exist
if (!document.querySelector('.buffer-progress')) {
  const progressBar = document.querySelector('.progress-bar');
  const bufferProgress = document.createElement('div');
  bufferProgress.className = 'buffer-progress';
  progressBar.insertBefore(bufferProgress, progressBar.firstChild);
}