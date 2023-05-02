'use strict';

var quizContainer = document.querySelector('.quiz');
var allCards = document.querySelectorAll('.quiz--card');
var nope = document.getElementById('nope');
var love = document.getElementById('love');
var skip = document.getElementById('skip');
var cont = document.getElementById('continue');
var close = document.getElementById('close');
var cardIndex = 1;

var chameleon = 0, historian = 0, sensitive = 0, thrillSeeker = 0, traditionalist = 0;

function initCards() {
  var newCards = document.querySelectorAll('.quiz--card:not(.removed)');

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
  });
  
  quizContainer.classList.add('loaded');
}

initCards();

allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on('pan', function (event) {
    el.classList.add('moving');
  });

  //handle when user is moving card
  hammertime.on('pan', function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    if (!event.target.isEqualNode(document.querySelector('.quiz--card'))) {
      event.target = event.target.parentElement;
    }

    //don't allow users to interact with cards other than the top card
    if (event.target.style.getPropertyValue('z-index') != 10) { return; }

    //add active animations to like/dislike buttons for users who are swiping (deltaX threshold)
    if (event.deltaX > 170) {
      love.firstChild.classList.add('active');
    } else if (event.deltaX < -170) {
      nope.firstChild.classList.add('active');
    } else {
      love.firstChild.classList.remove('active');
      nope.firstChild.classList.remove('active');
    }

    event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
  });

  //handle after user stops moving card
  hammertime.on('panend', function (event) {
    el.classList.remove('moving');

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 170 && Math.abs(event.velocityX) < 0.5;

    //add icon animation when user swipes quickly (aka doesn't hit deltaX threshold)
    if(event.velocityX >= 0.5) {
      love.firstChild.classList.add('active');
    } else if (event.velocityX <= -0.5) {
      nope.firstChild.classList.add('active');
    }

    if (!event.target.isEqualNode(document.querySelector('.quiz--card'))) {
      event.target = event.target.parentElement;
    }

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


      setTimeout(() => {
        love.firstChild.classList.remove('active');
        nope.firstChild.classList.remove('active');
      }, 400);

      event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
      initCards();

      //add to appropriate result sum
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

      var cards = document.querySelectorAll('.quiz--card:not(.removed)');
      if (!cards.length) result();
      setTimeout(() => {
        event.target.remove();
      }, 500);

      cardIndex++;
      //updating progress display
      document.getElementById('progress').innerHTML = cardIndex + " of 10";
      //update skip confirmation message when user is more than halfway through
      if (cardIndex == 6) {
        document.getElementById('overlayText').innerHTML = 'You\'re so close to  discovering your unique artistic preferences and style!';
      }
    }
  });
});

function result() {
  var types = {
    'chameleon': chameleon,
    'historian': historian,
    'sensitive': sensitive,
    'thrillSeeker': thrillSeeker,
    'traditionalist': traditionalist
  };

  //redirect to appropriate result type

  switch(Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b)) {
    case ('chameleon'): window.location.href = 'chameleon.html'; break;
    case ('historian'): window.location.href = 'historian.html'; break;
    case ('sensitive'): window.location.href = 'sensitive.html'; break;
    case ('thrillSeeker'): window.location.href = 'thrillSeeker.html'; break;
    case ('traditionalist'): window.location.href = 'traditionalist.html'; break;
  }

}

//button to 'like' artwork
function createButtonListener(love) {
  return function (event) {
    var cards = document.querySelectorAll('.quiz--card:not(.removed)');
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    if (love) {
      card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      //add to appropriate result sum
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
      initCards();
    }

    card.classList.add('removed');
    var cards = document.querySelectorAll('.quiz--card:not(.removed)');
    if (!cards.length) result();

    setTimeout(() => {
      card.remove();
    }, 500);

    cardIndex++;
    //updating progress display
    document.getElementById('progress').innerHTML = cardIndex + " of 10";
    //update skip confirmation message when user is more than halfway through
    if (cardIndex == 6) {
      document.getElementById('overlayText').innerHTML = 'You\'re so close to  discovering your unique artistic preferences and style!';
    }

    event.preventDefault();
  };
}

//buttons that open/close the skip overlay
function skipListener() {
  document.getElementById('overlay').style.visibility = 'visible';
}

function contListener()  {
  document.getElementById('overlay').style.visibility = 'hidden';
}

function closeListener() {
  document.getElementById('overlay').style.visibility = 'hidden';
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);
skip.addEventListener('click', skipListener);
cont.addEventListener('click', contListener);
close.addEventListener('click', closeListener);


window.onload = () => {
  // demo of swiping to show users how to interact
  var demo = document.querySelector('.quiz--card');
  demo.style.transform ='translate(50px,0px) rotate(10deg)';
  demo.style.transition = '0.5s';
  setTimeout(() => {
    demo.style.transform ='translate(-50px,0px) rotate(-10deg)';
  }, 500);
  setTimeout(() => {
    demo.style.transform ='';
  }, 1000);
  initCards();
};

window.addEventListener( "pageshow", function ( event ) {
  //reload page if user goes backwards
  if(window.performance.getEntriesByType('navigation')[0] == null) return;

  var historyTraversal = event.persisted || 
    ( typeof window.performance != "undefined" && 
    window.performance.getEntriesByType("navigation")[0].type === "back_forward");
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});