import "./styles/app.css"

document.querySelectorAll("noscript").forEach(node => node.remove())

import("./styles/button.css").finally(() => {
  const launchBtn = document.createElement("button")
  document.body.append(launchBtn)

  launchBtn.id = "launch"
  launchBtn.textContent = launchBtn.id
  launchBtn.onclick = () => {
    launchBtn?.remove()

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
    })
  }
})
