console.log("Lets write JS");

let currentSong = new Audio();
let songs;

function getDisplayName(fileName) {
  fileName = decodeURIComponent(fileName);
  return fileName
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replaceAll("%20", " ")
    .replaceAll(".mp3", "")
    .replaceAll("MP3", "")
    .replaceAll("Mp3", "")
    .replaceAll("mp3", "")
    .replace(/%[^%]*%/g, "")
    .replaceAll("%20", " ")
    .replace(/(\([^)]*\)|\{[^}]*\}|\[[^\]]*\])/g, "")
    .replace(/\s*\([^)]*\)(?=\.mp3)/i, "");
}

function formatSeconds(seconds) {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return "00:00";
  }
  const mins = Math.floor(seconds / 60); // get full minutes
  const secs = Math.floor(seconds % 60); // remaining seconds

  // pad with 0 if less than 10
  const formattedMins = String(mins).padStart(2, "0");
  const formattedSecs = String(secs).padStart(2, "0");

  return `${formattedMins}:${formattedSecs}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs2 = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs2.push(element.href.split("/%5Csongs%5C")[1]);
    }
  }
  return songs2;
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+ track);
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong
      .play()
      .then(() => {
        play.src = "assets/pause.svg"; // playing successfully
      })
      .catch((err) => {
        console.error("Cannot play song:", err);
        play.src = "assets/play.svg"; // fallback icon
      });
  }
  document.querySelector(".songInfo").innerHTML = getDisplayName(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function main() {
  //Get the list of songs
  songs = await getSongs();
  playMusic(songs[0], true);
  //Show all songs in Playlists
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li data-song="${song}"> 
    
                  <img class="invert" src="assets/music.svg" alt="" />
                  <div class="info">
                    <div class="infoName">${getDisplayName(song)}</div>
                    <div>Rhony</div>
                  </div>
                  <div class="playNow">
                    <span>Play Now</span>
                    <img class="invert" src="assets/play.svg" alt="" />
                  </div> </li>`;
  }
  //Play the 1st song
  //   var audio = new Audio(songs[0]);
  //   audio.play();

  //Attach an EventListener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      play.src = "assets/pause.svg";
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.dataset.song);
    });
  });

  //Attach an EventListener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/pause.svg";
    } else {
      currentSong.pause();
      play.src = "assets/play.svg";
    }
  });

  //Listen for timme update
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
     const current = currentSong.currentTime;
  const duration = currentSong.duration;
document.querySelector(".songTime").innerHTML =
    `${formatSeconds(current)} / ${formatSeconds(duration)}`;
    let progress = 0;
  if (Number.isFinite(duration) && duration > 0) {
    progress = (current / duration) * 100;
  }
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an eventListener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.offsetX/e.target.getBoundingClientRect().width);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add eventListener for Hamburger
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".footer").style.left = "0";
    // document.querySelector(".playbar").style.width= "calc(100vw - 395px)";
    // document.querySelector(".playbar").style.right= "18px";
    document.querySelectorAll('.playNow span')
  .forEach(span => span.remove());
  });

  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".playbar").style.right= "";
    // document.querySelector(".playbar").style.width= "calc(100vw - 60px)";
    // document.querySelectorAll('.playNow span')
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".footer").style.left = "-120%";
  });

  //Add eventListener for Previous and Next
  previous.addEventListener("click", (e)=>{
    console.log('previous clicked');
    // console.log(currentSong.src);
    // console.log(songs);
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    console.log(songs, index);
    let lastIndex = songs.length - 1;
    
    if(currentSong.currentTime >= 3){
      currentSong.currentTime = 0;
    return;
    }
    if(index === 0){
      playMusic(songs[lastIndex]);
    }else{
      playMusic(songs[index-1]);
    }
  })

  next.addEventListener("click", (e)=>{
    console.log('next clicked');
    // console.log(currentSong.src);
    // console.log(songs);
    let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    console.log(songs, index);
    let lastIndex = songs.length - 1;
    if(index === lastIndex){
      playMusic(songs[0]);
    }
    else{
      playMusic(songs[index+1]);
    }
    
  })
}
main();
