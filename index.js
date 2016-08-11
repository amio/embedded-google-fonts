(function () {
  var urlInput = document.getElementById('css-url')
  var exampleButton = document.getElementById('eg-btn')
  var outputTextarea = document.getElementById('output')

  initEventListeners()

  function goGetIt () {
    var url = urlInput.value

    if (!verifyURL(url)) {
      console.error(url)
      return
    }

    fetchCSS(url)
      .then(embedFonts)
      .then(outputResult)
      .catch(errorHandler)
  }

  function fetchCSS (url) {
    return fetch(url).then(function (res) {
      return res.text()
    })
  }

  function embedFonts (cssText) {
    return cssText
  }

  function outputResult (cssText) {
    outputTextarea.value = cssText
  }

  function errorHandler (e) {
    console.error(e)
  }

  function verifyURL (url) {
    return true
  }

  function initEventListeners () {
    urlInput.addEventListener('input', goGetIt)
    exampleButton.addEventListener('click', function () {
      urlInput.value = 'https://fonts.googleapis.com/css?family=Droid+Serif|Roboto'
      goGetIt()
    })
  }
})()
