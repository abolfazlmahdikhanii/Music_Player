"use strict";

// elements
const media = document.querySelector("#music");
const btnPlayMusic = document.querySelector(".play-music");
const progressMusic = document.querySelector(".rng");
let currentTimeText = document.querySelector(".curr");
const durationTimeText = document.querySelector(".dure");
const listChart = document.querySelector(".list-chart");
const playerCover = document.querySelector(".pl-cover");
const musicName = document.querySelector(".music-name");
const singer = document.querySelector(".singer");
const forwardBtn = document.querySelector(".forward");
const backwardBtn = document.querySelector(".backward");
const loading = document.querySelector(".loading");
const boxInfoPlayer = document.querySelector(".top");
const importListItem = document.querySelector("#new-music");
const backdrop = document.querySelector("#backdrop");
const modal = document.querySelector(".modal-box");
const closeModalBtn = document.querySelector(".ico");
const uploadBtn = document.querySelector(".btn-upload");
const fileInput = document.querySelector("#file");
const forwardScroll = document.querySelector(".f-scroll");
const backwardScroll = document.querySelector(".b-scroll");
const artistContainer = document.querySelector(".main-top-artist");
const mainContainer = document.querySelector(".container .right .sub-right");
const preloader = document.querySelector(".preloader");
let dirInput = document.querySelector("#dir");
const fileInputDirectory = document.querySelector("#file-directory");
const uploadImageOutput = document.querySelector(".output-img");
const importBtn = document.querySelector(".import");
let musicInput = document.querySelector("#music-input");
let singerInput = document.querySelector("#singer-input");
let selectGenre = document.querySelector("#select-gener");
let artistModal = document.querySelector(".modal-box-pl");
const mediaModal = document.querySelector("#modal-music");
const progressModal = document.querySelector(".rng-dur");
const durationModal = document.querySelector(".duration");
const currentModal = document.querySelector(".current");
const btnModalPlayer = artistModal.querySelector(".btn-play-dur");
const btnNextModalPlayer = artistModal.querySelector(".btn-next-dur");
const btnPerviousModalPlayer = artistModal.querySelector(".btn-previous-dur");
const imgModal = artistModal.querySelector(".img-footer");
const titleModal = artistModal.querySelector(".s-title");
const singerModal = artistModal.querySelector(".s-singer");
const soundRange = artistModal.querySelector(".sound-rng");
const btnSound = artistModal.querySelector(".btn-sound");
const itemGener = document.querySelectorAll(".item-gener");
const closeModalPlayer = document.querySelector(".header-modal-pl .close");
const emptyListModal = document.querySelector(".txt-empty-modal");
let searchInput = document.querySelector(".search");
searchInput.value = "";
const suggestSearchContainer = document.querySelector(".suggest-search");
const searchList = document.querySelector(".list-search");
// variable
let file;
let dir = "";

let db = null;
let start = true;
let time = null;
let currentTrack = 0;
let currentTrackModal = 0;
let musicArray = [
  {
    id: 1,
    title: "Barcod",
    author: "Yas",
    coverImg: "../assets/images/c-yas.jpg",
    trak: "../assets/music/yas.mp3",
    genre: "rap",
  },
  {
    id: 2,
    title: "NDA",
    author: "Billie Eilish",
    coverImg: "../assets/images/c-bili.png",
    trak: "../assets/music/Billie Eilish - NDA.mp3",
    genre: "hiphop",
  },
  {
    id: 3,
    title: "Avaz Nemishi",
    author: "Shadmehr",
    coverImg: "../assets/images/c-shadmehr.jpg",
    trak: "../assets/music/Shadmehr Aghili - Avaz Nemishi.mp3",
    genre: "pop",
  },
  {
    id: 4,
    title: "POWER",
    author: "Kanya",
    coverImg: "../assets/images/c-kanya.jpg",
    trak: "../assets/music/02 POWER.mp3",
    genre: "hiphop",
  },
  {
    id: 5,
    title: "Butterfly Effect",
    author: "Travis Scott",
    coverImg: "../assets/images/travis.jpg",
    trak: "../assets/music/travis.mp3",
    genre: "pop",
  },
];
let data = null;
let finalArray = [];
let dbArray = [];
let newMusicArr = [];
newMusicArr = [...new Set(musicArray, ...newMusicArr)];

const searchFilter = {
  filter: "",
};

