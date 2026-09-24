/* SL Sheet Metal - Website Chat Assistant (external script version)
   Host this file somewhere public, then load it site-wide with ONE line:
   <script src="https://YOUR-DOMAIN/slsm-chatbot.js" defer></script>
   Edit CONFIG / KNOWLEDGE below just like before. */


(function () {
  if (window.__slsmBotLoaded) return;        // avoid double-loading
  window.__slsmBotLoaded = true;

  // Styles are injected here so the whole widget is one .js file.
  var SLSM_CSS = `
  .slsm-cw, .slsm-cw * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  .slsm-cw {
    --slsm-brand: #0f7e41;
    --slsm-accent: #f47b20;
    --slsm-ink: #1f2733;
    --slsm-soft: #f4f6f9;
    --slsm-line: #e3e8ef;
  }
  .slsm-cw-launcher {
    position: fixed; right: 20px; bottom: 20px; z-index: 2147483000;
    display: flex; align-items: center; gap: 10px;
    background: var(--slsm-brand); color: #fff; border: none; cursor: pointer;
    padding: 13px 18px 13px 15px; border-radius: 999px;
    box-shadow: 0 8px 24px rgba(0,0,0,.22); font-size: 15px; font-weight: 600;
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .slsm-cw-launcher:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.28); }
  .slsm-cw-launcher svg { width: 22px; height: 22px; flex: none; }
  .slsm-cw-launcher.slsm-hidden { display: none; }

  .slsm-cw-panel {
    position: fixed; right: 20px; bottom: 20px; z-index: 2147483001;
    width: 372px; max-width: calc(100vw - 24px);
    height: 600px; max-height: calc(100vh - 40px);
    background: #fff; border-radius: 18px; overflow: hidden;
    box-shadow: 0 18px 50px rgba(0,0,0,.30);
    display: none; flex-direction: column; opacity: 0; transform: translateY(12px);
    transition: opacity .18s ease, transform .18s ease;
  }
  .slsm-cw-panel.slsm-open { display: flex; opacity: 1; transform: translateY(0); }

  .slsm-cw-head {
    background: var(--slsm-brand); color: #fff; padding: 16px 16px 15px;
    display: flex; align-items: center; gap: 12px;
  }
  .slsm-cw-badge {
    width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.16);
    display: flex; align-items: center; justify-content: center; flex: none;
  }
  .slsm-cw-badge svg { width: 22px; height: 22px; }
  .slsm-cw-title { font-size: 15.5px; font-weight: 700; line-height: 1.2; }
  .slsm-cw-sub { font-size: 12px; opacity: .85; margin-top: 2px; }
  .slsm-cw-x { margin-left: auto; background: transparent; border: none; color: #fff;
    cursor: pointer; font-size: 22px; line-height: 1; padding: 4px 6px; border-radius: 8px; opacity: .85; }
  .slsm-cw-x:hover { opacity: 1; background: rgba(255,255,255,.15); }

  .slsm-cw-body { flex: 1; overflow-y: auto; padding: 16px; background: var(--slsm-soft); }
  .slsm-cw-row { display: flex; margin-bottom: 12px; }
  .slsm-cw-row.slsm-user { justify-content: flex-end; }
  .slsm-cw-bub {
    max-width: 84%; padding: 10px 13px; border-radius: 14px; font-size: 14.5px;
    line-height: 1.45; color: var(--slsm-ink); white-space: pre-wrap; word-wrap: break-word;
  }
  .slsm-cw-bot .slsm-cw-bub { background: #fff; border: 1px solid var(--slsm-line); border-bottom-left-radius: 4px; }
  .slsm-cw-user .slsm-cw-bub { background: var(--slsm-brand); color: #fff; border-bottom-right-radius: 4px; }

  .slsm-cw-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 2px 0 14px; }
  .slsm-cw-chip {
    background: #fff; border: 1.5px solid var(--slsm-brand); color: var(--slsm-brand);
    border-radius: 999px; padding: 7px 13px; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background .12s ease, color .12s ease;
  }
  .slsm-cw-chip:hover { background: var(--slsm-brand); color: #fff; }
  .slsm-cw-chip.slsm-accent { border-color: var(--slsm-accent); color: var(--slsm-accent); }
  .slsm-cw-chip.slsm-accent:hover { background: var(--slsm-accent); color: #fff; }

  .slsm-cw-typing { display: inline-flex; gap: 4px; padding: 12px 14px; }
  .slsm-cw-typing span { width: 7px; height: 7px; border-radius: 50%; background: #b6bfca; animation: slsm-blink 1.2s infinite; }
  .slsm-cw-typing span:nth-child(2){ animation-delay: .2s; } .slsm-cw-typing span:nth-child(3){ animation-delay: .4s; }
  @keyframes slsm-blink { 0%,60%,100%{opacity:.3;} 30%{opacity:1;} }

  .slsm-cw-foot { border-top: 1px solid var(--slsm-line); background: #fff; padding: 10px 12px; }
  .slsm-cw-inrow { display: flex; align-items: center; gap: 8px; }
  .slsm-cw-input {
    flex: 1; border: 1px solid var(--slsm-line); border-radius: 999px; padding: 11px 15px;
    font-size: 14.5px; outline: none; color: var(--slsm-ink);
  }
  .slsm-cw-input:focus { border-color: var(--slsm-brand); }
  .slsm-cw-send {
    flex: none; width: 42px; height: 42px; border-radius: 50%; border: none; cursor: pointer;
    background: var(--slsm-accent); color: #fff; display: flex; align-items: center; justify-content: center;
  }
  .slsm-cw-send:hover { filter: brightness(1.05); }
  .slsm-cw-send svg { width: 19px; height: 19px; }
  .slsm-cw-tag { text-align: center; font-size: 11px; color: #97a1ad; margin-top: 7px; }
  .slsm-cw-tag a { color: #97a1ad; text-decoration: none; }
`;
  var __slsmStyle = document.createElement("style");
  __slsmStyle.textContent = SLSM_CSS;
  (document.head || document.documentElement).appendChild(__slsmStyle);


  // Chat UI markup - injected into the page by boot() so it works from the header.
  var MARKUP =
    '<div class="slsm-cw" id="slsmCw">' +
      '<button class="slsm-cw-launcher" id="slsmLauncher" aria-label="Open chat">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>' +
        '<span>Chat with us</span>' +
      '</button>' +
      '<div class="slsm-cw-panel" id="slsmPanel" role="dialog" aria-label="SL Sheet Metal chat">' +
        '<div class="slsm-cw-head">' +
          '<div class="slsm-cw-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h2l2-7 4 14 3-9 2 2h5"></path></svg></div>' +
          '<div><div class="slsm-cw-title" id="slsmTitle"></div><div class="slsm-cw-sub" id="slsmSub"></div></div>' +
          '<button class="slsm-cw-x" id="slsmClose" aria-label="Close chat">&times;</button>' +
        '</div>' +
        '<div class="slsm-cw-body" id="slsmBody"></div>' +
        '<div class="slsm-cw-foot">' +
          '<div class="slsm-cw-inrow">' +
            '<input class="slsm-cw-input" id="slsmInput" type="text" autocomplete="off" placeholder="Type your message..." aria-label="Message">' +
            '<button class="slsm-cw-send" id="slsmSend" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>' +
          '</div>' +
          '<div class="slsm-cw-tag">Powered by SL Sheet Metal &middot; <a id="slsmTel" href="#">Call us</a></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  function boot(){
    if (document.getElementById("slsmCw")) return;   // already injected
    var wrap = document.createElement("div");
    wrap.innerHTML = MARKUP;
    document.body.appendChild(wrap);
    init();
  }

  function init(){

  /* ============================================================= */
  /*  CONFIG  -  edit these to update contact details & branding    */
  /* ============================================================= */
  var CONFIG = {
    businessName: "SL Sheet Metal LTD",
    subtitle:     "Edmonton's HVAC experts - usually replies fast",
    phone:        "780-993-2922",
    phoneHref:    "tel:+17809932922",
    // Your JobTable consultation form (same one behind your site's Book Now links):
    bookUrl:      "https://app.jobtable.com/book-now-for-a-free-consultation/sl-sheet-metal-ltd/69cd82b8455c8da14321390f",
    brandColor:   "#0f7e41",                    // header & accents (your brand green)
    accentColor:  "#f47b20",                    // buttons / send

    // MailerLite (already set up for you - leave as-is unless you rebuild the form)
    mlAccount: "2238268",
    mlForm:    "188103661232064436"
  };

  /* ============================================================= */
  /*  KNOWLEDGE  -  the bot's answers. Add/edit freely.             */
  /*  keywords: words that trigger this answer (lowercase)          */
  /*  answer:   what the bot replies                                */
  /*  chips:    follow-up buttons -> {t:"label", go:"intentId"}     */
  /*            or {t:"label", act:"lead|call|book"}                */
  /* ============================================================= */
  var KNOWLEDGE = [
    { id: "services",
      keywords: ["service","services","offer","do you do","what do you","help with","work"],
      answer: "We're Edmonton's HVAC experts and we handle it all:\n- Furnaces & heating\n- Air conditioning\n- Custom sheet metal & ductwork\n- Ventilation & air quality\n- Garage / shop heating\n- Basement development & legal suites\n- Water tank upgrades & tankless\n- Commercial HVAC\n- Mechanical insulation\n\nWhich one can I tell you more about?",
      chips: [{t:"Heating",go:"heating"},{t:"Cooling",go:"cooling"},{t:"Ductwork",go:"ductwork"},{t:"Book a consultation",act:"book"}] },

    { id: "heating",
      keywords: ["heat","heating","furnace","furnaces","warm","cold","no heat"],
      answer: "We install, replace and service furnaces and heating systems - including high-performance RUUD units built for Edmonton winters. Want a quote or to talk to our team?",
      chips: [{t:"Book a consultation",act:"book"},{t:"Financing",go:"financing"},{t:"Call now",act:"call"}] },

    { id: "cooling",
      keywords: ["cool","cooling","ac","a/c","air conditioning","air conditioner","conditioning","hot"],
      answer: "We install and service central air conditioning to keep your home comfortable all summer, using high-performance RUUD systems. Want to set up a quote?",
      chips: [{t:"Book a consultation",act:"book"},{t:"Financing",go:"financing"}] },

    { id: "ductwork",
      keywords: ["duct","ducting","ductwork","sheet metal","fabrication","custom metal","metal"],
      answer: "Custom sheet metal and ductwork is our specialty - it's right in our name. We design and fabricate ducting for new installs, renos, basement suites and commercial jobs, all to Alberta code. Want a quote?",
      chips: [{t:"Book a consultation",act:"book"},{t:"All services",go:"services"}] },

    { id: "ventilation",
      keywords: ["ventilation","vent","air quality","hrv","fresh air","exhaust"],
      answer: "We handle ventilation and indoor air quality - HRVs, exhaust and fresh-air systems. Want us to take a look? I can set up a quote.",
      chips: [{t:"Book a consultation",act:"book"}] },

    { id: "water",
      keywords: ["water","tankless","tank","hot water","water heater","water tank","boiler"],
      answer: "We do water tank upgrades and tankless (on-demand) water heater installs. Tankless gives you endless hot water and saves space. Want to set up a quote?",
      chips: [{t:"Book a consultation",act:"book"},{t:"Financing",go:"financing"}] },

    { id: "garage",
      keywords: ["garage","shop","workshop","heater"],
      answer: "We install garage and shop heating so your space stays warm year-round - great for workshops and hobby garages. Want a quote?",
      chips: [{t:"Book a consultation",act:"book"}] },

    { id: "basement",
      keywords: ["basement","suite","legal suite","development","reno","renovation"],
      answer: "We provide HVAC and ductwork for basement developments and legal suites, designed and installed to Alberta code. Want to discuss your project?",
      chips: [{t:"Book a consultation",act:"book"}] },

    { id: "commercial",
      keywords: ["commercial","business","office","building","store","mosque","restaurant"],
      answer: "We provide complete commercial HVAC solutions - heating, cooling, ventilation and custom ductwork for businesses across Edmonton. Want to talk to our team?",
      chips: [{t:"Book a consultation",act:"book"},{t:"Call now",act:"call"}] },

    { id: "insulation",
      keywords: ["insulation","insulate","mechanical insulation","pipe","efficiency"],
      answer: "We offer mechanical insulation for ducting and piping to improve efficiency and protect your system. Want more info or a quote?",
      chips: [{t:"Book a consultation",act:"book"}] },

    { id: "financing",
      keywords: ["financ","payment","pay","afford","instal","monthly","financeit","abode"],
      answer: "Yes - we offer financing so you can spread out the cost. We have RUUD System Financing and Abode Home Comfort Financing (through Financeit). Want someone to walk you through the options?",
      chips: [{t:"Book a consultation",act:"book"},{t:"Call now",act:"call"}] },

    { id: "ruud",
      keywords: ["ruud","brand","brands","equipment","reliable","warranty","guarantee"],
      answer: "We install high-performance RUUD systems - reliable, efficient and built to last through Edmonton winters, backed by solid warranties. Our promise is simple: Good, Fast & Fair. Want a quote?",
      chips: [{t:"Book a consultation",act:"book"},{t:"Financing",go:"financing"}] },

    { id: "pricing",
      keywords: ["price","pricing","cost","quote","estimate","how much","rate","rates"],
      answer: "Every job is different, so we give you a clear, upfront quote - no surprises, no upsells. That's part of our Good, Fast & Fair promise. The best next step is booking a consultation. Want me to set that up?",
      chips: [{t:"Book a consultation",act:"book"},{t:"Call now",act:"call"}] },

    { id: "hours",
      keywords: ["hour","hours","open","close","closed","when","time","weekend"],
      answer: "Our hours are Monday to Friday, 8am to 5pm. You can reach us at " + CONFIG.phone + ", or I can take your details and have the team follow up.",
      chips: [{t:"Book a consultation",act:"book"},{t:"Call now",act:"call"}] },

    { id: "contact",
      keywords: ["contact","phone","call","reach","email","location","address","where","area","edmonton","serve"],
      answer: "You can call us at " + CONFIG.phone + " (Mon-Fri, 8am-5pm). We proudly serve Edmonton and surrounding areas. Want me to pass your info to the team for a callback?",
      chips: [{t:"Book a consultation",act:"book"},{t:"Call now",act:"call"}] },

    { id: "emergency",
      keywords: ["emergency","urgent","broken","not working","asap","right now","leak","emergency"],
      answer: "Sorry to hear that! For urgent issues like no heat, the fastest way to reach us is to call " + CONFIG.phone + ". If we're closed, leave your details here and we'll get back to you as soon as we can.",
      chips: [{t:"Call now",act:"call"},{t:"Book a consultation",act:"book"}] },

    { id: "promotions",
      keywords: ["promotion","promo","deal","deals","discount","sale","special","offer","newsletter","subscribe","updates","mailing","email list","sign up","signup","join"],
      answer: "We send out promos and deals on furnaces, A/C and more. Want me to add you to our list so you won't miss out? No spam, and you can unsubscribe anytime.",
      chips: [{t:"Yes, sign me up",act:"signup"},{t:"Book a consultation",act:"book"}] },

    { id: "about",
      keywords: ["about","who","scott","trust","review","reviews","experience","team"],
      answer: "SL Sheet Metal LTD is a trusted local Edmonton HVAC company led by Scott and his crew, serving homes and businesses with heating, cooling and custom ductwork. Our promise: Good, Fast & Fair. How can we help?",
      chips: [{t:"Our services",go:"services"},{t:"Book a consultation",act:"book"}] }
  ];

  // Greeting + the quick-start buttons shown first.
  var GREETING = "Hi there! I'm the SL Sheet Metal assistant. I can answer questions about our HVAC services, help you book a consultation, or add you to our promotions list. What can I help you with?";
  var QUICKSTART = [
    {t:"Book a consultation", act:"book"},
    {t:"Our services", go:"services"},
    {t:"Financing options", go:"financing"},
    {t:"Get promotions & updates", act:"signup"},
    {t:"No heat / emergency", go:"emergency"}
  ];

  /* ============================================================= */
  /*  ENGINE  -  no need to edit below this line                    */
  /* ============================================================= */
  var root = document.getElementById("slsmCw");
  root.style.setProperty("--slsm-brand", CONFIG.brandColor);
  root.style.setProperty("--slsm-accent", CONFIG.accentColor);

  var launcher = document.getElementById("slsmLauncher");
  var panel    = document.getElementById("slsmPanel");
  var bodyEl   = document.getElementById("slsmBody");
  var input    = document.getElementById("slsmInput");
  var sendBtn  = document.getElementById("slsmSend");
  document.getElementById("slsmTitle").textContent = CONFIG.businessName;
  document.getElementById("slsmSub").textContent   = CONFIG.subtitle;
  var telLink = document.getElementById("slsmTel"); telLink.href = CONFIG.phoneHref;
  document.getElementById("slsmClose").onclick = closePanel;

  var started = false;
  var lead = null; // active lead-capture state

  function openPanel(){ launcher.classList.add("slsm-hidden"); panel.classList.add("slsm-open");
    if(!started){ started = true; setTimeout(function(){ botSay(GREETING, QUICKSTART); }, 250); }
    setTimeout(function(){ input.focus(); }, 300); }
  function closePanel(){ panel.classList.remove("slsm-open"); launcher.classList.remove("slsm-hidden"); }
  launcher.onclick = openPanel;

  function scrollDown(){ bodyEl.scrollTop = bodyEl.scrollHeight; }

  function addBubble(text, who){
    var row = document.createElement("div");
    row.className = "slsm-cw-row slsm-cw-" + who + (who === "user" ? " slsm-user" : "");
    var b = document.createElement("div");
    b.className = "slsm-cw-bub"; b.textContent = text;
    row.appendChild(b); bodyEl.appendChild(row); scrollDown();
  }

  function addChips(chips){
    if(!chips || !chips.length) return;
    var wrap = document.createElement("div");
    wrap.className = "slsm-cw-chips";
    chips.forEach(function(c){
      var btn = document.createElement("button");
      btn.className = "slsm-cw-chip" + (c.act === "book" ? " slsm-accent" : "");
      btn.textContent = c.t;
      btn.onclick = function(){
        Array.prototype.slice.call(bodyEl.querySelectorAll(".slsm-cw-chips")).forEach(function(x){ x.remove(); });
        addBubble(c.t, "user");
        if(c.act === "book"  || c.act === "lead") return doBook();              // open JobTable form
        if(c.act === "booklink"){ window.open(CONFIG.bookUrl, "_blank"); return; }
        if(c.act === "signup") return startSignup();                            // MailerLite email signup
        if(c.act === "call") return botTyping(function(){ botSay("Sure - tap to call us at " + CONFIG.phone + " (Mon-Fri, 8am-5pm).", [{t:"Call " + CONFIG.phone, act:"calltel"}]); });
        if(c.act === "calltel"){ window.location.href = CONFIG.phoneHref; return; }
        if(c.go){ var k = find(c.go); if(k) botTyping(function(){ botSay(k.answer, k.chips); }); }
      };
      wrap.appendChild(btn);
    });
    bodyEl.appendChild(wrap); scrollDown();
  }

  function botSay(text, chips){ addBubble(text, "bot"); addChips(chips); }

  function botTyping(done){
    var row = document.createElement("div");
    row.className = "slsm-cw-row slsm-cw-bot";
    row.innerHTML = '<div class="slsm-cw-bub" style="padding:4px 6px;"><div class="slsm-cw-typing"><span></span><span></span><span></span></div></div>';
    bodyEl.appendChild(row); scrollDown();
    setTimeout(function(){ row.remove(); done(); }, 600);
  }

  function find(id){ for(var i=0;i<KNOWLEDGE.length;i++){ if(KNOWLEDGE[i].id===id) return KNOWLEDGE[i]; } return null; }

  function match(text){
    var t = " " + text.toLowerCase().replace(/[^a-z0-9\/\s]/g," ") + " ";
    var best = null, bestScore = 0;
    KNOWLEDGE.forEach(function(k){
      var score = 0;
      k.keywords.forEach(function(kw){
        if(t.indexOf(" " + kw + " ") !== -1) score += kw.length + 2;     // whole word/phrase
        else if(t.indexOf(kw) !== -1) score += kw.length;                 // substring
      });
      if(score > bestScore){ bestScore = score; best = k; }
    });
    return bestScore >= 3 ? best : null;
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ---- Booking: open the JobTable consultation form (same as the site's Book Now links) ----
  function doBook(){
    window.open(CONFIG.bookUrl, "_blank");
    botTyping(function(){
      botSay("I've opened our consultation form in a new tab - add your details there and our team will be in touch shortly. (If it didn't open, tap below.) Anything else I can help with?",
        [{t:"Open booking form",act:"booklink"},{t:"Get promotions & updates",act:"signup"},{t:"Call now",act:"call"}]);
    });
  }

  // ---- Email signup: adds the visitor to your MailerLite "Website Chatbot Leads" group ----
  function startSignup(){
    lead = { step: "email", name:"", email:"" };
    botTyping(function(){ botSay("Love it! We'll send you our promos and deals. What's the best email to use?"); });
  }

  function handleLead(text){
    if(lead.step === "email"){
      if(!EMAIL_RE.test(text)) return botTyping(function(){ botSay("Hmm, that doesn't look like a valid email - mind trying again?"); });
      lead.email = text; lead.step = "name";
      return botTyping(function(){ botSay("Great - and your name? (Type 'skip' to leave it out.)"); });
    }
    if(lead.step === "name"){
      if(!/^skip$/i.test(text.trim())) lead.name = text;
      lead.step = "submitting";
      return botTyping(function(){
        botSay("Adding you now...");
        mlSubscribe({ email: lead.email, name: lead.name, message: "Promotions/updates signup (via website chat)" }, function(ok){
          var nm = firstName(lead.name);
          if(!ok){
            botTyping(function(){
              botSay("Sorry, I couldn't confirm that went through. Please try again later, or call us at " + CONFIG.phone + " and we'll add you.",
                [{t:"Call now",act:"call"},{t:"Our services",go:"services"}]);
            });
            lead = null;
            return;
          }
          botTyping(function(){
            botSay("You're on the list" + (nm ? ", " + nm : "") + "! Watch your inbox, you may get a quick note to confirm your subscription. Ready to book? I can open our consultation form anytime.",
              [{t:"Book a consultation",act:"book"},{t:"Our services",go:"services"},{t:"Call now",act:"call"}]);
          });
          lead = null;
        });
      });
    }
  }

  function firstName(n){ return (n||"").trim().split(/\s+/)[0] || ""; }

  // Send the email signup to MailerLite via its public form endpoint (JSONP - no CORS issues).
  function mlSubscribe(d, onDone){
    var cb = "slsmcb_" + Date.now() + Math.floor(Math.random()*1000);
    var finished = false;
    var s = document.createElement("script");
    function cleanup(){ if(finished) return; finished = true; try{ delete window[cb]; }catch(e){ window[cb]=null; } if(s.parentNode) s.parentNode.removeChild(s); }
    window[cb] = function(r){ cleanup(); onDone(!(r && r.success === false)); };
    var p = [
      "fields[email]="  + encodeURIComponent(d.email),
      "fields[name]="   + encodeURIComponent(d.name || ""),
      "fields[phone]="  + encodeURIComponent(d.phone || ""),
      "fields[chatbot_message]=" + encodeURIComponent(d.message || ""),
      "ml-submit=1", "ajax=1", "callback=" + cb
    ];
    s.src = "https://assets.mailerlite.com/jsonp/" + CONFIG.mlAccount + "/forms/" + CONFIG.mlForm + "/subscribe?" + p.join("&");
    s.onerror = function(){ cleanup(); onDone(false); };          // request failed
    document.body.appendChild(s);
    setTimeout(function(){ if(!finished){ cleanup(); onDone(false); } }, 8000);  // no confirmation = not confirmed
  }

  function handleSend(){
    var text = input.value.trim();
    if(!text) return;
    input.value = "";
    Array.prototype.slice.call(bodyEl.querySelectorAll(".slsm-cw-chips")).forEach(function(x){ x.remove(); });
    addBubble(text, "user");

    if(lead){ return handleLead(text); }

    var k = match(text);
    if(k){ return botTyping(function(){ botSay(k.answer, k.chips); }); }

    // fallback
    botTyping(function(){
      botSay("I want to make sure you get the right answer. I can help with heating, cooling, ductwork, financing, hours, or setting up a quote - or you can call us directly at " + CONFIG.phone + ".",
        [{t:"Book a consultation",act:"book"},{t:"Our services",go:"services"},{t:"Call now",act:"call"}]);
    });
  }

  sendBtn.onclick = handleSend;
  input.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); handleSend(); } });

  } // end init

  // Run as soon as the page body is ready (works in header or page injection).
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
