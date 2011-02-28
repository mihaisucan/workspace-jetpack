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

let {Cu} = require("chrome");

Cu.import("resource://gre/modules/Services.jsm");

let windows = {
  getActiveContentWindow: function sdk_getActiveContentWindow() {
    let chromeWindow = Services.wm.getMostRecentWindow("navigator:browser");
    return chromeWindow.gBrowser.selectedBrowser.contentWindow;
  },

  getActiveChromeWindow: function sdk_getActiveChromeWindow() {
    return Services.wm.getMostRecentWindow("navigator:browser");
  },
};

// TODO: Use Cortex/Traits to make sure private properties are really private.
function Sandbox(aContext, aOptions) {
  this._sandbox = Cu.Sandbox(aContext, aOptions);
  this.jsVersion = "1.8";
  this.startLine = 1;
  this.filename = "";
}

Sandbox.prototype = {
  eval: function sdk_eval(aString, aCallback) {
    try {
      let result = Cu.evalInSandbox(aString, this._sandbox, this.jsVersion,
                                    this.filename, this.startLine);
      if (aCallback) {
        aCallback(null, result);
      }
    } catch (ex) {
        if (aCallback) {
          aCallback(ex);
        }
    }
  },
};

exports.windows = windows;
exports.Sandbox = Sandbox;
