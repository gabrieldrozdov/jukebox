// Fetch songs
let catalog;
fetch('songs.json')
	.then((response) => response.json())
	.then((json) => {
		catalog = json;
	})

// Change color on scroll
const root = document.querySelector('html');
const body = document.querySelector('body');
let baseHue = 0;
let percentScrolled = 0;
function setAxes() {
	const scrollTop = body.offsetTop;
	const scrollHeight = body.offsetHeight;
	const scrollPosition = window.scrollY;
	const pixelsScrolled = scrollPosition - scrollTop;

	// Calculate the percent scrolled (0–1)
	percentScrolled = pixelsScrolled/(scrollHeight - window.innerHeight);

	// Correct bounds
	if (percentScrolled < 0) {
		percentScrolled = 0;
	} else if (percentScrolled > 1) {
		percentScrolled = 1;
	}

	// Set CSS variable
	updateColor();
}
window.addEventListener('scroll', setAxes);

// Gradually shift color
function setColor() {
	baseHue += .5;
	if (baseHue >= 360) {
		baseHue = 0;
	}
	updateColor();
}
setInterval(setColor, 100);

// Update color
function updateColor() {
	root.style.setProperty('--base-hue', percentScrolled*document.documentElement.scrollHeight/50+baseHue + "deg");
	if (isNaN(percentScrolled*document.documentElement.scrollHeight/50+baseHue)) {
		root.style.setProperty('--base-hue', "0deg");
	}
}

// Generate logo
function generateLogo(text) {
	// Transition out old element
	for (let oldLogo of document.querySelectorAll('.logo-container')) {
		oldLogo.dataset.pos = 'right';
		setTimeout(() => {oldLogo.remove()}, 750);
	}

	// Create new element
	let newLogo = document.createElement('div');
	newLogo.classList.add('logo-container');
	newLogo.dataset.pos = 'left';

	// Build letter spans
	let logoLetters = "";
	newLogo.style.setProperty('--logoscale', 1/(text.length/7));
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
	setTimeout(() => {newLogo.dataset.pos = 'center'}, 5);
}
generateLogo('Jukebox');

// Update logo rotation
let baseRotation = 0;
function updateRotation() {
	let newRotation = percentScrolled*document.documentElement.scrollHeight/10+baseRotation;
	root.style.setProperty('--animation-rotation', newRotation + "deg");
	if (isNaN(newRotation)) {
		root.style.setProperty('--animation-rotation', "0deg");
	}
}
function setRotation() {
	baseRotation += .1;
	if (baseRotation >= 360) {
		baseRotation = 0;
	}
	updateRotation();
	requestAnimationFrame(setRotation);
}
setRotation();
window.addEventListener('scroll', updateRotation);

// Nav bouncing animation
function initializeNav() {
	const offset = Math.max(100, Math.min(window.innerWidth*.1, 250));
	const nav = document.querySelector('.nav');
	for (let navLink of document.querySelectorAll('.nav-link')) {
		// Position
		navLink.dataset.posx = Math.random()*(nav.offsetWidth-offset);
		navLink.dataset.posy = Math.random()*(nav.offsetHeight-offset);
		navLink.dataset.rot = Math.round(Math.random()*360);
		navLink.style.transform = `translate(${navLink.dataset.posx}px, ${navLink.dataset.posy}px) rotate(${navLink.dataset.rot}deg)`;
		if (Math.random() < .5) {
			navLink.dataset.velx = -1;
		} else {
			navLink.dataset.velx = 1;
		}
		if (Math.random() < .5) {
			navLink.dataset.vely = -1;
		} else {
			navLink.dataset.vely = 1;
		}

		// Events
		navLink.addEventListener('mouseenter', () => {navLink.dataset.pause = 1});
		navLink.addEventListener('mouseleave', () => {navLink.dataset.pause = 0});
	}
	navLoop();
}
function navLoop() {
	const offset = Math.max(100, Math.min(window.innerWidth*.1, 250));
	const nav = document.querySelector('.nav');
	for (let navLink of document.querySelectorAll('.nav-link')) {
		if (parseInt(navLink.dataset.pause) == 1) {
			continue
		}

		// X position
		if (parseInt(navLink.dataset.velx) == 1) {
			navLink.dataset.posx = parseInt(navLink.dataset.posx)+1;
		} else {
			navLink.dataset.posx = parseInt(navLink.dataset.posx)-1;
		}
		if (parseInt(navLink.dataset.posx) >= nav.offsetWidth-offset) {
			navLink.dataset.velx = -1;
		} else if (parseInt(navLink.dataset.posx) <= 0 ) {
			navLink.dataset.velx = 1;
		}

		// Y position
		if (parseInt(navLink.dataset.velY) == 1) {
			navLink.dataset.posy = parseInt(navLink.dataset.posy)+1;
		} else {
			navLink.dataset.posy = parseInt(navLink.dataset.posy)-1;
		}
		if (parseInt(navLink.dataset.posy) >= nav.offsetHeight-offset) {
			navLink.dataset.velY = -1;
		} else if (parseInt(navLink.dataset.posy) <= 0 ) {
			navLink.dataset.velY = 1;
		}

		// Rotation
		if (parseInt(navLink.dataset.velx) == 1) {
			navLink.dataset.rot = parseInt(navLink.dataset.rot)+1;
		} else {
			navLink.dataset.rot = parseInt(navLink.dataset.rot)-1;
		}
		if (parseInt(navLink.dataset.rot) >= 360) {
			navLink.dataset.rot = 0;
		} else if (parseInt(navLink.dataset.rot) <= 0) {
			navLink.dataset.rot = 360;
		}

		// Update position
		navLink.style.transform = `translate(${navLink.dataset.posx}px, ${navLink.dataset.posy}px) rotate(${navLink.dataset.rot}deg)`;
	}
	requestAnimationFrame(navLoop);
}
initializeNav();

