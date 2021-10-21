/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_settings.tsx
 *
 * Defines React front end functional components popup settings modal
 * page
 * - recitation mode: word only, up to word, entire sentence
 * - Speech synthesis settings: voice, rate, pitch, volume
 * - dictionaries: acronyms, pronunciation, recognition
 * - listening: timeouts, notifications (voice vs. sound effect)
 * - content: themes, fonts, css files, <pre> etc.
 * - performance: push interval
 *
 * use configContext object accessed via useContext similar to PageContext
 * to manage content and serialization
 *
 * treat this modal page as a form with ok and cancel buttons.
 *
 * Version history:
 *
 **/
import React from "react";
export const Settings = () => {
  return <div>under construction</div>;
};
const RecitationMode = () => {
  // handlechange
  return (
    <select className="ddlb-recitationmode">
      <option value="recitationmode">Recitation mode...</option>
      <option value="wordonly">Word Only</option>
      <option value="uptoword">Up to word</option>
      <option value="entiresentence">Entire sentence</option>
    </select>
  );
};