// listner
const eventListner = function () {
  // document when load
  document.addEventListener("DOMContentLoaded", () => {
    creatDb(function () {
      viewMusic(function () {
        finalArray = newMusicArr.concat(dbArray);
        itemMusic(finalArray);
        artist(finalArray);
        playingMusic(
          currentTrack,
          finalArray,
          media,
          playerCover,
          musicName,
          singer
        );
      });
    });
    mainContainer.style.display = "none";
    preloader.style.display = "block";

    setTimeout(() => {
      mainContainer.style.display = "block";
      preloader.style.display = "none";
    }, 5000);

    checkMediaModal(mediaModal.volume);
  });

  // play music
  btnPlayMusic.addEventListener("click", (e) => {
    check(e.target.dataset.id, "btn-play");
    if (start) {
      playMusic(btnPlayMusic, media, progressVal);
    } else {
      stopMusic(media, btnPlayMusic);
    }
  });
  btnModalPlayer.addEventListener("click", (e) => {
    check(e.target.dataset.id, "btn-play-m");
    if (start) {
      playMusic(btnModalPlayer, mediaModal, progressValModal);
    } else {
      stopMusic(mediaModal, btnModalPlayer);
    }
  });

  // change value progress ,set media time
  progressMusic.addEventListener("input", (e) => {
    media.currentTime = e.target.value;
    if (e.target.value == Math.floor(media.duration)) {
      rest(durationTimeText, progressMusic, currentTimeText, btnPlayMusic);
    }
  });
  progressModal.addEventListener("input", (e) => {
    mediaModal.currentTime = e.target.value;
    if (e.target.value == Math.floor(mediaModal.duration)) {
      rest(durationModal, progressModal, currentModal, btnModalPlayer);
    }
  });
  // play nex music
  forwardBtn.addEventListener("click", () => {
    if (currentTrack < finalArray.length - 1) {
      loadingMusic();
      currentTrack++;
      moveMusic(
        finalArray,
        currentTrack,
        btnPlayMusic,
        media,
        playerCover,
        musicName,
        singer
      );
      rest(durationTimeText, progressMusic, currentTimeText, btnPlayMusic);
    } else {
      loadingMusic();
      currentTrack = 0;
      moveMusic(
        finalArray,
        currentTrack,
        btnPlayMusic,
        media,
        playerCover,
        musicName,
        singer
      );
      rest(durationTimeText, progressMusic, currentTimeText, btnPlayMusic);
    }
    check(btnPlayMusic.getAttribute("data-id"), "btn-play");
  });

  // play perivious music
  backwardBtn.addEventListener("click", () => {
    if (currentTrack > 0) {
      loadingMusic();
      currentTrack--;
      rest(durationTimeText, progressMusic, currentTimeText, btnPlayMusic);
      moveMusic(
        finalArray,
        currentTrack,
        btnPlayMusic,
        media,
        playerCover,
        musicName,
        singer
      );
    } else {
      loadingMusic();
      currentTrack = finalArray.length - 1;
      rest(durationTimeText, progressMusic, currentTimeText, btnPlayMusic);
      moveMusic(
        finalArray,
        currentTrack,
        btnPlayMusic,
        media,
        playerCover,
        musicName,
        singer
      );
    }
    check(btnPlayMusic.getAttribute("data-id"), "btn-play");
  });

  // show modal
  importListItem.addEventListener("click", () => {
    backdrop.classList.add("show");
    modal.classList.add("show");
  });

  // close modal
  backdrop.addEventListener("click", () => {
    resetModal();
  });
  closeModalBtn.addEventListener("click", () => {
    resetModal();
  });
  closeModalPlayer.addEventListener('click',()=>{
    resetModal()
  })
  // upload

  fileInput.addEventListener("change", () => {
    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      uploadImageOutput.setAttribute("src", event.target.result);
      uploadImageOutput.style.display = "block";
      uploadBtn.style.display = "none";
    });
    reader.readAsDataURL(fileInput.files[0]);
  });
  uploadBtn.addEventListener(
    "dragenter",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
  uploadBtn.addEventListener(
    "dragleave",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
  uploadBtn.addEventListener(
    "dragover",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
  uploadBtn.addEventListener(
    "drop",
    function (e) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
      handler(file);
    },
    false
  );

  fileInputDirectory.addEventListener("change", (e) => {
    dirInput.value = e.target.value;
    var files = fileInputDirectory.files;
    let read = new FileReader();
    read.onload = function (e) {
      dir = e.target.result;
    };

    read.readAsDataURL(files[0]);
  });

  // import the music
  importBtn.addEventListener("click", () => {
    let id = uuidv4();
    let music = musicInput.value.trim();
    let singer = singerInput.value.trim();

    let cover = uploadImageOutput.getAttribute("src");
    let dirMusic = dirInput.value.trim();
    let genere = selectGenre.value;

    if (
      music === "" ||
      singer === "" ||
      cover == "" ||
      dirMusic === "" ||
      genere == ""
    ) {
      alert("Fill the all feild");
    } else {
      //  pushArray(id,music,singer,cover,dir,genere);
      data = {
        id: id,
        title: music,
        author: capitalizeWord(singer),
        coverImg: cover,
        trak: dir,
        genre: genere,
      };
      const tx = db.transaction("musicPersonal", "readwrite");
      const pMusic = tx.objectStore("musicPersonal");

      pMusic.add(data);
      finalArray.push(data);
      //  savbeStorage(newMusicArr)
      resetModal();
      itemMusic(finalArray);
      artist(finalArray);
    }
  });

  // scroll artist container
  forwardScroll.addEventListener("click", (e) => {
    artistContainer.scrollLeft += 125;
  });
  backwardScroll.addEventListener("click", (e) => {
    artistContainer.scrollLeft -= 350;
  });

  //  artist listner

  artistContainer.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("i-artist") ||
      e.target.classList.contains("img") ||
      e.target.classList.contains("author")
    ) {
      let id = e.target.dataset.id;

      let itemFind = findMusicId(finalArray, id);
      rest(durationTimeText, progressMusic, currentTimeText, btnPlayMusic);
      openArtistModal(itemFind);
      
    }
  });
  // click gener item

  itemGener.forEach((item) => {
    item.addEventListener("click", (e) => {
      let val = e.target.dataset.value;
      openGenerModal(val);
      rest(durationTimeText, progressMusic, currentTimeText, btnPlayMusic);
    });
  });

  //  search listner
  searchInput.addEventListener("input", (e) => {
    searchFilter.filter = e.target.value;
    searchFind(finalArray, searchFilter);
    if (searchFilter.filter.length > 0) {
      suggestSearchContainer.classList.add("show");
    } else {
      suggestSearchContainer.classList.remove("show");
    }
  });

  // sound
  soundRange.addEventListener("input", (e) => {
    mediaModal.volume = e.target.value / 100;

    checkMediaModal(mediaModal.volume);
    console.log(mediaModal.volume);
  });
  
};
eventListner();
