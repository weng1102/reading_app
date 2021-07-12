# Testing headings

the quick brown fox jumped over heading "Testing headings"

## heading 2 expected

the quick brown fox jumped over heading "headings 2 expected."

### heading 3 expected

the quick brown fox jumped over heading "headings 3 expected."

#### heading 4 expected

the quick brown fox jumped over heading "headings 4 expected."

##### heading 5 expected

the quick brown fox jumped over heading "headings 5 expected."

###### heading 6 expected

the quick brown fox jumped over heading "headings 6 expected."

###### heading 4 expected

the quick brown fox jumped over heading "headings 4 expected."

[//]: SectionParagraphType

# Testing SectionParagraphType

This paragraph is not explicitly indicated by an explicit paragraph label.
This paragraph is terminated by an empty newline.

[//]: # paragraph/>Paragraph with explicit paragraph label
This paragraph has explicit paragraph label.
This paragraph is terminated by an explicit heading label.

## Heading level 2

This paragraph has explicit paragraph label.
This paragraph is terminated by an empty newline.

This paragraph is an implicit new paragraph that follows an empty newline.

My name is Ronlyn Goo. I am 58 years old. I have a Bachelor's degree in Chemical Engineering from UC Berkeley. I also have an MBA degree from Stanford. I live at 20680 Seaton Ave. My current occupation is stroke recovery. My cell phone number is (408) 206-5963. In case of emergency, please call Wen at (408) 267-6076. Yay! // blank line terminates paragraph. (Good luck with parenthetics.) What about lasting [sic]. Sentences ending with "quotes." What about sentences ending with "quotes?" What about abbreviations like Ca. or Or. trailing sentence with no formal terminal punctuation

## heading level 2

I had a hemorrhagic stroke in 2015. A bleed in my head damaged my brain.
I was initially paralyzed on my right side and had severe aphasia.
Aphasia is the loss of language skills.
Each stroke victim is affected differently.
Survivors recover at different rates.
I could only say one word after my stroke.
I am starting to speak in sentences again.
I get frustrated when I cannot say what I am thinking.
I have problems with simple math and remembering things.

### Heading level 3

# Testing comments

[]: "embedded comments"
[]: (embedded comments)
[]: 'embedded comments'
[//]: (embedded comments)
[comment]: (embedded comments)

# Testing SectionHeadingVariantType

sentence 1 after heading 1.0

## heading 1.1

sentence 1 after heading 1.1.
sentence 2 after heading 1.1.

# heading 2.0

sentence 1 after heading 2.0
</page>

[//]: SectionUnorderedListVariantType

[//page]: unordered list

# unorder list example

- sentence 1
- sentence 2

* sentence 3
* sentence 4
  - sentence 4.1. But what if this section has multiple sentences. What do you do?
  - sentence 4.2. Should the list item be preserved as a single block? Or as separate sentences within a paragraph?
* sentence 5
* sentence 6
  - sentence 6.1
  - sentence 6.2

# heading1 ordered list example

ordered_list:

1. sentence 1
2. sentence 2
3. sentence 2.1
4. sentence 3.3.1
5. sentence 3
6. sentence 4
7. sentence 6.1 with tabs
8. sentence 6.2 with tabs
9. sentence 4
10. sentence 5.1 with spaces
    5. sentence 5.2.2 with spaces

# mixed list example

1. ordered sentence 1

- unordered sentence 1

2. ordered sentence 2

- unordered sentence 2

> This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote. This is a blockquote.

[//photo-entry]: image="abc.jpg" photo

- photo caption 1.
- photo caption 2.
  [//photo-entry-end]

[//fill-in]: ordered fill

1. this is an ordered fill in section label1
2. this is an ordered fill in section label2
   [//fill-in-end]

[//fill-in]: unordered fill

- this is an unordered fill in section label1
- this is an unordered fill in section label2
  [//fill-in-end]

[//custom-tag]: this is a custom tag section label

    - sentence starting at a depth greater than 1
      - sentence starting at a depth greater than 2
