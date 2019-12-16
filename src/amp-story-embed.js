/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { useEffect, useRef } = preactHooks;

export function AmpStoryEmbed(props) {
  props['decoding'] = 'async';
  const { children } = props;

  return preact.createElement('viewer', {}, buildStories(children));
}

/**
 * Builds stories and realizes handshake between them and the viewer.
 * @param {!Array<!Element>} stories
 */
function buildStories(stories) {
  const containerRef = useRef();

  const iframes = stories.map((story, idx) => {
    const url =
      story.props.href +
      `?amp_js_v=0.1#visibilityState=prerender&width=412&height=660&paddingTop=50&prerenderSize=1&origin=http%3A%2F%2F127.0.0.1%3A8080`;
    const iframe = preact.createElement('iframe', {
      id: 'AMP_DOC_' + idx,
      src: url,
    });
    return iframe;
  });

  useEffect(() => {
    Array.prototype.forEach.call(containerRef.current.children, iframe => {
      initializeHandshake(iframe);
    });
  });

  return preact.createElement('container', { ref: containerRef }, iframes);
}

/**
 * Initializes messaging between viewer and AMP document.
 * @param {!Element} iframe
 */
function initializeHandshake(iframe) {
  Messaging.waitForHandshakeFromDocument(
    window,
    iframe.contentWindow,
    'http://127.0.0.1:8080'
  ).then(
    messaging => {
      messaging.setDefaultHandler(handler => {
        console.log('default', { handler });
      });
      // Render first story.
      if (iframe.id === 'AMP_DOC_0') {
        messaging.sendRequest('visibilitychange', { state: 'visible' }, true);
      }
      messaging.registerHandler('moreInfoLinkUrl', () => {
        return Promise.resolve('https://www.google.com');
      });
    },
    err => {
      console.log({ err });
    }
  );
}
