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

const viewerHost = document.createElement('container');
const viewerEl = document.createElement('viewer');
viewerEl.appendChild(viewerHost);
document.body.appendChild(viewerEl);

export function AmpStoryEmbed(props) {
  const Messaging = window.Messaging;
  const { children } = props;
  props['decoding'] = 'async';

  // TODO: build all stories.
  const story = children[0];

  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', 'AMP_DOC_1');
  const url =
    story.props.href +
    `?amp_js_v=0.1#visibilityState=visible&width=412&height=660&paddingTop=50&prerenderSize=1&origin=http%3A%2F%2F127.0.0.1%3A8080`;

  iframe.setAttribute('src', url);
  viewerHost.appendChild(iframe);
  Messaging.waitForHandshakeFromDocument(
    window,
    iframe.contentWindow,
    'http://127.0.0.1:8080'
  ).then(
    messaging => {
      messaging.registerHandler('moreInfoLinkUrl', handler => {
        console.log({ handler });
        return Promise.resolve();
      });
      messaging.setDefaultHandler(handler => {
        console.log('default', { handler });
        return Promise.resolve();
      });
      messaging.sendRequest('visibilitychange', { state: 'visible' }, true);
    },
    err => {
      console.log({ err });
    }
  );
}
