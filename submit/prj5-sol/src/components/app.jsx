import React from 'react';

const { useState } = React;

import makeKnnWsClient from '../knn-ws-client.mjs';
import canvasToMnistB64 from '../canvas-to-mnist-b64.mjs';

const DEFAULT_WS_URL = 'https://zdu.binghamton.edu:2345';

export default function App(props) {
  return (
    <div>
      <button id="my-btn">
        Classify
      </button>
    </div>
  );
}
