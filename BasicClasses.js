let classes = {}
const freezetimer = 5000
const freezeRange = 20


classes.empty = class {
  constructor(amount = 0) {
    this.name = "empty"
    this.description = ""
    this.description2 = ""
    this.amount = amount
    this.maxStackSize = 64
    this.type = "none"
    this.burnvalue = 0
    this.Rname = ""
    this.rarity = 0
    this.customcolor = "#222222"
    this.stats = {}
    this.additionalstats = {}
    this.enchants = {}
  }
  postloadConstructor() {}
  getEmpty() {
    return this.maxStackSize - this.amount
  }
  useAbility() {}
  withTag(tag) {
    this.addTag(tag)
  }
  addTag(tag) {
    if (tag) {
      for (const key in tag) {
        if (typeof tag[key] == "object") {
          for (const key2 in tag[key]) {
            this[key][key2] = tag[key][key2]
          }
        } else this[key] = tag[key]
      }
    }
  }
}
classes.block = class extends classes.empty {
  constructor(amount = 0) {
    super(amount)
    this.hardness = 500
    this.isBreakable = true
    this.tool = "none"

    this.restrictTool = false
    this.tier = 0
    this.replacement = "bedrock"

    this.xp = {
      amount: 0,
      type: "mining",
    }
  }
  generateDrop() {
    let drops = []
    if (LootTable[this.name]) {
      for (const key of LootTable[this.name]) {
        if (steve.getTool().match1word(key.tool) && key.condition()) {
          let name = key.item
          if (key.smeltsInto != "none" && steve.getEnchant("smeltingtouch"))
            name = key.smeltsInto
          const amount =
            (randomItem(key.min, key.max, key.chance) *
              steve.fortunes[key.type]()) >>
            0
          if (amount) {
            drops.push(new classes[name](amount))
            addCollectionItem(key.collection, amount)
          }
        }
      }
    } else drops.push(new classes[this.name](1))

    if (drops.length) addSkillXP(this.xp.type, this.xp.amount)

    return drops
  }
}
classes.item = class extends classes.empty {
  constructor(amount = 0) {
    super(amount)
    this.stats = {}
  }
}
classes.stonetype = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "stone"
    this.tool = "pickaxe"

    this.restrictTool = true
    this.replacement = "bedrock"
  }
}
classes.tool = class extends classes.item {
  constructor(amount = 0) {
    super(amount)
    this.name = "tool"
    this.maxStackSize = 1
  }
}
classes.tree = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "tree"
    this.tool = "axe shears"
    this.logs = 0
    this.xp = 0
  }

  // generateDrop() {
  //   let drops = []
  //   if (steve.stats.tool.match1word("shears")) {
  //     drops.push(new classes["steeleaf"]( 2 * steve.getForagingFortune()))
  //   } else if (steve.itemInHand.name == "efficientaxe")
  //     drops.push(
  //       new classes["planks" + this.name.slice(4)](
  //         Math.floor(this.logs * 5 * steve.getForagingFortune())
  //       )
  //     )
  //   else if (steve.enchants.smeltingtouch)
  //     drops.push(
  //       new classes["charcoal"](
  //         Math.floor(this.logs * steve.getForagingFortune())
  //       )
  //     )
  //   else
  //     drops.push(
  //       new classes["log" + this.name.slice(4)](
  //         Math.floor(this.logs * steve.getForagingFortune())
  //       )
  //     )
  //   addSkillXP("foraging", this.xp)
  //   addCollectionItem(
  //     "log" + this.name.slice(4),
  //     (this.logs * steve.getForagingFortune()) >> 0
  //   )

  //   return drops
  // }
}
classes.machine = class extends classes.empty {
  constructor(amount = 0) {
    super(amount)
    this.name = "machine"
    this.type = "machine"

    this.inventoryslotid = -1
    this.maxStackSize = 1
    this.recipetimer = -1
    this.inventory = {}
  }
  doRecipe() {}
  stoprecipe() {}
  checkvalidnes() {}
  /**
   * searches for most left item in machine input
   */
  mostLeftItem() {
    for (const key in this.inventory) {
      if (key.includes("input") && this.inventory[key].name != empty)
        return this.inventory[key].name
    }
    return "empty"
  }
  countItem(filter) {
    let amount = 0
    for (const key in this.inventory) {
      if (key.includes("input") && this.inventory[key].name == filter)
        amount += this.inventory[key].amount
    }
    return amount
  }
  removeFromInventory(item, amount) {
    let iter = 0
    for (const key in this.inventory) {
      if (
        key.includes("input") &&
        this.inventory[key].name == item &&
        amount > 0
      ) {
        if (this.inventory[key].amount >= amount) {
          this.inventory[key] = reduceStack(this.inventory[key], amount)
          amount = 0
        } else {
          amount -= this.inventory[key].amount
          this.inventory[key] = reduceStack(
            this.inventory[key],
            this.inventory[key].amount
          )
        }
        putItemInslot(
          this.inventory[key],
          e[this.name]["slot" + iter],
          e[this.name]["slot" + iter + "amount"]
        )
      }
      iter++
    }
  }
  addToInventory(item) {
    let iter = 0
    for (const key in this.inventory) {
      if (item.name != "empty")
        if (!key.includes("output")) {
          if (this.inventory[key].name == item.name) {
            if (this.inventory[key].getEmpty() >= item.amount) {
              this.inventory[key].amount += item.amount
              item = reduceStack(item, item.amount)
            } else {
              item = reduceStack(item, this.inventory[key].getEmpty())
              this.inventory[key].amount = this.inventory[key].maxStackSize
            }
          } else if (this.inventory[key].name == "empty") {
            this.inventory[key] = Object.assign(
              Object.create(Object.getPrototypeOf(item)),
              item
            )
            item = reduceStack(item, item.amount)
          }
        }
      if (thismachinei == this.inventoryslotid) {
        putItemInslot(
          this.inventory[key],
          e[this.machinetype]["slot" + iter],
          e[this.machinetype]["slot" + iter + "amount"]
        )
      }
      iter++
    }

    return item
  }
}
classes.backpack = class extends classes.empty {
  constructor(amount = 0) {
    super(amount)
    this.name = "backpack"
    this.type = "backpack"
    this.maxStackSize = 1

    this.inventory = {}
    this.inventorySlots = 0
    this.description = "Inventory Slots: " + this.inventorySlots
    this.buildinventory()
  }
  buildinventory() {
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory["slot" + i] = new classes.empty()
    }
  }
  addToInventory(item) {
    let iter = 0
    for (const key in this.inventory) {
      if (item.name != "empty")
        if (this.inventory[key].name == item.name) {
          if (this.inventory[key].getEmpty() >= item.amount) {
            this.inventory[key].amount += item.amount
            item = reduceStack(item, item.amount)
          } else {
            item = reduceStack(item, this.inventory[key].getEmpty())
            this.inventory[key].amount = this.inventory[key].maxStackSize
          }
        } else if (this.inventory[key].name == "empty") {
          this.inventory[key] = Object.assign(
            Object.create(Object.getPrototypeOf(item)),
            item
          )
          item = reduceStack(item, item.amount)
        }

      putItemInslot(
        this.inventory[key],
        e.backpack["slot" + iter],
        e.backpack["slot" + iter + "amount"]
      )

      iter++
    }

    return item
  }
}
classes.consumable = class extends classes.empty {
  constructor(amount = 0) {
    super(amount)
    this.name = "consumable"
    this.type = "food"
    this.addedstats = {}
    this.effectLength = 0
  }
  useAbility() {
    if (caneat) {
      caneat = false

      steve.inventory[currentHotbarSlot] = reduceStack(
        steve.inventory[currentHotbarSlot],
        1
      )
      let bottleneck = Object.assign(
        Object.create(Object.getPrototypeOf(this.addedstats)),
        this.addedstats
      )
      delete bottleneck.health
      steve.food[alphabetCode()] = {
        time: this.effectLength * 1000,
        stats: bottleneck,
      }
      selectHotbarItem(currentHotbarSlot)

      setTimeout(function () {
        caneat = true
      }, 1000)
    }
  }
}
classes.mob = class {
  constructor(x, y, id) {
    this.name = "mob"
    this.mobtype = "none"
    this.width = 0.8
    this.id = id
    this.height = 0.8
    this.sx = x
    this.sy = y
    this.xp = 0
    this.x = x
    this.y = y
    this.lvl = 0
    this.stats = {
      health: 200,
      maxhealth: 200,
      damage: 100,
      speed: 50,
      range: 2,
      angerrange: 10,
      attacktime: 1000,
    }
    this.isangered = false
    this.isAlive = true
    this.respawntimer = 2000

    this.state = "passive"
    this.type = "angry"
    this.attacktimer = 0
    this.angerinterval = 0
    this.isFrozen = false
    setInterval(this.checkForFreeze.bind(this),freezetimer)
  }
  checkForFreeze(){
    if(distnaseBetweenTargets({x:steve.x, y:steve.y},{x:this.x,y:this.y}) > freezeRange){
      if(!this.isFrozen) {
        this.freze()
      }
    }else if(this.isFrozen){
      this.unfreze()
    }

  }

  create() {
    this.diffrencex = +(5 - this.width).toFixed(2)
    this.diffrencey = +(5 - this.height).toFixed(2)
    let tag = document.createElement("div")
    tag.className = "mob " + this.name

    tag.style.display = "none"
    tag.style.width = this.width.blocks().px()
    tag.style.height = this.height.blocks().px()
    if (isMapModeOn) {
      tag.setAttribute(
        "onclick",
        "onMapClick({offsetX:" +
          this.x +
          ",offsetY:" +
          this.y +
          "},false," +
          this.id +
          ")"
      )
    } else {
      tag.setAttribute("onclick", "steve.damageMob(" + this.id + ")")
      tag.setAttribute("onmouseenter", "makeMonsterHotbar(" + this.id + ")")
    }
    tag.id = "mob" + this.id
    e.mapcontainer.appendChild(tag)
    e["mob" + this.id] = tag
    mobs[this.id] = this

  }
  spawn() {
    this.x = this.sx
    this.y = this.sy
    this.isAlive = true
    e["mob" + this.id].style.display = "block"
    e["mob" + this.id].style.left = this.x.blocks().px()
    e["mob" + this.id].style.top = this.y.blocks().px()
    if (!isMapModeOn && !this.isFrozen) {
      if (this.type == "angry") {
        this.getAngry()
        this.angerinterval = setInterval(this.getAngry.bind(this), 1000)
      }
      this.randominterval = setTimeout(
        this.randommove.bind(this),
        randomNumber(2000, 10000)
      )
    }
  }
  die() {
    playMobHowl(this.name, "death", 0)
    document.dispatchEvent(
      new CustomEvent("mobdeath", {
        detail: { name: this.name },
      })
    )

    steve.kills++
    dumbtoinventory(this.generateDrop())
    e["mob" + this.id].style.opacity = 1
    this.stats.health = this.stats.maxhealth
    clearInterval(this.angerinterval)
    clearInterval(this.randominterval)
    this.isAlive = false
    this.state = "passive"
    addSkillXP("combat", this.xp)
    e["mob" + this.id].style.display = "none"
    this.respawntimer = setTimeout(this.spawn.bind(this), this.respawntimer)
  }
  freze() {
    this.isFrozen = true
    this.state = "passive"
    clearInterval(this.attacktimer)
    clearInterval(this.angerinterval)
    clearInterval(this.randominterval)
    clearInterval(this.shottimer)
  }
  unfreze() {
  
    this.isFrozen = false
    if (!isMapModeOn) {
      if (this.type == "angry") {
        this.getAngry()
        this.angerinterval = setInterval(this.getAngry.bind(this), 1000)
      }
      this.randominterval = setTimeout(
        this.randommove.bind(this),
        randomNumber(2000, 10000)
      )
    }
  }
  destroy() {
    clearInterval(this.angerinterval)
    clearInterval(this.randominterval)
    clearInterval(this.respawntimer)
    clearInterval(this.shottimer)
    this.isAlive = false

    e["mob" + this.id].style.display = "none"
  }
  isPlayerInRange() {
    return (
      (steve.x - (this.x + this.width / 2)) ** 2 +
        (steve.y - (this.y + this.height / 2)) ** 2 <=
      ((this.stats.range + 1)) ** 2
    )
  }
  generateDrop() {
    let drops = []
    if (LootTable[this.name]) {
      for (const key of LootTable[this.name]) {
        if (steve.getTool().match1word(key.tool)) {
          let name = key.item
          if (key.smeltsInto != "none" && steve.enchants.smeltingtouch)
            name = key.smeltsInto
          const amount =
            (randomItem(key.min, key.max, key.chance) *
              steve.fortunes[key.type]()) >>
            0
          if (amount) {
            drops.push(new classes[name](amount))
            addCollectionItem(key.collection, amount)
          }
        }
      }
    }

    if (drops.length) addSkillXP("combat", this.xp)

    return drops
  }
  isPlayerInAngryRange() {
    return (
      (steve.x - (this.x + this.width / 2)) ** 2 +
        (steve.y - (this.y + this.height / 2)) ** 2 <=
      ((this.stats.angerrange + 1)) ** 2
    )
  }
  getAngry() {
    if (
      this.isPlayerInAngryRange() &&
      this.isAlive &&
      this.state != "angry" &&
      (this.lvl > steve.getStat("intimidationlevel") ||
        this.stats.health != this.stats.maxhealth)
    ) {
      //comsole.log("ID", this.id, this.name, "got Angry")
      clearInterval(this.angerinterval)
      this.angerinterval = 0
      this.state = "angry"
      this.movetoplayer()
    }
  }
  getSpeed() {
    return this.stats.speed / 1000
  }
  move(vectorspeed) {
    if (this.isAlive) {
      let oldcoords = [this.y, this.x]
      {
        
        this.y += vectorspeed[1]
        this.y = this.y.fixed(2)
       // console.log("y1",this.y)
        if(checkMapForBlock(this.y,this.x,this.width,this.height)) 
        this.y = oldcoords[0]
        //console.log("y2",this.y)
        
        this.x += vectorspeed[0]
        this.x = this.x.fixed(2)
        if(checkMapForBlock(this.y,this.x,this.width,this.height)) this.x = oldcoords[1]

     

        e["mob" + this.id].style.top = this.y.blocks().px()
        e["mob" + this.id].style.left = this.x.blocks().px()
      }
    }
  }
  attackplayer() {
    if (this.isPlayerInRange() && !isBlockBetween(steve, this)) {
      this.damagePlayer()
    }
    this.attacktimer = 0
    if (this.state == "angry" && this.isAlive) {
      this.movetoplayer()
    }
  }

  randommove() {
    if (this.state != "angry" && this.isAlive) {
      playMobHowl(this.name, "step")
      let vectorspeed = [
        +(
          (randomNumber(this.getSpeed() * 8500, this.getSpeed() * 11500) /
          10000) *
          randomPlusMinus()
        ).toFixed(2),
        +(
          (randomNumber(this.getSpeed() * 8500, this.getSpeed() * 11500) /
          10000) *
          randomPlusMinus()
        ).toFixed(2),
      ]
 
      for (let i = 1; i < randomNumber(25, 50); i++) {
        setTimeout(this.move.bind(this), i * 25, vectorspeed)
      }
    }
    const timer = randomNumber(5000, 20000)

    this.randominterval=  setTimeout(this.randommove.bind(this), timer)
  }
  movetoplayer() {
    if (this.attacktimer == 0 && this.isAlive) {
      if (this.isPlayerInRange()) {
        this.attacktimer = setTimeout(
          this.attackplayer.bind(this),
          this.stats.attacktime || 1000
        )
      } else {
        playMobHowl(this.name, "step")

        let hipon = Math.sqrt((this.x - steve.x) ** 2 + (this.y - steve.y) ** 2)
        let angleSin = Math.abs(this.x - steve.x) / hipon
        //vectorspeed[deltax,deltay]
        let vectorspeed = [
          +(this.getSpeed() * angleSin * (steve.x > this.x ? 1 : -1)).toFixed(
            2
          ),
          +(
            this.getSpeed() *
            Math.cos(Math.asin(angleSin)) *
            (steve.y > this.y ? 1 : -1)
          ).toFixed(2),
        ]
        for (let i = 1; i < 41; i++) {
          setTimeout(this.move.bind(this), i * 25, vectorspeed)
        }

        if (this.state == "angry" && this.isAlive) {
          setTimeout(this.movetoplayer.bind(this), 1000)
        }
      }
    }
  }
  dealDamage() {
    new Howl({
      src: [
        "./sounds/damage/hit" + (1 + Math.floor(Math.random() * 3)) + ".ogg",
      ],
    }).play()
    steve.stats.health -=
      (this.stats.damage * steve.getDamageReduction(this.name)) >> 0
    steve.updateheathbar()
  }
  damagePlayer() {
    this.dealDamage()
  }
  knockback() {
    for (let i = 0; i < 5; i++) {
      let hipon = Math.sqrt((this.x - steve.x) ** 2 + (this.y - steve.y) ** 2)
      let angleSin = Math.abs(this.x - steve.x) / hipon
      let vectorspeed = [
        +(this.getSpeed()*4 * angleSin * (steve.x > this.x ? -1 : 1)).toFixed(
          2
        ),
        +(
          this.getSpeed()*4 *
          Math.cos(Math.asin(angleSin)) *
          (steve.y > this.y ? -1 : 1)
        ).toFixed(2),
      ]
      setTimeout(this.move.bind(this), i * 25, vectorspeed)
    }
  }
}

