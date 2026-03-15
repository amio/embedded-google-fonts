/* eslint-env browser */

(function () {
  if (!checkBrowserRequirements()) {
    window.alert('Sorry, current browser not support.')
  }

  var urlInput = document.getElementById('css-url')
  var resultTextarea = document.getElementById('result')
  var stepIII = document.getElementById('step-iii')
  var stepIIIHint = document.getElementById('step-iii-hint')
  var loader = document.getElementById('loader')
  var copyBtn = document.getElementById('copy-btn')

  var exampleButton = document.getElementById('example-btn')
  var exampleURL = 'https://fonts.googleapis.com/icon?family=Material+Icons'
  urlInput.placeholder = exampleURL

  var hintWaiting = 'Waiting for a valid google-fonts-css url ↑↑↑'
  var hintResult = 'Copy the generated CSS below'
  stepIIIHint.innerText = hintWaiting

  initEventListeners()

  function goGetIt () {
    var url = urlInput.value

    if (!verifyURL(url)) {
      // console.info('unrecognized url:', url)
      outputResult('')
      return
    }

    loader.classList.remove('hidden')
    stepIIIHint.classList.add('hidden')
    copyBtn.classList.add('hidden')

    fetchCSS(url)
      .then(embedFonts)
      .then(outputResult)
      .catch(function (e) {
        loader.classList.add('hidden')
        stepIIIHint.classList.remove('hidden')
        errorHandler(e)
      })
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
    loader.classList.add('hidden')
    stepIIIHint.classList.remove('hidden')
    resultTextarea.value = cssText
    stepIII.className = cssText.length ? 'loaded' : ''
    stepIIIHint.innerText = cssText.length ? hintResult : hintWaiting

    if (cssText.length) {
      copyBtn.classList.remove('hidden')
    } else {
      copyBtn.classList.add('hidden')
    }
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

    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(resultTextarea.value).then(function () {
        var btnText = copyBtn.querySelector('.btn-text')
        var successIcon = copyBtn.querySelector('.copy-success-icon')
        btnText.classList.add('hidden')
        successIcon.classList.remove('hidden')
        copyBtn.classList.add('copy-success')
        setTimeout(function () {
          btnText.classList.remove('hidden')
          successIcon.classList.add('hidden')
          copyBtn.classList.remove('copy-success')
        }, 1000)
      })
    })
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
