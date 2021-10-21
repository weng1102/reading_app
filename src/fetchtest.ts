import { IPageContent } from "./pageContentType";
import fetch from "node-fetch";

function getJson(url: string) {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.error(error);
    });
}
let url: string = "https://weng1102.github.io/reading_app/dist/heading.json";
var content = getJson(url);
console.log(content);
