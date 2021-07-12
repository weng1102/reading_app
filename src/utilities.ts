import DictionaryType from "./dictionary";
import { PronunciationDictionary, RecognitionDictionary } from "./dictionary";
"use strict";
export abstract class BaseClass {
  protected _logger: Logger;
  protected _parent: any;
  constructor(parent?: any | undefined) {
    this._logger = new Logger(this);
    this._parent = parent;
  }
  get logger(): Logger {
    return this._logger;
  }
  set logger(obj: Logger) {
    this._logger = obj;
  }
}
export class UserContext {
  /* look at the altPro and altRec that are for personalized entries
     should be readable from an external file that will not require recompile
     to recognize (unlike the Dictionary objects)

      this._altRecognitionMap = new Map();
      mapEntries = JSON.parse(FileAltRecog);
      for (let key of Object.keys(mapEntries)) {
        this._altRecognitionMap.set(key, mapEntries[key]);
      }
      this._altPronunciationMap = new Map();
      mapEntries = JSON.parse(FileAltPronun);
      for (let key of Object.keys(mapEntries)) {
        this._altPronunciationMap.set(key, mapEntries[key]);
      };
    }
    get altPronunciationMap() {
      return this._altPronunciationMap;
    }
    get altRecognitionMap() {
      return this._altRecognitionMap;
    }
    get name() {
      return this._name;
    }
    set name(name) {
    this._name = name;
    }
  }*/
  readonly username: string;
  // need authentication infoblock at some point
  constructor(name: string) {
    //    this._parent = parent;
    this.username = name;
    ////    this._pages = new Array();
  }
  get pronunciationDictionary(): DictionaryType {
    // should actually return the combined user and general dictionary
    return PronunciationDictionary;
  }
  get recognitionDictionary(): DictionaryType {
    // should actually return the combined user and general dictionary
    return PronunciationDictionary;
  }
}
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
export const RecognitionMap = new Map([
  ["Ronlyn", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1})$"],
  ["Ronlyn's", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1}'s)$"],
  ["Goo", "^(g[ou])"],
  ["Wen", "^(wh{0,1}en)$"],
  ["Wen's", "^(wh{0,1}en's)$"]
]);

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
export class Logger {
  // logging from within supported objects
  protected _parent: any = undefined;
  protected _terseFormat: boolean = false; // do not show only severity with message
  protected _adornMode: boolean = false; // do not show adorning messages
  protected _verboseMode: boolean = false; // do not show info and adorn messages
  protected _diagnosticMode: boolean = false; // do not show debug messages
  protected _errorObject!: Error;
  protected _showSeverity: boolean = true;
  protected _showFunctionName: boolean = true;
  protected _showTimestamp: boolean = false;
  protected _showModuleLocation: boolean = false;
  protected _errorCount: number = 0;
  protected _fatalCount: number = 0;
  protected _warningCount: number = 0;
  constructor(parent: any | null | undefined) {
    if (parent !== undefined && parent !== null) this._parent = parent; // required to find proper stack frame
  }
  get adornMode() {
    return this._adornMode;
  }
  set adornMode(onOff) {
    console.log(
      this.logEntry(
        "ADORN",
        "adorn mode is " + (onOff ? "ON" : "OFF"),
        false,
        false,
        false,
        false
      )
    );
    this._adornMode = onOff;
  }
  get diagnosticMode(): boolean {
    return this._diagnosticMode;
  }
  set diagnosticMode(onOff) {
    //
    if (onOff !== this._diagnosticMode) {
      console.log(
        this.logEntry(
          "DIAG",
          "diagnostic mode is " + (onOff ? "ON" : "OFF"),
          this._showSeverity,
          this._showFunctionName,
          this._showTimestamp,
          this._showModuleLocation
        )
      );
    }
    this._diagnosticMode = onOff;
  }
  get verboseMode() {
    return this._verboseMode;
  }
  set verboseMode(onOff: boolean) {
    //  // controls display of info and adorn messages
    if (onOff !== this._verboseMode) {
      console.log(
        this.logEntry(
          "INFO",
          "verbose mode is " + (onOff ? "ON" : "OFF"),
          this._showSeverity,
          this._showFunctionName,
          this._showTimestamp,
          this._showModuleLocation
        )
      );
    }
    this._verboseMode = onOff;
  }
  assert(message: string) {
    console.log(message);
  }
  diagnostic(message: string) {
    if (this._diagnosticMode) {
      console.log(
        this.logEntry(
          "DIAG",
          message,
          this._showSeverity,
          this._showFunctionName,
          this._showTimestamp,
          this._showModuleLocation
        )
      );
    }
  }
  set showTimestamp(onOff: boolean) {
    this._showTimestamp = onOff;
  }
  set showFunctionName(onOff: boolean) {
    this._showFunctionName = onOff;
  }
  adorn(
    message: string,
    showSeverity: boolean,
    showFunctionName: boolean,
    showTimestamp: boolean,
    showModuleName: boolean
  ) {
    if (this._verboseMode && this._adornMode) {
      console.log(
        this.logEntry(
          "ADORN",
          message,
          showSeverity === undefined ? this._showSeverity : showSeverity,
          showFunctionName === undefined
            ? this._showFunctionName
            : showFunctionName,
          showTimestamp === undefined ? this._showTimestamp : showTimestamp,
          showModuleName === undefined
            ? this._showModuleLocation
            : showModuleName
        )
      );
    }
  }
  errors() {
    return this._errorCount;
  }
  info(
    message: string,
    showSeverity: boolean,
    showFunctionName: boolean,
    showTimestamp: boolean,
    showModuleName: boolean
  ) {
    console.log(
      this.logEntry(
        "INFO",
        message,
        showSeverity === undefined ? this._showSeverity : showSeverity,
        showFunctionName === undefined
          ? this._showFunctionName
          : showFunctionName,
        showTimestamp === undefined ? this._showTimestamp : showTimestamp,
        showModuleName === undefined ? this._showModuleLocation : showModuleName
      )
    );
  }
  error(message: string) {
    this._errorCount++;
    // Operational or programmatic try to fix
    console.error(this.logEntry("ERROR", message, true, true, true, true));
    // should throw AppError here
  }
  fatal(message: string) {
    this._fatalCount++;
    //unrecoverable error
    console.log(message);
    // should throw AppError here
  }
  resetCount() {
    this._errorCount = 0;
    this._fatalCount = 0;
    this._warningCount = 0;
  }
  trace(message: string) {
    //
    console.log(message);
  }
  warning(message: string) {
    this._warningCount++;
    console.log(
      this.logEntry(
        "WARNING",
        message,
        this._showSeverity,
        this._showFunctionName,
        this._showTimestamp,
        this._showModuleLocation
      )
    );
  }
  warnings() {
    return this._warningCount;
  }
  getMethodName() {
    // search back through call stack for certain patterns.
    // A convenience and NOT robust
    let frame: string;
    let methodName: string = "<unknown method>";
    let objectNameLocator: string = "";
    let stackFrames: string[] = new Error()?.stack?.split("\n") as string[]; // optional chaining
    if (this._parent === undefined) {
      objectNameLocator = " at Object.<anonymous>";
    } else {
      objectNameLocator = " at " + this._parent.constructor.name + ".";
    }
    frame =
      stackFrames[
        stackFrames.findIndex(element => element.includes(objectNameLocator))
      ];
    // console.log(
    //   `objectNameLocator=${objectNameLocator} for stackFrame=${stackFrames.split("\n")}`
    // );
    if (frame !== undefined && frame.length > 0) {
      methodName = frame
        .substring(frame.indexOf(objectNameLocator) + 4)
        .split(" ")[0];
    } else {
      methodName = "unknown";
    }
    return methodName;
  }
  getModuleLocation() {
    let frame: string;
    let frameIdx: number;
    let stackFrames: string[] = new Error()?.stack?.split("\n") as string[]; // optional chaining
    let moduleLocation: string = "<unknown module location>";
    let modulePath: string;
    let objectNameLocator: string = " at Object.";

    if (this._parent === undefined) {
      objectNameLocator = " at Object.";
    } else {
      objectNameLocator = " at " + this._parent.constructor.name + ".";
    }
    frameIdx = stackFrames.findIndex(element =>
      element.includes(objectNameLocator)
    );
    modulePath = stackFrames[frameIdx]
      .split(" ")
      .slice(-1)[0]
      .slice(0, -1)
      .split(":")[1];
    frame =
      stackFrames[
        stackFrames.findIndex(element => element.includes(modulePath))
      ];
    moduleLocation = frame
      .split("\\")
      .slice(-1)[0]
      .slice(0, -1)
      .split(":")
      .slice(0, -1)
      .join(":");
    return moduleLocation;
  }
  logEntry(
    severityTag: string,
    message: string,
    showSeverity: boolean,
    showFunctionName: boolean,
    showTimestamp: boolean,
    showModuleLocation: boolean
  ) {
    let timestamp: string = new MyDate().yyyymmddhhmmss();
    return (
      (showSeverity ? severityTag + ":" : "") +
      (showFunctionName ? " " + this.getMethodName() : "") +
      (showTimestamp ? " (at " + timestamp + ")" : "") +
      (showModuleLocation ? " in module " + this.getModuleLocation() : "") +
      (showFunctionName || showTimestamp || showModuleLocation ? ": " : "") +
      message
    );
  }
}
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