// Player object
let player = new Audio();
let currentVolume = .8;
player.volume = currentVolume;
let currentTime = 0;
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
	playerTime.innerText = `${minutes}:${seconds}`;
}

// Manually play song
let currentAlbum = "";
let currentSong = "";
let currentAlbumData = [];
let songNumber = 0;
let playing = false;
function playSong(albumKey, songName) {
	// Set album link
	const albumLink = document.querySelector('.player-album');
	albumLink.href = `#${albumKey}`;

	// Activate player
	triggerPlayPause();
	document.querySelector('.player').dataset.active = 1;

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
	const playerSong = document.querySelector('.player-song');
	playerSong.innerHTML = songName;
	const playerAlbum = document.querySelector('.player-album');
	playerAlbum.innerHTML = `${catalog[currentAlbum]['name']} | Track&nbsp;${songNumber+1}`;
	const playerTime = document.querySelector('.player-time');
	playerTime.innerHTML = "00:00";
	const playerDuration = document.querySelector('.player-duration');
	playerDuration.innerHTML = currentSongData['duration'];

	// Update artwork
	generateLogo(songName);

	// Play song
	player.src = `music/${currentAlbum}/${currentSongData['file']}`;
	player.play();
	playing = true;

	// Activate current song
	for (let song of document.querySelectorAll('.song')) {
		song.dataset.active = 0;
	}
	let song = document.querySelector(`[data-song="${currentAlbum} ${currentSong}"]`);
	song.dataset.active = 1;
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
function triggerPlayPause() {
	const playButton = document.querySelector('#player-playpause');
	playing = true;
	playButton.dataset.active = 1;
}

// Manually scrub time
function skipToTime(newTime) {
	player.currentTime = newTime;
}

// Volume
let playerMuted = false;
function toggleMute() {
	const muteButton = document.querySelector('#player-mute');
	const playerVolume = document.querySelector('.player-volume');
	if (playerMuted) {
		playerMuted = false;
		muteButton.dataset.active = 0;
		player.volume = currentVolume;
		playerVolume.value = currentVolume*100;
	} else {
		playerMuted = true;
		muteButton.dataset.active = 1;
		player.volume = 0;
		playerVolume.value = 0;
	}
}
function changeVolume(newVolume) {
	const muteButton = document.querySelector('#player-mute');
	playerMuted = false;
	muteButton.dataset.active = 0;
	currentVolume = newVolume;
	player.volume = currentVolume;
}

// Repeat and shuffle
let settingRepeat = 'all';
let settingShuffle = 'none';
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
	document.querySelector('.info').dataset.active = 1;
}
function closeInfo() {
	document.querySelector('.info').dataset.active = 0;
}
function openMusic() {
	document.querySelector('.music').dataset.active = 1;
}
function closeMusic() {
	document.querySelector('.music').dataset.active = 0;
}

// TODO
// fix glitch with clicking repeat and shuffle before clicking on a song