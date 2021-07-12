const enum TokenType {
  zero = 0,
  one,
  two
}
interface IClass {}

abstract class Ca implements IClass {
  constructor() {}
  methoda(): number {
    return 0;
  }
}
class Cb extends Ca {
  constructor() {
    super();
  }
  methoda(): number {
    return 0;
  }
}
class Ca_1 extends Ca implements IClass {
  constructor() {
    super();
  }
}
class Cb_1 extends Cb implements IClass {
  constructor() {
    super();
  }
  methoda(): number {
    return 0;
  }
}
type ContentNodeClassType = typeof Cb | typeof Ca_1 | typeof Cb_1;
type ContentNodeDictionaryType = Record<TokenType, ContentNodeClassType>;
const ContentNodeDictionary: ContentNodeDictionaryType = {
  [TokenType.zero]: Ca_1,
  [TokenType.one]: Cb_1,
  [TokenType.two]: Cb_1
};
{
  let c = new ContentNodeDictionary[TokenType.zero]();
  c.methoda();
}
