import React from 'react';

const { useState } = React;

import makeKnnWsClient from './knn-ws-client.mjs';
import Canvas from './Canvas';

const DEFAULT_WS_URL = 'https://zdu.binghamton.edu:2345';

export default function App(props) {
  //TODO
  return (
    <div>
      <Canvas />

    </div>
  )
}
