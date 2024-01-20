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
  launchBtn.onclick = async () => {
    // @ts-ignore
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    const App = await import("./App.svelte")
      .then(m => m.default)
      .catch(() => {
        launchBtn.disabled = true

        const errorMessage = document.createElement("div")
        errorMessage.id = "error"
        errorMessage.textContent = "App is dead 💀, ask Support for help or something idk"

        document.body.append(errorMessage)
      })

    globalStore.addAudioContext(audioContext)

    if (!App) throw Error()

    new App({ target: appContainer })

    launchBtn?.remove()
  }
})