classes.accessorybag = class {
  constructor() {
    this.inventory = []
    this.name = "accessorybag"
    this.inventory.set(new classes.empty(), maxaccesoriesslots)
    this.families = []
  }
  addToInventory(item, slot = undefined) {
    if (slot == undefined) slot = this.getEmptyInventorySlot()
    if (slot != undefined && item.type == "accessory") {
      if (!this.searchForFamily(item.family)) {
        item.activate()
      }
      this.inventory[slot] = Object.assign(
        Object.create(Object.getPrototypeOf(item)),
        item
      )
      item = new classes.empty()
      putItemInslot(
        this.inventory[slot],
        e.accessorybag["slot" + slot],
        e.accessorybag["slot" + slot + "amount"]
      )
    }
    return item
  }
  getEmptyInventorySlot() {
    let slot = undefined
    this.inventory.forEach((x, i) => {
      if (
        x.name == "empty" &&
        i < steve.stats.accessorybagslots &&
        slot == undefined
      ) {
        slot = i
      }
    })
    return slot
  }
  removeFromInventory(slot) {
    const item = Object.assign(
      Object.create(Object.getPrototypeOf(this.inventory[slot])),
      this.inventory[slot]
    )
    this.inventory[slot] = new classes.empty()
    putItemInslot(
      this.inventory[slot],
      e.accessorybag["slot" + slot],
      e.accessorybag["slot" + slot + "amount"]
    )

    if (item.wasActivated) {
      item.deactivate()
    }

    return item
  }
  searchForFamily(family) {
    let is = false
    this.inventory.forEach((x) => {
      if (x.family == family) is = true
    })
    return is
  }
  isItemInInventory(name) {
    let is = false
    this.inventory.forEach((x) => {
      if (x.name == name) is = true
    })
    return is
  }
  addAll() {
    this.inventory.forEach((x) => {
      if (x.wasActivated) {
        x.deactivate()
        x.activate()
      }
    })
  }
}

class Loot {
  constructor(
    item,
    chance = 100,
    type = "none",
    min = 1,
    max = 1,
    smeltsInto = "none",
    tool = "",
    collection = item,
    condition = function () {
      return true
    }
  ) {
    return {
      item: item,
      min: min,
      max: max,
      type: type,
      chance: chance,
      smeltsInto: smeltsInto,
      tool: tool,
      collection: collection,
      condition: condition,
    }
  }
}
