// DOM Elements
const audioElement = document.getElementById('audio-element');
const currentTrackElement = document.getElementById('current-track');
const currentArtistElement = document.getElementById('current-artist');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const playlistCards = document.querySelectorAll('.playlist-card');
const trackArtElement = document.querySelector('.track-art');
const playerControls = document.querySelector('.player-controls');

// Audio Player Controls
let isPlaying = false;
let currentPlaylist = 'electronic'; // Default playlist

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

function playTrack(track) {
  // Remove active class from all tracks
  trackItems.forEach(t => t.classList.remove('active'));
  
  // Add active class to clicked track
  track.classList.add('active');
  
  // Update audio source
  const audioSrc = track.dataset.src;
  audioElement.src = audioSrc;
  
  // Update now playing info
  currentTrackElement.textContent = track.querySelector('.track-title').textContent;
  currentArtistElement.textContent = track.querySelector('.track-artist').textContent;
  
  // Set playlist image or emoji in track art
  const sectionTitle = track.closest('.section').querySelector('.section-title').textContent;
  if (sectionTitle.includes('Hip Hop') || currentPlaylist === 'electronic') {
    trackArtElement.innerHTML = '<img src="/images/hip-hop.jpg" alt="Hip Hop" class="track-art-img">';
  } else {
    const emoji = sectionTitle.includes('Bollywood') ? '🎬' : 
                 sectionTitle.includes('Classical') ? '🎹' : 
                 sectionTitle.includes('Jazz') ? '🎷' : '🎸';
                 
    trackArtElement.innerHTML = emoji;
  }
  
  // Play the audio
  audioElement.play();
}

// Next and Previous buttons
nextButton.addEventListener('click', playNextTrack);
prevButton.addEventListener('click', playPrevTrack);

function playNextTrack() {
  const currentTrack = document.querySelector('.track-item.active');
  const nextTrack = currentTrack ? currentTrack.nextElementSibling : null;
  
  if (nextTrack && nextTrack.classList.contains('track-item')) {
    playTrack(nextTrack);
  } else {
    // If no next track, go back to first track in the playlist
    const firstTrack = document.querySelector('.track-list .track-item');
    if (firstTrack) {
      playTrack(firstTrack);
    }
  }
}

function playPrevTrack() {
  const currentTrack = document.querySelector('.track-item.active');
  const prevTrack = currentTrack ? currentTrack.previousElementSibling : null;
  
  if (prevTrack && prevTrack.classList.contains('track-item')) {
    playTrack(prevTrack);
  } else {
    // If no previous track, go to last track in the playlist
    const allTracks = document.querySelectorAll('.track-list .track-item');
    const lastTrack = allTracks[allTracks.length - 1];
    if (lastTrack) {
      playTrack(lastTrack);
    }
  }
}

// Auto-play next track
audioElement.addEventListener('ended', playNextTrack);

