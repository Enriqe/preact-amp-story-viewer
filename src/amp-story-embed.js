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

const {useEffect, useRef} = preactHooks;

let currentIdx = 0;
let maxIdx = 0;

export function AmpStoryEmbed(props) {
  props['decoding'] = 'async';

  const {children} = props;
  const containerRef = useRef();
  const container = buildStories(children, containerRef);
  const messagingMap = {};
  maxIdx = children.length - 1;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const storyIframes = containerRef.current.children;
    Array.prototype.forEach.call(storyIframes, (iframe) => {
      initializeHandshake(iframe).then((messaging) => {
        messagingMap[iframe.id] = messaging;
      });
    });

    installGestures(messagingMap, storyIframes);
  });

  return preact.createElement('viewer', {}, container);
}

/**
 * Installs gestures.
 * @param {!Object} messagingMap
 * @param {!Element} storyIframes
 */
function installGestures(messagingMap, storyIframes) {
  const buttonLeft = window.document.querySelector('button.prev');
  const buttonRight = window.document.querySelector('button.next');

  // TODO: install swiping gestures.
  buttonLeft.addEventListener('click', () => {
    currentIdx = Math.max(currentIdx - 1, 0);
    pauseStory(messagingMap, storyIframes[currentIdx + 1]);
    displayStory(messagingMap, storyIframes[currentIdx]);
    preRenderStory(messagingMap, storyIframes[currentIdx - 1]);
  });
  buttonRight.addEventListener('click', () => {
    currentIdx = Math.min(currentIdx + 1, maxIdx);
    pauseStory(messagingMap, storyIframes[currentIdx - 1]);
    displayStory(messagingMap, storyIframes[currentIdx]);
    preRenderStory(messagingMap, storyIframes[currentIdx + 1]);
  });
}

/**
 * Builds iframes where stories will appear.
 * @param {!Array<!Element>} stories
 * @param {*} containerRef
 * @return {*}
 */
function buildStories(stories, containerRef) {
  const iframes = stories.map((story, idx) => {
    const url =
      story.props.href +
      `?amp_js_v=0.1#visibilityState=inactive&width=412&height=660&paddingTop=50&prerenderSize=1&origin=http%3A%2F%2F127.0.0.1%3A8080`;
    const iframe = preact.createElement('iframe', {
      id: 'AMP_DOC_' + idx,
      src: url,
      style: 'transform: translateX(1000%)',
    });

    return iframe;
  });

  return preact.createElement('container', {ref: containerRef}, iframes);
}

/**
 * Initializes messaging between viewer and AMP document.
 * @param {!Element} iframe
 * @return {!Promise}
 */
function initializeHandshake(iframe) {
  return Messaging.waitForHandshakeFromDocument(
      window,
      iframe.contentWindow,
      'http://127.0.0.1:8080',
  ).then(
      (messaging) => {
        messaging.setDefaultHandler((handler) => {
          console.log('default', {handler});
        });
        // Render first story.
        // TODO: move this elsewhere and reuse displayStory.
        if (iframe.id === 'AMP_DOC_0') {
          messaging.sendRequest('visibilitychange', {state: 'visible'}, true);
          iframe.style.transform = 'translateX(0)';
        }
        messaging.registerHandler('moreInfoLinkUrl', () => {
          return Promise.resolve('https://www.google.com');
        });
        console.log('finished handshake', iframe.id);
        return messaging;
      },
      (err) => {
        console.log({err});
      },
  );
}

/**
 * Renders story visible.
 * @param {!Object} messagingMap
 * @param {!Element} iframe
 */
function displayStory(messagingMap, iframe) {
  if (!iframe || !messagingMap[iframe.id]) {
    return;
  }

  console.log('displaying: ', iframe.id);
  iframe.style.transform = 'translateX(0)';
  messagingMap[iframe.id].sendRequest(
      'visibilitychange',
      {state: 'visible'},
      true,
  );
}

/**
 * Pauses story.
 * @param {!Object} messagingMap
 * @param {!Element} iframe
 */
function pauseStory(messagingMap, iframe) {
  if (!iframe || !messagingMap[iframe.id]) {
    return;
  }

  console.log('pausing: ', iframe.id);
  iframe.style.transform = 'translateX(200%)';
  messagingMap[iframe.id].sendRequest(
      'visibilitychange',
      {state: 'paused'},
      true,
  );
}

/**
 * Prerenders story.
 * @param {!Object} messagingMap
 * @param {!Element} iframe
 */
function preRenderStory(messagingMap, iframe) {
  if (!iframe || !messagingMap[iframe.id]) {
    return;
  }

  console.log('prerendering: ', iframe.id);
  iframe.style.transform = 'translateX(100%)';
  messagingMap[iframe.id].sendRequest(
      'visibilitychange',
      {
        state: 'prerender',
      },
      true,
  );
}
