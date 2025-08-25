// Update logo rotation
let currentRotation = 0;
let targetRotation = 0;
let rotationOffset = 0;
let currentTime = 0;
function setRotation() {
	// Update rotation target
	targetRotation = currentTime*10;

	// Update current rotation to move toward target
	let delta = ((targetRotation+rotationOffset)-currentRotation)/60;
	currentRotation += delta;

	// Set CSS variable
	const root = document.querySelector('html');
	root.style.setProperty('--animation-rotation', currentRotation + "deg");

	// Loop
	requestAnimationFrame(setRotation);
}
setRotation();

// Rotate on scroll
window.addEventListener('wheel', (e) => {
	if (!initialized) {
		rotationOffset += e.deltaY/10;
	}
})

// Fetch songs
let catalog;
fetch('songs.json')
	.then((response) => response.json())
	.then((json) => {
		catalog = json;
		setTimeout(() => {
			readURL();
		}, 50)
	})

// Generate logo
function generateLogo(text) {
	// Transition out old element
	for (let oldLogo of document.querySelectorAll('.logo-container')) {
		oldLogo.style.setProperty('--animation-rotation', currentRotation + "deg");
		oldLogo.dataset.pos = 'right';
		setTimeout(() => {oldLogo.remove()}, 750);
	}

	// Reset rotation
	currentRotation = 0;
	targetRotation = 0;
	rotationOffset = 0;
	currentTime = 0;

	// Create new element
	let newLogo = document.createElement('div');
	newLogo.classList.add('logo-container');
	newLogo.dataset.pos = 'left';

	// Build letter spans
	let logoLetters = "";
	newLogo.style.setProperty('--logoscale', 1/(text.length/10));
	for (let letter of text) {
		if (letter == " ") {
			letter = "&nbsp;";
		}
		logoLetters += `<span>${letter}</span>`;
	}

	// Build words
	let logoTemp = `<h1 class="logo" style="z-index: 12;">${logoLetters}</h1>`;
	for (let i=1; i<12; i++) {
		logoTemp += `<div class="logo" style="transform: translate(-50%, -50%) rotate(calc(var(--animation-rotation) + ${i*15}deg)); z-index: ${12-i}; filter: hue-rotate(${-i*10}deg)">${logoLetters}</div>`;
	}
	newLogo.innerHTML = logoTemp;

	// Add new logo to DOM
	let logoParent = document.querySelector('.logo-parent');
	logoParent.appendChild(newLogo);

	// Transition in new element
	setTimeout(() => {newLogo.dataset.pos = 'center'}, 25);
}
generateLogo('Jukebox');

// Player object
let player = new Audio();
let currentVolume = 1;
player.volume = currentVolume;
player.addEventListener('ended', () => {
	nextSong();
});
player.addEventListener('timeupdate', () => {
	currentTime = player.currentTime;
	const playbar = document.querySelector('.player-playbar');
	playbar.value = Math.round(currentTime);
	refreshCurrentTime();
});
player.addEventListener('loadeddata', () => {
	const playbar = document.querySelector('.player-playbar');
	playbar.max = Math.round(player.duration);
});

// Format current time for display
function refreshCurrentTime() {
	let minutes = Math.floor(currentTime/60);
	if (minutes < 10) {
		minutes = "0"+minutes;
	}

	let seconds = Math.floor(currentTime%60);
	if (seconds < 10) {
		seconds = "0"+seconds;
	}

	const playerTime = document.querySelector('.player-time');
	let newTime = `${minutes}:${seconds}`;
	let durationHTML = "";
	for (let letter of newTime) {
		durationHTML += `<span>${letter}</span>`;
	}
	playerTime.innerHTML = durationHTML;
}

// Manually play song
let currentAlbum = "";
let currentSong = "";
let currentAlbumData = [];
let songNumber = 0;
let playing = false;
let initialized = false;
function playSong(albumKey, songName, dontPlay) {
	// Activate player
	initialized = true;
	document.querySelector('body').dataset.player = 1;

	// Update variables
	currentAlbum = albumKey;
	currentSong = songName;
	let album = catalog[albumKey];

	// Get song data
	let currentSongData;
	songNumber = 0;
	currentAlbumData = album['songs'];
	for (let song of album['songs']) {
		if (song['name'] == songName) {
			currentSongData = song;
			break
		} else {
			songNumber++;
		}
	}

	// Update player info
	const playerDetails = document.querySelector('.player-info-details');
	const playerSong = document.querySelector('.player-info-song');
	playerDetails.innerHTML = `<span>${catalog[currentAlbum]['name']}</span> <span>${songNumber+1} of ${catalog[currentAlbum]['songs'].length}</span>`;
	playerSong.innerHTML = songName;

	const playerTime = document.querySelector('.player-time');
	playerTime.innerHTML = "00:00";
	
	const playerDuration = document.querySelector('.player-duration');
	playerDuration.innerHTML = currentSongData['duration'];

	// Update player height for mobile artwork position
	const playerElmnt = document.querySelector('.player');
	const body = document.querySelector('body');
	body.style.setProperty('--player-height', `${playerElmnt.offsetHeight}px`);

	// Update artwork
	generateLogo(songName);

	// Activate current song
	for (let song of document.querySelectorAll('.song')) {
		song.dataset.active = 0;
	}
	let albumElmnt = document.querySelector(`[data-album="${currentAlbum}"]`)
	let songElmnt = albumElmnt.querySelector(`[data-song="${currentSong}"]`);
	songElmnt.dataset.active = 1;

	// Play song
	player.src = `music/${currentAlbum}/${currentSongData['file']}`;
	if (dontPlay == undefined) {
		triggerPlay();
	} else {
		
	}
}

