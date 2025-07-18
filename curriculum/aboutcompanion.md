[[page: About My Companion, Ronlyn, Wen, 5/4/2023, Personal, About/]]
# About the Reading Companion
## Case for action (What is the motivation?)
[[image-entry: Background, left, 20%]]
![Primary user](rmg.png) 
The model lost much of her fluency to a deep brain hemorrhagic stroke that resulted in moderately severe aphasia. Although the stroke did not directly affect her Broca area, she presents with utterances of a few words and limited vocabulary that characterizes non-fluent (expressive) aphasia. Compounding this, she also has a working memory deficit.

Her primary goal is to recover as much conversational speech as possible. Fortunately, her loss of verbal skills did not include basic oral reading skills. To work toward regaining her voice in complete sentences, she can leverage her remaining oral reading skills to repeatedly practice as she builds her ability and confidence to speak again. Essential to this, improved word finding and sentence completion can strengthen her flow of thought, her working memory issues notwithstanding.
[[/image-entry]]

## Rationale: (Why create it?)
Given the aforementioned requirements, a product search revealed no single viable candidate. Most published content can be presented with different font sizing and line spacing, printed or otherwise. Some apps could recognize words and sentences, many could generate speech, but none could present custom prose much less interleaved images and recognize and synthesize speech. Some apps can highlight the current word but only for predefined content and few support cueing hierarchies. 

This seemed understandable given the specific need: reading as speech reinforcement. Intuitively, people begin to learn or relearn how to speak through oral conversation. But the model user of this app can benefit from self-paced written rote reinforcement via reading. At least one ongoing clinical study is focused on script-based reading for speech rehabilitation.

When facilitating reading practice aloud, tracking the current word to be spoken was an obvious initial strategy. The index finger of the reader was convenient and already familiar to start  assuming that hand-eye faculty was not also impaired. When self-tracking words, the model must not only identify the current word but also recognize when misreads occur. 

This self-checking sometimes seemed difficult since she truly believes that she was uttering the correct word. And while skipping or misreading the occasional word seemed reasonable, persistent misreads warranted more real-time and accurate feedback when the model could not  acknowledge misreads after the fact, possibly due to memory deficits.

The introduction of a literate reading companion definitely improved tracking and accuracy. While overlooking the occasional and arbitrary misreads, persistent misreads seemed to warrant more immediate feedback especially when the reader still could not or would not acknowledge the misread. But as the model became frustrated with the misreads, she started challenging the validity of the corrective feedback by the companion. This led to the misperception that the companion was not being supportive enough.

Word tracking and recognition feedback by an app seems more amenable to the model, resulting in a less adversarial circumstance, especially as the former corporeal companions resumes a more advocative role rather than therapeutic.

As the model worked with her speech language pathologists, additional requirements were incorporated into the app based on their recommendations to support more advanced word finding and sentence completion activities.

## Features (How does it meet the needs?)
The reading companion is a web application (app) originally developed for the model user. It presents multimodal personalized content with customizable format to be read aloud, highlights the current word to be recited and corrects mispronunciations without a human companion through any web browser that supports ReactJS and SpeechRecognition and SpeechSynthesis Web APIs. Note that iOS web browsers (via webview) support only a subset: SpeechRecognition APIs are not supported at this time.

### Curation/Authoring
The app hosts textual and visual content authored with a plain-text editor (e.g., Windows Notepad or Mac TextEdit) using a lightweight markup language (i.e., a markdown format). The content can be personalized to be more familiar and hence more conducive to being read properly and more importantly retained over time. The content can be arranged as lists, ordered and unordered. Beyond text, images can be embedded within the prose. 

### Formatting
The look and feel application wide and can be changed based on individual cascading style sheets and internal application settings. More specifically, the font sizing and line spacing can be modified for each page based on the user’s desire to ensure the best viewing. 

### Speech recognition
First and foremost, the reading companion reads along with the user by listening while the user reads aloud, recognizes and advances the current word to be spoken to the next word, waits for the correct word to be spoken and when necessary eventually skips to the subsequent word.

To balance the therapeutic challenge with ongoing self doubt and resultant frustration, the app assumes the word recognition responsibility and affords the reader a (configurable) number of retries before the "stuck" word is recited and the next word is highlighted. 

The app recognizes and properly interprets components that the user finds difficult to speak  including numbers, dates, years, phone numbers, email addresses, acronyms, symbols, etc.

