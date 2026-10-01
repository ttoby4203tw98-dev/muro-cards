/* MURO APP 入口密碼：每台裝置輸入一次就記住。
   換密碼 = 改 暮若ai\app_password.txt → node 暮若ai\set_app_password.mjs → push；
   HASH 一換，所有裝置都要重新輸入（離職同仁就進不來）。 */
(function () {
  var HASH = "5a5d81ddeabef988f84ed357c70a27348439109ff670b939e6c65d2442060551";
  var KEY = "muro-gate";
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  if (saved() === HASH) return;

  var st = document.createElement("style");
  st.id = "muro-gate-style";
  st.textContent =
    "body>*:not(#muro-gate){display:none!important}" +
    "#muro-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;" +
    "background:linear-gradient(160deg,#4a2c3a 0%,#6b3f52 55%,#9c5c6e 100%);font-family:-apple-system,'PingFang TC','Microsoft JhengHei',sans-serif}" +
    "#muro-gate form{background:#fff;border-radius:18px;padding:28px 22px;width:100%;max-width:340px;box-shadow:0 12px 40px rgba(0,0,0,.25);text-align:center}" +
    "#muro-gate h1{margin:0 0 6px;font-size:20px;color:#4a2c3a}" +
    "#muro-gate p{margin:0 0 18px;font-size:13px;color:#8a7680}" +
    "#muro-gate input{width:100%;box-sizing:border-box;font-size:17px;padding:12px 14px;border:1px solid #d9cdd2;border-radius:12px;outline:none;text-align:center}" +
    "#muro-gate input:focus{border-color:#9c5c6e}" +
    "#muro-gate button{margin-top:12px;width:100%;font-size:16px;padding:12px;border:0;border-radius:12px;background:#4a2c3a;color:#fff;cursor:pointer}" +
    "#muro-gate .msg{min-height:18px;margin-top:10px;font-size:13px;color:#c0392b}";
  document.head.appendChild(st);

  function sha(s) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
    });
  }
  function show() {
    var box = document.createElement("div");
    box.id = "muro-gate";
    box.innerHTML = '<form autocomplete="off"><h1>暮若團隊</h1><p>請輸入團隊密碼（這台裝置只需輸入一次）</p>' +
      '<input type="password" inputmode="text" placeholder="密碼" aria-label="密碼" autofocus>' +
      '<button type="submit">進入</button><div class="msg"></div></form>';
    document.body.appendChild(box);
    var form = box.querySelector("form"), inp = box.querySelector("input"), msg = box.querySelector(".msg");
    inp.focus();
    form.onsubmit = function (e) {
      e.preventDefault();
      sha("muro-gate|" + inp.value.trim()).then(function (h) {
        if (h !== HASH) { msg.textContent = "密碼不對，請再試一次。"; inp.select(); return; }
        try { localStorage.setItem(KEY, HASH); } catch (err) {}
        box.remove(); st.remove();
      });
    };
  }
  if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
})();
