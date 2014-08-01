var main = {

onload : function(){
  inventory.init();
  if('objects' in localStorage){
    inventory.objects = JSON.parse(localStorage['objects']);
  }
  buttons.init();
  window.setInterval(function(){main.tick()}, 1000);
  this.registerTickFunc( inventory.doTools.bind( inventory ), 1000 );
  this.registerTickFunc( inventory.updateDisplay.bind( inventory ), 1000 );
  this.registerTickFunc( villagers.doVillagers.bind( villagers ), 1000 );
},

tick : function() {
    interval = 1000;

    for ( var i = 0; i < this.tickFuncs.length; i++ ) {
        this.tickFuncs[i][2] += interval;

        while ( this.tickFuncs[i][2] > this.tickFuncs[i][1] ) {
            this.tickFuncs[i][0]();
            this.tickFuncs[i][2] -= this.tickFuncs[i][1];
        }
    }
},
registerTickFunc: function( func, interval ) {
    this.tickFuncs.push( [ func, interval, 0 ] );
},
tickFuncs: [],

addAlert : function(text){
  $('#alerts').show();
  var alert = $("<div class='alert'>" + text + "</div>");
  $('#alerts').append(alert);
  setTimeout(function(){
    alert.fadeOut('slow',function(){
      $(this).remove();
      if($('#alerts .alert').length == 0){
        $('#alerts').hide();
      }
    });
  },3000);
},

addMouseAlert : function(text,e){
  var alert = $('<div class="mouse-alert"></div>');
  alert.html(text);
  alert.css({
    'left':e.pageX + 20,
    'top':e.pageY,
    'opacity':1
  });
  alert.animate({
    'top':e.pageY - 50,
    'opacity':0
  },1000,function(){
    alert.remove();
  });
  $('body').append(alert);
}

};

window.onload = main.onload.bind(main);

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomChoice(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
