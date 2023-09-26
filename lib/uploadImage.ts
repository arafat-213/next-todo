import {ID, storage} from '@/appwrite'

export const uploadImage = async (file: File) => {
 if (!file) return;   

 const uploadedFile = await storage.createFile(
    process.env.NEXT_PUBLIC_IMAGES_STORAGE_BUCKET_ID!,
    ID.unique(),
    file
 )

 return uploadedFile
}