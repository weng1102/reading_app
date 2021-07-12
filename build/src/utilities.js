'use strict';
function WildcardToRegex(pattern) {
    // some problems with multiple *
    return "^" + pattern.replace("*", ".*").replace("?", ".") + "$";
}
;
class AppError extends Error {
    constructor(args) {
        super(args);
    }
    set name(name) {
        this.name = "AppError";
    }
    ;
}
const RecognitionMap = new Map([
    ["Ronlyn", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1})$"],
    ["Ronlyn's", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1}'s)$"],
    ["Goo", "^(g[ou])"],
    ["Wen", "^(wh{0,1}en)$"],
    ["Wen's", "^(wh{0,1}en's)$"]
]);
const MonthFromAbbreviationMap = new Map([
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
const OrdinalNumberMap = new Map([
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
const AcronymMap = new Map([
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
    ["UCSD", "university,california,san,diego"],
]);
class Logger {
    constructor(parent) {
        this._parent = parent; // required to find proper stack frame
        this._terseFormat = false; // do not show only severity with message
        this._adornMode = false; // do not show adorning messages
        this._verboseMode = false; // do not show info and adorn messages
        this._diagnosticMode = false; // do not show debug messages
        this._errorObject = null;
        this._showSeverity = true;
        this._showFunctionName = true;
        this._showTimestamp = false;
        this._showModuleLocation = false;
    }
    get adornMode() {
        return this._adornMode;
    }
    set adornMode(onOff) {
        console.log(this.logEntry("ADORN", "adorn mode is " + (onOff ? "ON" : "OFF", false, false, false, false)));
        this._adornMode = onOff;
    }
    get diagnosticMode() {
        return this._diagnosticMode;
    }
    set diagnosticMode(onOff) {
        if (onOff !== this._diagnosticMode) {
            console.log(this.logEntry("DIAG", "diagnostic mode is " + (onOff ? "ON" : "OFF"), this._showSeverity, this._showFunctionName, this._showTimestamp, this._showModuleLocation));
        }
        this._diagnosticMode = onOff;
    }
    get verboseMode() {
        return this._verboseMode;
    }
    set verboseMode(onOff) {
        if (onOff !== this._verboseMode) {
            console.log(this.logEntry("INFO", "verbose mode is " + (onOff ? "ON" : "OFF"), this._showSeverity, this._showFunctionName, this._showTimestamp, this._showModuleLocation));
        }
        this._verboseMode = onOff;
    }
    assert(message) {
        console.log(message);
    }
    diagnostic(message) {
        if (this._diagnosticMode) {
            console.log(this.logEntry("DIAG", message, this._showSeverity, this._showFunctionName, this._showTimestamp, this._showModuleLocation));
        }
    }
    set showTimestamp(onOff) {
        this._showTimestamp = onOff;
    }
    set showFunctionName(onOff) {
        this._showFunctionName = onOff;
    }
    adorn(message, showSeverity, showFunctionName, showTimestamp, showModuleName) {
        if (this._verboseMode && this._adornMode) {
            console.log(this.logEntry("ADORN", message, (showSeverity === undefined ? this._showSeverity : showSeverity), (showFunctionName === undefined ? this._showFunctionName : showFunctionName), (showTimestamp === undefined ? this._showTimestamp : showTimestamp), (showModuleName === undefined ? this._showModuleLocation : showModuleName)));
        }
    }
    info(message, showSeverity, showFunctionName, showTimestamp, showModuleName) {
        console.log(this.logEntry("INFO", message, (showSeverity === undefined ? this._showSeverity : showSeverity), (showFunctionName === undefined ? this._showFunctionName : showFunctionName), (showTimestamp === undefined ? this._showTimestamp : showTimestamp), (showModuleName === undefined ? this._showModuleLocation : showModuleName)));
    }
    error(message) {
        console.error(this.logEntry("ERROR", message, true, true, true, true));
        // should throw AppError here
    }
    fatal(message) {
        console.log(message);
        // should throw AppError here
    }
    trace(message) {
        console.log(message);
    }
    warning(message) {
        let timestamp = new MyDate().yyyymmddhhmmss();
        console.log(this.logEntry("WARNING", message, this._showSeverity, this._showFunctionName, this._showTimestamp, this._showModuleLocation));
    }
    getMethodName() {
        // search back through call stack for certain patterns.
        // A convenience and NOT robust
        let frame;
        let methodName = "<unknown method>";
        let objectNameLocator = "";
        let stackFrames = new Error().stack.split("\n");
        if (this._parent === undefined) {
            objectNameLocator = " at Object.<anonymous>";
        }
        else {
            objectNameLocator = " at " + this._parent.constructor.name + ".";
        }
        frame = stackFrames[stackFrames.findIndex(element => element.includes(objectNameLocator))];
        methodName = frame.substring(frame.indexOf(objectNameLocator) + 4).split(" ")[0];
        return methodName;
    }
    getModuleLocation() {
        let frame;
        let frameIdx;
        let stackFrames;
        let moduleLocation = "<unknown module location>";
        let modulePath;
        let objectNameLocator = " at Object.";
        if (this._parent === undefined) {
            objectNameLocator = " at Object.";
        }
        else {
            objectNameLocator = " at " + this._parent.constructor.name + ".";
        }
        stackFrames = new Error().stack.split("\n");
        frameIdx = stackFrames.findIndex(element => element.includes(objectNameLocator));
        modulePath = stackFrames[frameIdx].split(" ").slice(-1)[0].slice(0, -1).split(":")[1];
        frame = stackFrames[stackFrames.findIndex(element => element.includes(modulePath))];
        moduleLocation = frame.split("\\").slice(-1)[0].slice(0, -1).split(":").slice(0, -1).join(":");
        return moduleLocation;
    }
    logEntry(severityTag, message, showSeverity, showFunctionName, showTimestamp, showModuleLocation) {
        let timestamp = new MyDate().yyyymmddhhmmss();
        return (showSeverity ? severityTag + ":" : "")
            + (showFunctionName ? " " + this.getMethodName() : "")
            + (showTimestamp ? " (at " + timestamp + ")" : "")
            + (showModuleLocation ? " in module " + this.getModuleLocation() : "")
            + ((showFunctionName || showTimestamp || showModuleLocation) ? ": " : "")
            + message;
    }
}
class MyDate extends Date {
    constructor() {
        super();
    }
    yyyymmdd() {
        let yyyy = this.getFullYear();
        let mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
        let dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
        //    return "".concat(yyyy).concat("/").concat(mm).concat("/").concat(dd);
        return yyyy + "/" + mm + "/" + dd;
    }
    yyyymmddhhmmss() {
        var yyyymmdd = this.yyyymmdd();
        var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
        var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
        var sec = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
        //    return "".concat(yyyymmdd).concat(" ").concat(hh).concat(":").concat(min);
        return yyyymmdd + " " + hh + ":" + min + ":" + sec;
    }
}
module.exports = { AcronymMap, AppError, Logger, MyDate, MonthFromAbbreviationMap, OrdinalNumberMap, RecognitionMap, WildcardToRegex };
