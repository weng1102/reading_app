/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: utilities.ts
 *
 * Create miscellaneous objects that support all other objects.
 *
 * Version history:
 *
 **/
import * as fs from "fs";
import DictionaryType from "./dictionary";
import { PronunciationDictionary, RecognitionDictionary } from "./dictionary";
"use strict";
// export abstract class BaseClass {
//   protected _logger: Logger;
//   protected _parent: any;
//   constructor(parent?: any | undefined) {
//     this._logger = new Logger(this);
//     this._parent = parent;
//   }
//   get logger(): Logger {
//     return this._logger;
//   }
//   set logger(obj: Logger) {
//     this._logger = obj;
//   }
// }
//   get pronunciationDictionary(): DictionaryType {
//     // should actually return the combined user and general dictionary
//     return PronunciationDictionary;
//   }
//   get recognitionDictionary(): DictionaryType {
//     // should actually return the combined user and general dictionary
//     return PronunciationDictionary;
//   }
// }
export const IsError = (exception: any): exception is Error => {
  return (
    typeof exception == "object" &&
    exception !== null &&
    "name" in exception &&
    typeof exception.name === "string" &&
    "message" in exception &&
    typeof exception.message === "string"
  );
};
export const IsDefined = (attribute: string): boolean => {
  return attribute !== undefined && attribute.length > 0;
};
export const FileExists = (path: string): boolean => {
  try {
    return fs.existsSync(path);
  } catch (e) {
    return false;
  }
};
export const SetArgBoolean = (arg: string, defaultValue: boolean) => {
  const acceptedTrues = ["true", "t", "yes", "y"];
  let result: boolean = defaultValue;
  if (IsDefined(arg)) {
    result = acceptedTrues.includes(arg.toLowerCase()) ? true : false;
  }
  return result;
};
export const SetArgWholeNumber = (arg: string, defaultValue: number) => {
  let result: number = defaultValue;
  if (IsDefined(arg)) {
    result = /^\d+$/.test(arg) ? +arg : defaultValue;
  }
  return result;
};

