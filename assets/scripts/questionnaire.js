//find() polyfill
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

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

var utils = {
  get: function get(selector, scope) {
    scope = scope ? scope : document;
    return scope.querySelector(selector);
  },
  getAll: function getAll(selector, scope) {
    scope = scope ? scope : document;
    return scope.querySelectorAll(selector);
  },

  /* Function to call api request */
  makeRequest: function makeRequest(url, method, params) {
    // Create the XHR request
    var request = new XMLHttpRequest(); // Return it as a Promise

    var promise = new Promise(function(resolve, reject) {
      // Setup our listener to process compeleted requests
      request.onreadystatechange = function() {
        // Only run if the request is complete
        if (request.readyState !== 4) return; // Process the response

        if (request.status >= 200 && request.status < 300) {
          // If successful
          resolve(request);
        } else {
          // If failed
          reject({
            status: request.status,
            statusText: request.statusText
          });
        }
      }; // Setup our HTTP request


      request.open(method || 'GET', url, true);
      request.setRequestHeader('apikey', '95111accf97fb85c919ad97856eedfex'); // TODO change for staging
      // Send the request

      request.send(params || '');

    });

    // promise.then(function(result) {
    //     console.log("Fulfilled: " + result);
    //     return result;
    // }, function(error) {
    //     console.log("Rejected: " + error);
    //     return error;
    // });


    return promise;
  }
}; // Load questionnaire once DOM loaded

