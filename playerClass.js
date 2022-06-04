class player {
  constructor() {
    this.width = 4.6
    this.height = this.width
    this.x = 50
    this.y = 20
    this.mapX = 0
    this.mapY = 0
    this.nick = "none"
    this.skin = "default"
    this.diffrencex = +(5 - this.width).toFixed(2)
    this.diffrencey = +(5 - this.height).toFixed(2)
    this.inventorySlots = 36
    this.inventory = []
    this.machines = []
    this.machines.set(new classes.machine(), 9)
    this.backpacks = []
    this.backpacks.set(new classes.empty(), 24)
    this.accessorybag = new classes.accessorybag()
    this.stats = {
      maxhealth: 100,
      health: 100,
      defense: 0,
      damage: 5,
      strength: 1,
      criticaldamage: 50,
      criticalchance: 25,
      speed: 100,
      miningspeed: 100,
      miningfortune: 0,
      farmingfortune: 0,
      combatfortune: 0,
      foragingfortune: 0,
      naturalregeneration: 3,
      totalDamageMultiplier: 1,
      undeadbonus: 1,
      zombiedefense: 0,

      range: 3,
      accessorybagslots: 9,
      tool: "none",
      tooltier: 0,
    }
    this.enchants = {
      smeltingtouch: 0,
    }
    this.basicstats = Object.assign(
      Object.create(Object.getPrototypeOf(this.stats)),
      this.stats
    )
    this.kills = 0
    this.age = 0
    this.coins = 1000
    this.foodstats = {}
    this.itemInHand = new classes.empty()
    this.helmet = new classes.empty()
    this.chestplate = new classes.empty()
    this.leggins = new classes.empty()
    this.boots = new classes.empty()
    this.ring1 = new classes.empty()
    this.ring2 = new classes.empty()
    this.bracelet = new classes.empty()
    this.belt = new classes.empty()
    this.skillxp = {}
    this.skilllevels = {}
    this.collectionitems = {}
    this.collectionlevels = {}
    this.food = {}
    this.makeSkills()
    this.makeCollections()
    this.loadInventory()
    this.sellHistory = []
    setInterval(this.reduceFoodSecond.bind(this), 1000)
    setInterval(this.naturalRegeneration.bind(this), 1000)
    setInterval(this.addAge.bind(this), 1000)
  }
  addAge() {
    this.age++
  }
  createPlayer() {
    let tag = document.createElement("p")
    tag.setAttribute("id", "player")
    tag.style.left = this.x + "vh"
    tag.style.top = this.y + "vh"
    tag.style.width = this.width + "vh"
    tag.style.height = this.height + "vh"

    let tool = document.createElement("p")
    tool.setAttribute("id", "playertool")

    tool.style.left = this.x + 4 + "vh"
    tool.style.top = this.y + 0.5 + "vh"
    e["playertool"] = tool
    e["player"] = tag
  }
  reduceFoodSecond() {
    for (const key in this.food) {
      this.food[key].time -= 1000
      if (this.food[key].time <= 0) {
        this.removeStats(this.food[key])
        delete this.food[key]
      }
    }
  }
  addAllFood() {
    for (const key in this.food) {
      this.addStats(this.food[key])
    }
  }
  applySkin() {
    e.player.style.backgroundImage =
      "url(" +
      (this.skin.toLocaleLowerCase() == "default"
        ? "img/player.jfif"
        : this.skin) +
      ")"
    e.playerStats.style.backgroundImage =
      "url(" +
      (this.skin.toLocaleLowerCase() == "default"
        ? "img/player.jfif"
        : this.skin) +
      ")"
  }

  loadInventory() {
    this.inventory.set(new classes.empty(), 36)
  }
  makeSkills() {
    for (const key in skillnames) {
      this.skillxp[key] = 0
      this.skilllevels[key] = 0
    }
  }
  makeCollections() {
    for (let i = 0; i < collections.length; i++) {
      this.collectionitems[collections[i]] = 0
      this.collectionlevels[collections[i]] = 0
    }
  }
  move() {
    let movingright = true
    let oldcoords = [this.y, this.x]
    if (!keys.slice(0, 4).includes(1)) {
      clearInterval(movetimer)
      movetimer = 0
    } else if (
      this.x < 0 ||
      this.y < 0 ||
      this.y > (mapH - 1) * 5 - 1 ||
      this.x > (mapW - 1) * 5 - 1
    ) {
      // savemap();
      if (this.x < 0) {
        this.x = (mapW - 1.2) * 5
        mapX--
      }
      if (this.y < 0) {
        this.y = (mapH - 1.2) * 5
        mapY--
      }
      if (this.y > (mapH - 1) * 5 - 1) {
        this.y = 4
        mapY++
      }
      if (this.x > (mapW - 1) * 5 - 1) {
        this.x = 4
        mapX++
      }

      goToNextMap()
    } else {
      if (keys[0] != keys[2]) {
        if (keys[0]) this.y -= 0.2
        if (keys[2]) this.y += 0.2
      }

      this.y = +this.y.toFixed(1)

      if (oldcoords[0] > this.y) {
        //move up
        if (this.x % 5 >> 0 <= this.diffrencex) {
          if (checkMapForBlock((this.y / 5) >> 0, (this.x / 5) >> 0))
            this.y = oldcoords[0]
        } else {
          if (
            checkMapForBlock((this.y / 5) >> 0, (this.x / 5) >> 0) ||
            checkMapForBlock((this.y / 5) >> 0, (this.x / 5 + 1) >> 0)
          )
            this.y = oldcoords[0]
        }
      } else {
        // move down
        if (this.x % 5 >> 0 <= this.diffrencex) {
          if (
            checkMapForBlock(
              (this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1,
              (this.x / 5) >> 0
            )
          ) {
            this.y = oldcoords[0]
          }
        } else if (
          checkMapForBlock(
            ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0,
            (this.x / 5 + 1) >> 0
          ) ||
          checkMapForBlock(
            ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0,
            (this.x / 5) >> 0
          )
        )
          this.y = oldcoords[0]
      }
      if (keys[1] != keys[3]) {
        if (keys[1]) this.x -= 0.2
        if (keys[3]) this.x += 0.2
      }
      this.x = +this.x.toFixed(1)
      //////
      if (oldcoords[1] > this.x) {
        movingright = false
        //move left
        if (this.y % 5 >> 0 <= this.diffrencey) {
          if (checkMapForBlock((this.y / 5) >> 0, (this.x / 5) >> 0))
            this.x = oldcoords[1]
        } else {
          if (
            checkMapForBlock((this.y / 5) >> 0, (this.x / 5) >> 0) ||
            checkMapForBlock((this.y / 5 + 1) >> 0, (this.x / 5) >> 0)
          )
            this.x = oldcoords[1]
        }
      } else {
        //move right
        movingright = true
        if (this.y % 5 >> 0 <= this.diffrencey) {
          if (
            checkMapForBlock(
              this.y / 5,
              (this.x - 0.2 - this.diffrencex + 0.01) / 5 + 1
            )
          )
            this.x = oldcoords[1]
        } else if (
          checkMapForBlock(
            this.y / 5,
            (this.x - 0.2 - this.diffrencex + 0.01) / 5 + 1
          ) ||
          checkMapForBlock(
            (this.y / 5 + 1) >> 0,
            (this.x - 0.2 - this.diffrencex + 0.01) / 5 + 1
          )
        ) {
          this.x = oldcoords[1]
        }
      }

      e.player.style.top = this.y + "vh"
      e.player.style.left = this.x + "vh"
      if (movingright) {
        e.playertool.style.transform = "scale(-1,1) rotate(-90deg)"
        e.playertool.style.left = this.x + 4 + "vh"
      } else {
        e.playertool.style.left = this.x - 3.6 + "vh"

        e.playertool.style.transform = "scale(1,1) rotate(-90deg)"
      }
      e.playertool.style.top = this.y + 0.5 + "vh"
    }
  }

  getSpeed() {
    return this.stats.speed / 10
  }
  spawn() {
    e.map.appendChild(e.playertool)
    e.map.appendChild(e.player)
    this.applySkin()
    e.player.style.top = this.y + "vh"
    e.player.style.left = this.x + "vh"
    e.playertool.style.left = this.x + 4 + "vh"
    e.playertool.style.top = this.y + 0.5 + "vh"
  }
  searchForItemInInventory(item, s = 0, e = 36) {
    let itemSlots = []
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].name == item.name) itemSlots.push(i)
    }
    return itemSlots
  }
  searchForFirstEmpty(s, e) {
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].name == "empty") return i
    }
  }
  isEmptySlotInInventory(s = 0, e = 36) {
    for (let i = e - 1; i >= s; i--) {
      if (this.inventory[i].name == "empty") return true
    }
    return false
  }
  removeFromInventory(item, amount) {
    const items = this.searchForItemInInventory({ name: item })
    items.forEach((x) => {
      if (amount > 0) {
        if (this.inventory[x].amount >= amount) {
          this.inventory[x] = reduceStack(this.inventory[x], amount)
          amount = 0
        } else {
          amount -= this.inventory[x].amount
          this.inventory[x] = reduceStack(
            this.inventory[x],
            this.inventory[x].amount
          )
        }
        putItemInslot(
          this.inventory[x],
          e.inventory["slot" + x],
          e.inventory["slot" + x + "amount"]
        )
      }
    })
  }
  countItem(filter) {
    let amount = 0
    this.inventory.forEach((x) => {
      if (x.name == filter) amount += x.amount
    })
    return amount
  }

  equipItem(item1, item2 = this.itemInHand) {
    this.removeStats(item2)
    this.removeEnchants(item2)
    this.addStats(item1)
    this.addEnchants(item1)
  }
  removeStats(item) {
    if (item.stats != undefined) {
      for (const key in item.stats) {
        if (typeof this.stats[key] == "string") {
          this.stats[key] = "none"
        } else this.stats[key] -= item.stats[key]
        if (key == "speed") {
          clearInterval(movetimer)
          movetimer = setInterval(function () {
            steve.move()
          }, Math.ceil(200 / steve.getSpeed()))
        }
      }
    }
  }
  addStats(item) {
    if (item.stats != undefined) {
      for (const key in item.stats) {
        if (typeof this.stats[key] == "string") {
          this.stats[key] = item.stats[key]
        } else this.stats[key] += item.stats[key]
        if (key == "speed") {
          clearInterval(movetimer)
          movetimer = setInterval(function () {
            steve.move()
          }, Math.ceil(200 / steve.getSpeed()))
        }
      }
    }
  }
  addEnchants(item) {
    if (item.enchants != undefined) {
      for (const key in item.enchants) {
        this.enchants[key] =
          this.enchants[key] == undefined
            ? item.enchants[key]
            : this.enchants[key] + item.enchants[key]
      }
    }
  }
  removeEnchants(item) {
    if (item.enchants != undefined) {
      for (const key in item.enchants) {
        this.enchants[key] -= item.enchants[key]
      }
    }
  }

  clearinventory(s = 0, end = this.inventorySlots - 1) {
    for (s; s <= end; s++) {
      this.inventory[s] = new classes.empty()

      putItemInslot(
        this.inventory[s],
        e.inventory["slot" + s],
        e.inventory["slot" + s + "amount"]
      )
    }
  }

  addToInventory(item, s = 0, end = 36) {
    let itemslots = this.searchForItemInInventory(item, s, end)

    if (itemslots != undefined)
      for (let i = 0; i < itemslots.length; i++) {
        if (item.amount <= this.inventory[itemslots[i]].getEmpty()) {
          this.inventory[itemslots[i]].amount += item.amount
          item = reduceStack(item, item.amount)
          putItemInslot(
            this.inventory[itemslots[i]],
            e.inventory["slot" + itemslots[i]],
            e.inventory["slot" + itemslots[i] + "amount"]
          )

          i = 10000
        } else {
          item = reduceStack(item, this.inventory[itemslots[i]].getEmpty())
          this.inventory[itemslots[i]].amount =
            this.inventory[itemslots[i]].maxStackSize
          putItemInslot(
            this.inventory[itemslots[i]],
            e.inventory["slot" + itemslots[i]],
            e.inventory["slot" + itemslots[i] + "amount"]
          )
        }

        if (itemslots[i] == currentHotbarSlot) selectHotbarItem(itemslots[i])
      }
    if (item.amount > 0) {
      let nextempty = this.searchForFirstEmpty(s, end)
      if (nextempty != undefined) {
        this.inventory[nextempty] = Object.assign(
          Object.create(Object.getPrototypeOf(item)),
          item
        )
        item = reduceStack(item, item.amount)

        putItemInslot(
          this.inventory[nextempty],
          e.inventory["slot" + nextempty],
          e.inventory["slot" + nextempty + "amount"]
        )

        if (nextempty == currentHotbarSlot) selectHotbarItem(nextempty)
      }
    }

    return item
  }
  getMiningFortune() {
    return (this.stats.miningfortune + 100) / 100
  }
  getForagingFortune() {
    return (this.stats.foragingfortune + 100) / 100
  }
  getCombatFortune() {
    return (this.stats.combatfortune + 100) / 100
  }
  getFarmingFortune() {
    return (this.stats.farmingfortune + 100) / 100
  }
  getMiningSpeed() {
    return this.stats.miningspeed * (1 + (this.enchants.efficiency * 0.08 || 0))
  }

  isInRange(target) {
    return (
      (target.x * 5 + 2.5 - (this.x + this.width / 2)) ** 2 +
        (target.y * 5 + 2.5 - (this.y + this.height / 2)) ** 2 <=
      ((this.stats.range + 1) * 5) ** 2
    )
  }
  isMobInRange(target) {
    return (
      (target.x - (this.x + this.width / 2)) ** 2 +
        (target.y - (this.y + this.height / 2)) ** 2 <=
      ((this.stats.range + 1) * 5) ** 2
    )
  }
  stopBreakingBlock(cblock) {
    clearInterval(breaktimer)
    breaktimer = 0
    e.progressbar.style.display = "none"
    e.progressbarInside.style.width = "100%"
    selectedBlock = new classes[selectedBlock.name]()
  }
  sortInventory() {
    let tempinventory = [...this.inventory]

    tempinventory = tempinventory.slice(9)
    tempinventory.sort(function (a, b) {
      return a.name > b.name ? 1 : -1
    })
    this.clearinventory(9)
    dumbtoinventory(tempinventory)
  }
  breakblock(cblock) {
    if (keys[5] == 0) {
      this.stopBreakingBlock(cblock)
      console.log("stop breaking")
    } else {
      if (
        cblock.block.tool == "none" ||
        steve.stats.tool.match1word(cblock.block.tool)
      ) {
        cblock.block.hardness -= this.getMiningSpeed()
      } else {
        cblock.block.hardness -= 100
      }
      console.log("hardenss: " + cblock.block.hardness)
      e.progressbarInside.style.width =
        (cblock.block.hardness / cblock.maxhardness) * 100 + "%"
      if (cblock.block.hardness <= 0) {
        e.progressbar.style.display = "none"
        e.progressbarInside.style.width = "100%"
        console.log("block broken")
        clearInterval(breaktimer)
        breaktimer = 0
        dumbtoinventory(cblock.block.generateDrop())
        maphtml[cblock.y][cblock.x][cblock.layer].classList =
          (cblock.layer ? "blockfloor " : "block ") + cblock.block.replacement
        currentmap[cblock.y][cblock.x][cblock.layer] = cblock.block.replacement
        selectedBlock = new classes.empty()
        setTimeout(
          blockreplacement,
          4000,
          mapY,
          mapX,
          cblock.y,
          cblock.x,
          cblock.block.name,
          cblock.layer
        )
      } else
        breaktimer = setTimeout(function () {
          steve.breakblock(currentblock)
        }, 100)
    }
  }
  getDamageReduction(mobName) {
    let defense = this.stats.defense
    if(isZombie(mobName))
    defense += this.stats.zombiedefense
    
    return +(1 - defense / (defense + 100)).toFixed(2)
  }
  damageMob(id) {
    if (this.isMobInRange(mobs[id]) && !isBlockBetween(this, mobs[id])) {
      if (mobs[id].name == "villager") {
        openMachineGui(mobs[id])
      } else {
        mobs[id].knockback()
        mobs[id].stats.health -=
          (this.stats.damage *
            (1 + this.stats.strength / 100) *
            (random100(this.stats.criticalchance)
              ? this.stats.criticaldamage / 100 + 1
              : 1) *
            (mobs[id].mobtype == "undead"
              ? this.stats.undeadbonus == undefined
                ? 1
                : this.stats.undeadbonus
              : 1) *
            (1 + (this.enchants.sharpness * 0.1 || 0)) *
            this.stats.totalDamageMultiplier) >>
          0

        e["mob" + id].style.opacity =
          mobs[id].stats.health / mobs[id].stats.maxhealth + 0.1

        if (mobs[id].stats.health <= 0) {
          mobs[id].die()
          e.progressbar.style.display = "none"
        } else {
          playMobHowl(mobs[id].name, "hurt")
          makeMonsterHotbar(id)
        }
      }
    }
  }
  updateheathbar() {
    e.healthbarinside.style.width =
      (this.stats.health / this.stats.maxhealth) * 100 + "%"
    e.healthbartext.innerText = this.stats.health + " / " + this.stats.maxhealth
  }
  addHealth(amount) {
    this.stats.health =
      this.stats.health + amount < this.stats.maxhealth
        ? this.stats.health + amount
        : this.stats.maxhealth
    this.updateheathbar()
  }
  setHealth(amount) {
    this.stats.health = amount
    this.updateheathbar()
  }

  addCoins(amount) {
    this.coins += amount
    e.coinstext.innerText = this.coins.formate()
  }
  naturalRegeneration() {
    this.addHealth(
      (this.stats.maxhealth * (this.stats.naturalregeneration / 100)) >> 0
    )
  }
}

