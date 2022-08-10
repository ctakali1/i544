import React, { useEffect, useRef, useState } from 'react';

const useState = React;

import makeKnnWsClient from './knn-ws-client.mjs';
import canvasToMnistB64 from './canvas-to-mnist-b64.mjs';
import Canvas from './Canvas'

export default function App(props) {
  //TODO

  const DEFAULT_WS_URL = 'https://zdu.binghamton.edu:2345';
  const [variable, setVariable] = useState(DEFAULT_WS_URL);
  let caller = new makeKnnWsClient(DEFAULT_WS_URL);

  function ResetApp() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, 300, 300);
    document.querySelector('#knn-label').innerHTML = "";
    document.querySelector('#errors').innerHTML = "";
  }

  async function Classify() {
    try {
      document.querySelector('#errors').innerHTML = "";
      document.querySelector('#knn-label').innerHTML = "";
      caller = new makeKnnWsClient(variable);
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext('2d');
      const b64 = canvasToMnistB64(context);
      if (!(/[B-Z]/.test(b64))) {
        reportErrors({ errors: [{ message: 'please draw digit before classifying' }] });
        return;
      }
      var id = (await (caller['classify'](b64))).id;
      var label = (await (caller['getImage'](id))).label;
      document.getElementById('knn-label').innerHTML = label;
    } catch (error) {
      document.getElementById('errors').innerHTML = `<li>${error}</li>`;
    }
  }

  function onChangeWidth() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    const buttonEl = document.getElementById('pen-width').value;
    context.lineWidth = buttonEl;
  }

  function updateUrl() {
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
      <label for="ws=url">KNN Web Services URL</label>
      <input value={variable} type="text" name="ws-url" id="ws-url" size="30" onChange={(e) => setVariable(e.target.value)} />
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