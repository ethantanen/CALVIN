$(document)
  .ready(() => {
    var firstAppend = true

    // Request access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true
      })
        .then(function (stream) {
          video.src = window.URL.createObjectURL(stream)
          video.play()
        })
    }

    // Get the help modal pop up
    var helpModal = document.getElementById('helpModal')
    // Get the button that opens the help list modal
    var btn = document.getElementById('myBtn')
    // Get the <span> element that closes the help list modal
    var span = document.getElementsByClassName('close')[0]

    // When the user clicks the button, open the help list modal
    btn.onclick = function () {
      helpModal.style.display = 'block'
    }

    // When the user clicks on <span> (x), close the help list modal
    span.onclick = function () {
      helpModal.style.display = 'none'
    }

    // When the user clicks anywhere outside of the help list modal, close it
    window.onclick = function (event) {
      if (event.target == helpModal) {
        helpModal.style.display = 'none'
      }
    }

    // Elements for taking and displaying the snapshot
    var canvas = document.getElementById('canvas')
    var context = canvas.getContext('2d')
    var video = document.getElementById('videos')
    var image = document.getElementById('bulldog')

    context.drawImage(image, 0, 0, 300, 210)

    // Trigger take photo
    document.getElementById('snap')
      .addEventListener('click', function () {
        context.drawImage(video, 0, 0, 300, 210)
      })

    // Play speech.mp3 file
    function playAudio (audioStream) {
      var uInt8Array = new Uint8Array(audioStream)
      var arrayBuffer = uInt8Array.buffer
      var blob = new Blob([arrayBuffer])
      var url = URL.createObjectURL(blob)
      document.getElementById('audio')
        .src = url
      document.getElementById('audio')
        .play()
    }

    function sendData (json, url, success) {
      $.ajax({
        type: 'POST',
        url: url,
        data: json,
        dataType: 'json',
        success: (res) => {
          success(res)
        }
      })
    }

    function makeTextBox () {
      var typedInfo = $('#response').val()
      var fullTitle = $("<div style='display: block'  class='containerChat darkerChat'> <img src='otherLogo.png' alt='Avatar'  class='rightChat'> <h4 class='textRight' style='color:white'>" + typedInfo + '</h4></div>')
      $('#thingToAppend').append(fullTitle)
    }

    META = null
    SEND_URL = '/authenticate'

    function makeCalvinTextBox (chatText) {
      console.log(chatText)
      var fullTitle = $("<div style='display: block'  class='containerChat'> <img src='venteraLogo.png' alt='Avatar'> <h4 class='textLeft'>" + chatText + '</h4></div>')
      $('#thingToAppend').append(fullTitle)
      const objDiv = document.getElementById('scrollList')
      objDiv.scrollTop = objDiv.scrollHeight
    }

    $('#send')
      .click(() => {
        img_64 = document.getElementById('canvas')
          .toDataURL('image/jpeg')
        json = {
          image: img_64
        }

        if (SEND_URL === '/adduser') {
          json = { ...json,
            ...{
              meta: META
            }
          }
          console.log(json)
        }

        sendData(json, SEND_URL, (res) => {
          console.log(res)
          playAudio(res.audio.data)
          makeCalvinTextBox(res.text)

          SEND_URL = '/authenticate'
        })
      })

    $('#uploadfile')
      .click(() => {
        img = document.getElementById('file')
          .files[0]
        reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => {
          sendData({
            image: reader.result
          }, URL, (res) => {
            playAudio(res.audio.data)
          })
        }
      })

    $('#response').keyup(function (event) {
      if (event.keyCode === 13) {
        $('#conversation').click()
      }
    })

    $('#conversation')
      .click(() => {
        console.log('HERE')
        json = {
          text: $('#response')
            .val()
        }
        sendData(json, '/conversation', (res) => {
          if (res.meta) {
            META = res.meta
            SEND_URL = '/adduser'
          }
          makeCalvinTextBox(res.text)
          playAudio(res.audio.data)
        })

        makeTextBox()
        $('#response').val('')
        const objDiv = document.getElementById('scrollList')
        objDiv.scrollTop = objDiv.scrollHeight
      })
  })
