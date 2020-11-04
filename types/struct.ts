export type Post = {
    id: string
    title: string
    subtitle: string
    hashtag: string
    tags: string[]
    userId: string
    createdAt: Date
  }

  export type PostFormData = {
    word: string
    subWord: string
  }

  export type PostDocumentData = {
    id: string
    title: string
    subtitle: string
    hashtag: string
    tags: string[]
    userId: string
  }