// ==UserScript==
// @name         YV-ignore
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tavoitteena tehdä Yksivaihde.netistä hieman parempaa luettavaa.
// @author       Okw
// @include      http://www.yksivaihde.net/site/foorumi/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

const windowcss = `#newtaberCfg {background-color: #ddd;}
                   #newtaberCfg .reset_holder {float: left; position: relative; bottom: -1em;}
                   #newtaberCfg .saveclose_buttons {margin: .7em;}
                   #newtaberCfg textarea[id^='newtaberCfg_field_ignore_']  {width: 100%; height: 10em; margin-bottom: 2em;`;
const iframecss = 'height: 50%; width: 30em; border: 1px solid #aaa; border-radius: 3px; position: fixed; z-index: 999;';

GM_registerMenuCommand('Muuta ignore-listaa', opencfg);

function opencfg() {
    GM_config.open();
	newtaberCfg.style = iframecss;
}

GM_config.init({
    id: 'newtaberCfg',
    title: 'Ignore-listan hallinta',
    fields:
    {
        ignore_postaus:
        {
            section: ['Postaus-ignore'],
            label: '(1 nimimerkki / rivi)',
            labelPos: 'top',
            type: 'textarea',
        },
        ignore_etusivu:
        {
            section: ['Etusivu-ignore'],
            label: '(1 nimimerkki / rivi)',
            labelPos: 'top',
            type: 'textarea',
        },
    },
    css: windowcss,
    events:
    {
        save: function() {
            GM_config.close();
        }
    },
});

function etusivu_ignore(nimimerkit) {

    var etusivun_topit = document.getElementById("latest").children[0].children;

    for (var i = 1, alt = false; i < etusivun_topit.length; i++) {
        var tr = etusivun_topit[i];
        if (nimimerkit.includes(tr.children[0].children[1].innerHTML.slice(1,-1))) {
            tr.style.display = "none";
            continue;
        }

        if (alt) {
            tr.setAttribute("class", "alt");
        } else {
            tr.removeAttribute("class");
        }
        alt = !alt;
    }
}

function postaus_ignore(nimimerkit) {

    var viestit = document.getElementsByClassName("threadauthor");

    for (var i = 0, alt = false; i < viestit.length; i++) {
        var li = viestit[i].parentNode;
        if (nimimerkit.includes(viestit[i].children[0].children[2].innerText)) {
            li.style.display = "none";
            continue;
        }

        if (alt) {
            li.setAttribute("class", "alt");
        } else {
            li.removeAttribute("class");
        }
        alt = !alt;
    }
}

(function() {
    'use strict';
    if (window.location.href.endsWith("/site/foorumi/")) {
        // Ollaan etusivulla
        etusivu_ignore(GM_config.get("ignore_etusivu").trim().split('\n'));
    } else if (window.location.href.includes("topic.php")) {
        // Ollaan viestiketjussa
        postaus_ignore(GM_config.get("ignore_postaus").trim().split('\n'));
    } else {
        // Ollaan jossain muualla
    }

})();
