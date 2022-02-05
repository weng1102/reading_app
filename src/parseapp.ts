/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parseapp.ts
 *
 * Create app object from serialized input

 * Version history:
 *
 **/
import { BaseClass } from "./baseclasses";
export class AppNode extends BaseClass {
  id: number = 0;
  title: string = "";
  owner: string = "";
  constructor(parent?: any) {
    super(parent);
  }
}
