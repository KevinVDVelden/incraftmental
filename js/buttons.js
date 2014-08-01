function getRecipeFromCraftingGrid() {
  var code = '';
  var needed = {};

  $('.craft-square').each(function(){
    if($(this).attr('data-object')){
      code += inventory.getObject($(this).attr('data-object')).symbol;
      if($(this).attr('data-object') in needed){
        needed[$(this).attr('data-object')]++;
      }else{
        needed[$(this).attr('data-object')] = 1;
      }
    }else{
      code += ' ';
    }
  });

  code = code.trim();

  return [ code, needed ]
}
function getMatchingItem( code ) {
  for(var group in inventory.objects){
    for(var object in inventory.objects[group]){
      if(inventory.objects[group][object].recipe == code){
        return inventory.objects[group][object];
      }
    }
  }
}
function formatAnMultiple( baseStr, pluralCount ) {
  var prefix = '';
  var postfix = '';
  if ( pluralCount > 1 ){
    prefix = pluralCount + ' ';
    postfix = 's';
  } else {
    prefix = (['A','E','I','O','U'].indexOf(baseStr[0]) > -1) ? 'an ' : 'a ';
  }

  return prefix  + baseStr + postfix;
}
function handleCraft( needed, item) {
  console.log( 'handleCraft', item, item.slug, item.yield );
  inventory.addObject(item.slug,item.yield);
  // Try to 'pull in' more ingredients
  var replace = true;
  for(material in needed){
    if(inventory.getObject(material).quantity < 10 * needed[material]){
      replace = false;
    }
  }
  if(replace){
    for(material in needed){
      inventory.addObject(material,-10 * needed[material]);
    }
  }else{
    $('.craft-square').removeAttr('data-object');
    $('.craft-square').html('');
  }

  inventory.updateDisplay();

  return replace;
}
function craftCount( n ) {
  var codeNeeded = getRecipeFromCraftingGrid();
  var item = getMatchingItem( codeNeeded[ 0 ] );

  console.log( codeNeeded, item );

  if ( item ) {
    var craftCount;

    for ( craftCount = 0; craftCount < n; craftCount++ ) {
      if ( handleCraft( codeNeeded[ 1 ], item ) ) {
      }
    }

    if ( item.yield ) {
      craftCount *= item.yield;
    }

    console.log(item,craftCount);
    var name = item.display;
    name = formatAnMultiple( name, craftCount );

    main.addAlert( 'Crafted ' + name );
  } else {
    main.addAlert( 'Unable to find item to craft' );
  }
}

var buttons = {
init : function(){
  $('#get-wood').on('click',function(){
    inventory.addObject('wood');
    $('#inventory').show();
    inventory.updateDisplay();
    if(inventory.objects.blocks.wood.quantity >= 10){
      $('#make-planks').show();
    }
  });
  $('#make-planks').on('click',function(){
    var value = inventory.objects.blocks.crafting_table.hasOwned ? 4 : 10;
    if(inventory.objects.blocks.wood.quantity >= value){
      inventory.objects.blocks.wood.quantity -= value;
      inventory.addObject('planks');
      inventory.updateDisplay();
      if(inventory.objects.blocks.planks.quantity >= 4){
        $('#make-crafting').show();
      }
    }
  });
  $('#make-crafting').on('click',function(){
    if(inventory.objects.blocks.planks.quantity >= 4){
      inventory.objects.blocks.planks.quantity -= 4;
      inventory.addObject('crafting_table');
      inventory.updateDisplay();
      $('#crafting').show();
      $('#make-planks').html('Make Planks (4 wood)');
      main.addAlert('Made a Crafting Table!');
    }
  });
  $('.craft-square').on('click',function(e){
    if($(this).attr('data-object')){
      $(this).html("");
      inventory.getObject($(this).attr('data-object')).quantity += 10;
      $(this).removeAttr('data-object');
      inventory.updateDisplay();
      return;
    }
    var object = inventory.selected;
    if(!object){
      main.addMouseAlert('Select an item to craft!',e);
      return;
    }
    if(inventory.getObject(object).quantity >= 10){
      inventory.getObject(object).quantity -= 10;
      $(this).html(inventory.getObject(object).symbol);
      $(this).attr('data-object',object);
      inventory.updateDisplay();
    }else{
      main.addMouseAlert('Not enough to craft (10 required)!',e);
    }
  });
  $('#craft').on('click',function() {
    craftCount( 1 );
  });
  $('#craft_10').on('click',function() {
    craftCount(10);
  });
  $('#craft_100').on('click',function() {
    craftCount(100);
  });
  // init button states
  if(inventory.objects.blocks.wood.hasOwned){
    $('#make-planks').show();
    $('#inventory').show();
  }
  if(inventory.objects.blocks.planks.hasOwned){
    $('#make-crafting').show();
  }
  if(inventory.objects.blocks.crafting_table.hasOwned){
    $('#crafting').show();
  }
  this.hook_inventory();
},

hook_inventory : function(){
  $('.inventory-item').on('click',function(){
    $('.inventory-item').removeClass('selected');
    $(this).addClass('selected');
    inventory.selected = $(this).attr('data-object');
  });
}

};
