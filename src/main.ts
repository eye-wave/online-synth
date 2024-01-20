import "./styles/index.css"

document.querySelectorAll("noscript").forEach(node => node.remove())

import("./styles/button.css").finally(() => {
  const launchBtn = document.createElement("button")
  document.body.append(launchBtn)

  launchBtn.id = "launch"
  launchBtn.textContent = launchBtn.id
  launchBtn.onclick = () => {

    // @ts-ignore
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    import("./App.svelte").then(m => {      
      const appElement = document.createElement("div")
      appElement.id = "main"
      document.body.appendChild(appElement)


      new m.default({
        target: appElement,
        props: {
          audioContext,
        },
      })

      launchBtn?.remove()
    })
    .catch(() => {
      launchBtn.disabled = true

      const errorMessage = document.createElement("div")
      errorMessage.id = "error"
      errorMessage.textContent = "App is dead 💀, ask Support for help or something idk"

      document.body.append(errorMessage)

    })
  }
})
