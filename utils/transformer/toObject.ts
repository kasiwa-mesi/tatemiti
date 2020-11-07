import {
    Post,
    PostDocumentData,
    Message,
    MessageDocumentData
  } from '../../types/struct'
  import { DocumentNotExistError } from '../../types/error'
type Document = firebase.default.firestore.DocumentSnapshot<
  firebase.default.firestore.DocumentData
>

export function toObject<T>(doc: Document): T {
    const obj: any = {
      id: doc.id,
      ...doc.data()
    }
    return obj as T
  }

export function toPost(doc: Document): Post {
    if (!doc.exists) throw new DocumentNotExistError()
    const _doc: any = doc
    return {
      ...toObject<PostDocumentData>(doc),
      createdAt: _doc.data().createdAt.toDate(),
    }
  }

export function toMessage(doc: Document): Message {
    if (!doc.exists) throw new DocumentNotExistError()
    const _doc: any = doc
    return {
      ...toObject<MessageDocumentData>(doc),
      createdAt: _doc.data().createdAt.toDate(),
    }
  }