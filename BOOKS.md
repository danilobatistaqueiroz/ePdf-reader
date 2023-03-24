tela principal para escolher entre setup, ou ler um livro (menu):


tela para cadastrar o livro (setup/books):
  gravar em localstorage('books')

tela para cadastrar capítulos (setup/chapters):
  gravar em localstorage('chapters')

tela para carregar as fotos (setup/pages):
  escolhe um capítulo (localstorage)
  escolhe uma lista de fotos da galeria ou tira a foto na camera
  acrescenta na lista em localstorage('{chapter}_fotos)
    [png,png,png...]

tela para escolher o livro (books/menu)
  localstorage.getItem('books')
  localstorage.setItem('books')
  opção de deletar o livro (remover de localstorage('books') e 'chapters'

tela para escolher o capitulo (books/chapters)
  listar usando: localstorage('chapters')

tela para exibir o capitulo - leitor (base e chapter)
  