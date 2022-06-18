const skilllevelxp = [
  50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425, 32425,
  47425, 67425, 97425, 147425, 222425, 322425, 522425, 822425, 1222425, 1722425,
  2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425, 9322425,
  10722425, 12222425, 13822425, 15522425, 17322425, 19222425, 21222425,
  23322425, 25522425, 27822425, 30222425, 32722425, 35322425, 38072425,
  40972425, 44072425, 47472425, 51172425, 55172425, 59472425, 64072425,
  68972425, 74172425, 79672425, 85472425, 91572425, 97972425, 104672425,
  111672425, 2000000000,
]

const RomanNumbers = [
  "0",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI",
  "XXII",
  "XXIII",
  "XXIV",
  "XXV",
  "XXVI",
  "XXVII",
  "XXVIII",
  "XXIX",
  "XXX",
  "XXXI",
]

// const collections = ["cobblestone","logoak","rottenflesh","sugarcane","cactus","coal","ironingot","leather"]
const collections = {
  leather: [
     {
      message: "Small Backpack Recipe",
      reward:
        'addShapedRecipe(["leather","leather","leather","leather","ironingot","leather","leather","leather","leather"],"smallbackpack",1,[2,2,2,2,4,2,2,2,2])',
      amount: 50,
      
      
    },
  ],
  cobblestone: [
    {
      message: "Stone Tools Recipes",
      reward:
        "addShapedRecipe(['cobblestone', 'cobblestone', 'cobblestone', 'empty', 'woodtoughrod', 'empty', 'empty', 'woodtoughrod', 'empty'],'stonepickaxe'); addShapedRecipe(['cobblestone', 'cobblestone',  'empty', 'cobblestone','woodtoughrod', 'empty', 'empty', 'woodtoughrod', 'empty'],'stoneaxe');addShapedRecipe([empty, 'cobblestone', empty, 'empty', 'cobblestone', 'empty', 'empty', 'woodtoughrod', 'empty'],'stonesword');",
        amount: 10
    },
   {
      message: "Stone Furnace Recipe",
      reward:
        "addShapedRecipe(['cobblestone','cobblestone','cobblestone','cobblestone','empty','cobblestone','cobblestone','cobblestone','cobblestone'],'furnace',1,[].set(16, 9).put(1, 4))",
      amount: 200
    },
  ],
  rottenflesh: [
     {
      message: "Undead Sword Recipe",
      reward:
        "addShapedRecipe(['empty', 'rottenflesh', 'empty', 'empty', 'rottenflesh', 'empty', 'ironingot', 'stick', 'ironingot'],'undeadsword')",
        amount:32
    },
    {
      message: "Zombie Hat Recipe",
      reward:
        "addShapedRecipe(['zombiefang','rottenflesh','zombiefang','rottenflesh','ironhelmet','rottenflesh'],'zombiehat',1,[2,16,2,16,1,16,0,0,0])",
      amount:256
    },
    {
      message: "Glitched Rotten Flesh Recipe",
      reward: "addGlitchRecipe('rottenflesh')",
      amount: 512
    },
    {
      message: "Zombie Heart Recipe",
      reward: "addShapedRecipe(['glitchedrottenflesh','glitchedrottenflesh','glitchedrottenflesh','glitchedrottenflesh','zombiehat','glitchedrottenflesh','glitchedrottenflesh','glitchedrottenflesh','glitchedrottenflesh'],'zombieheart',1,[8,8,8,8,0,8,8,8,8])",
      amount: 1500
    }

  ],
  logoak: [
    
     {
      message: "Efficient Axe Recipe",
      reward:
        "addShapedRecipe(['logoak', 'logoak', 'planksoak', 'logoak', 'woodtoughrod', 'empty', 'empty', 'ironingot', 'empty'],'efficientaxe',1,[16,16,16,16,8,0,0,4,0])",
        amount: 32,
    },
    {
      message: "Steeleaf Handle Recipe",
      reward: "addShapedRecipe([empty,'steeleaf','ironingot','steeleaf', 'woodtoughrod' ,'steeleaf','ironingot',  'steeleaf',empty],'steeleafhandle')",
      amount:128
    }
  
  ],
  sugarcane: [
    {
      message: "Paper Recipe",
      reward:
        'addShapedRecipe(["sugarcane","sugarcane","sugarcane"],"paper",3)',
      amount: 32
    },
    {
      
      message: "Enchanting Book Recipe",
      reward: 'addShapedRecipe([empty,"glitchedredstone",empty,"string","book","string"],"enchantingbook",1,[0,2,0,32,1,32])',
      amount: 256
    }
  ],
  cactus: [
     {
      message: "Green Dye Recipe",
      reward: 'addFurnaceRecipe("cactus","dyegreen",60)',
      amount: 16
    },
  ],
  coal: [
    {
      message: "Smelting Touch Enchanting Paste",
      reward:
        'addShapedRecipe(["coal","paper","coal","paper","ironblock","paper","coal","paper","coal"],"enchantingpaste",1,[].set(16,9).put(4,4),{enchants : {smeltingtouch:1}})',
        amount: 32,
    },
  ],
   
  ironingot: [
    {
      message: "Glitch Compactor 3000 Recipe",
      reward:
        'addShapedRecipe(["ironingot","dyegreen","ironingot","dyegreen",empty,"dyegreen","ironingot","dyegreen","ironingot"],"greenbox",1,[].set(4,9).put(1,4)); addShapedRecipe(["redstone","ironblock","redstone","redstoneblock","greenbox","redstoneblock","redstone","ironblock","redstone"],"glitchcompactor")',
        amount: 128,
    },
  ],
  redstone: [
    {
      message: "Glitched Redstone Recipe",
      reward: "addGlitchRecipe('redstone')",
      amount: 512
    }
  ]
}

