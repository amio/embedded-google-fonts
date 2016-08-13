(function () {
  var urlInput = document.getElementById('css-url')
  var exampleButton = document.getElementById('eg-btn')
  var outputTextarea = document.getElementById('output')

  initEventListeners()

  function goGetIt () {
    var url = urlInput.value

    if (!verifyURL(url)) {
      // console.info('unrecognized url:', url)
      outputResult('')
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
    var fontLocations = cssText.match(/https:\/\/[^)]+/g)
    var fontLoadedPromises = fontLocations.map(function (location) {
      return new Promise (function (resolve, reject) {
        fetch(location).then(function (res) {
          return res.blob()
        }).then(function (blob) {
          var reader = new FileReader()
          reader.addEventListener('load', function () {
            // Side Effect
            cssText = cssText.replace(location, this.result)
            resolve([location, this.result])
          })
          reader.readAsDataURL(blob)
        }).catch(reject)
      })
    })
    return Promise.all(fontLoadedPromises).then(function () {
      return cssText
    })
  }

  function outputResult (cssText) {
    outputTextarea.value = cssText
  }

  function errorHandler (e) {
    console.error(e)
  }

  function initEventListeners () {
    urlInput.addEventListener('input', goGetIt)
    exampleButton.addEventListener('click', function () {
      urlInput.value = 'https://fonts.googleapis.com/css?family=Droid+Serif|Roboto'
      goGetIt()
    })
  }

  function verifyURL (url) {
    return url.indexOf('https://fonts.googleapis.com/') === 0
  }

  function checkBrowserRequirements () {
    if (typeof window.fetch === 'undefined') return false
    if (typeof window.FileReader === 'undefined') return false
    if (typeof window.URL === 'undefined') return false
    return true
  }
})()
