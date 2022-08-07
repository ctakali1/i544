import React, { useEffect, useRef, useState } from 'react';

// const { useState } = React;

import makeKnnWsClient from './knn-ws-client.mjs';
import canvasToMnistB64 from './canvas-to-mnist-b64.mjs';
import Canvas from './Canvas'

const DEFAULT_WS_URL = 'https://zdu.binghamton.edu:2345';

export default function App(props) {
  //TODO

  let caller = new makeKnnWsClient(DEFAULT_WS_URL);

  function ResetApp() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, 300, 300);
  }

  async function Classify() {
    try {
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext('2d');
      const b64 = canvasToMnistB64(context);
      if (!(/[B-Z]/.test(b64))) {
        reportErrors({ errors: [{ message: 'please draw digit before classifying' }] });
        // document.getElementById('errors').innerHTML = "please draw digit before classifying";
        return;
      }
      var id = (await (caller['classify'](b64))).id;
      var label = (await (caller['getImage'](id))).label;
      document.getElementById('knn-label').innerHTML = label;
    } catch (error) {
      document.getElementById('errors').innerHTML = `<li>${error}</li>`;
    }
    // console.log("label ", label)
  }

  function onChangeWidth() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    const buttonEl = document.getElementById('pen-width').value;
    context.lineWidth = buttonEl;
  }

  function updateUrl() {
    // var canvas = document.getElementById("canvas");
    // var context = canvas.getContext('2d');
    const buttonEl = document.getElementsByName('ws-url').value;
    alert(buttonEl);
  }

  function reportErrors(errResult) {
    const html =
      errResult.errors.map(e => `<li>${e.message}</li>`).join('\n');
    document.getElementById('errors').innerHTML = html;
  }

  return (
    <div>
      {/* <div>
        <input type="text" name="ws-url" id="ws-url" size="30" value={DEFAULT_WS_URL} />
      </div> */}
      <form id="url-form">
        {/* <label for="ws=url">KNN Web Services URL</label> */}
        <input id="ws-url" name="ws-url" size="30" value="https://zdu.binghamton.edu:2345" />
      </form>
      <Canvas></Canvas>
      <div>
        <button onClick={ResetApp}>Reset</button>
        <button onClick={Classify}>Classify</button>
        Pen width : <select id="pen-width" onChange={onChangeWidth} value={this.value}>
          <option value="1" defaultValue>1</option>
          <option value="2">2</option>
        </select>
        <p>
          <strong>Label</strong>: <span id="knn-label"></span>
        </p>
        <ul id="errors"></ul>
      </div>
    </div>
  )
}
