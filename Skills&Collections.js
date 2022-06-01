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
  leather: {
    2: {
      message: "Small Backpack Recipe",
      reward:
        'addShapedRecipe(["leather","leather","leather","leather","ironingot","leather","leather","leather","leather"],"smallbackpack",1,[2,2,2,2,4,2,2,2,2])',
    },
  },
  cobblestone: {
    1: {
      message: "Stone Tools Recipes",
      reward:
        "addShapedRecipe(['cobblestone', 'cobblestone', 'cobblestone', 'empty', 'stick', 'empty', 'empty', 'stick', 'empty'],'stonepickaxe')",
    },
    2: {
      message: "Stone Furnace Recipe",
      reward:
        "addShapedRecipe(['cobblestone','cobblestone','cobblestone','cobblestone','empty','cobblestone','cobblestone','cobblestone','cobblestone'],'furnace',1,[].set(16, 9).put(1, 4))",
    },
  },
  rottenflesh: {
    1: {
      message: "Undead Sword Recipe",
      reward:
        "addShapedRecipe(['empty', 'rottenflesh', 'empty', 'empty', 'rottenflesh', 'empty', 'ironingot', 'stick', 'ironingot'],'undeadsword')",
    },
    2: {
      message: "Zombie Hat Recipe",
      reward:
        "addShapedRecipe(['zombiefang','rottenflesh','zombiefang','rottenflesh','ironhelmet','rottenflesh'],'zombiehat',1,[2,16,2,16,1,16,0,0,0])",
    },
  },
  logoak: {
    2: {
      message: "Efficient Axe Recipe",
      reward:
        "addShapedRecipe(['logoak', 'logoak', 'planksoak', 'logoak', 'stick', 'empty', 'empty', 'ironingot', 'empty'],'efficientaxe',1,[16,16,16,16,8,0,0,4,0])",
    },
  },
  sugarcane: {
    2: {
      message: "Paper Recipe",
      reward:
        'addShapelessRecipe(["sugarcane","sugarcane","sugarcane"],"paper",3)',
    },
  },
  cactus: {
    2: {
      message: "Green Dye Recipe",
      reward: 'addFurnaceRecipe("cactus","dyegreen",60)',
    },
  },
  coal: {
    2: {
      message: "Smelting Touch Enchanting Paste",
      reward:
        'addShapedRecipe(["coal","paper","coal","paper","ironblock","paper","coal","paper","coal"],"enchantingpaste",1,[].set(16,9).put(4,4),{enchants : {smeltingtouch:1}})',
    },
  },
  ironingot: {
    2: {
      message: "Glitch Compactor 3000 Recipe",
      reward:
        'addShapedRecipe(["ironingot","dyegreen","ironingot","dyegreen",empty,"dyegreen","ironingot","dyegreen","ironingot"],"greenbox",1,[].set(4,9).put(1,4)); addShapedRecipe(["redstone","ironblock","redstone","redstoneblock","greenbox","redstoneblock","redstone","ironblock","redstone"],"glitchcompactor")',
    },
  },
}

function levelUpSkill(skill) {
  if (steve.skillxp[skill] >= skilllevelxp[steve.skilllevels[skill]]) {
    steve.skilllevels[skill]++
    e["skilllevel" + skill].innerText = RomanNumerals.toRoman(
      steve.skilllevels[skill]
    )
    if (loaded) {
      steve.addCoins((steve.skilllevels[skill] * 100) >> 0)
      updateSkillXp(skill)
      recalculateStats()
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
      steve.stats.totalDamageMultiplier += 0.04
      steve.stats.combatfortune += 5
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

            addShapedRecipe(
              [
                "leather",
                "leather",
                "leather",
                "leather",
                "empty",
                "leather",
                "leather",
                "empty",
                "leather",
              ],
              "leatherleggins",
              1,
              [3, 3, 3, 3, 0, 3, 3, 0, 3]
            )

            addShapedRecipe(
              ["leather", "empty", "leather", "leather", "empty", "leather"],
              "leatherboots",
              1,
              [3, 0, 3, 3, 0, 3]
            )
          }
          break

        default:
          break
      }

      break

    case "mining":
      steve.stats.miningfortune += 10
      break
    default:
      break
  }
}

function addCollectionItem(item, amount) {
  steve.collectionitems[item] += amount
  levelUpCollection(item)
}
function getCollectionAmounts(item) {
  switch (item) {
    case "G":
      break

    default:
      return [0, 5, 50, 100, 2000, 5000]
  }
}

function levelUpCollection(item) {
  if (
    steve.collectionitems[item] >=
    getCollectionAmounts(item)[steve.collectionlevels[item] + 1]
  ) {
    steve.collectionlevels[item]++
    giveCollectionReward(item, steve.collectionlevels[item])

    return true
  }
  return false
}

function giveCollectionReward(item, lvl) {
  if (collections[item][lvl] != undefined) eval(collections[item][lvl].reward)

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