// Song queue
let queue = [];
let queueIndex = 0;
function generateQueue() {
	queue = [];
	queueIndex = 0;

	// Repeating current album
	if (settingRepeat == 'album') {
		// Normal vs. shuffled order
		if (settingShuffle == 'none') {
			let iterateIndex = true;
			for (let song of catalog[currentAlbum]['songs']) {
				queue.push([currentAlbum, song['name']]);
				if (song['name'] == currentSong) {
					iterateIndex = false;
				}
				if (iterateIndex) {
					queueIndex++;
				}
			}
			return
		} else {
			for (let song of catalog[currentAlbum]['songs']) {
				queue.push([currentAlbum, song['name']]);
			}
			queue = shuffleArray(queue);

			// Get current index
			for (let entry of queue) {
				if (entry[0] == currentAlbum && entry[1] == currentSong) {
					break
				}
				queueIndex++;
			}
			return
		}
	}

	// Normal queue
	if (settingShuffle == 'none') {
		let iterateIndex = true;
		for (let album of Object.keys(catalog)) {
			for (let song of catalog[album]['songs']) {
				queue.push([album, song['name']]);
				if (album == currentAlbum && song['name'] == currentSong) {
					iterateIndex = false;
				}
				if (iterateIndex) {
					queueIndex++;
				}
			}
		}
		return
	}

	// Shuffled album queue
	if (settingShuffle == 'album') {
		for (let album of Object.keys(catalog)) {
			if (album == currentAlbum) {
				for (let song of catalog[album]['songs']) {
					queue.push([album, song['name']]);
				}
			}
		}
		queue = shuffleArray(queue);

		// Get current index
		for (let entry of queue) {
			if (entry[0] == currentAlbum && entry[1] == currentSong) {
				break
			}
			queueIndex++;
		}
		return
	}

	// Shuffled all queue
	if (settingShuffle == 'all') {
		for (let album of Object.keys(catalog)) {
			for (let song of catalog[album]['songs']) {
				queue.push([album, song['name']]);
			}
		}
		queue = shuffleArray(queue);

		// Get current index
		for (let entry of queue) {
			if (entry[0] == currentAlbum && entry[1] == currentSong) {
				break
			}
			queueIndex++;
		}
		return
	}
}
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// Player controls
function prevSong() {
	let newSong = queue[queueIndex];
	if (settingRepeat != "song") {
		queueIndex--;
		if (queueIndex < 0) {
			queueIndex = queue.length-1;
		}
		newSong = queue[queueIndex];
	}
	playSong(newSong[0], newSong[1]);
}
function nextSong() {
	let newSong = queue[queueIndex];
	if (settingRepeat != "song") {
		queueIndex++;
		if (queueIndex >= queue.length) {
			queueIndex = 0;
		}
		newSong = queue[queueIndex];
	}
	playSong(newSong[0], newSong[1]);
}
function togglePlayPause() {
	const playButton = document.querySelector('#player-playpause');
	if (playing) {
		playing = false;
		player.pause();
		playButton.dataset.active = 0;
	} else {
		playing = true;
		player.play();
		playButton.dataset.active = 1;
	}
}
function triggerPlay() {
	document.removeEventListener('mouseup', triggerPlay);
	document.removeEventListener('touchend', triggerPlay);
	const playButton = document.querySelector('#player-playpause');
	playing = true;
	playButton.dataset.active = 1;
	player.play();
}
function triggerPause() {
	const playButton = document.querySelector('#player-playpause');
	playing = false;
	playButton.dataset.active = 0;
	player.pause();
}

// Manually scrub time
function skipToTime(newTime) {
	player.currentTime = newTime;
	if (playing) {
		triggerPause();
		document.addEventListener('mouseup', triggerPlay);
		document.addEventListener('touchend', triggerPlay);
	}
}

