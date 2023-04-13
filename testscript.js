var like = document.querySelector('#like');
var dislike = document.querySelector('#dislike');

var chameleon = 0, historian = 0, sensitive = 0, thrillSeeker = 0, traditionalist = 0;


//add listeners for icon buttons & set those up
function init() {
    var cards = document.getElementsByClassName('card');

    for (let i = 0; i < cards.length; i++) {
        new Card ({
            card: cards.item(i)
        });
        
    }

}


//update later
function result() {
    console.log(chameleon + ' ' + historian + ' ' + sensitive + ' ' + thrillSeeker + ' ' + traditionalist);

    if (chameleon > 0) {
      window.location.href = "chameleon.html";
    }
  
}

window.addEventListener("load", init);

window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || 
      ( typeof window.performance != "undefined" && 
      window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      // Handle page restore.
      window.location.reload();
    }
  });