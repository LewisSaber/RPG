let e = {}
function loadIDS(){
  var allElements = document.querySelectorAll("*[id]")
    for (let i = 0, n = allElements.length; i < n; i++) {
      e[allElements[i].id] = allElements[i]
    }
e.map.style.width = mapW*5 + "vh"
e.map.style.height = mapH*5 + "vh"
}