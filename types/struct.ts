export type Post = {
    id: string
    title: string
    image: string
    subtitle: string
    hashtag: string
    userId: string
    createdAt: Date
  }

  export type PostFormData = {
    name: string
    imageURL: string
  }

  export type PostDocumentData = {
    id: string
    title: string
    image: string
    subtitle: string
    hashtag: string
    userId: string
  }

  export type MessageDocumentData = {
    id: string
    text: string
    createdAt: Date
  }

  export type MessageFormData = {
      text: string
      link: string
      imageURL: string
  }

  export type Message = {
      id?: string
      text?: string
      createdAt?: Date
  }

  export type User = {
    id: string
    displayName: string
    photoUrl: string
  }