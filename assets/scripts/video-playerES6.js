//global player
let player;

/*
* Opens a model to contain the videoJS player
* @param {HTML element} btn - The element clicked to display a video.
*/
const openVideoModal = (btn) => {

  let uCaption;
  //if there is a caption track, grab the link
  if(btn.getAttribute("data-video-captions")){
    uCaption = btn.getAttribute("data-video-captions");
  }

  let videojsTemplate = "<video id='video-js-player' class='vjs-jat video-js vjs-default-skin'>";
  //if there is a caption track, add it to the video tag, otherwise just end the video tag
  (uCaption) ? videojsTemplate += "<track label='English' kind='captions' srclang='en' src='" + uCaption + "'></video>" : videojsTemplate += "</video>";

  //open a modal with the videoJS container and caption track in it
  //smallBtn adds a close X in the top right
  //before the modal closes, dispose of the videoJS player, otherwise it will keep playing

  $.fancybox.open({
    src: videojsTemplate,
    type: 'html',
    smallBtn: true,
    beforeClose: function(){
      player.dispose();
    }
  });

  //initialise the video player
  createVideoPlayer(btn);
}

/*
* Initialises videoJS player with attributes from HTML element
* Modernizr is used to determine which video format the users browser supports
* Valid video qualities are: 360P, 540P, 720P, 1080P
* If a certain quality is not included in the HTML elements attributes, it will not be added to the player
* @param {HTML element} btn - The element clicked to display a video. Contains attributes with video links and caption link
*/
const createVideoPlayer = (btn) => {
  let mp4Valid = Modernizr.video.h264 == "probably";
  let webmValid = Modernizr.video.webm == "probably";
  let oggValid = Modernizr.video.ogg == "probably";
  console.log(Modernizr.video);
  //For testing non compatibles
  // mp4Valid = false;
  // webmValid = false;
  // oggValid = false;


  //DETERMINE WHICH FILE FORMAT TO USE
  //ORDER: MP4, WEBM, OGV, Not supported.
  let format, type;
  //MP4
  if(mp4Valid){
    format = "mp4";
    type = "mp4";
    // console.log("Using MP4.");
  //WEBM
  }else if(webmValid){
    format = "webm";
    type = "webm";
    // console.log("Using WEBM.");
  //OGG/OGV
  }else if(oggValid){
    format = "ogv";
    type = "ogg";
    // console.log("Using OGV.");
  }else{
    format = null;
    type = null;
    // console.log("Not supported.");
  }
  console.log(Modernizr.performance.timing);
  //initialise player with options
  //preload true, doesnt load on page load, loads after modal opens
  player = videojs("video-js-player", {
    controls: true,
    autoplay: true,
    preload: true,
    responsive: false,
    fluid: true,
    breakpoints: {
      medium: 600,
      large: 940,
    },
    controlBar: {
        children: [
           'playToggle',
           'progressControl',
           'volumePanel',
           'qualitySelector',
           'captionsButton',
           'fullscreenToggle',
        ]
     }
  });

  //if browser does not support available formats, we still want the player to be loaded but with a modal message.
  if(format === null){
    player.createModal("Your browser does not support our video formats.");
    player.bigPlayButton.hide();
    player.loadingSpinner.hide();
    // console.dir(player);
    //return from method, we cant add a valid source.
    return;
  }


  //Check if video sources exist in the HTML elements attributes
  //if so, initialise the sources
  let u360, u540, u720, u1080;
  if(btn.getAttribute("data-video-1080")){
    u1080 = {
      type: 'video/' + type,
      label: '1080P',
      src: btn.getAttribute("data-video-1080") + "." + format
    };
  }
  if(btn.getAttribute("data-video-720")){
    u720 = {
      type: 'video/' + type,
      label: '720P',
      src: btn.getAttribute("data-video-720") + "." + format
    };
  }
  if(btn.getAttribute("data-video-540")){
    u540 = {
      type: 'video/' + type,
      label: '540P',
      src: btn.getAttribute("data-video-540") + "." + format
    };
  }
  if(btn.getAttribute("data-video-360")){
    u360 = {
      type: 'video/' + type,
      label: '360P',
      src: btn.getAttribute("data-video-360") + "." + format
    };
  }
  //

  //put the sources into an array to be iterated over
  let sourceLinks = [u1080, u720, u540, u360];
  //container for the sources that will actually be added to the player
  let src = new Array();

  //if the source exists then add it to the actual sources
  sourceLinks.forEach(source => {
    if(source){
      src.push(source);
    }
  });

  //Finally add the actual sources to the player
  player.src(src);

  //TODO: Check user bandwith and select an appropriate source (THAT EXISTS)

}

//get all video modal buttons on the page
let modalButtons = document.getElementsByClassName("video-modal-btn");

//add event listeners to the modal buttons passing their HTML elements to the events function
for(let btn of modalButtons){
  btn.addEventListener("click", function() {
    openVideoModal(btn);
  });
}
