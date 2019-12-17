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

/**
 *
 * @param {*} props
 * @return {*}
 */
export function AmpStoryEmbed(props) {
  props['decoding'] = 'async';

  const {children} = props;
  const containerRef = useRef();
  const container = buildStories(children, containerRef);
  const messagingMap = {};

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    Array.prototype.forEach.call(containerRef.current.children, (iframe) => {
      initializeHandshake(iframe).then((messaging) => {
        messagingMap[iframe.id] = messaging;
      });
    });

    const currentIframe = containerRef.current.children[0];
    installGestures(messagingMap, currentIframe);
  });

  return preact.createElement('viewer', {}, container);
}

/**
 *
 * @param {!Object} messagingMap
 * @param {!Element} iframe
 */
function installGestures(messagingMap, iframe) {
  const buttonLeft = window.document.querySelector('button.prev');
  const buttonRight = window.document.querySelector('button.next');
  // TODO: install swiping gestures for real.
  buttonLeft.addEventListener('click', () => {
    previousStory(messagingMap, iframe);
  });
  buttonRight.addEventListener('click', () => {
    nextStory(messagingMap, iframe);
  });
}

/**
 *
 * @param {*} stories
 * @param {*} containerRef
 * @return {*}
 */
function buildStories(stories, containerRef) {
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
        if (iframe.id === 'AMP_DOC_0') {
          messaging.sendRequest('visibilitychange', {state: 'visible'}, true);
        }
        messaging.registerHandler('moreInfoLinkUrl', () => {
          return Promise.resolve('https://www.google.com');
        });
        return messaging;
      },
      (err) => {
        console.log({err});
      },
  );
}

/**
 *
 * @param {*} messagingMap
 * @param {*} iframe
 */
function nextStory(messagingMap, iframe) {
  // pause and hide current story
  // play next story
  // pre-render next-next story
  if (!messagingMap[iframe.id]) {
    return;
  }
  console.log('next');
}

/**
 *
 * @param {*} messagingMap
 * @param {*} iframe
 */
function previousStory(messagingMap, iframe) {
  // pause and hide current story
  // play previous story
  // pre-render previous-previous story
  if (!messagingMap[iframe.id]) {
    return;
  }
  console.log('prev');
}
