'use strict';

var tinderContainer = document.querySelector('.tinder');
var allCards = document.querySelectorAll('.tinder--card');
var nope = document.getElementById('nope');
var love = document.getElementById('love');

var chameleon = 0, historian = 0, sensitive = 0, thrillSeeker = 0, traditionalist = 0;

function initCards() {
  var newCards = document.querySelectorAll('.tinder--card:not(.removed)');

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
  });
  
  tinderContainer.classList.add('loaded');
}

allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on('pan', function (event) {
    el.classList.add('moving');
  });

  hammertime.on('pan', function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
    tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
  });

  hammertime.on('panend', function (event) {
    el.classList.remove('moving');
    tinderContainer.classList.remove('tinder_love');
    tinderContainer.classList.remove('tinder_nope');

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle('removed', !keep);

    if (keep) {
      event.target.style.transform = '';
    } else {
      var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';

      if (event.deltaX > 0) {
        switch(event.target.getElementsByTagName('img')[0].classList[0]){
          case 'chameleon':
            chameleon++;
            break;
          case 'historian':
            historian++;
            break;
          case 'sensitive':
            sensitive++;
            break;
          case 'thrillSeeker':
            thrillSeeker++;
            break;
          case 'traditionalist':
            traditionalist++;
            break;
          default:
            console.log('error: no type');
        }
      }

      var cards = document.querySelectorAll('.tinder--card:not(.removed)');
      if (!cards.length) result();
      setTimeout(() => {
        event.target.remove();
      }, 500);

      // initCards();
    }
  });
});

function result() {
  console.log(chameleon + ' ' + historian + ' ' + sensitive + ' ' + thrillSeeker + ' ' + traditionalist);

  // Math.max[chameleon, historian, sensitive, thrillSeeker, traditionalist];


  if (chameleon > 0) {
    window.location.href = "chameleon.html";
  }

}

function createButtonListener(love) {
  return function (event) {
    var cards = document.querySelectorAll('.tinder--card:not(.removed)');
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    // card.classList.add('removed');

    if (love) {
      card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      switch(card.getElementsByTagName('img')[0].classList[0]){
        case 'chameleon':
          chameleon++;
          break;
        case 'historian':
          historian++;
          break;
        case 'sensitive':
          sensitive++;
          break;
        case 'thrillSeeker':
          thrillSeeker++;
          break;
        case 'traditionalist':
          traditionalist++;
          break;
        default:
          console.log('error: no type');
      }
    } else {
      card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
    }

    card.classList.add('removed');
    var cards = document.querySelectorAll('.tinder--card:not(.removed)');
    if (!cards.length) result();

    setTimeout(() => {
      console.log(card);
      card.remove();
    }, 500);

    // initCards();

    event.preventDefault();
  };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);

window.onload = initCards();

window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || 
    ( typeof window.performance != "undefined" && 
    window.performance.getEntriesByType("navigation")[0].type === "back_forward");
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});