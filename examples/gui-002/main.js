/*
 * Copyright (c) 2016-2017  Moddable Tech, Inc.
 *
 *   This file is part of the Moddable SDK.
 *
 *   This work is licensed under the
 *       Creative Commons Attribution 4.0 International License.
 *   To view a copy of this license, visit
 *       <http://creativecommons.org/licenses/by/4.0>.
 *   or send a letter to Creative Commons, PO Box 1866,
 *   Mountain View, CA 94042, USA.
 *
 */

import {} from 'piu/MC'

const WHITE = 'white'
const RED = 'red'
const whiteSkin = new Skin({ fill: WHITE })
const redSkin = new Skin({ fill: RED })

let MyApplication = Application.template($ => ({
  skin: whiteSkin,
  Behavior: class extends Behavior {
    onCreate (application, anchors) {}
    onDisplaying (application) {}
    onFinished (application) {}
    onTimeChanged (application) {}
  },
  contents: [
    Content($, {
      skin: whiteSkin,
      top: 0,
      left: 0,
      width: 240,
      height: 320
    })
  ]
}))

export default function () {
  new Application(
    {},
    {
      skin: whiteSkin,
      contents: [
        new Content(
          {},
          {
            skin: redSkin,
            x: 50,
            y: 200,
            width: 10,
            height: 10
          }
        )
      ]
    }
  )
}
