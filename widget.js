(function () {
  const script = document.currentScript;
  const clientId = script.getAttribute("data-client");
  const apiKey = script.getAttribute("data-key");

  // =========================
  // 🔵 FLOATING BUTTON
  // =========================
  const button = document.createElement("div");
  button.innerText = "Chat";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.background = "#ff4d4d";
  button.style.color = "#fff";
  button.style.padding = "12px 16px";
  button.style.borderRadius = "50px";
  button.style.cursor = "pointer";
  button.style.zIndex = "99999";
  button.style.fontFamily = "Arial";

  document.body.appendChild(button);

  // =========================
  // 💬 CHAT BOX
  // =========================
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.bottom = "80px";
  box.style.right = "20px";
  box.style.width = "300px";
  box.style.height = "400px";
  box.style.background = "#fff";
  box.style.borderRadius = "12px";
  box.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
  box.style.display = "none";
  box.style.flexDirection = "column";
  box.style.overflow = "hidden";
  box.style.zIndex = "99999";
  box.style.fontFamily = "Arial";

  box.innerHTML = `
    <div id="header" style="
      padding:12px;
      color:white;
      font-weight:bold;
      background:#ff4d4d;
    ">
      Chat
    </div>

    <div id="messages" style="
      flex:1;
      padding:10px;
      overflow:auto;
      font-size:14px;
    "></div>

    <div style="display:flex;border-top:1px solid #eee;">
      <input id="input" style="
        flex:1;
        padding:10px;
        border:none;
        outline:none;
      " placeholder="Type..." />

      <button id="send" style="
        padding:10px 14px;
        border:none;
        background:#ff4d4d;
        color:white;
        cursor:pointer;
      ">Send</button>
    </div>
  `;

  document.body.appendChild(box);

  // =========================
  // TOGGLE
  // =========================
  button.onclick = () => {
    box.style.display = box.style.display === "none" ? "flex" : "none";
  };

  const messages = box.querySelector("#messages");
  const input = box.querySelector("#input");
  const send = box.querySelector("#send");
  const header = box.querySelector("#header");

  // =========================
  // ✍️ TYPING EFFECT
  // =========================
  function typeMessage(text, isUser = false) {
    let i = 0;
    const div = document.createElement("div");

    div.style.margin = "6px 0";
    div.style.textAlign = isUser ? "right" : "left";
    div.style.whiteSpace = "pre-wrap";

    messages.appendChild(div);

    const interval = setInterval(() => {
      div.innerText += text[i];
      i++;

      if (i >= text.length) {
        clearInterval(interval);
        messages.scrollTop = messages.scrollHeight;
      }
    }, 15);
  }

  // =========================
  // 📩 SEND MESSAGE
  // =========================
  send.onclick = async () => {
    const text = input.value;
    if (!text) return;

    typeMessage("You: " + text, true);
    input.value = "";

    const res = await fetch("https://restaurant-chat-one.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        clientId,
        apiKey
      })
    });

    const data = await res.json();

    // =========================
    // 🎨 BRANDING (IMPORTANT)
    // =========================
    const brand = data.brand;

    if (brand) {
      header.innerText = brand.name + " Assistant";
      header.style.background = brand.color;

      button.style.background = brand.color;
      send.style.background = brand.color;
    }

    // bot reply
    typeMessage(data.reply);
  };
})();
