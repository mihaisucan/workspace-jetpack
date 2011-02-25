/* vim:set ts=2 sw=2 sts=2 et:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Workspace.
 *
 * The Initial Developer of the Original Code is
 * Mozilla Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Mihai Sucan <mihai.sucan@gmail.com> (Original Author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK *****/

const $self = require("self");
const $widget = require("widget");
const $panel = require("panel");
const $tabs = require("tabs");
const $timer = require("timer");

let panel = {
  _panel: null,
  isOpen: false,

  create: function panel_create() {
    console.log("panel_create");

    if (!this._panel) {
      this._panel = $panel.Panel({
        contentURL: $self.data.url("panel.html"),
        contentScriptFile: $self.data.url("panel.js"),
        //onMessage: this.onMessage,
        onShow: this._onShow.bind(this),
        onHide: this._onHide.bind(this),
      });
    }

    return this._panel;
  },

  show: function panel_show(anchor) {
    console.log("panel_show");
    if (!this._panel) {
      this.create();
    }

    this._panel.show(anchor);
  },

  _onShow: function panel__onShow() {
    console.log("panel__onShow");
    this.isOpen = true;

    if (this._destroyTimeout) {
      $timer.clearTimeout(this._destroyTimeout);
      this._destroyTimeout = null;
    }
  },

  hide: function panel_hide() {
    console.log("panel_hide");
    this._panel.hide();
  },

  _onHide: function panel__onHide() {
    console.log("panel__onHide");
    this.isOpen = false;

    if (this._destroyTimeout) {
      $timer.clearTimeout(this._destroyTimeout);
    }

    let self = this;

    this._destroyTimeout =
      $timer.setTimeout(function() {
        console.log("_destroyTimeout");
        if (self._destroyTimeout) {
          $timer.clearTimeout(self._destroyTimeout);
          self._destroyTimeout = null;
          if (!self.isOpen) {
            self.destroy();
          }
        }
      }, 10000);
  },

  destroy: function panel_destroy() {
    console.log("panel_destroy");

    if (this._destroyTimeout) {
      $timer.clearTimeout(this._destroyTimeout);
      this._destroyTimeout = null;
    }

    if (this._panel) {
      this._panel.destroy();
      this._panel = null;
    }
  },

  toggle: function panel_toggle() {
    console.log("panel_toggle");

    if (!this.isOpen) {
      this.show();
    } else {
      this.hide();
    }
  },
};

let widget = $widget.Widget({
  label: "Workspace",
  contentURL: $self.data.url("workspace.ico"),
  onClick: panel.toggle.bind(panel),
});

console.log("The add-on is running.");
