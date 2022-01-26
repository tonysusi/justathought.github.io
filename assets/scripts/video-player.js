"use strict";

//global player
var player = void 0;

/*
* Opens a model to contain the videoJS player
* @param {HTML element} btn - The element clicked to display a video.
*/
var openVideoModal = function openVideoModal(btn) {

  var uCaption = void 0;
  //if there is a caption track, grab the link
  if (btn.getAttribute("data-video-captions")) {
    uCaption = btn.getAttribute("data-video-captions");
  }

  var videojsTemplate = "<video id='video-js-player' class='vjs-jat video-js vjs-default-skin'>";
  //if there is a caption track, add it to the video tag, otherwise just end the video tag
  uCaption ? videojsTemplate += "<track label='English' kind='captions' srclang='en' src='" + uCaption + "'></video>" : videojsTemplate += "</video>";

  //open a modal with the videoJS container and caption track in it
  //smallBtn adds a close X in the top right
  //before the modal closes, dispose of the videoJS player, otherwise it will keep playing

  $.fancybox.open({
    src: videojsTemplate,
    type: 'html',
    smallBtn: true,
    beforeClose: function beforeClose() {
      player.dispose();
    }
  });

  //initialise the video player
  createVideoPlayer(btn);
};

/*
* Initialises videoJS player with attributes from HTML element
* Modernizr is used to determine which video format the users browser supports
* Valid video qualities are: 360P, 540P, 720P, 1080P
* If a certain quality is not included in the HTML elements attributes, it will not be added to the player
* @param {HTML element} btn - The element clicked to display a video. Contains attributes with video links and caption link
*/
var createVideoPlayer = function createVideoPlayer(btn) {
  var mp4Valid = Modernizr.video.h264 == "probably";
  var webmValid = Modernizr.video.webm == "probably";
  var oggValid = Modernizr.video.ogg == "probably";
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  // console.log(Modernizr.video);
  //For testing non compatibles
  // mp4Valid = false;
  // webmValid = false;
  // oggValid = false;


  //DETERMINE WHICH FILE FORMAT TO USE
  //ORDER: MP4, WEBM, OGV, Not supported.
  var format = void 0,
      type = void 0;

  if(isFirefox){
    format = "ogv";
    type = "ogg";
  }else{
    //MP4
    if (mp4Valid) {
      format = "mp4";
      type = "mp4";
      // console.log("Using MP4.");
      //WEBM
    } else if (webmValid) {
      format = "webm";
      type = "webm";
      // console.log("Using WEBM.");
      //OGG/OGV
    } else if (oggValid) {
      format = "ogv";
      type = "ogg";
      // console.log("Using OGV.");
    } else {
      format = null;
      type = null;
      // console.log("Not supported.");
    }
  }
  // console.log(Modernizr.performance.timing);
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
      large: 940
    },
    controlBar: {
      children: ['playToggle', 'progressControl', 'volumePanel', 'qualitySelector', 'captionsButton', 'fullscreenToggle']
    }
  });

  //if browser does not support available formats, we still want the player to be loaded but with a modal message.
  if (format === null) {
    player.createModal("Your browser does not support our video formats.");
    player.bigPlayButton.hide();
    player.loadingSpinner.hide();
    // console.dir(player);
    //return from method, we cant add a valid source.
    return;
  }

  //Check if video sources exist in the HTML elements attributes
  //if so, initialise the sources
  var u360 = void 0,
      u540 = void 0,
      u720 = void 0,
      u1080 = void 0;
  if (btn.getAttribute("data-video-1080")) {
    u1080 = {
      type: 'video/' + type,
      label: '1080P',
      src: btn.getAttribute("data-video-1080") + "." + format
    };
  }
  if (btn.getAttribute("data-video-720")) {
    u720 = {
      type: 'video/' + type,
      label: '720P',
      selected: true,
      src: btn.getAttribute("data-video-720") + "." + format
    };
  }
  if (btn.getAttribute("data-video-540")) {
    u540 = {
      type: 'video/' + type,
      label: '540P',
      src: btn.getAttribute("data-video-540") + "." + format
    };
  }
  if (btn.getAttribute("data-video-360")) {
    u360 = {
      type: 'video/' + type,
      label: '360P',
      src: btn.getAttribute("data-video-360") + "." + format
    };
  }



  //put the sources into an array to be iterated over
  var sourceLinks = [u1080, u720, u540, u360];
  //container for the sources that will actually be added to the player
  var src = new Array();

  //if the source exists then add it to the actual sources
  sourceLinks.forEach(function (source) {
    if (source) {
      src.push(source);
    }
  });

  //Finally add the actual sources to the player
  player.src(src);

  //TODO: Check user bandwith and select an appropriate source (THAT EXISTS)
};

//get all video modal buttons on the page
var modalButtons = document.getElementsByClassName("video-modal-btn");

//add event listeners to the modal buttons passing their HTML elements to the events function
//add event listeners to the modal buttons passing their HTML elements to the events function
// for(var btn of modalButtons){
//   btn.addEventListener("click", function() {
//     openVideoModal(btn);
//   });
// }

// modalButtons.forEach(function (btn){
//   btn.addEventListener("click", function() {
//     openVideoModal(btn);
//   });
// });

function accessebilityClick(event){
    if(event.type === 'click'){
        return true; //if the event was a click return true, all clicks should trigger
    }else if(event.type === 'keypress'){
        var code = event.charCode || event.keyCode;
        if((code === 32) || (code === 13)){
            return true; //if the event was a keydown AND the key pressed was space or enter return true
        }
    }else{
        return false; //if anything but a click or enter/space keydown then return false, no action
    }
}

for(var i = 0; i < modalButtons.length; i++){
  var btn = modalButtons[i];
  var eventList = ['click', 'keypress'];
  for(var j = 0; j < eventList.length; j++){
    btn.addEventListener(eventList[j], function(event) {
      if(accessebilityClick(event) === true){
        openVideoModal(this);
      }
    });
  }

}
