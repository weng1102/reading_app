[[page: Recitation Mode Help, Ronlyn, Wen, 5/23/2023, Help, /]]

# Help for Recitation Modes
The app can recite content (that is, words and sentences) to the user in various ways based on span of content, ensuing placement of the cursor and ensuing listening action. All recitation function disable listening when enabled to prevent the app from listening to itself. The converse is also so in that the listening mode is disabled when recitation mode is active.

## Content Span
The text span is the sequence of consecutive words to be recited within the sentence containing the current word. The span can be the:
  * current word only
  * first word of the sentence upto:
    * excluding the current word, or
    * including the current word 
  * entire sentence, or
  * entire section or paragraph
## Cursor placement
After recitation of the aforementioned span is complete, the cursor placement can either remain unchanged or be advanced to the beginning of the next sentence or section if and only if the entire sentence or section are spanned.
Moving to the beginning of the subsequent sentence or section respectively. The latter case allows passages to be recited the user.
## Listening action
After recitation of the aforementioned span is complete, listening can be automatically activited. This is most applicable when the span does not include the entire sentence.
[[image-entry: Recitation Mode, left, 7%, none]]
![recitation mode](button_speak.png,, 40, 40)
Recite word(s) depending upon the current mode
[[/image-entry]]
## Recitation mode active
[[image-entry: Recitation Mode, left, 7%, none]]
![recitation mode](button_speak_activeGreen.gif,, 40, 40)
Recite active
[[/image-entry]]
[[image-entry: Recitation Mode, left, 7%, none]]
![recitation mode](button_speak_sentence_full.png,, 40, 40)
Recite entire sentence
Recite Inactive 
[[/image-entry]]
## Sentence reading mode
[[image-entry: Recitation Mode, left, 7%, none]]
![recitation mode](button_speak_sentence_full_advance.png,, 40, 40)
Recites full sentence, stops synthesizing and advances to the beginning of the next sentence. This allows the user to listen as the app reads.
[[/image-entry]]
## Sentence completion reading mode
[[image-entry: Recitation Mode, left, 7%, none]]
![recitation mode](button_speak_sentence_partial_inclusive_advance.png,, 40, 40)
Recite sentence up to and including current word and advance to the next word.
[[/image-entry]]
## Word completion reading mode
[[image-entry: Recitation Mode, left, 7%, none]]
![recitation mode](button_speak_word_advance.png,, 40, 40)
Recite word and advance to next word
[[/image-entry]]
