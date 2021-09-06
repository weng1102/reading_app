export default interface PageContentType {
  id: number,
  name: string,
  description: string,
  owner: string,
  pageFormatType: PageFormatEnumType,
  created: Date | undefined,
  modified: Date | undefined,
  transformed: Date | undefined,
  firstWordIdx: number,
  lastWordIdx: number,
  sections: SectionType[]
}
export interface SectionType {
  id: number,
  name: string,
  description: string,
  firstWordIdx: number,
  sentences: SentenceContentType[]
  meta: SectionVariantType
}
type SectionVariantType =
  | SectionHeadingVariantType
  | SectionUnorderedListVariantType
  | SectionOrderedListVariantType
  | SectionParagraphType
  | SectionFillinType
  | SectionFillinListType
  | SectionPhotoEntryType

interface SectionHeadingVariantType {
  type: SectionVariantEnumType.heading, // can have zero (when immediately followed by subsecion) or more sentences
  title: string, // overrides name and description above
  recitable: true | false,
  audible: true | false,
  level: number
}
interface SectionUnorderedListVariantType {
  type: SectionVariantEnumType.unordered_list,
  marker:  UnorderedListMarkerEnumType// overrides css but not user profile
}
interface SectionOrderedListVariantType {
  type: SectionVariantEnumType.ordered_list,
  startNumber: number,
  listType: OrderedListTypeEnumType //  overrides css but not user profile
}
interface SectionParagraphType {
  type: SectionVariantEnumType.paragraph,
  style: string // overrides css but not user profile
}
interface SectionFillinType {
  type: SectionVariantEnumType.fillin
}
interface SectionFillinListType {
  type: SectionVariantEnumType.fillin_list
}
interface SectionPhotoEntryType {
  type: SectionVariantEnumType.photo_entry,
  image: string // path to img/filename
}
interface SentenceContentType {
  id: number,
  content: string,
  firstWordIdx: number,
  terminals: TerminalInfoType[]
}
interface TerminalInfoType {
  content: string,
  meta: TerminalMetaType
}
type TerminalMetaType =
  AudibleWordTerminalMetaType
  | NonaudibleWordTerminalMetaType
  | ReferenceTerminalMetaType
  | PunctuationTerminalMetaType
  | ReferenceTerminalMetaType
  | WhitespaceTerminalMetaType

interface WhitespaceTerminalMetaType {
  type: TerminalMetaEnumType.whitespace,
  whitespaceType: string
}
interface PunctuationTerminalMetaType {
  type: TerminalMetaEnumType.punctuation,
  punctuationType: string
}
interface ReferenceTerminalMetaType {
  type: TerminalMetaEnumType.reference,
  reference: string
}
interface NonaudibleWordTerminalMetaType {
  type: TerminalMetaEnumType.nonaudibleword,
  content: string
}
interface AudibleWordTerminalMetaType {
  type: TerminalMetaEnumType.audibleword,
  id: number,
  wordIdx: number,
  nextWordIdx: number[],
  prevWordIdx: number[],
  altpronunciation: string,
  altrecognition: string;
  active: boolean,
  visited: boolean,
}
export enum PageFormatEnumType {
  default = 0
}
export enum SectionVariantEnumType {
  heading,
  subsection,
  unordered_list,
  ordered_list,
  paragraph,
  fillin,
  fillin_list,
  photo_entry
}
export enum TerminalMetaEnumType {
  audibleword,
  nonaudibleword, // cannot be heard or recited
  punctuation,    // only interesting for end of sentence/page/chapter feedback
  reference,      // can be heard but cannot be recited
  whitespace      // delimiter or syntactic sugar
}
export enum OrderedListTypeEnumType { // standard HTML
  numerical,
  alphabetical_uppercase,
  alphabetical_lowercase,
  roman_uppercase,
  roman_lowercase
}
export enum UnorderedListMarkerEnumType { // standard HTML
  disc,
  circle,
  square,
  none,
  other
}