### Speech Synthesis
The reading companion app can recite the text content to provide oral modeling on demand. The app can speak in various voices, both male and female, at different rates and volume. The companion can recite just the current word, the partial sentence up to current word inclusively or exclusively. The latter allows the user a “running start” at uttering the current word. In addition, the app can recite entire sentences, paragraphs. While reciting sentences or paragraphs, it can advance the next word to the beginning of the next sentence or paragraph, respectively.

Different voices can be selected for reciting depending upon the voices provided by the underlying platform. The recitation volume can be adjusted within the app as well as through the platform. Most importantly, the rate of recitation can be sped up or slowed down.

### Word finding and sentence construction (fill in the blanks)
The reading companion app supports word finding and sentence construction by prompting and listening for specific word or words that fit the verbal context. ​The sentence prompt (known as a stem) induces the user to reply with the valid response (known as a key) in the entry (response to be filled in, fill-in response, or just fill-in). 

The reading companion app supports word finding by allowing the author to selectively conceal words within a prompt (phrase or sentence). Subsequently, the user can read the prompt and:
* Identify the concealed word by reciting the word correctly whereupon the word is revealed, 
* Listen to the concealed word without reveal on demand,
* Reveal the concealed word on demand, 
* Listen to and reveal the concealed word automatically after the maximum number of retries is exceeded. 

The author is responsible for creating a prompt with enough context so as to allow the user to deduce the concealed response. 

After the concealed word is revealed, the cursor is advanced to the next word to be recited. To aid the user, response(s) can be displayed in a separate section from the prompt, outside the context of the prompt. Within the separate section, responses can be accompanied and sorted by their attributes such as grammatical tags (aka part of speech or, part of sentences), definitions, and possibly other information helpful to the user.

For example,
[[fillin: gridInOrder, true, 1, true,, Recite the following prompts:,grid, 2, insert, true, true, true, true, true, false]]
The man=(noun) is [_walking=(verb)_] to the [_market=(noun)_].
[[/fillin]]
In the fillin-in example above, while actively reciting the prompt for the app, the user can find the proper word among one or more words in a list. 
### Reading comprehension (multiple choice questions)
The reading companion app supports reading comprehension by prompting the user (with a question) and providing a list of responses from which the user can select the proper response. After the user selects the right response, the reading companion listens for the user to recite the proper response.

For example,
1a. What is my name?
  1a. [button: choice, , , , css attributes/] My name is Cindy.
  1a. [button: choice, correct, , , css attributes/] My name is Ronlyn.
  1a. [button: choice, , , , css attributes/] My name is Karen.
  1a. [button: choice, , , , css attributes/] My name is Linda.
In the multiple choice example above, while actively reciting the prompt for the app, the user can select the proper response (by clicking on the leading button) among multiple choices. 
### Speech modeling
Speech Modeling is a therapy technique where the user is initially presented with a clear example of a desired word, phrase or sentence (with optional visual cues) to be modeled; then prompted to imitate it without the written cue to allow the user to recall the prose (as opposed to just reading it aloud). The app facilitates this operation on demand by reciting the model prose, obscuring the model prose, prompting the user to repeat the prose, listening for the user’s response, recognizing and advancing the word cursor accordingly. 

For example,
[button: model, , , , css attributes/] The person is cooking.
[button: model, , , , css attributes/] The person is walking.
[button: model, , , , css attributes/] The person is running.

## Requirements: (What is needed?)
The model will be presented with curated and formatted multimodal content to encourage and facilitate reading. The model will have her speech recognized and tracked as she reads to ensure accuracy and instill confidence. The model will have the content recited on demand to provide oral modeling. The model will practice “filling in the blank” within context to practice word finding as well as multiple "filling in" key grammatical elements within a sentence to practice sentence construction. 

The model will use the reading companion from her primary touchscreen-based electronic platforms. The content will be accessible across all instances of the reading companion app to minimize pushing content.

The following reflects a summary of the most useful specific requirements to address the challenges observed and recommendations from her speech language pathologists.

* Authoring/curating familiar and relevant content to the user
  * Custom content
  * Multimodal context: visual, verbal (oral and written), link
  * Prose structuring, ordered and unordered lists, bullets, blocks, indenting
  * Navigation to related content
* Formatting content for the user
  * Font sizing
  * Sentence spacing
  * Page indexing
  * Customizable application look and feel
  * Repeating layouts (e.g., journaling/chronicling (date, images, captions)
* Tracking, recognizing and correcting the content spoken by the users
  * Current word tracking
  * Recite on demand with selectable voice and rate
  * Special formats (e.g., numbers, proper names, dates, phone numbers, numerals, email addresses, symbols)
  * Corrective action (after retries)
* Retrieving words
  * Word fill-ins
  * Hints/cueing hierarchy
* Sentence comprehension
* Speech Modeling


