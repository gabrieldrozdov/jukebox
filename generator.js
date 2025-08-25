const fs = require('fs');
const data = require('./songs.json');

function generateHTML() {
	// Generate songs
	let albumsHTML = "";
	let infoNotes = "";
	for (let key of Object.keys(data)) {
		let album = data[key];

		let songsHTML = "";
		let songNumber = 1;
		for (let song of album['songs']) {
			let durationHTML = "";
			for (let letter of song['duration']) {
				durationHTML += `<span>${letter}</span>`;
			}
			songsHTML += `
				<li class="song" onclick="playSong('${key}', '${song['name']}'); generateQueue(); closeMusic();" data-active="0" data-song="${song['name']}">
					<span class="song-number">${songNumber}</span>
					<span class="song-name">${song['name']}</span>
					<span class="song-duration">${song['duration']}</span>
					<button class="song-share"><svg viewBox="0 0 24 24"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"/></svg></button>
				</li>
			`;
			songNumber++
		}

		let linksHTML = "";
		if (album['links'].length > 0) {
			for (let link of album['links']) {
				linksHTML += `
					<a href="${link[1]}" target="_blank">${link[0]}</a>
				`;
			}
			linksHTML = `<div class="album-info-links">${linksHTML}</div>`;
		}
		
		albumsHTML += `
			<section class="album" data-album="${key}" data-active="0">
				<button class="album-header" href="#${key}" onclick="toggleAlbum('${key}');">
					<p class="album-header-details">${album['date']} | ${album['songs'].length} songs</p>
					<h2 class="album-header-title">${album['name']}</h2>
					<div class="album-share"><svg viewBox="0 0 24 24"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"/></svg></div>
				</button>
				<div class="album-info">
					${album['desc']}
					${linksHTML}
				</div>
				<ul class="album-songs">
					${songsHTML}
				</ul>
			</section>
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
		<body data-player="0" data-music="0" data-info="0">		
			<div class="container">
				<header class="header" onclick="closeInfo();">
					<div class="logo-parent">
						<div class="logo-container">
							<h1 class="logo" data-pos="right">Jukebox</h1>
						</div>
					</div>
		
					<div class="player" data-active="0">
						<button class="player-info" onclick="viewCurrentSong();">
							<div class="player-info-details"></div>
							<div class="player-info-song"></div>
						</button>
				
						<div class="player-section">
							<button class="player-button" id="player-playpause" onclick="togglePlayPause();" data-active="0">
								<svg class="player-playpause-play" viewBox="0 0 20 20"><path d="M6.13,2.89v14.22l9.74-7.11L6.13,2.89h0Z"/></svg>
								<svg class="player-playpause-pause" viewBox="0 0 20 20"><rect x="4.82" y="3.48" width="3.54" height="13.05"/><rect x="11.64" y="3.48" width="3.54" height="13.05"/></svg>
							</button>
							<button class="player-button" id="player-back" onclick="prevSong();">
								<svg viewBox="0 0 20 20"><path d="M17.11,2.89l-7.11,7.11,7.11,7.11V2.89h0ZM10,2.89l-7.11,7.11,7.11,7.11V2.89h0Z"/></svg>
							</button>
							<button class="player-button" id="player-forward" onclick="nextSong();">
								<svg viewBox="0 0 20 20"><path d="M2.89,2.89v14.22l7.11-7.11L2.89,2.89h0ZM10,2.89v14.22l7.11-7.11-7.11-7.11h0Z"/></svg>
							</button>
							<button class="player-toggle" id="repeat" onclick="toggleRepeat();">
								<span>Repeat</span>
								<span id="repeat-mode">All</span>
							</button>
							<button class="player-toggle" id="shuffle" onclick="toggleShuffle();">
								<span>Shuffle</span>
								<span id="shuffle-mode">None</span>
							</button>
						</div>
				
						<div class="player-section" id="player-playbar">
							<div class="player-time"><span>0</span><span>0</span><span>:</span><span>0</span><span>0</span></div>
							<input type="range" class="player-playbar" min="0" max="100" value="0" oninput="skipToTime(this.value);">
							<div class="player-duration"><span>0</span><span>0</span><span>:</span><span>0</span><span>0</span></div>
						</div>
					</div>
				</header>
		
				<main class="music" data-active="0" onclick="closeInfo();">
					<button class="music-close" onclick="closeMusic();">×</button>
					${albumsHTML}
					<div class="music-controls">
						<button onclick="expandAllAlbums();">Expand All</button>
						<button onclick="collapseAllAlbums();">Collapse All</button>
					</div>
				</main>
			</div>

			<button class="menu-toggle menu-toggle-info" onclick="openInfo();">Info</button>

			<button class="menu-toggle menu-toggle-music" onclick="openMusic();">Music</button>

			<div class="copy-notice" data-active="0">
				<span>Link copied!</span>
			</div>

			<div class="info">
				<button onclick="closeInfo();">×</button>
				<p>Music and music player by <a href="https://barcoloudly.com/" target="_blank">Barco Loudly</a> (a.k.a. <a href="https://gabrieldrozdov.com/" target="_blank">Gabriel Drozdov</a>). I got sick of the other music services so I made my own. If you want to copy this site, all the code is free to download from <a href="https://github.com/gabrieldrozdov/jukebox" target="_blank">GitHub</a>. If you want to work with me on something (websites, music, etc.), head to <a href="https://noreplica.com/" target="_blank">No Replica</a>. Fonts are Limkin by <a href="https://toomuchtype.com/" target="_blank">Too Much Type</a> and <a href="https://vercel.com/font" target="_blank">Geist Mono</a>.</p>
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