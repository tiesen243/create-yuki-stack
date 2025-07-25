import type { Model } from 'mongoose'
import mongoose from 'mongoose'

export interface Post {
  _id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const postSchema = new mongoose.Schema<Post>(
  {
    title: { type: String, required: true, maxlength: 255 },
    content: { type: String, required: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

export const posts: Model<Post> =
  mongoose.models.post ?? mongoose.model<Post>('post', postSchema)
