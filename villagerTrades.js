const villagerTrades = {
    john: [
      {
        item:  new classes.intimidationtalisman(1),
        price: { rottenflesh: 64, coins: 10000} 
      },
      {
        item:  new classes.villagetalisman(1),
        price: { coins: 5000} 
      },
      
    ],

   
   
   }

  const LootTable = {
   treeoak: [
       new Loot("logoak",100,"foraging",4,4,"charcoal","","logoak",function(){ return !steve.getTool().match1word("shears")}),
       new Loot("steeleaf",100,"foraging",1,4,"none","shears"),
       new Loot("treetalisman",1)
   ],
   sugarcane: [
     new Loot("sugarcane",100,"farming")
   ],
   stone: [
    new Loot("cobblestone",100,"mining",1,1,"stone")
   ],
   ironore: [
    new Loot("ironore",100,"mining",1,1,"ironingot","","ironingot")
   ],
   coalore: [
    new Loot("coal",100,"mining")
   ],
   redstoneore: [
    new Loot("redstone",100,"mining",3,6)
   ],
   diamondore:[
     new Loot("diamond",100,"mining")
   ],
   cactus: [
     new Loot("cactus",100,"farming",1,1,"dyegreen")
   ],
   zombie: [
     new Loot("rottenflesh",100,"combat",1,4),
     new Loot("zombiefang",20,"combat",1,3),
   ],
   cow: [
     new Loot("leather",80,"combat",1,4),
     new Loot("beef",100,"combat",1,3,"steak")
   ],
   chicken: [
    new Loot("feather",80,"combat",1,4),
    new Loot("rawchicken",100,"combat",1,3,"cookedchicken")
   ], 
   brutezombie: [
    new Loot("rottenflesh",100,"combat",4,8),
    new Loot("zombiefang",60,"combat",2,4),
   ]



  }
