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

    try {
      await import("pkg/wavetable_synth")

      const { globalStore } = await import("./lib/global")
      globalStore.addAudioContext(audioContext)

      const App = await import("./lib/App.svelte").then(m => m.default)
      new App({ target: appContainer })
    } catch (err) {
      launchBtn.classList.remove("on")
      launchBtn.classList.add("off")

      const errorMessage = document.createElement("div")
      errorMessage.id = "error"
      errorMessage.textContent = "App is dead 💀, ask Support for help or something idk"
      errorMessage.textContent += `\n${err}`

      document.body.append(errorMessage)
      launchBtn.onclick = null
      return
    }

    launchBtn?.remove()
  }
})
