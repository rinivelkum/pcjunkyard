const description = new EditorJS({
  holder: 'description',
  tools: {
    image: SimpleImage,
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    header: Header,
    quote: Quote,
    delimiter: Delimiter,
    list: {
      class: List,
      inlineToolbar: true,
    },
  },
  placeholder: 'Decription',
})

const review = new EditorJS({
  holder: 'review',
  tools: {
    image: SimpleImage,
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    header: Header,
    quote: Quote,
    delimiter: Delimiter,
    list: {
      class: List,
      inlineToolbar: true,
    },
  },
})
