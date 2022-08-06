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
    context.clearRect(4, 4, 292, 292);
  }

  async function Classify() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    const b64 = canvasToMnistB64(context);
    // console.log("b64 ", b64)
    if (!(/[B-Z]/.test(b64))) {
      // console.log("in if")
      this.reportErrors({ errors: [{ message: 'please draw digit before classifying' }] });
      return;
    }

    // console.log(caller);
    debugger;
    var id = (await (caller['classify'](b64))).id;
    // console.log("id ", id)
    var label = (await (caller['getImage'](id))).label;
    console.log("label ", label)
  }

  return (
    <div>
      <Canvas></Canvas>
      <div>
        <button onClick={ResetApp}>Reset</button>
        <button onClick={Classify}>Classify</button>
      </div>
    </div>
  )
}