// Playlist Cards
playlistCards.forEach(card => {
  card.addEventListener('click', () => {
    // Get the playlist ID
    const playlistId = card.dataset.playlist;
    
    // Find the corresponding playlist link in the sidebar and add active class
    playlistLinks.forEach(link => {
      if (link.dataset.playlist === playlistId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Switch to playlists section
    navItems.forEach(nav => {
      if (nav.dataset.section === 'playlists') {
        nav.click();
      }
    });
    
    // Load tracks for the selected playlist
    loadPlaylistTracks(playlistId);
  });
});

// Function to load playlist tracks (in a real app, this would fetch from an API)
function loadPlaylistTracks(playlistId) {
  currentPlaylist = playlistId;
  
  // Update the playlist title and description
  const playlistName = document.querySelector(`.playlist-link[data-playlist="${playlistId}"]`).textContent;
  document.querySelector('#playlists .section-title').textContent = playlistName;
  
  // Update playlist description based on the selected playlist
  const descriptions = {
    'electronic': 'Vibrant beats and rhymes from top Hip Hop artists',
    'ambient': 'Popular songs from Bollywood movies and Indian artists',
    'classical': 'Timeless classical compositions from renowned composers',
    'jazz': 'Smooth jazz tunes for a sophisticated listening experience',
    'rock': 'Classic rock hits that defined generations'
  };
  
  const playlistDescription = document.querySelector('.playlist-description');
  if (playlistDescription) {
    playlistDescription.textContent = descriptions[playlistId] || `A collection of ${playlistName} tracks`;
  }
  
  // Clear existing tracks
  const trackList = document.querySelector('#playlists .track-list');
  
  // Create some example tracks for each playlist
  // In a real app, this would load from a database or API
  const tracks = {
    'electronic': [
      { title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:22' },
      { title: 'Die For You', artist: 'The Weeknd', duration: '4:20' },
      { title: 'Everybody Dies In Their Nightmares', artist: 'XXXTENTACION', duration: '1:36' },
      { title: 'FE!N', artist: 'Travis Scott feat. Playboi Carti', duration: '3:09' },
      { title: 'God\'s Plan', artist: 'Drake', duration: '3:19' },
      { title: 'Hope', artist: 'XXXTENTACION', duration: '1:50' },
      { title: 'Jimmy Cooks', artist: 'Drake feat. 21 Savage', duration: '3:38' },
      { title: 'luther', artist: 'Kendrick Lamar with SZA', duration: '2:56' },
      { title: 'Moonlight', artist: 'XXXTENTACION', duration: '2:15' },
      { title: 'Not Like Us', artist: 'Kendrick Lamar', duration: '4:42' },
      { title: 'peekaboo', artist: 'Kendrick Lamar feat. azchike', duration: '2:36' },
      { title: 'SAD!', artist: 'XXXTENTACION', duration: '2:46' },
      { title: 'squabble up', artist: 'Kendrick Lamar', duration: '2:39' },
      { title: 'Starboy', artist: 'The Weeknd', duration: '3:50' },
      { title: 'tv off', artist: 'Kendrick Lamar feat. lefty gunplay', duration: '3:41' }
    ],
    'ambient': [
      { title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh', duration: '6:30' },
      { title: 'Kal Ho Naa Ho', artist: 'Sonu Nigam', duration: '5:21' },
      { title: 'Tum Hi Ho', artist: 'Arijit Singh', duration: '4:22' },
      { title: 'Senorita', artist: 'Farhan Akhtar', duration: '3:48' }
    ],
    'classical': [
      { title: 'Moonlight Sonata', artist: 'Classical', duration: '5:48' },
      { title: 'Four Seasons: Spring', artist: 'Classical', duration: '6:24' },
      { title: 'Symphony No. 5', artist: 'Classical', duration: '7:15' },
      { title: 'Claire de Lune', artist: 'Classical', duration: '4:52' },
      { title: 'Nocturne Op. 9', artist: 'Classical', duration: '5:37' }
    ],
    'jazz': [
      { title: 'Blue in Green', artist: 'Jazz', duration: '4:45' },
      { title: 'Take Five', artist: 'Jazz', duration: '5:24' },
      { title: 'Autumn Leaves', artist: 'Jazz', duration: '4:18' },
      { title: 'Misty', artist: 'Jazz', duration: '3:53' }
    ],
    'rock': [
      { title: 'Stairway to Heaven', artist: 'Rock', duration: '8:02' },
      { title: 'Bohemian Rhapsody', artist: 'Rock', duration: '5:55' },
      { title: 'Sweet Child O\' Mine', artist: 'Rock', duration: '5:56' },
      { title: 'Hotel California', artist: 'Rock', duration: '6:30' },
      { title: 'Back in Black', artist: 'Rock', duration: '4:15' }
    ]
  };
  
  // Use the tracks for the selected playlist, or fallback to electronic if not found
  const playlistTracks = tracks[playlistId] || tracks['electronic'];
  
  // Clear existing HTML
  trackList.innerHTML = '';
  
  // Create HTML for each track
  playlistTracks.forEach((track, index) => {
    const trackElement = document.createElement('div');
    trackElement.className = 'track-item';
    
    // Use hip-hop folder path instead of electronic for the electronic playlist
    const folderPath = playlistId === 'electronic' ? 'hip-hop' : playlistId;
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

// Initialize with default volume
audioElement.volume = volumeSlider.value;

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

// Add functionality for the Play All button
const playAllButton = document.querySelector('.btn-play-all');
if (playAllButton) {
  playAllButton.addEventListener('click', () => {
    const firstTrack = document.querySelector('#playlists .track-item');
    if (firstTrack) {
      playTrack(firstTrack);
    }
  });
}

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