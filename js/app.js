function App(){
	var that = this;
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

App.prototype.init = function(){
	window.addEventListener('resize', this.resize)
	this.resize();
	fetch('/README.md')
		.then(function(res){ return res.text() })
		.then(function(text){
			var content = document.getElementById('content');
			content.innerHTML = marked(text)
		})
}

App.prototype.resize = function(){
	var header = document.getElementById('header')
  header.style.height = (window.innerHeight - 150) + 'px'
}

var app = new App()