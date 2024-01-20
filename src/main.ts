import { globalStore } from "./global"
import "./styles/index.css"

document.querySelectorAll("noscript").forEach(node => node.remove())

import("./styles/button.css").finally(() => {
  const appContainer = document.getElementById("app") || document.createElement("main")
  appContainer.id = "app"
  document.body.insertBefore(appContainer, document.body.firstChild)

  const launchBtn = document.createElement("button")
  appContainer.append(launchBtn)

  launchBtn.id = "launch"
  launchBtn.textContent = launchBtn.id
  launchBtn.onclick = () => {
    // @ts-ignore
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    import("./App.svelte")
      .then(m => {
        globalStore.addAudioContext(audioContext)

        new m.default({ target: appContainer })

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
