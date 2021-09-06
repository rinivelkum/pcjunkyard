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
  placeholder: 'Introdu descrierea produsului',
})

const image = new EditorJS({
  holder: 'image',
  tools: {
    image: SimpleImage,
  },
  placeholder: 'Copiaza link-ul cu poza',
})
