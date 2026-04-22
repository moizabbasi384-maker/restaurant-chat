(function () {
  const script = document.currentScript;
  const clientId = script.getAttribute("data-client");
  const apiKey = script.getAttribute("data-key");

  // 🟢 Create chat button
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
  button.style.zIndex = "9999";

  document.body.appendChild(button);

  // 🟢 Create chat box
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.bottom = "80px";
  box.style.right = "20px";
  box.style.width = "300px";
  box.style.height = "400px";
  box.style.background = "#fff";
  box.style.border = "1px solid #ccc";
  box.style.borderRadius = "10px";
  box.style.display = "none";
  box.style.flexDirection = "column";
  box.style.zIndex = "9999";

 box.innerHTML = `
  <div id="header" style="
    padding:10px;
    color:white;
    font-weight:bold;
    background:#ff4d4d;
  ">
    Chat
  </div>

  <div id="messages" style="height:300px;overflow:auto;padding:10px;"></div>

  <div style="display:flex;">
    <input id="input" style="flex:1;padding:10px;" />
    <button id="send">Send</button>
  </div>
`;
  document.body.appendChild(box);

  // 🟢 Toggle
  button.onclick = () => {
    box.style.display = box.style.display === "none" ? "flex" : "none";
  };

  const messages = box.querySelector("#messages");
  const input = box.querySelector("#input");
  const send = box.querySelector("#send");

 function typeMessage(text, callback) {
  let i = 0;
  const div = document.createElement("div");
  div.style.margin = "5px 0";
  messages.appendChild(div);

  const interval = setInterval(() => {
    div.innerText += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 20);
}
  send.onclick = async () => {
    const text = input.value;
    if (!text) return;

    addMessage(text, true);
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
    const brand = data.brand;
    addMessage(data.reply, false);
  };
})();
