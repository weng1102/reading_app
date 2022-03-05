import { MyDate } from "./utilities";
export class Logger {
  // logging from within supported objects
  protected _appName: string = "";
  protected _parent: any = undefined;
  protected _terseFormat: boolean = false; // do not show only severity with message
  protected _adornMode: boolean = false; // do not show adorning messages
  protected _verboseMode: boolean = false; // do not show info and adorn messages
  protected _diagnosticMode: boolean = false; // do not show diagnostic messages
  protected _errorObject!: Error;
  protected _showSeverity: boolean = true;
  protected _showFunctionName: boolean = true;
  protected _showTimestamp: boolean = false;
  protected _showModuleLocation: boolean = false;
  protected _errorCount: number = 0;
  protected _fatalCount: number = 0;
  protected _warningCount: number = 0;
  constructor(parent: any | null | undefined) {
    if (parent !== undefined && parent !== null) {
      this._parent = parent; // required to find proper stack frame
    }
  }
  get appName() {
    return this._appName;
  }
  set appName(name: string) {
    this._appName = name;
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
    showSeverity: boolean = this._showSeverity,
    showFunctionName: boolean = this._showFunctionName,
    showTimestamp: boolean = this._showTimestamp,
    showModuleName: boolean = this._showModuleLocation
  ) {
    console.log(
      this.logEntry(
        "INFO",
        message,
        showSeverity,
        showFunctionName,
        showTimestamp,
        showModuleName
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
      objectNameLocator = "    at " + this.constructor.name + "."; // the caller of logger
    }
    //    console.log(`stackFrames=${stackFrames}`);
    let reverseStackFrames: string[] = stackFrames.slice().reverse();

    let callerFrameIdx =
      reverseStackFrames.findIndex(
        element =>
          element.substring(0, objectNameLocator.length) === objectNameLocator
      ) - 1;
    //  console.log(`callerFrameIdx=${callerFrameIdx}`);
    frame = reverseStackFrames[callerFrameIdx];
    //  console.log(`frame=${frame}`);
    // console.log(
    //   `objectNameLocator=${objectNameLocator} for stackFrame=${stackFrames.split("\n")}`
    // );
    if (frame !== undefined && frame.length > 0) {
      // console.log(frame.substring(4).split(" "));
      methodName = frame.substring(4).split(" ")[1];
    } else {
      //      methodName = "unknown";
    }
    //    console.log(`methodName=${methodName}`);
    return methodName;
  }
  // getMethodNamesave() {
  //   // search back through call stack for certain patterns.
  //   // A convenience and NOT robust
  //   let frame: string;
  //   let methodName: string = "<unknown method>";
  //   let objectNameLocator: string = "";
  //   let stackFrames: string[] = new Error()?.stack?.split("\n") as string[]; // optional chaining
  //   if (this._parent === undefined) {
  //     objectNameLocator = " at Object.<anonymous>";
  //   } else {
  //     objectNameLocator = " at " + this._parent.constructor.name + "."; // the caller of logger
  //   }
  //   frame =
  //     stackFrames[
  //       stackFrames.findIndex(element => element.includes(objectNameLocator))
  //     ];
  //   // console.log(
  //   //   `objectNameLocator=${objectNameLocator} for stackFrame=${stackFrames.split("\n")}`
  //   // );
  //   if (frame !== undefined && frame.length > 0) {
  //     methodName = frame
  //       .substring(frame.indexOf(objectNameLocator) + 4)
  //       .split(" ")[0];
  //   } else {
  //     //      methodName = "unknown";
  //   }
  //   console.log(`methodName=${methodName}`);
  //   return methodName;
  // }
  getModuleLocation() {
    let frame: string;
    let frameIdx: number;
    let stackFrames: string[] = new Error()?.stack?.split("\n") as string[]; // optional chaining
    let moduleLocation: string = "<unknown>";
    let modulePath: string = "<unknown>";
    let objectNameLocator: string = " at Object.";

    if (this._parent === undefined) {
      objectNameLocator = " at Object.";
    } else {
      objectNameLocator = " at " + this._parent.constructor.name + ".";
    }
    frameIdx = stackFrames.findIndex(element =>
      element.includes(objectNameLocator)
    );
    if (
      frameIdx !== undefined &&
      frameIdx >= 0 &&
      frameIdx < stackFrames.length
    ) {
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
    }
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