function levelUpSkill(skill) {
  if (steve.skillxp[skill] >= skilllevelxp[steve.skilllevels[skill]]) {
    steve.skilllevels[skill]++
    e["skilllevel" + skill].innerText = RomanNumerals.toRoman(
      steve.skilllevels[skill]
    )
    if (isLoaded) {
      steve.addCoins((steve.skilllevels[skill] * 100) >> 0)
      updateSkillXp(skill)
    
     // recalculateStats()
    }
    giveSkillReward(skill, steve.skilllevels[skill])
    changeSkillBar(skill)
    return true
  }
  changeSkillBar(skill)
  updateSkillXp(skill)
  return false
}
function loadskills() {
  for (const key in skillnames) {
    while (levelUpSkill(key)) {}
  }
}
function changeSkillBar(skill) {
  e["skillbar" + skill].style.width =
    (steve.skillxp[skill] / skilllevelxp[steve.skilllevels[skill]]) * 100 + "%"
}
function updateSkillXp(skill) {
  e["skillxpamount" + skill].innerText =
    steve.skillxp[skill].formate(5) +
    "/" +
    skilllevelxp[steve.skilllevels[skill]].formate(5)
}




function addSkillXP(skill, a) {
  steve.skillxp[skill] += a
  levelUpSkill(skill)
}

function giveSkillReward(skill, lvl, l = 0) {
  switch (skill) {
    case "combat":
      steve.skillstats.totalDamageMultiplier +=  0.04
      
      steve.skillstats.combatfortune += 5
      switch (lvl) {
        case 2:
          if (l == 0) {
            addShapedRecipe(
              ["leather", "leather", "leather", "leather", "empty", "leather"],
              "leatherhelmet",
              1,
              [3, 3, 3, 3, 0, 3]
            )

            addShapedRecipe(
              [
                "leather",
                "empty",
                "leather",
                "leather",
                "leather",
                "leather",
                "leather",
                "leather",
                "leather",
              ],
              "leatherchestplate",
              1,
              [3, 0, 3, 3, 3, 3, 3, 3, 3]
            )

            // addShapedRecipe(
            //   [
            //     "leather",
            //     "leather",
            //     "leather",
            //     "leather",
            //     "empty",
            //     "leather",
            //     "leather",
            //     "empty",
            //     "leather",
            //   ],
            //   "leatherleggings",
            //   1,
            //   [3, 3, 3, 3, 0, 3, 3, 0, 3]
            // )

            // addShapedRecipe(
            //   ["leather", "empty", "leather", "leather", "empty", "leather"],
            //   "leatherboots",
            //   1,
            //   [3, 0, 3, 3, 0, 3]
            // )
          }
          break

        default:
          break
      }

      break

    case "mining":
      steve.skillstats.miningfortune += 10
      break
    default:
      break
  }
}

function addCollectionItem(item, amount) {
  if(steve.collectionitems[item] != undefined)
  {
    steve.collectionitems[item] += amount
    levelUpCollection(item)

  }
}


function levelUpCollection(item) {
  if (
    collections[item][steve.collectionlevels[item]] &&
    steve.collectionitems[item] >=
    collections[item][steve.collectionlevels[item]].amount
  
    ) {
      giveCollectionReward(item, steve.collectionlevels[item])
      steve.collectionlevels[item]++
    
    return true
  }
  return false
}

function giveCollectionReward(item, lvl) {
  if (collections[item][lvl] != undefined){
    eval(collections[item][lvl].reward)
   
    // notification([getName(item)+ " Collection", "Level UP!","Reward",collections[item][lvl].message])

  } 
    

  // switch (item) {
  //   case "cobblestone":
  //     switch (lvl) {
  //       case 1:
  //         // addShapedRecipe(['cobblestone', 'cobblestone', 'cobblestone', 'empty', 'stick', 'empty', 'empty', 'stick', 'empty'],"stonepickaxe")
  //         break;
  //       case 2:
  //
  //         break
  //     }
  //     break;
  //       case "rottenflesh":
  //     switch (lvl) {
  //       case 1:
  //         addShapedRecipe(['empty', 'rottenflesh', 'empty', 'empty', 'rottenflesh', 'empty', 'ironingot', 'stick', 'ironingot'],"undeadsword")
  //         break;
  //     }

  //     break;

  //     case "logoak":
  //     switch (lvl) {
  //       case 2:
  //         addShapedRecipe(["logoak","logoak","planksoak","logoak","stick",empty,empty,"ironingot"],"efficientaxe",1,[16,16,16,16,8,0,0,4,0])
  //         break;
  //     }

  //     break;

  //     /*
  //     case "cobblestone":
  //     switch (lvl) {
  //       case 1:

  //         break;
  //     }

  //     break;
  //     */

  // }
}

function loadCollections() {
  for (const key in collections) {
    steve.collectionlevels[key] = 0
    while (levelUpCollection(key)) {}
  }
}