function WildcardToRegex(pattern: string) {
  // some problems with multiple *
  return "^" + pattern.replace("*", ".*").replace("?", ".") + "$";
}
class AppError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "AppError";
  }
}
export const SymbolPronunciationMap = new Map([
  [".", "dot"],
  ["-", "dash"],
  ["@", "at"],
  ["_", "underscore"],
  ["$", "dollar"],
  ["!", "exclamation"],
  ["&", "ampersand"],
  ["/", "slash"],
  ["\\", "back slash"],
  ["+", "plus"],
  ["~", "tilde"],
  ["#", "hashtag"]
]);
// export const RecognitionMap = new Map([
//   ["Ronlyn", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1})$"],
//   ["Ronlyn's", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1}'s)$"],
//   ["Goo", "^(g[ou])"],
//   ["Wen", "^(wh{0,1}en)$"],
//   ["Eng", "^(egg|Aang|hang)$"],
//   ["Wen's", "^(wh{0,1}en's)$"],
//   ["Goo", "^(g[ou])"],
//   ["Wen", "^(wh{0,1}en)$"],
//   ["Wen's", "^(wh{0,1}en's)$"],
//   ["Aruna", "^([ai]runa)$"],
//   ["Berna", "^(b[eu]rn[ae]t{0,2})$"],
//   ["Berna's", "^(b[eu]rn[ae]t{0,2}s)$"],
//   ["Bett", "^(bet{1,2})$"],
//   ["Bett's", "^(bet{1,2}s)$"],
//   ["Gambhir", "^(gamb[ie]e{0,1}r)$"],
//   ["shao", "^(sh[ae]ll)$"],
//   ["mai", "^(my)"],
//   ["cheung", "^(ch[euo]ng)$"],
//   ["gaw", "^(ga{0,1}o{0,1}l{0,1}w{0,1})$"],
//   ["negin", "^(n[ei]ge{1,2}ne{0,1})$"],
//   ["Jaylynne", "^(ja[yi]l[ey]n{1,2}e{0,1})$"],
//   ["Lynda", "^(l[iy]nda)$"],
//   ["Melisse", "^(m[ei]lis{1,2}e{0,1})$"],
//   ["Meilan", "^(m[aei]y{0,1}land{0,1})$"],
//   ["Popo's", "^(popo'{0,1}s)$"],
//   ["Auntie", "^([ant{1,2}[iy])$"],
//   ["Ag", "^([ae]g{1,2})$"],
//   ["Seaton", "^(sea{0,1}ton)$"],
//   ["Ave", "^(avenue)$"],
//   ["St", "^(street)$"]
// ]);
export const MonthFromAbbreviationMap = new Map([
  ["jan", "january"],
  ["feb", "february"],
  ["mar", "march"],
  ["apr", "april"],
  ["may", "may"],
  ["jun", "june"],
  ["jul", "july"],
  ["aug", "august"],
  ["sep", "september"],
  ["oct", "october"],
  ["nov", "november"],
  ["dec", "december"]
]);
export const OrdinalNumberMap = new Map([
  // could be coded as switch on ones digit except the teens
  ["1", "1st"],
  ["2", "2nd"],
  ["3", "3rd"],
  ["4", "4th"],
  ["5", "5th"],
  ["6", "6th"],
  ["7", "7th"],
  ["8", "8th"],
  ["9", "9th"],
  ["10", "10th"],
  ["11", "11th"],
  ["12", "12th"],
  ["13", "13th"],
  ["14", "14th"],
  ["15", "15th"],
  ["16", "16th"],
  ["17", "17th"],
  ["18", "18th"],
  ["19", "19th"],
  ["20", "20th"],
  ["21", "21st"],
  ["22", "22nd"],
  ["23", "23rd"],
  ["24", "24th"],
  ["25", "25th"],
  ["26", "26th"],
  ["27", "27th"],
  ["28", "28th"],
  ["29", "29th"],
  ["30", "30th"],
  ["31", "31st"]
]);
export const CardinalNumberMap = new Map([
  ["0", "zero"],
  ["1", "one"],
  ["2", "two"],
  ["3", "three"],
  ["4", "four"],
  ["5", "five"],
  ["6", "six"],
  ["7", "seven"],
  ["8", "eight"],
  ["9", "nine"],
  ["01", "one"],
  ["02", "two"],
  ["03", "three"],
  ["04", "four"],
  ["05", "five"],
  ["06", "six"],
  ["07", "seven"],
  ["08", "eight"],
  ["09", "nine"],
  ["10", "ten"],
  ["11", "eleven"],
  ["12", "twelve"],
  ["13", "thirteen"],
  ["14", "fourteen"],
  ["15", "fifteen"],
  ["16", "sixteen"],
  ["17", "seventeen"],
  ["18", "eighteen"],
  ["19", "nineteen"],
  ["20", "twenty"],
  ["21", "twenty-one"],
  ["22", "twenty-two"],
  ["23", "twenty-three"],
  ["24", "twenty-four"],
  ["25", "twenty-five"],
  ["26", "twenty-six"],
  ["27", "twenty-seven"],
  ["28", "twenty-eight"],
  ["29", "twenty-nine"],
  ["30", "thirty"],
  ["31", "thirty-one"],
  ["32", "thirty-two"],
  ["33", "thirty-three"],
  ["34", "thirty-four"],
  ["35", "thirty-five"],
  ["36", "thirty-six"],
  ["37", "thirty-seven"],
  ["38", "thirty-eight"],
  ["39", "thirty-nine"],
  ["40", "forty"],
  ["41", "forty-one"],
  ["42", "forty-two"],
  ["43", "forty-three"],
  ["44", "forty-four"],
  ["45", "forty-five"],
  ["46", "forty-six"],
  ["47", "forty-seven"],
  ["48", "forty-eight"],
  ["49", "forty-nine"],
  ["50", "fifty"],
  ["51", "fifty-one"],
  ["52", "fifty-two"],
  ["53", "fifty-three"],
  ["54", "fifty-four"],
  ["55", "fifty-five"],
  ["56", "fifty-six"],
  ["57", "fifty-seven"],
  ["58", "fifty-eight"],
  ["59", "fifty-nine"],
  ["60", "sixty"],
  ["61", "sixty-one"],
  ["62", "sixty-two"],
  ["63", "sixty-three"],
  ["64", "sixty-four"],
  ["65", "sixty-five"],
  ["66", "sixty-six"],
  ["67", "sixty-seven"],
  ["68", "sixty-eight"],
  ["69", "sixty-nine"],
  ["70", "seventy"],
  ["71", "seventy-one"],
  ["72", "seventy-two"],
  ["73", "seventy-three"],
  ["74", "seventy-four"],
  ["75", "seventy-five"],
  ["76", "seventy-six"],
  ["77", "seventy-seven"],
  ["78", "seventy-eight"],
  ["79", "seventy-nine"],
  ["80", "eighty"],
  ["81", "eighty-one"],
  ["82", "eighty-two"],
  ["83", "eighty-three"],
  ["84", "eighty-four"],
  ["85", "eighty-five"],
  ["86", "eighty-six"],
  ["87", "eighty-seven"],
  ["88", "eighty-eight"],
  ["89", "eighty-nine"],
  ["90", "ninety"],
  ["91", "ninety-one"],
  ["92", "ninety-two"],
  ["93", "ninety-three"],
  ["94", "ninety-four"],
  ["95", "ninety-five"],
  ["96", "ninety-six"],
  ["97", "ninety-seven"],
  ["98", "ninety-eight"],
  ["99", "ninety-nine"]
]);
export const AcronymMap = new Map([
  ["SCVMC", "santa,clara,valley,medical,center"],
  ["CSUEB", "cal,state,university,east,bay"],
  ["UCB", "university,california,berkeley"],
  ["SJS", "san,jose,state"],
  ["SJSU", "san,jose,state,university"],
  ["ASAP", "as,soon,as,possible"],
  ["US", "united,states"],
  ["PSA", "pacific,stroke,association"],
  ["TBD", "to,be,determined"],
  ["UCSB", "university,california,santa,barbara"],
  ["UCD", "university,california,davis"],
  ["UCSD", "university,california,san,diego"]
]);
export class MyDate extends Date {
  constructor() {
    super();
  }
  yyyymmdd() {
    let yyyy = this.getFullYear();
    let mm =
      this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1; // getMonth() is zero-based
    let dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    //    return "".concat(yyyy).concat("/").concat(mm).concat("/").concat(dd);
    return yyyy + "/" + mm + "/" + dd;
  }
  yyyymmddhhmmss() {
    var yyyymmdd = this.yyyymmdd();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min =
      this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    var sec =
      this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    //    return "".concat(yyyymmdd).concat(" ").concat(hh).concat(":").concat(min);
    return yyyymmdd + " " + hh + ":" + min + ":" + sec;
  }
}