document.addEventListener("DOMContentLoaded", function() {
  var q = {
    index: 0,
    complete: 0,
    id: 9,
    loading: utils.get(".loading"),
    block: utils.get(".question__block"),
    description: document.createElement('div'),
    content: document.createElement('div'),
    list: document.createElement('div'),
    progress: document.createElement('div'),
    nav: document.createElement('div'),
    submit: document.createElement('div'),
    nextBtn: document.createElement('a'),
    prevBtn: document.createElement('a'),
    pagination: document.createElement('div'),
    questionnaireData: {},
    questionData: {},
    answerData: {},
    postData: [],
    start_date: {},
    end_date: {},
    screeningId: '',
    score: '',
    threshold: {},
    k10_thresholds: {
      healthy: [0, 19, '<h2>According to the K10, your distress score is <SCORE>, which is within the healthy range.</h2><p>Our courses can still be of great benefit to you, as they will equip you with better-coping skills for day-to-day living.</p>', '#90D5AC', ''],
      above_normal: [20, 29, '<h2>According to the K10, your score is <SCORE>, which is above the range of normal distress.</h2><p>You may benefit from taking one of our courses.</p>', '#FCC66F', '<strong>Need help now?</strong><p>While we’d love to be able to help, Just a Thought is not a monitored service. If you need to talk to someone now, you can free call or text 1737 anytime to speak to a trained counsellor.<br><br>You can also find a list of <a href="https://www.justathought.co.nz/gethelp" target="_blank">additional services or helplines for support</a> on our website.</p>'],
      high: [30, 39, '<h2>According to the K10, your distress score is <SCORE>, which is high.</h2><p>A score in this range would typically be a reason to seek support from a health professional (e.g. GP, mental health clinician) in order to look at ways to lower distress and improve wellbeing.  Please consider carefully whether this may be necessary for you at this time.<br><br>It may be helpful to do one of our courses, however support from a health professional along the way may be beneficial.   </p>', '#E89662', '<strong>Need help now?</strong><p>While we’d love to be able to help, Just a Thought is not a monitored service. If you need to talk to someone now, you can free call or text 1737 anytime to speak to a trained counsellor.<br><br>If you are in crisis, please contact emergency services by calling 111.<br><br>You can also find a list of <a href="https://www.justathought.co.nz/gethelp" target="_blank">additional services or helplines for support</a> on our website.</p>'],
      very_high: [40, 50, '<h2>According to the K10, your distress score is <SCORE>, which is very high.</h2><p>A score in this range would typically be a reason to seek support from a health professional (e.g. GP, mental health clinician) in order to look at ways to lower distress and improve wellbeing.  Please consider carefully whether this may be necessary for you at this time. <br><br> It may be helpful to do one of our courses, however support from a health professional along the way may be beneficial.  </p>', '#D56666', '<strong>Need help now?</strong><p>While we’d love to be able to help, Just a Thought is not a monitored service. If you need to talk to someone now, you can free call or text 1737 anytime to speak to a trained counsellor.<br><br>If you are in crisis, please contact emergency services by calling 111.<br><br>You can also find a list of <a href="https://www.justathought.co.nz/gethelp" target="_blank">additional services or helplines for support</a> on our website.</p>']
    },
    loadData: function loadData() {
      utils.makeRequest('https://api.justathought.co.nz/api/v1/questionnaire/' + q.id).then(function(questionnaire) {
        q.questionnaireData = JSON.parse(questionnaire.response);
        return utils.makeRequest('https://api.justathought.co.nz/api/v1/questionnaire/' + q.id + '/questions');
      }).then(function(questions) {
        q.questionData = JSON.parse(questions.response);
        var promises = [];
        var q_ids = [];
        q.questionData.forEach(function(item, key) {
          q_ids.push(item.id);
        });
        q_ids.forEach(function(id) {
          promises.push(utils.makeRequest('https://api.justathought.co.nz/api/v1/question/' + id + '/answers'));
        });
        /* Build Answer data
         *  After all answer api called build answer data on each question object
         */

        Promise.all(promises).then(function(results) {
          var allAnswers = {};
          results.forEach(function(result, key) {
            var question = q.questionData.find(function(obj) {
              return obj.id === q_ids[key];
            });
            question.answerData = JSON.parse(result.response);
            question.answerData.forEach(function(key, value) {
              q.answerData[key.id] = key.score;
            });
          }); //hide loading

          q.loading.style.display = 'none'; // start building

          q.init();
        });
      }).catch(function(error) {
        console.log('Something went wrong', error);
      });
    },
    init: function init() {
      q.setTime();
      // q.getScreeningId();
      q.buildDescription();
      q.buildContent(); // url:  "https://clinicapi.thiswayupclinic.org/api/v1/screening/persist/<screening_id>/<quesdtionnaire_id>"

      utils.makeRequest('https://api.justathought.co.nz/api/v1/questionnaire/' + q.id).then(function(questionnaire) {
        q.questionnaireData = JSON.parse(questionnaire.response);
        return utils.makeRequest('https://api.justathought.co.nz/api/v1/questionnaire/' + q.id + '/questions');
      });
    },
    setTime: function setTime() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth();
      var day = now.getDate();
      var hour = now.getHours();
      var min = now.getMinutes();
      var sec = now.getSeconds();
      var mils = now.getMilliseconds();
      q.start_date = new Date(year, month, day, hour, min, sec, mils);
      q.end_date = new Date(year, month, day, hour + 1, min);
    },
    getScreeningId: function getScreeningId() {
      utils.makeRequest('https://api.justathought.co.nz/api/v1/screening/id').then(function(screening) {
        q.screeningId = JSON.parse(screening.response);
      });
    },
    buildContent: function buildContent() {
      q.content.className = 'questionnaire__content';
      q.list.className = 'question__list';
      q.questionData.forEach(function(question, key) {
        // Create question block
        var questionBlock = document.createElement('div');
        questionBlock.className = key == 0 ? 'question question-' + question.id + ' question--active' : 'question question-' + question.id; // Create question headline

        var questionHeadline = document.createElement('h2');
        questionHeadline.innerHTML = question.content; // Create question buttons

        var questionButtons = document.createElement('div');
        questionButtons.className = "questionnaire__buttons independent";
        questionButtons.setAttribute("role", "radiogroup") // Build questions

        question.answerData.forEach(function(answer) {
          var answerButton = document.createElement('a');
          answerButton.className = 'btn btn-secondary--outline';
          answerButton.setAttribute("data-aid", answer.id);
          answerButton.setAttribute("data-qid", question.id);
          answerButton.setAttribute("role", "radio");
          answerButton.setAttribute("tabindex", "0");
          answerButton.innerHTML = answer.content;
          questionButtons.appendChild(answerButton);
        });
        questionBlock.appendChild(questionHeadline);
        questionBlock.appendChild(questionButtons);
        q.list.appendChild(questionBlock);
      });
      q.content.appendChild(q.list);
      q.buildProgress();
      q.buildNav();
      q.block.appendChild(q.content); //update variables

      q.buttons = document.querySelectorAll(".question__block .questionnaire__buttons a.btn");
      q.questions = document.querySelectorAll(".question");
      q.total = document.querySelectorAll(".question").length;
      q.nextBtn = document.querySelector(".questionnaire__navButtons--next");
      q.nextBtn.setAttribute("role", "button");
      q.nextBtn.setAttribute("tabindex", "0");
      q.prevBtn = document.querySelector(".questionnaire__navButtons--prev"); // Add event listeners to answer buttons
      q.prevBtn.setAttribute("role", "button");
      q.prevBtn.setAttribute("tabindex", "0");

      for(var i = 0; i < q.buttons.length; i++){
        var cButton = q.buttons[i];
        cButton.addEventListener("click", function(event) {
            q.selectBtn(this.dataset.qid, this.dataset.aid);
        });
      }


      q.buttons.forEach(function(a) {
        a.addEventListener("keypress", function() {
          if(accessebilityClick(event) === true){
            q.selectBtn(this.dataset.qid, this.dataset.aid);
          }
        });
      });
    },
    buildDescription: function buildDescription() {
      q.description.className = "questionnaire__description";
      q.description.innerHTML = q.questionnaireData.description;
      q.block.appendChild(q.description);
    },
    buildProgress: function buildProgress() {
      var progressLine = document.createElement('div');
      var progressWidth = 1 / q.questionData.length * 100;
      progressLine.className = 'questionnaire__progress';
      progressLine.innerHTML = '<span style="width: ' + progressWidth + '%;"></span>';
      q.progress.className = 'questionnaire__nav';
      q.progress.appendChild(progressLine);
      q.content.appendChild(q.progress);
    },
    buildNav: function buildNav() {
      q.maxQuestion = q.questionData.length; // Add classes

      q.nav.className = 'questionnaire__nav';
      q.prevBtn.className = "questionnaire__navCircle questionnaire__navButtons--prev questionnaire__navButtons--disabled";
      q.nextBtn.className = "questionnaire__navCircle questionnaire__navButtons--next questionnaire__navButtons--disabled";
      q.pagination.className = "questionnaire__pagination"; // Add html content

      q.prevBtn.innerHTML = '<span class="questionnaire__navButtons"></span><div class="questionnaire__navButtons--prev--text">back</div>';
      q.nextBtn.innerHTML = '<span class="questionnaire__navButtons"></span><div class="questionnaire__navButtons--next--text">next</div>';
      q.pagination.innerHTML = '<span class="questionnaire__pagination__text">Question </span><span class="questionnaire__index">1</span> of <span class="questionnaire__max">' + q.maxQuestion + '</span>';
      q.submit.innerHTML = "<a class='btn btn-primary btn-arrow btn--hidden'>See result</a>";
      q.submit.className = "submit";
      q.submit.setAttribute("tabindex", "0");
      q.nav.appendChild(q.prevBtn);
      q.nav.appendChild(q.pagination);
      q.nav.appendChild(q.nextBtn);
      q.content.appendChild(q.nav);
      q.content.appendChild(q.submit);
      q.nextBtn.addEventListener('click', function() {
        q.nextBtnAction();
      });
      q.nextBtn.addEventListener('keypress', function(event) {
        if(accessebilityClick(event) === true){
          q.nextBtnAction();
          var firstButton = document.querySelector(".question.question--active .questionnaire__buttons .btn");
          firstButton.focus();
        }
      });
      q.prevBtn.addEventListener('click', function() {
        q.prevBtnAction();
      });
      q.prevBtn.addEventListener('keypress', function(event) {
        if(accessebilityClick(event) === true){
          q.prevBtnAction();
          var firstButton = document.querySelector(".question.question--active .questionnaire__buttons .btn");
          firstButton.focus();
        }
      });
      q.submit.addEventListener('click', function() {
        q.showResults();
      });
      q.submit.addEventListener('keypress', function(event) {
        if(accessebilityClick(event) === true){
          q.showResults();
        }
      });
    },
    buildResults: function buildResults() {
      q.description.style.display = 'none';
      q.content.style.display = 'none';
      var resultsContent = document.createElement('div');
      resultsContent.className = 'results';
      var resultsIcon = document.createElement('div');
      resultsIcon.className = 'results__icon';
      resultsIcon.innerHTML = '<img src="/uploads/k10_' + q.threshold + '_icon.svg">';
      var resultsCopy = document.createElement('div');
      resultsCopy.className = 'results__copy';
      resultsCopy.innerHTML = q.k10_thresholds[q.threshold][2].replace('<SCORE>', '<span style="color:' + q.k10_thresholds[q.threshold][3] + '">' + q.score + '</span>') + '<span class="startFreeCourse"><a class="btn" href="https://www.justathought.co.nz/courses">Start a free course</a></span>';
      var resultsHelp = document.createElement('div');
      resultsHelp.className = 'questionnaire__explanation questionnaire__needHelp';
      resultsHelp.innerHTML = q.k10_thresholds[q.threshold][4];
      resultsContent.appendChild(resultsIcon);
      resultsContent.appendChild(resultsCopy);
      q.block.appendChild(resultsContent);
      q.block.appendChild(resultsHelp);
    },
    isDisabled: function isDisabled(btnType) {
      var result = false;
      var nextBtnClass = document.querySelector(".questionnaire__navButtons--next").classList;
      var prevBtnClass = document.querySelector(".questionnaire__navButtons--prev").classList;

      if (btnType === 'next') {
        for (var key in nextBtnClass) {
          if (nextBtnClass.hasOwnProperty(key)) {
            if (nextBtnClass[key] === "questionnaire__navButtons--disabled") {
              result = true;
            }
          }
        }
      }

      if (btnType === 'prev') {
        for (var key in prevBtnClass) {
          if (prevBtnClass.hasOwnProperty(key)) {
            if (prevBtnClass[key] === "questionnaire__navButtons--disabled") {
              result = true;
            }
          }
        }
      }

      return result;
    },
    // update post data ans tally up score.
    updateData: function updateData(qid, aid) {
      q.postData[qid] = Number(aid);
      var scoreTotal = 0;

      for (var i = 0; i < q.postData.length; i++) {
        if (q.postData[i]) {
          var answerId = q.postData[i];
          scoreTotal += q.answerData[answerId];
        }
      }

      q.score = Number(scoreTotal);
      // console.log('q.score:', q.score);
      // console.log('q.index:', q.index);
      // console.log('q.complete:', q.complete);
    },
    activateQuestion: function activateQuestion() {
      for (var i = 0; i < q.questions.length; i++) {
        var questionClass = q.questions[i].classList; // array of button classes
        // remove 'btn--selected' when found in btn.classList

        // for (var key in questionClass) {
        for (var j = 0; j < questionClass.length; j++) {
          if (questionClass.hasOwnProperty(j)) {
            if (questionClass[j] === "question--active" && q.index < q.total) {
              q.questions[i].classList.remove("question--active");
            }
          }
        }
      } // add index and max number to pagination


      document.querySelector(".questionnaire__index").textContent = q.index + 1;
      document.querySelector(".questionnaire__max").textContent = q.total; // add question--active to next question

      if (q.index < q.total) {
        q.questions[q.index].classList.add("question--active");
      } // update progress bar



      q.progressBar();
      q.checkNav();
      // console.log('q.score:', q.score);
      // console.log('q.index:', q.index);
      // console.log('q.complete:', q.complete);
      // console.log('q.complete',q.complete);
      // console.log('q.index',questionnaire.index);
    },
    checkNav: function checkNav() {
      // update disabled nav buttons
      if (q.index == 0) {
        // console.log('prev is disabled');
        document.querySelector(".questionnaire__navButtons--prev").classList.add('questionnaire__navButtons--disabled');
      } else {
        // console.log('prev is active');
        document.querySelector(".questionnaire__navButtons--prev").classList.remove('questionnaire__navButtons--disabled');
      }

      if (q.complete > q.index) {
        // console.log('next is active');
        document.querySelector(".questionnaire__navButtons--next").classList.remove('questionnaire__navButtons--disabled');
      } else {
        document.querySelector(".questionnaire__navButtons--next").classList.add('questionnaire__navButtons--disabled'); // console.log('next is disabled');
      }

      if (q.total == q.complete) {
        document.querySelector('.submit .btn').classList.remove("btn--hidden");
        document.querySelector(".questionnaire__navButtons--next").classList.add('questionnaire__navButtons--disabled');
      }
    },
    nextBtnAction: function nextBtnAction() {
      // console.log('nextBtn');
      if (!q.isDisabled('next')) {
        q.index++;
        q.activateQuestion();
      }
    },
    prevBtnAction: function prevBtnAction() {
      // console.log('prevBtn');
      // console.log('q.index',q.index);
      // console.log('q.total',q.total);
      if (!q.isDisabled('prev')) {
        // q.index = (q.index > q.total)? q.total - 1: q.index -1;
        q.index--;
        q.activateQuestion();
      }
    },
    selectBtn: function selectBtn(qid, aid) {
      // variables
      var activeButton = document.querySelectorAll("[data-aid='" + aid + "']"); // the active button

      var classNames = activeButton[0].classList; // list of classses for active button

      var question = activeButton[0].parentNode; // block of button for question

      q.updateData(qid, aid);
      q.complete = q.index >= q.complete ? q.complete + 1 : q.complete;
      q.removeSelectClass(question, activeButton[0]);
      q.checkNav();
    },
    removeSelectClass: function removeSelectClass(question, activeBtn) {
      var buttons = question.querySelectorAll("a.btn");
      // buttons.forEach(function (btn) {
      for (var i = 0; i < buttons.length; i++) {
        var btnClass = buttons[i].classList; // array of button classes
        // remove 'btn--selected' when found in btn.classList

        // for (var key in btnClass) {
        for (var j = 0; j < btnClass.length; j++) {
          if (btnClass.hasOwnProperty(j)) {
            // console.log(btnClass[j]);
            if (btnClass[j] === "btn--selected") {
              buttons[i].classList.remove("btn--selected");
              buttons[i].setAttribute("aria-checked", "false");
            }
          }
        }
      };
      q.addSelectClass(activeBtn);
    },
    addSelectClass: function addSelectClass(activeBtn) {
      // add selected style to acive button
      // activeBtn.classList ? activeBtn.classList.add("btn--selected") : activeBtn.className += " btn--selected";
      if(activeBtn.classList){
        activeBtn.classList.add("btn--selected");
        activeBtn.setAttribute("aria-checked", "true");
      }else{
        activeBtn.className += " btn--selected";
        activeBtn.setAttribute("aria-checked", "true");
      }
    },
    progressBar: function progressBar() {
      var percentage = (q.index + 1) / q.total;
      var percentageBar = document.querySelector('.questionnaire__progress span'); // console.log('percentageBar',percentageBar);
      // console.log(q.index , q.total);

      if (q.index + 1 < q.total) {
        percentageBar.style.width = percentage * 100 + '%';
      } else {
        percentageBar.style.width = '100%';
        percentageBar.style.borderRadius = '20px';
      }
    },
    showResults: function showResults() {
      // find all the answer id in q.postData,
      // find each score in q.answerData ids, add and show result page
      // q.threshold stores correct threshold variable
      for (var threshold in q.k10_thresholds) {
        var lowRange = Number(q.k10_thresholds[threshold][0]);
        var highRange = Number(q.k10_thresholds[threshold][1]);
        // console.log(threshold, lowRange, highRange);

        if (q.score >= lowRange && q.score <= highRange) {
          q.threshold = threshold;
        }
      }

      // console.log(q.threshold);
      // console.log(q.k10_thresholds[q.threshold]);
      q.buildResults();
    }
  };
  q.loadData();
});
/*
** Return score:

screening_id: https://clinicapi.thiswayupclinic.org/api/v1/screening/id

  // 'question_id : question_answer_options_id'
  data{
    35: 151
    36: 156
    37: "161"
    38: 166
    39: 171
    40: "176"
    41: 181
    42: 186
    43: 191
    44: 198
  }
  url:  "https://clinicapi.thiswayupclinic.org/api/v1/screening/persist/<screening_id>/<quesdtionnaire_id>"
*/
