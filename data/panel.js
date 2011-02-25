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

let Workspace = {
  textbox: null,

  init: function WS_init() {
    this.textbox = document.getElementById("source-input");
    console.log("init textbox " + this.textbox);

    let btnExecute = document.getElementById("execute");
    let btnInspect = document.getElementById("inspect");
    let btnPrint = document.getElementById("print");

    btnExecute.addEventListener("click", this.execute.bind(this), false);
    btnInspect.addEventListener("click", this.inspect.bind(this), false);
    btnPrint.addEventListener("click", this.print.bind(this), false);

    let contentContext = document.getElementById("content-context");
    let chromeContext = document.getElementById("chrome-context");

    contentContext.addEventListener("change",
      this.changeContext.bind(this), false);
    chromeContext.addEventListener("change",
      this.changeContext.bind(this), false);
  },

  changeContext: function WS_changeContext(event) {
    console.log("changeContext " + value + " " + event.target.value);
  },

  execute: function WS_execute() {
    console.log("execute " + this.textbox.value);
  },

  inspect: function WS_inspect() {
    console.log("inspect " + this.textbox.value);
  },

  print: function WS_print() {
    console.log("print " + this.textbox.value);
  },
};

window.addEventListener("DOMContentLoaded", Workspace.init.bind(Workspace), false);
