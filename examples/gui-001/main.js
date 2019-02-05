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

/* global Skin, Application, Container, Content */

export default new Application(null, {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  skin: new Skin({ fill: 'blue' })
})

/*
const WHITE = 'white'
const whiteSkin = new Skin({ fill: WHITE })
const RED = 'red'
const redSkin = new Skin({ fill: RED })

export default function() {
  return new Application(
    {},
    {
      skin: whiteSkin,
      displayListLength: 2048,
      width: 320,
      height: 240,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      contents: [
        new Container(null, {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          // skin: whiteSkin,
          contents: [
            new Content(null, {
              width: 100,
              height: 100,
              skin: redSkin
            })
          ]
        })
      ]
    }
  )
}
*/