/*
   move() {
      let movingright = true;
      let oldcoords = [this.y, this.x];
      if (!keys.slice(0, 4).includes(1)) {
        clearInterval(movetimer);
        movetimer = 0;
      } else if (
        this.x < 0 ||
        this.y < 0 ||
        this.y > (mapH - 1) * 5 - 1 ||
        this.x > (mapW - 1) * 5 - 1
      ) {
        // savemap();
        if (this.x < 0) {
          this.x = (mapW - 1.2) * 5;
          mapX--;
        }
        if (this.y < 0) {
          this.y = (mapH - 1.2) * 5;
          mapY--;
        }
        if (this.y > (mapH - 1) * 5 - 1) {
          this.y = 4;
          mapY++;
        }
        if (this.x > (mapW - 1) * 5 - 1) {
          this.x = 4;
          mapX++;
        }
  
        goToNextMap();
      } else {
        if (keys[0] != keys[2]) {
          if (keys[0]) this.y -= 0.2;
          if (keys[2]) this.y += 0.2;
        }
  
        this.y = +this.y.toFixed(1);
  
        if (oldcoords[0] > this.y) {
          //move up
          if (this.x % 5 >> 0 <= this.diffrencex) {
            if (
              !allowedblocks.includes(
                currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0].slice(0,9)
              )
            )
              this.y = oldcoords[0];
          } else {
            if (
              !allowedblocks.includes(
                currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0].slice(0,9)
              ) ||
              !allowedblocks.includes(
                currentmap[(this.y / 5) >> 0][(this.x / 5 + 1) >> 0][0].slice(0,9)
              )
            )
              this.y = oldcoords[0];
          }
        } else {
          // move down
          if (this.x % 5 >> 0 <= this.diffrencex) {
            if (
              !allowedblocks.includes(
                currentmap[
                  ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0
                ][(this.x / 5) >> 0][0].slice(0,9)
              )
            ) {
              this.y = oldcoords[0];
            }
          } else if (
            !allowedblocks.includes(
              currentmap[
                ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0
              ][(this.x / 5) >> 0][0].slice(0,9)
            ) ||
            !allowedblocks.includes(
              currentmap[
                ((this.y - 0.2 - this.diffrencey + 0.0001) / 5 + 1) >> 0
              ][(this.x / 5 + 1) >> 0][0].slice(0,9)
            )
          )
            this.y = oldcoords[0];
        }
        if (keys[1] != keys[3]) {
          if (keys[1]) this.x -= 0.2;
          if (keys[3]) this.x += 0.2;
        }
        this.x = +this.x.toFixed(1);
        //////
        if (oldcoords[1] > this.x) {
          movingright = false;
          //move left
          if (this.y % 5 >> 0 <= this.diffrencey) {
            if (
              !allowedblocks.includes(
                currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0].slice(0,9)
              )
            )
              this.x = oldcoords[1];
          } else {
            if (
              !allowedblocks.includes(
                currentmap[(this.y / 5 + 0.0001) >> 0][
                  (this.x / 5 + 0.0001) >> 0
                ][0].slice(0,9)
              ) ||
              !allowedblocks.includes(
                currentmap[(this.y / 5 + 1 + 0.0001) >> 0][
                  (this.x / 5 + 0.0001) >> 0
                ][0].slice(0,9)
              )
            )
              this.x = oldcoords[1];
          }
        } else {
          //move right
          movingright = true;
          if (this.y % 5 >> 0 <= this.diffrencey) {
            if (
              !allowedblocks.includes(
                currentmap[(this.y / 5) >> 0][
                  ((this.x - 0.2 - this.diffrencex + 0.0001) / 5 + 1) >> 0
                ][0].slice(0,9)
              )
            )
              this.x = oldcoords[1];
          } else if (
            !allowedblocks.includes(
              currentmap[(this.y / 5) >> 0][
                ((this.x - 0.2 - this.diffrencex + 0.0001) / 5 + 1) >> 0
              ][0].slice(0,9)
            ) ||
            !allowedblocks.includes(
              currentmap[(this.y / 5 + 1) >> 0][
                ((this.x - 0.2 - this.diffrencex + 0.0001) / 5 + 1) >> 0
              ][0].slice(0,9)
            )
          )
            this.x = oldcoords[1];
        }
  
        e.player.style.top = this.y + "vh";
        e.player.style.left = this.x + "vh";
        if (movingright) {
          e.playertool.style.transform = "scale(-1,1) rotate(-90deg)";
          e.playertool.style.left = this.x + 4 + "vh";
        } else {
          e.playertool.style.left = this.x - 3.6 + "vh";
  
          e.playertool.style.transform = "scale(1,1) rotate(-90deg)";
        }
        e.playertool.style.top = this.y + 0.5 + "vh";
      }
    } */
