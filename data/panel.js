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

const WORKSPACE_CONTEXT_CONTENT = 1;
const WORKSPACE_CONTEXT_CHROME = 2;

let Workspace = {
  _callbacks: {},

  _callId: 0,

  executionContext: WORKSPACE_CONTEXT_CONTENT,

  textbox: null,

  init: function WS_init() {
    this.textbox = document.getElementById("source-input");
    console.log("WS_init");

    let btnExecute = document.getElementById("execute");
    let btnInspect = document.getElementById("inspect");
    let btnPrint = document.getElementById("print");

    btnExecute.addEventListener("click", this.execute.bind(this), false);
    btnInspect.addEventListener("click", this.inspect.bind(this), false);
    btnPrint.addEventListener("click", this.print.bind(this), false);

    let contentContext = document.getElementById("content-context");
    let chromeContext = document.getElementById("chrome-context");

    contentContext.checked = true;

    contentContext.addEventListener("change",
      this.changeContext.bind(this), false);

    chromeContext.addEventListener("change",
      this.changeContext.bind(this), false);

    on("message", this._onMessage.bind(this));
  },

  changeContext: function WS_changeContext(event) {
    this.executionContext = parseInt(event.target.value);
    console.log("changeContext " + this.executionContext);
  },

  execute: function WS_execute() {
    let selection = this.getSelectedText() || this.getTextboxValue();
    this.evalForContext(selection);
    this.deselect();
  },

  inspect: function WS_inspect() {
    console.log("inspect " + this.textbox.value);
  },

  print: function WS_print() {
    let selection = this.getSelectedText() || this.getTextboxValue();
    console.log("print " + selection);

    let start = this.textbox.selectionStart;
    let end = this.textbox.selectionEnd;
    if (start == end) {
      end = this.textbox.value.length;
    }
    this.deselect();

    this.evalForContext(selection, this._printCallback.bind(this, start, end));
  },

  _printCallback: function WS__printCallback(aStart, aEnd, aError, aResult) {
    let result = (aError ?
                  aError.errorMessage || aError.message || aError :
                  aResult) + "";
    if (!result) {
      return;
    }

    console.log("_printCallback " + result);

    let piece1 = this.textbox.value.slice(0, aEnd);
    let piece2 = this.textbox.value.slice(aEnd + 1, this.textbox.value.length);
    this.textbox.value = piece1 + "\n " + result + "\n" + piece2;

    this.textbox.selectionStart = aEnd + 2;
    this.textbox.selectionEnd = aEnd + 2 + result.length;
  },

  getTextboxValue: function WS_getTextboxValue() {
    return this.textbox.value;
  },

  getSelectedText: function WS_getSelectedText() {
    let text = this.textbox.value;
    let selectionStart = this.textbox.selectionStart;
    let selectionEnd = this.textbox.selectionEnd;
    if (selectionStart != selectionEnd)
      return text.substring(selectionStart, selectionEnd);

    return "";
  },

  deselect: function WS_deselect() {
    this.textbox.selectionEnd = this.textbox.selectionStart;
  },

  evalForContext: function WS_evalForContext(aString, aCallback) {
    let message = {
      action: "evalForContext",
      context: this.executionContext,
      string: aString,
    };

    if (aCallback) {
      let id = ++this._callId;
      this._callbacks[id] = aCallback;

      message.meta = {callId: id};
      message.sendResult = true;
    }

    console.log("panel evalForContext " + this.executionContext + " " + aString);

    postMessage(message);
  },

  _onMessage: function WS__onMessage(aMessage) {
    if (!aMessage || !aMessage.action) {
      throw new Error("Workspace panel: received unknown message!");
    }

    console.log("panel _onMessage " + aMessage.action);

    switch (aMessage.action) {
      case "evalResultForContext":
        this._evalResultForContext(aMessage);
        break;

      default:
        throw new Error("Workspace panel: received unknown message with " +
                        "action " + aMessage.action);
    }
  },

  _evalResultForContext: function WS__evalResultForContext(aResult) {
    if (!("result" in aResult) && !("error" in aResult) ||
        !aResult.meta || !aResult.meta.callId) {
      throw new Error("Workspace panel: received invalid evaluation result! " + aResult.result + " " + aResult.error);
    }

    let id = aResult.meta.callId;
    console.log("panel _evalResultForContext " + id);

    let callback = this._callbacks[id];
    if (!callback) {
      throw new Error("Workspace panel: received stale evaluation result. " +
                      "Callback ID not found: " + id);
    }

    delete this._callbacks[id];
    callback(aResult.error, aResult.result);
  },
};

window.addEventListener("DOMContentLoaded", Workspace.init.bind(Workspace), false);
