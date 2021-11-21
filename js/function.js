"use strict";

function creatDb(callback) {
  const request = indexedDB.open("music", 1);

  request.onupgradeneeded = function (e) {
    db = e.target.result;
    db.createObjectStore("musicPersonal", { keyPath: "id" });
    console.log("call upgraneeded");
  };
  request.onsuccess = function (e) {
    db = e.target.result;
    callback();
  };

  request.onerror = function (e) {
    console.log(`error ${e.target.error}`);
  };
}

function viewMusic(callback) {
  const tx = db.transaction(["musicPersonal"], "readonly");
  const pMusic = tx.objectStore("musicPersonal");
  const c = pMusic.openCursor();

  c.onsuccess = function (e) {
    const cur = e.target.result;

    if (cur) {
      dbArray.push(cur.value);
      cur.continue();
    } else {
      callback(dbArray);
    }
  };
}

function loadingMusic() {
  boxInfoPlayer.classList.add("active");
  loading.classList.add("load");
  setTimeout(() => {
    boxInfoPlayer.classList.remove("active");
    loading.classList.remove("load");
    playMusic(btnPlayMusic, media, progressVal);
  }, 3000);
}
// get music for playing
const playingMusic = function (curr = 0, arr, media, imgEl, titleEl, authorEl) {
  media.src = arr[curr].trak;
  imgEl.src = arr[curr].coverImg;
  titleEl.textContent = arr[curr].title;
  authorEl.textContent = arr[curr].author;
};


// append item music list
const itemMusic = function (arr) {
  listChart.innerHTML = "";
  arr.map((item) => {
    const liEl = document.createElement("li");
    liEl.className = "item-chart";
    liEl.setAttribute("data-id", item.id);
    liEl.innerHTML = `
    <section class="chart-right">
   
    <img src=${item.coverImg}>
    <div class="detail">
        <p class="title">${item.title}</p>
        <p class="author">${item.author}</p>
    </div>
    </section>
    <section class="duration">
    <div class="duration-music">
      
    </div>
    
    </section>
    `;
    const au = document.createElement("audio");
    au.className = "au";
    au.src = item.trak;
    // au.setAttribute('src',item.trak)
    au.setAttribute("preload", "metadata");
    const pEl = document.createElement("p");
    pEl.className = "time";

    // get duration music
    au.onloadedmetadata = function () {
      pEl.innerHTML = formatTime(au.duration);
    };

    const btn = document.createElement("button");
    btn.classList.add("btn-play", "play");
    btn.setAttribute("data-id", item.id);
    liEl.querySelector(".duration").appendChild(btn);

    liEl.querySelector(".duration-music").appendChild(pEl);
    liEl.appendChild(au);
    listChart.appendChild(liEl);

    btn.addEventListener("click", (e) => {
      e.target.innerHTML = "";
      let id = e.target.dataset.id;
      let itemFinded = arr.find((item) => {
        return item.id == id;
      });

      stopMusic(media, btnPlayMusic);
      playerInfo(itemFinded);

      btnPlayMusic.setAttribute("data-id", id);
      check(btnPlayMusic.getAttribute("data-id"), "btn-play");
    });
  });
};

const handler = (file) => {
  const reader = new FileReader();
  reader.addEventListener("load", function (event) {
    uploadImageOutput.setAttribute("src", event.target.result);
    uploadImageOutput.style.display = "block";
    uploadBtn.style.display = "none";
  });
  reader.readAsDataURL(file);
};

// set media time to second and minutes
let formatTime = function (time) {
  let min = Math.floor(time / 60);
  let sec = Math.floor(time - min * 60);
  return `${min} : ${sec < 10 ? `0${sec}` : sec}`;
};

