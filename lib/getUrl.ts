import { storage } from '@/appwrite'

export const getUrl = (image: Image): string =>
  storage.getFilePreview(image.bucketId, image.fileId).toString()
