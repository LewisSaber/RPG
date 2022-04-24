class player {
  constructor() {
    let tag = document.createElement("p");
    tag.setAttribute("id", "player");

    e.map.appendChild(tag);
    e["player"] = tag;
    this.x = 5;
    this.y = 20;
    this.speed = 300;

    e.player.style.left = this.x + "vh";
    e.player.style.top = this.y + "vh";
  }
  move() {
    
    let oldcoords = [this.y, this.x];
    if (!keys.includes(1)) {
      clearInterval(movetimer);
      movetimer = 0;
    } else {
      if (keys[0] != keys[2]) {
        if (keys[0]) this.y = this.y -= 0.2;
        if (keys[2]) this.y = this.y += 0.2;
      }

      this.y = +this.y.toFixed(1);

      if (oldcoords[0] > this.y) {
        if (this.x % 5 == 0) {
          if (currentmap[(this.y / 5) >> 0][this.x / 5][0] !="0")
            this.y = oldcoords[0];
        } else {
          if (
            currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0] !="0" ||
            currentmap[(this.y / 5) >> 0][(this.x / 5 + 1) >> 0][0] !="0"
          )
            this.y = oldcoords[0];
        }
      } else {
        if (this.x % 5 == 0) {
          if (currentmap[((this.y - 0.2) / 5 + 1) >> 0][this.x / 5][0] !="0")
            this.y = oldcoords[0];
        } else if (
          currentmap[((this.y - 0.2) / 5 + 1) >> 0][(this.x / 5) >> 0][0] !="0" ||
          currentmap[((this.y - 0.2) / 5 + 1) >> 0][(this.x / 5 + 1) >> 0][0] !="0"
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
        if (this.y % 5 == 0) {
          if (currentmap[this.y / 5][(this.x / 5) >> 0][0] !="0")
            this.x = oldcoords[1];
        } else {
          if (
            currentmap[(this.y / 5) >> 0][(this.x / 5) >> 0][0] !="0" ||
            currentmap[(this.y / 5 + 1) >> 0][(this.x / 5) >> 0][0] !="0"
          )
            this.x = oldcoords[1];
        }
      } else {
        if (this.y % 5 == 0) {
          if (currentmap[this.y / 5][((this.x - 0.2) / 5 + 1) >> 0][0] !="0")
            this.x = oldcoords[1];
        } else if (
          currentmap[(this.y / 5) >> 0][((this.x - 0.2) / 5 + 1) >> 0][0] !="0" ||
          currentmap[(this.y / 5 + 1) >> 0][((this.x - 0.2) / 5 + 1) >> 0][0] !="0"
        )
          this.x = oldcoords[1];
      }

      e.player.style.top = this.y + "vh";
      e.player.style.left = this.x + "vh";
    }
  }
  //}
  

  getSpeed() {
    return this.speed / 10;
  }
}