// set progress max , progress value, current time text and time duration
const progressVal = function () {
  progressMusic.max = Math.floor(media.duration);
  durationTimeText.innerHTML = isNaN(media.duration)
    ? "0:0"
    : formatTime(media.duration);
  progressMusic.value = Math.floor(media.currentTime);
  currentTimeText.innerHTML = formatTime(Math.floor(media.currentTime));

  if (progressMusic.value == Math.floor(media.duration)) {
    rest(durationTimeText, progressMusic, currentTimeText, btnPlayMusic);
    start = true;
  }
};
const progressValModal = function () {
  progressModal.max = Math.floor(mediaModal.duration);
  durationModal.innerHTML = isNaN(mediaModal.duration)
    ? "0:0"
    : formatTime(mediaModal.duration);
  progressModal.value = Math.floor(mediaModal.currentTime);
  currentModal.innerHTML = formatTime(Math.floor(mediaModal.currentTime));

  if (progressModal.value == Math.floor(mediaModal.duration)) {
    rest(durationModal, progressModal, currentModal, btnModalPlayer);
    start = true;
  }
};

// rest the palyer
const rest = function (durEl, progressEl, currenEl, btnEl) {
  clearInterval(time);

  durEl.innerHTML = "0:00";
  progressEl.value = 0;
  currenEl.innerHTML = "0:00";
  btnEl.classList.add("play");
  btnEl.classList.remove("visible");
};

//when click musicBtn music play
function playMusic(btnEl, mediaa, pr) {
  mediaa.play();
  btnEl.classList.remove("play");
  btnEl.classList.add("visible");
  // set progress every 10 milisecond
  time = setInterval(pr == progressVal ? progressVal : progressValModal, 10);

  start = false;
}
// check which music playing
function check(id = 1, el) {
  document.querySelectorAll(`.${el}`).forEach((item) => {
    let itemId = item.getAttribute("data-id");
    if (id == itemId) {
      let i = item;
      i.classList.remove("play");
      i.classList.add("visible");
    } else {
      item.classList.add("play");
      item.classList.remove("visible");
    }
  });
}
function findMusicId(arr, id) {
  let findId = arr.find((item) => {
    return item.id == id;
  });

  return findId;
}
function stopMusic(mediaa, btnEl) {
  mediaa.pause();
  btnEl.classList.add("play");
  btnEl.classList.remove("visible");
  start = true;

  clearInterval(time);
}
// show music info example singer name,title ,...
function playerInfo(findedItem) {
  loadingMusic();
  media.src = findedItem.trak;
  playerCover.src = findedItem.coverImg;
  musicName.textContent = findedItem.title;
  singer.textContent = findedItem.author;
}
function playerInfoModal(findedItem) {
  mediaModal.src = findedItem.trak;
  imgModal.src = findedItem.coverImg;
  titleModal.textContent = findedItem.title;
  singerModal.textContent = findedItem.author;
}
// reset modal
const resetModal = function () {
  backdrop.classList.remove("show");
  modal.classList.remove("show");
  artistModal.classList.remove("show");
  uploadImageOutput.style.display = "none";
  uploadBtn.style.display = "flex";
  uploadImageOutput.src = "";
  dirInput.value = "";
  musicInput.value = "";
  singerInput.value = "";
  selectGenre.value = "";
  rest(durationModal, progressModal, currentModal, btnModalPlayer);
  stopMusic(mediaModal, btnModalPlayer);
  imgModal.src = "./assets/images/empty.png";
  titleModal.textContent = "Unknown";
  singerModal.textContent = "Unknown";
};
const moveMusic = function (arr, current, el, media, imgEl, titleEl, authorEl) {
  let findedId = findMusicId(arr, arr[current].id);
  el.setAttribute("data-id", findedId.id);
  playingMusic(current, arr, media, imgEl, titleEl, authorEl);
};
// artist container
const artist = (arr) => {
  var dups = [];
  let newArr = arr.filter((item) => {
    if (dups.indexOf(item.author) == -1) {
      dups.push(item.author);
      return true;
    }
    return false;
  });

  artistContainer.innerHTML = ``;
  newArr.forEach((item) => {
    const divEl = document.createElement("div");
    divEl.className = "item";
    divEl.setAttribute("data-id", `${item.id}`);
    divEl.innerHTML = `
     <div class="i-artist" data-id=${item.id}>
     <img src=${item.coverImg} alt="cover" class="img" data-id=${item.id} />
     <p class="author" data-id=${item.id}>${item.author}</p>
     
     </div>
    
    
    `;

    artistContainer.appendChild(divEl);
  });
};
// captilize first word of every letter
const capitalizeWord = function (word) {
  let seprateWord = word.toLowerCase().split(" ");

  for (let i = 0; i < seprateWord.length; i++) {
    seprateWord[i] =
      seprateWord[i].charAt(0).toUpperCase() + seprateWord[i].substring(1);
  }
  return seprateWord.join(" ");
};

