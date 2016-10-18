/* eslint-env browser */

(function () {
  if (!checkBrowserRequirements()) {
    window.alert('Sorry, current browser not support.')
  }

  var urlInput = document.getElementById('css-url')
  var resultTextarea = document.getElementById('result')
  var stepIII = document.getElementById('step-iii')
  var stepIIIHint = document.getElementById('step-iii-hint')

  var exampleButton = document.getElementById('example-btn')
  var exampleURL = 'https://fonts.googleapis.com/css?family=Droid+Serif|Roboto'
  urlInput.placeholder = exampleURL

  var hintWaiting = 'Waiting for a valid google-fonts-css url ↑↑↑'
  var hintResult = 'Here you are'
  stepIIIHint.innerText = hintWaiting

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
    }, errorHandler)
  }

  function embedFonts (cssText) {
    var fontLocations = cssText.match(/https:\/\/[^)]+/g)
    var fontLoadedPromises = fontLocations.map(function (location) {
      return new Promise(function (resolve, reject) {
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
    resultTextarea.value = cssText
    stepIII.className = cssText.length ? 'loaded' : ''
    stepIIIHint.innerText = cssText.length ? hintResult : hintWaiting
  }

  function errorHandler (e) {
    console.info('ERR', e)
  }

  function initEventListeners () {
    urlInput.addEventListener('input', goGetIt)

    exampleButton.addEventListener('click', function () {
      urlInput.value = exampleURL
      goGetIt()
    })

    resultTextarea.addEventListener('focus', function (e) {
      e.target.select()
    })

    document.getElementById('step-ii-label').addEventListener('click', reset)
  }

  function reset () {
    urlInput.value = ''
    outputResult('')
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
