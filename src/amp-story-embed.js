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
const ampDoc = document.createElement('ampDoc');
document.body.appendChild(ampDoc);
let viewer;

export function AmpStoryEmbed(props) {
  const { children } = props;
  props['decoding'] = 'async';

  // TODO: build all stories.
  const story = children[0];
  // TODO: add backgroundimage from data-poster-portrait-src.
  viewer = new Viewer(viewerHost, story.props.href);
  viewer.setViewerShowAndHide(showViewer, hideViewer, isViewerHidden);

  // TODO: render all viewers
  const embed = preact.createElement('amp-story-embed', props);
  openAmpDocInViewer();
  return embed;
}

function hideViewer() {
  viewerEl.classList.add('hidden');
}

function showViewer() {
  viewerEl.classList.remove('hidden');
}

function isViewerHidden() {
  return viewerEl.classList.contains('hidden');
}

function openAmpDocInViewer() {
  viewer.attach();
  showViewer();
}