// filterd same artist name
const filterArtis = function (arr, singer) {
  let filter = arr.filter((item) => {
    return item.author == singer;
  });
  return filter;
};
// filter by gener
const filterGener = function (arr, gener) {
  let filter = arr.filter((item) => {
    return item.genre == gener;
  });
  return filter;
};
// open artist modal
const openArtistModal = function (item) {
  let filterd = [];
  // when open modal stop music
  media.pause();
  currentTrack = 0;
  start = false;
  // show modal and backdrop
  artistModal.classList.add("show");
  backdrop.classList.add("show");

  // set artis modal in header image and text
  artistModal.querySelector(".b-author").textContent = item.author;

  // filterd same artist name
  filterd = filterArtis(finalArray, item.author);
  if(filterd.length>0){
    playingMusic(0,filterd,mediaModal,imgModal,titleModal,singerModal);
    playMusic(btnModalPlayer, mediaModal, progressValModal);
  }
 
  // call function for make new item
  newItemModal(filterd);
  // check empty or not
  checkEmptyModal(filterd);
  // when click backward and next button move music
  modalBtn(filterd);
};
const openGenerModal = function (item) {
  let filterd = [];
  // when open modal stop music
  media.pause();
  currentTrack = 0;
  start = false;
  // show modal and backdrop
  artistModal.classList.add("show");
  backdrop.classList.add("show");

  // set artis modal in header image and text

  artistModal.querySelector(".b-author").textContent = `${item}`;

  // filterd same artist name
  filterd = filterGener(finalArray, item);
  if(filterd.length>0){
    playingMusic(0,filterd,mediaModal,imgModal,titleModal,singerModal);
    playMusic(btnModalPlayer, mediaModal, progressValModal);
  }
  

  // call function for make new item
  newItemModal(filterd);
  // check empty or not
  checkEmptyModal(filterd);
  // when click backward and next button move music
  modalBtn(filterd);
};
const newItemModal = function (arr) {

  // apend new item
  artistModal.querySelector(".list-modal-pl").innerHTML = ``;
  arr.forEach((element) => {
    const liEl = document.createElement("li");
    liEl.className = "item-modal-pl";
    liEl.innerHTML = `
     <section class="row">
     <div class="right">
       <img src=${element.coverImg} alt="cover">
        <div class="col">
         <p class="title">${element.title}</p>
         <p class="author">${element.author}</p>
        </div>
     </div>
     <div class="duration-pl">
      
  
     </div>
   </section>
     
     `;

    const au = document.createElement("audio");
    au.className = "aud";
    au.src = element.trak;
    // au.setAttribute('src',item.trak)
    au.setAttribute("preload", "metadata");
    const pEl = document.createElement("p");
    pEl.className = "durate";

    // get duration music
    au.onloadedmetadata = function () {
      pEl.innerHTML = formatTime(au.duration);
    };

    const btn = document.createElement("button");
    btn.classList.add("btn-play-m", "play");

    btn.setAttribute("data-id", element.id);
    liEl.querySelector(".duration-pl").appendChild(pEl);
    liEl.querySelector(".duration-pl").appendChild(btn);

    btn.addEventListener("click", (e) => {
      e.target.innerHTML = "";
      let id = e.target.dataset.id;
      let itemFinded = findMusicId(arr, id);
      stopMusic(mediaModal, btnModalPlayer);
      playerInfoModal(itemFinded);
      playMusic(btnModalPlayer, mediaModal, progressValModal);
      btnModalPlayer.setAttribute("data-id", id);
      check(btnModalPlayer.getAttribute("data-id"), "btn-play-m");
    });

    liEl.appendChild(au);
    artistModal.querySelector(".list-modal-pl").appendChild(liEl);
  });
};

