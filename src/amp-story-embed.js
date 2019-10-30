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

/** @const {string} */
const CSS =
  ':host { all: initial; display: block; border-radius: 0 !important; width: 405px; height: 720px; overflow: auto; } .story { height: 100%; width: 100%; flex: 0 0 100%; border: 0; opacity: 0; transition: opacity 500ms ease; } main { display: flex; flex-direction: row; height: 100%; } .i-amphtml-story-embed-loaded iframe { opacity: 1; } iframe[src=""] { display: none; }';

export function AmpStoryEmbed(props) {
  const { children } = props;
  props['decoding'] = 'async';

  // TODO: build all child iframes.
  const story = children[0];
  // TODO: add backgroundimage from data-poster-portrait-src.
  const iframe = preact.createElement('iframe', {
    src: story.props.href,
    style: {
      all: 'initial',
      display: 'block',
      'border-radius': '0 !important',
      width: '405px',
      height: '720px',
      overflow: 'auto',
    },
  });

  // TODO: render all iframes
  return preact.createElement('amp-story-embed', props, iframe);
}
