import { globalStore } from "./lib/global"
import "./styles/index.css"

document.querySelectorAll("noscript").forEach(node => node.remove())

import("./styles/extra.css").finally(() => {
  const appContainer = document.getElementById("app") || document.createElement("main")
  appContainer.id = "app"
  document.body.insertBefore(appContainer, document.body.firstChild)

  const launchBtn = document.createElement("button")
  appContainer.append(launchBtn)

  launchBtn.id = "launch"
  launchBtn.className = "on"
  launchBtn.textContent = launchBtn.id
  launchBtn.onclick = async () => {
    // @ts-ignore
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    const App = await import("./lib/App.svelte").then(m => m.default)

    globalStore.addAudioContext(audioContext)

    try {
      new App({ target: appContainer })
    } catch (err) {
      launchBtn.classList.remove("on")
      launchBtn.classList.add("off")

      const errorMessage = document.createElement("div")
      errorMessage.id = "error"
      errorMessage.textContent = "App is dead 💀, ask Support for help or something idk"
      errorMessage.textContent += `\n${err}`

      document.body.append(errorMessage)
      return
    }

    launchBtn?.remove()
  }
})
