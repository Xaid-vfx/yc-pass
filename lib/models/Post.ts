import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorImage: string;
  type: "want" | "have";
  body: string;
  claimed: boolean;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorUsername: { type: String, required: true },
  authorImage: { type: String, default: "" },
  type: { type: String, enum: ["want", "have"], required: true },
  body: { type: String, required: true, maxlength: 500 },
  claimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
