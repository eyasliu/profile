function App(){
	var that = this;
  this.wasFetch = false;
	this.domReady(function(){
		that.init()
	})
}

App.prototype.domReady = (function (cb){
  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }
})()

App.prototype.resize = function(){
	var header = document.getElementById('header')
  header.style.height = (window.innerHeight - 150) + 'px'
}

App.prototype.bindEvent = function(){
  window.addEventListener('resize', this.resize)
  this.resize();
  
}

App.prototype.fetch = function(cb){
  fetch('/README.md')
    .then(function(res){ return res.text() })
    .then(function(text){
      this.wasFetch = true;
      localStorage.setItem('content', text);
      cb(text);
    }.bind(this))
  
}

App.prototype.updateCache = function(){
  this.fetch(localStorage.setItem.bind(localStorage, 'content'))
}

App.prototype.render = function(text){
  if(text){
    var content = document.getElementById('content');
    content.innerHTML = marked(text)
    !this.wasFetch && this.updateCache();
  } else {
    var storageText = localStorage.getItem('content');
    storageText ? arguments.callee.call(this, storageText) : this.fetch(arguments.callee);
  }
}

App.prototype.init = function(){
  var that = this;
  this.bindEvent();
  this.render();
}


var app = new App()