// Repeat and shuffle
let settingRepeat = 'all';
let settingRepeatOptions = ['all', 'song', 'album'];
let settingShuffle = 'none';
let settingShuffleOptions = ['none', 'album', 'all'];
function toggleRepeat() {
	let currentSettingIndex = settingRepeatOptions.indexOf(settingRepeat);
	currentSettingIndex++;
	if (currentSettingIndex >= settingRepeatOptions.length) {
		currentSettingIndex = 0;
	}
	settingRepeat = settingRepeatOptions[currentSettingIndex];
	document.querySelector(`#repeat-mode`).innerHTML = settingRepeat;
	generateQueue();
}
function toggleShuffle() {
	let currentSettingIndex = settingShuffleOptions.indexOf(settingShuffle);
	currentSettingIndex++;
	if (currentSettingIndex >= settingShuffleOptions.length) {
		currentSettingIndex = 0;
	}
	settingShuffle = settingShuffleOptions[currentSettingIndex];
	document.querySelector(`#shuffle-mode`).innerHTML = settingShuffle;
	generateQueue();
}
function setRepeat(newSetting) {
	for (let toggle of document.querySelectorAll('#repeat button')) {
		toggle.dataset.active = 0;
	}
	settingRepeat = newSetting;
	document.querySelector(`#repeat-${newSetting}`).dataset.active = 1;
	generateQueue();
}
function setShuffle(newSetting) {
	for (let toggle of document.querySelectorAll('#shuffle button')) {
		toggle.dataset.active = 0;
	}
	settingShuffle = newSetting;
	document.querySelector(`#shuffle-${newSetting}`).dataset.active = 1;
	generateQueue();
}

// Menus
function openInfo() {
	document.querySelector('body').dataset.info = 1;
}
function closeInfo() {
	document.querySelector('body').dataset.info = 0;
}
function openMusic() {
	document.querySelector('body').dataset.music = 1;
}
function closeMusic() {
	document.querySelector('body').dataset.music = 0;
}

// Toggle album tracklists
function toggleAlbum(albumKey) {
	let album = document.querySelector(`[data-album="${albumKey}"]`);
	if (parseInt(album.dataset.active) == 1) {
		album.dataset.active = 0;
	} else {
		album.dataset.active = 1;
	}
}
function expandAllAlbums() {
	for (let album of document.querySelectorAll('.album')) {
		album.dataset.active = 1;
	}
}
function collapseAllAlbums() {
	for (let album of document.querySelectorAll('.album')) {
		album.dataset.active = 0;
	}
}

// Read URL and open album
function readURL() {
	const urlParams = new URLSearchParams(window.location.search);
	const album = urlParams.get('album');
	const track = urlParams.get('track');
	if (album != undefined) {
		let activeAlbum = document.querySelector(`[data-album="${album}"]`);
		if (activeAlbum == undefined) {
			return
		}

		activeAlbum.dataset.active = 1;
		activeAlbum.scrollIntoView();
	
		// If track is active, queue it up
		if (track == undefined) {
			// Open controls on mobile if no specific track selected
			let body = document.querySelector(`body`);
			body.dataset.music = 1;
		} else {
			let trackElmnt = activeAlbum.querySelectorAll('.song')[parseInt(track)-1];
			trackElmnt.scrollIntoView();
			trackElmnt.dataset.active = 1;
			playSong(album, trackElmnt.dataset.song, true);
			generateQueue();
		}
	}
}

// Share URL for albums or songs
let shareNotice;
let shareNoticeElmnt = document.querySelector('.copy-notice');
function shareAlbum(e, album) {
	e.stopPropagation();
	clearTimeout(shareNotice);
	let baseURL = window.location.href.split('?')[0];
	navigator.clipboard.writeText(`${baseURL}?album=${album}`);
	shareNoticeElmnt.dataset.active = 1;
	shareNotice = setTimeout(() => {shareNoticeElmnt.dataset.active = 0}, 1000);
}
function shareSong(e, album, trackNumber) {
	e.stopPropagation();
	clearTimeout(shareNotice);
	let baseURL = window.location.href.split('?')[0];
	navigator.clipboard.writeText(`${baseURL}?album=${album}&track=${trackNumber}`);
	shareNoticeElmnt.dataset.active = 1;
	shareNotice = setTimeout(() => {shareNoticeElmnt.dataset.active = 0}, 1000);
}
for (let album of document.querySelectorAll('.album')) {
	let albumShareButton = album.querySelector('.album-share');
	albumShareButton.addEventListener('click', (e) => {
		shareAlbum(e, album.dataset.album);
	})

	let trackNumber = 1;
	for (let song of album.querySelectorAll('.song')) {
		let shareButton = song.querySelector('.song-share');
		const track = trackNumber;
		shareButton.addEventListener('click', (e) => {
			shareSong(e, album.dataset.album, track)
		})
		trackNumber++;
	}
}

// View currently playing song
function viewCurrentSong() {
	openMusic();
	let album = document.querySelector(`[data-album="${currentAlbum}"]`);
	album.dataset.active = 1;
	let songElmnt = album.querySelector('[data-active="1"]');
	songElmnt.scrollIntoView();
}

// TODO
// info button on each album to open up album info