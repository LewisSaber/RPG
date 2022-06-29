let classes = {}
const freezetimer = 4000
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
    this.customcolor = "#000000"
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
    if(tag != undefined)
    this.addTag(tag)
  }
  onToolTip(){}
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
  onPlacement(){}
  onRemoval(){}
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
            (randomItem(
              key.min,
              key.max,
              steve.getMagicFindChance(key.chance)
            ) *
              steve.fortunes[key.type]()) >>
            0
          if (amount) {
            drops.push(new classes[name](amount))
            addCollectionItem(key.collection, amount)
            notifyRareDrop(name, key.chance)
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
    this.obitained = new Date()
  }
}
classes.tree = class extends classes.block {
  constructor(amount = 0) {
    super(amount)
    this.name = "tree"
    this.tool = "axe shears"
    this.logs = 0
    this.xp = 0
    this.replacement = "air"
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
    this.obitained = new Date()
  }
  doRecipe() {}
  stoprecipe() {}
  checkvalidnes() {}
  /**
   * searches for most left item in machine input
   */
  mostLeftItem() {
    for (const key in this.inventory) {
      if (key.includes("input") && this.inventory[key].getItem().name != empty)
        return this.inventory[key].getItem().name
    }
    return "empty"
  }
  countItem(filter) {
    let amount = 0
    for (const key in this.inventory) {
      if (key.includes("input") && this.inventory[key].getItem().name == filter)
        amount += this.inventory[key].getItem().amount
    }
    return amount
  }
  removeFromInventory(item, amount) {
    let iter = 0
    for (const key in this.inventory) {
      if (
        key.includes("input") &&
        this.inventory[key].getItem().name == item &&
        amount > 0
      ) {
        if (this.inventory[key].amount >= amount) {
          this.inventory[key].reduceStack(amount)
          amount = 0
        } else {
          amount -= this.inventory[key].getItem().amount
          this.inventory[key].putItem(new classes.empty())
          
        }
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
  generateGui(){}
  removeGui(){
    if(this.handler)
    this.handler.remove()
  }
  onPlacement(){
    this.generateGui()
    this.doRecipe()
  }
  onRemoval(){
    this.gui = undefined
    this.removeGui()
    this.stoprecipe()
  }
  openGui(){
    if(this.gui == undefined) this.generateGui()
    this.gui.open()
  }
}
classes.backpack = class extends classes.empty {
  constructor(amount = 0) {
    super(amount)
    this.name = "backpack"
    this.type = "backpack"
    this.maxStackSize = 1
    this.obitained = new Date()

    this.inventory = []
    this.inventorySlots = 0
    this.description = "Inventory Slots: " + this.inventorySlots
   
  }
  buildinventory() {
    this.inventory = []
    for (let i = 0; i < this.inventorySlots; i++) {
      this.inventory[i] = new Slot("",true,undefined)
    }
  }
  generateGui(){
    //<div id="backpack"><div id="backpackname">fff</div></div>
    this.handler = document.createElement("div")
    this.handler.className = "backpack"
    let nameHandler = document.createElement("div") 
    nameHandler.className = "backpackname"
    nameHandler.style.color = this.customcolor
    nameHandler.innerText = this.Rname == "" ? getName(this.name) : this.Rname
    this.handler.appendChild(nameHandler)
    this.inventory.forEach(x=>{
      this.handler.appendChild(x.getTag())
    })
    e.gui.appendChild(this.handler)
    this.gui = new Gui("backpack",[$("#inventory")[0],$("#hotbar")[0],this.handler])
  }
  openGui(){
    if(this.gui == undefined) this.generateGui()
    this.gui.open()
  }
  removeGui(){
    this.handler.remove()
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
  onPlacement(){
    this.generateGui()
  }
  onRemoval(){
    this.gui = undefined
    this.removeGui()
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
    setInterval(this.checkForFreeze.bind(this), freezetimer)
  }
  checkForFreeze() {
    if (
      distnaseBetweenTargets(
        { x: steve.x, y: steve.y },
        { x: this.x, y: this.y }
      ) > freezeRange
    ) {
      if (!this.isFrozen) {
        this.freze()
      }
    } else if (this.isFrozen) {
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
    steve.addCoins(steve.getScavengerBonus(this.lvl))
  }
  freze() {
    this.isFrozen = true
    this.state = "passive"
    e["mob" + this.id].style.display = "none"
    clearInterval(this.attacktimer)
    clearInterval(this.angerinterval)
    clearInterval(this.randominterval)
    clearInterval(this.shottimer)
  }
  unfreze() {
    e["mob" + this.id].style.display = "block"
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
      (this.stats.range + 1) ** 2
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
            (randomItem(
              key.min,
              key.max,
              steve.getMagicFindChance(key.chance)
            ) *
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
      (this.stats.angerrange + 1) ** 2
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
        if (checkMapForBlock(this.y, this.x, this.width, this.height))
          this.y = oldcoords[0]
        //console.log("y2",this.y)

        this.x += vectorspeed[0]
        this.x = this.x.fixed(2)
        if (checkMapForBlock(this.y, this.x, this.width, this.height))
          this.x = oldcoords[1]

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

    this.randominterval = setTimeout(this.randommove.bind(this), timer)
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
        +(this.getSpeed() * 4 * angleSin * (steve.x > this.x ? -1 : 1)).toFixed(
          2
        ),
        +(
          this.getSpeed() *
          4 *
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
    for(let i = 0 ; i < maxaccesoriesslots;i++){
    this.inventory[i] = new Slot((item)=>item.type == "accessory",true,undefined,{
      onPostClick : this.onClick.bind(this),
    })
    }
    
    this.families = []
    this.generateGui()
  }
  onClick(){
    this.sort()
    this.reactivate()
  }
  sort(){
    this.inventory.sort(function(a,b){
      return a.isEmpty() ? 1 : -1
    })
  }
  
  reactivate() {
    this.families = []
    this.inventory.forEach((x) => {
      if(!x.isEmpty()){
        if (x.getItem().wasActivated) {
          x.item.deactivate()
        }
        if(!this.families.includes(x.getItem().family)){
          this.families.push(x.getItem().family)
          x.item.activate()
        }
      }
    })
  }
  generateGui(){
    this.handler = $("#accessorybag")[0]
    this.inventory.forEach(x=>{
      x.hide()
      this.handler.appendChild(x.getTag())
    })
    this.gui = new Gui("accessorybag",[$("#inventory")[0],$("#hotbar")[0],this.handler],undefined,{
      onopen:this.onGuiOpen.bind(this)
    })
    
  }
  onGuiOpen(){
    const slots = steve.getStat("accessorybagslots")
    for(let i = 0; i < slots;i++){
      this.inventory[i].show()
    }
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
const guiProperties = {
  movesHotbar: true,
  needsHandler: true,
  onopen:undefined,
  onclose:undefined,
}

class Gui {
  /**
   * @param {string} name
   * @param {HTMLElement[]} content 
   * @param {Slots[]} slots 
   * @param {guiProperties} properties 
   */
  constructor(name,content,slots,properties = {}) {
    this.name = name
    this.content = content
    this.slots  = slots
    this.properties = properties
    if(this.properties.needsHandler == undefined)
    this.properties.needsHandler = true
    if(this.properties.movesHotbar == undefined)
    this.properties.movesHotbar = true

  }
  open() {
    activeGui.close()
 
    if(this.properties.needsHandler) e.guihandler.style.display = "block"
    if(this.properties.movesHotbar)   e.hotbar.style.bottom = "11vh"
    
    

    this.content.forEach((x) => {
      x.style.display = "block"
    })
    if(isNeiOpen){
      e.nei.style.display = "block"
      e.inventory.style.display = "none"
      e.hotbar.style.display = "none"
    }
    else
    {
      e.nei.style.display = "none"
    }
    if(this.properties.onopen)
    this.properties.onopen()
    activeGui = this
  }
  close() {
    if(this.properties.needsHandler) e.guihandler.style.display = "none"
    e.hotbar.style.bottom = "0vh"
    this.content.forEach((x) => {
      x.style.display = "none"
    })
    if(this.properties.onclose)
    this.properties.onclose()
  }

}
let slots = []
/**
 * Properties:  
 * @example
 * canPutItems - if you can input in slot 
 * isLclickSpecial/isRclickSpecial - supports Default L/R click
 * onPreClick - action before any click
 * onPostClick - action after any click
 * emptyClass - background placeholder if slot is empty
 *  
 *  
 *  
 *  
 * </ul>
 * 
 */
const SlotProperties = {
  /** if you can input in slot  */
   emptyClass:"",
   /** Dont Support Default L click 
    * @type {Boolean} */
   isLclickSpecial:false,
   /** Dont Support Default R click 
    * * @type {Boolean} */
   isRclickSpecial:false,
   /** action before any click
    * @type {function} */
   onPreClick : () =>{},
   /** action after any click 
   * @type {function} */
   onPostClick : () =>{},
   /** can Input Items 
     * @type {Boolean} */
   canPutItems:true,
  /** if supports item onPlacement/onRemoval 
   * @type {Boolean}*/
  isSpecialSlot: false,
  /** action on R click
    * @type {function} */
   onRclick : () =>{},
}


class Slot {
  /**
   * 
   * @param {*} filter 
   * @param {*} isMachineSlot 
   * @param {CCSStyleObject} position 
   * @param {SlotProperties} properties 
   */
  constructor( filter = "", isMachineSlot = true, position,properties = {}) {
    this.item = new classes.empty()
    this.filter = filter
    this.isMachineSlot = isMachineSlot
    this.create(position)
    this.id = slots.length 
    slots.push(this)
    this.properties = properties
    if(this.properties.emptyClass == undefined) this.properties.emptyClass = "empty"
    if(this.properties.canPutItems == undefined) this.properties.canPutItems = true

  }
  hide() {
    this.tag.style.display = "none"
  }
  show() {
    this.tag.style.display = "block"
  }
  isEmpty(){
    return isEmpty(this.item)
  }
  create(position) {
    let tag = document.createElement("div")
    let amount = document.createElement("div")
    amount.setAttribute("class", "itemamount")
    tag.setAttribute("onmouseleave", "leaveElement()")
    if (position) {
      for (const key in position) {
        tag.style[key] = position[key]
      }
    }
    tag.onmouseenter = this.onToolTip.bind(this)
    tag.onmousedown = this.onclick.bind(this)
    tag.setAttribute("class", "guiSlot")
    tag.appendChild(amount)
    this.tag = tag
    this.amount = amount
  }
  updateSlot() {
    
    if(this.visualItem && this.isEmpty()){
      this.tag.className = this.visualItem.name + " guiSlot"
      this.amount.innerText = this.visualItem.amount > 1 ? this.visualItem.amount : ""
    }
    else
    {

      this.tag.className =(this.isEmpty() ? this.properties.emptyClass :this.item.name) + " guiSlot"
      
      this.amount.innerText = this.item.amount > 1 ? this.item.amount : ""
    }
  }
  onToolTip(){
    this.item.onToolTip()
    if(this.visualItem && this.isEmpty())
    makeToolTip(this.visualItem)
    else
    makeToolTip(this.item )
  }
  checkFilter(item){
    if(isEmpty(item)) return true
    if(typeof this.filter == "string"){

    return item.name.match1word(this.filter)
    }
    else
    return this.filter(item)
  }

  onclick(evt) {
   
    switch (evt.button) {
      //Lclick
      case 0:
      case 1:
        if(!this.properties.isLclickSpecial)
        if(!(this.isEmpty() && cursor.isEmpty())){
            if(this.item.name == cursor.getItem().name ){
              if(this.properties.canPutItems){
                let amount = Math.min(this.item.getEmpty(),cursor.getItem().amount)
                cursor.removeAmount(amount)
                this.item.amount += amount
              }
            }else
            if(this.properties.canPutItems || cursor.isEmpty())
            {
              
              if(this.checkFilter(cursor.getItem())){

                if(this.properties.isSpecialSlot){
                  this.item.onRemoval()
                }
              
                this.item = cursor.putItem(this.item)
                if(this.properties.isSpecialSlot){
                  this.item.onPlacement()
                }
              }
            }
          
        }
       
       
          this.updateSlot()
          if(cursor.isEmpty()){
            this.onToolTip()
          }
        break
      //Rclick
      case 2:
        if(!this.properties.isRclickSpecial)
        if(!(this.isEmpty() && cursor.isEmpty())){
          if(cursor.isEmpty()){
            const amount = Math.round(this.item.amount/2)
            const oldAmount = this.item.amount
            this.item.amount = amount
            cursor.putItem(this.item)
            this.item.amount = oldAmount
            this.item = reduceStack(this.item,amount)
          }else
          if(this.isEmpty()){
            if(this.properties.canPutItems && this.checkFilter(cursor.getItem())){

              this.item  = Object.assign(
                Object.create(Object.getPrototypeOf(cursor.getItem())),
                cursor.getItem()
                ) 
                this.item.amount = 1
                cursor.removeAmount(1)
              } 
             
          }else
          if(this.item.name == cursor.getItem().name && this.item.getEmpty() >= 1){
            if(this.properties.canPutItems){

              const amount = 1
              this.item.amount += 1
              cursor.removeAmount(1)
            }

          }
          this.updateSlot()
        }
        if(this.properties.onRclick)
        this.properties.onRclick(this.item)
        break
      }
      if(this.properties.onPostClick){
        this.properties.onPostClick()
      }
  }
  getItem(){
    return this.item
  }
 
  getTag() {
    return this.tag
  }
  putItem(item){
    this.item = item
    if(this.properties.isSpecialSlot) this.item.onPlacement()
    this.updateSlot()
  }
  addItem(item){
    if(this.isEmpty()) this.putItem(item)
    else
    {

      if(this.item.name == item.name){
        this.item.amount += item.amount
      } 
      this.updateSlot()
    }
  }
  select(){
    this.tag.style.borderWidth = "0.6vh"
    this.tag.style.margin = "0.1vh"
   
  }
  unSelect(){
  this.tag.style.borderWidth = "0.4vh"
  this.tag.style.margin = "0.3vh"
    /*
     display: block;
  float: left;
  width: 7vh;
  height: 7vh; 
  margin: 0.3vh; 
  border: inset 0.4vh #5f5f5f;
  position: relative;*/
  }
  reduceStack(amount){
    this.item = reduceStack(this.item,amount)
    this.updateSlot()
  }
  setVisualItem(item){
    this.visualItem = item
    this.updateSlot()
  }
  removeVisualItem(){
    this.visualItem = undefined
    this.updateSlot()
  }
  clear(){
    this.item = new classes.empty()
    this.removeVisualItem()
    
  }

}

const cursor = {
  x: 0,
  y: 0,
  item: new classes.empty(),
  /** @type {HTMLElement} */
  handler: $("#tooltip")[0],
  isEmpty() {
    return this.item.name == "empty"
  },
  getItem(){
    return this.item
  },
  updateSlot() {
    this.handler.className = this.item.name
  },
  isToolTip: true,
  becomeItem() {
    if (this.isToolTip) {
      this.handler.style.width = (1).blocks().px()
      this.handler.style.height = (1).blocks().px()
      this.handler.innerText = ""
      this.handler.style.padding = "0vh"
      this.isToolTip = false
      this.handler.style.cursor = "none"

      this.show()
      this.position()
    }
    this.updateSlot()
  },
  hide() {
    this.handler.style.display = "none"
  },
  show() {
    this.handler.style.display = "block"
  },
  becomeToolTip() {
    if (isEmpty(this.item)) {
      if (!this.isToolTip) {
        this.handler.className = "tooltipimg"
        this.handler.style.width = "auto"
        this.handler.style.height = "auto"
        this.handler.style.padding = " 1.2vh 2vh"
        this.isToolTip = true
        this.handler.style.cursor = "pointer"
        this.show()
        this.position()
      }

      return true
    } else return false
  },
  hideOnLeave() {
    if (this.isToolTip && itemintooltip == "none") this.hide()
  },
  position(evt) {
    if (evt) {
      this.x = evt.x
      this.y = evt.y
    }
    this.handler.style.top = (
      this.isToolTip
        ? this.y - 100 + session.tooltipYOffset
        : this.y - blocksize / 2
    ).px()
    this.handler.style.left = (
      this.isToolTip
        ? this.x - 100 + session.tooltipXOffset
        : this.x - blocksize / 2
    ).px()
  },
  putItem(item) {
    if (item.name == this.item.name) {
      const amount = this.item.getEmpty()
      this.item.amount += amount
      item = reduceStack(item, amount)
    } else if (isEmpty(this.item)) {
      this.item = Object.assign(
        Object.create(Object.getPrototypeOf(item)),
        item
      )
      item = new classes.empty()
    } else {
      let temp = Object.assign(
        Object.create(Object.getPrototypeOf(this.item)),
        this.item
      )
      this.item = item
      item = temp
    }
    this.becomeItem()
    return item
  },
  removeAmount(amount) {
    this.item = reduceStack(this.item, amount)
    this.updateSlot()
    return this.item
  },
  removeItem() {
    return this.removeAmount(this.item.amount)
  },
  removeHalf(){
    return this.removeAmount(Math.round(this.item.amount/2))
  },
  addItem(item){
    if(this.isEmpty()) {
      this.putItem(item)

    }else
    if(this.item.name == item.name){
      this.item.amount += item.amount
    }
  },
  
}
