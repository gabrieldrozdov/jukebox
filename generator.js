const fs = require('fs');
const data = require('./songs.json');

function generateHTML() {
	// Generate songs
	let albumsHTML = "";
	let navHTML = "";
	let infoNotes = "";
	for (let key of Object.keys(data)) {
		let album = data[key];

		let linksHTML = "";
		if (album['links'].length > 0) {
			for (let link of album['links']) {
				linksHTML += `
					<a href="${link[1]}" target="_blank">${link[0]}</a>
				`;
			}
			linksHTML = `<div class="info-notes-links">${linksHTML}</div>`;
		}

		let songsHTML = "";
		let songNumber = 1;
		for (let song of album['songs']) {
			songsHTML += `
				<li class="song" onclick="playSong('${key}', '${song['name']}'); generateQueue();" data-active="0" data-song="${key} ${song['name']}">
					<span class="song-number">${songNumber}</span>
					<span class="song-name">${song['name']}</span>
					<span class="song-duration">${song['duration']}</span>
				</li>
			`;
			songNumber++
		}
		
		albumsHTML += `
			<section class="album" id="${key}" data-active="0">
				<a class="album-header" href="#${key}">
					<div class="album-header-cover">
						<img src="music/${key}/${album['cover']}">
					</div>
					<div class="album-header-info">
						<p class="album-header-info-date">${album['date']}</p>
						<h2 class="album-header-info-title">${album['name']}</h2>
					</div>
				</a>
				<ul class="album-songs">
					${songsHTML}
				</ul>
			</section>
		`;

		navHTML += `
			<a href="#${key}" class="nav-link" data-album="${key}" onclick="closeInfo(); openMusic();"><img src="music/${key}/${album['cover']}"></a>
		`;

		infoNotes += `
			<section class="info-notes">
				<p class="info-notes-date">${album['date']}</p>
				<h2 class="info-notes-album"><a href="#${key}" onclick="closeInfo(); openMusic();">${album['name']}</a></h2>
				${album['desc']}
				${linksHTML}
			</section>
		`;
	}

	// Generate page
	let pageContent = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Jukebox</title>
			<meta name="author" content="Gabriel Drozdov">
			<meta name="keywords" content="Music, Composition, Songs, Creative Coding, Songwriting, Sound Design, Music Production">
			<meta name="description" content="Real music for human ears.">
			<meta property="og:url" content="https://jukebox.barcoloudly.com/">
			<meta name="og:title" property="og:title" content="Jukebox">
			<meta property="og:description" content="Real music for human ears.">
			<meta property="og:image" content="./assets/meta/opengraph.jpg">
			<link rel="icon" type="image/png" href="assets/meta/favicon.png" />
			<link rel="stylesheet" href="style.css">
		</head>
		<body>
			<button class="menu-toggle menu-toggle-info" onclick="openInfo();">Info</button>
			<button class="menu-toggle menu-toggle-music" onclick="openMusic();">Music</button>

			<div class="info" data-active="0">
				<button class="info-close" onclick="closeInfo();">Close</button>
				<nav class="nav">
					${navHTML}
				</nav>
				<div class="info-content">
					<section class="info-content-intro">
						<p>
							Oh hi there. <a href='https://gabrieldrozdov.com/' target='_blank'>Gabriel Drozdov</a>, a.k.a. <a href="https://barcoloudly.com/" target="_blank">Barco Loudly</a>, here. I’ve been making music for a while. Here’s all of it.
						</p>
						<p>
							This music is mine. If you want royalty-free tracks for whatever, check out <a href="https://bgm.barcoloudly.com/" target="_blank">BGM</a>. If you want musical toys, go to <a href="https://barcoloudly.com/" target="_blank">Barco Loudly</a>. If you want your own website (like to work together), reach out to <a href="https://noreplica.com/" target="_blank">No Replica</a>.
						</p>
					</section>
					${infoNotes}
				</div>
			</div>
		
			<div class="container">
				<header class="header">
					<div class="logo-container">
						<div class="logo" style="animation-delay: calc(-2s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-4s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-6s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-8s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-10s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-12s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-14s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-16s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-18s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-20s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-22s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-24s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-26s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<div class="logo" style="animation-delay: calc(-28s + var(--animation-offset));"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></div>
						<h1 class="logo"><span>J</span><span>u</span><span>k</span><span>e</span><span>b</span><span>o</span><span>x</span></h1>
					</div>
		
					<div class="player" data-active="0">
						<div class="player-song">
							No Song Playing
						</div>
						<div class="player-album">
							No Album Selected
						</div>
				
						<div class="player-controls">
							<div class="player-section" id="player-buttons">
								<button class="player-button" id="player-back" onclick="prevSong();">
									<svg width="24" height="24" viewBox="0 0 24 24"><path d="M13,12l11,7V5l-11,7ZM13,5v14L3,12l10-7ZM0,6h3v12H0V6Z"/></svg>
								</button>
								<button class="player-button" id="player-playpause" onclick="togglePlayPause();" data-active="1">
									<svg viewBox="0 0 24 24" class="player-playpause-1"><path d="M9,22h-5V2h5v20ZM20,2h-5v20h5V2Z"/></svg>
									<svg width="24" height="24" viewBox="0 0 24 24" class="player-playpause-2"><path d="M3 22v-20l18 10-18 10z"/></svg>
								</button>
								<button class="player-button" id="player-forward" onclick="nextSong();">
									<svg width="24" height="24" viewBox="0 0 24 24"><path d="M11 12l-11 7v-14l11 7zm0-7v14l10-7-10-7zm13 1h-3v12h3v-12z"/></svg>
								</button>
							</div>
			
							<div class="player-section" id="player-playbar">
								<div class="player-time">00:00</div>
								<input type="range" class="player-playbar" min="0" max="100" value="0" oninput="skipToTime(this.value);">
								<div class="player-duration">00:00</div>
							</div>
				
							<div class="player-section" id="player-volume">
								<button class="player-button" id="player-mute" onclick="toggleMute();" data-active="0">
									<svg width="24" height="24" viewBox="0 0 24 24" class="player-mute-1"><path d="M19 7.358v15.642l-8-5v-.785l8-9.857zm3-6.094l-1.548-1.264-3.446 4.247-6.006 3.753v3.646l-2 2.464v-6.11h-4v10h.843l-3.843 4.736 1.548 1.264 18.452-22.736z"/></svg>
									<svg width="24" height="24" viewBox="0 0 24 24" class="player-mute-2"><path d="M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z"/></svg>
								</button>
								<input type="range" class="player-volume" min="0" max="100" value="80" oninput="changeVolume(this.value/100);">
							</div>
						</div>
				
						<div class="player-toggles">
							<div class="player-toggle" id="repeat">
								<label class="player-toggle-label">Repeat</label>
								<button class="player-toggle-button" id="repeat-none" data-active="1" onclick="setRepeat('none');">
									None
								</button>
								<button class="player-toggle-button" id="repeat-song" onclick="setRepeat('song');">
									Song
								</button>
								<button class="player-toggle-button" id="repeat-album" onclick="setRepeat('album');">
									Album
								</button>
							</div>
							<div class="player-toggle" id="shuffle">
								<label class="player-toggle-label">Shuffle</label>
								<button class="player-toggle-button" id="shuffle-none" data-active="1" onclick="setShuffle('none');">
									None
								</button>
								<button class="player-toggle-button" id="shuffle-album" onclick="setShuffle('album');">
									Album
								</button>
								<button class="player-toggle-button" id="shuffle-all" onclick="setShuffle('all');">
									All
								</button>
							</div>
						</div>
					</div>
				</header>
		
				<main class="music" data-active="0">
					<button class="music-close" onclick="closeMusic();">Close</button>
					${albumsHTML}
				</main>
			</div>
		
			<script src="script.js"></script>
		</body>
		</html>
	`;

	// Create work file
	fs.writeFile(`index.html`, pageContent, err => {
		if (err) {
			console.error(err);
		}
	});
}
generateHTML();