const modalBtn = function (arr) {
  // check count music for every artis =>if exist  next and backward enable

  if (arr.length > 1) {
    btnNextModalPlayer.addEventListener("click", (e) => {
      if (currentTrackModal < arr.length - 1) {
        currentTrackModal++;
        moveMusic(
          arr,
          currentTrackModal,
          btnModalPlayer,
          mediaModal,
          imgModal,
          titleModal,
          singerModal
        );
        rest(durationModal, progressModal, currentModal, btnModalPlayer);
      } else {
        currentTrackModal = 0;
        moveMusic(
          arr,
          currentTrackModal,
          btnModalPlayer,
          mediaModal,
          imgModal,
          titleModal,
          singerModal
        );
        rest(durationModal, progressModal, currentModal, btnModalPlayer);
      }
      playMusic(btnModalPlayer, mediaModal, progressValModal);
      check(btnModalPlayer.getAttribute("data-id"), "btn-play-m");
    });
    btnPerviousModalPlayer.addEventListener("click", (e) => {
      if (currentTrackModal > 0) {
        currentTrackModal--;
        moveMusic(
          arr,
          currentTrackModal,
          btnModalPlayer,
          mediaModal,
          imgModal,
          titleModal,
          singerModal
        );
        rest(durationModal, progressModal, currentModal, btnModalPlayer);
      } else {
        currentTrackModal = arr.length - 1;
        moveMusic(
          arr,
          currentTrackModal,
          btnModalPlayer,
          mediaModal,
          imgModal,
          titleModal,
          singerModal
        );
        rest(durationModal, progressModal, currentModal, btnModalPlayer);
      }
      playMusic(btnModalPlayer, mediaModal, progressValModal);
      check(btnModalPlayer.getAttribute("data-id"), "btn-play-m");
    });
  }
};
// check empty modal
const checkEmptyModal = function (filter) {
  let container = artistModal.querySelector(".list-modal-pl");

  if (filter.length > 0) {
    emptyListModal.classList.add("show");
  } else {
    emptyListModal.classList.remove("show");
  }
};
// search
const searchFind = function (arr, filterSearch) {
  let filterArr = arr.filter((item) => {
    return (
      item.author.toLowerCase().includes(filterSearch.filter.toLowerCase()) ||
      item.title.toLowerCase().includes(filterSearch.filter.toLowerCase())
    );
  });
  // check filter array is empty show, empty list icon
  if(filterSearch.filter.length>0&&filterArr.length==0){
    document.querySelector('.search-show').classList.add('show')
  }
  else{
    document.querySelector('.search-show').classList.remove('show')
  }
  searchList.innerHTML = "";
  filterArr.forEach((item) => {
    const liEl = document.createElement("li");
    liEl.className = "item-search";
    liEl.innerHTML = `
   <div class="search-img">
   <img src="${item.coverImg}" alt="">
   <div class="txt-search">
     <p class="search-title">${item.title}</p>
     <p class="search-singer">${item.author}</p>
   </div>
 </div>
 <div class="search-btn">
 </div>
   `;
    //  crate btn for play
    const btn = document.createElement("button");
    btn.className = "btn-search-play";
    btn.setAttribute("data-id", item.id);
    btn.addEventListener("click", (e) => {
      let id = e.target.dataset.id;
      let itemFinded = findMusicId(finalArray, id);

      stopMusic(media, btnPlayMusic);
      playerInfo(itemFinded);

      btnPlayMusic.setAttribute("data-id", id);
      check(btnPlayMusic.getAttribute("data-id"), "btn-play");
      console.log(id);
    });
    liEl.querySelector(".search-btn").appendChild(btn);
    searchList.appendChild(liEl);
  });

};

// sound
const checkMediaModal = function (vol) {
  if (vol < 0.1) {
    btnSound.classList.remove("up");
    btnSound.classList.add("mute");
  }
  if (vol >= 0.1) {
    btnSound.classList.remove("mute");
    btnSound.classList.remove("up");
    btnSound.classList.add("down");
  }
  if (vol >= 0.5) {
    btnSound.classList.remove("mute");
    btnSound.classList.add("up");
    btnSound.classList.remove("down");
  }
};
