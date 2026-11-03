// app/schemas/cafe.ts
import { z } from 'zod'
import featureMaster from '@@/data/features.json'

// features.json のキーを型へ反映する
export type FeatureKey = keyof typeof featureMaster
// 各設備のデータ形式
export const CafeFeatureSchema = z.object({
  available: z.boolean()
}).passthrough()

// ZodスキーマからTypeScript型を自動生成する
export type CafeFeature = z.infer<typeof CafeFeatureSchema>
// features.json にある設備キーだけをTypeScript上で使えるようにする
export type CafeFeatures = Partial<Record<FeatureKey, CafeFeature>>

//-------- SNSリンクのデータ形式
export const socialLinkSchema = z.object({
  instagram: z.string().optional(),
  LINE: z.string().optional()
})
// ZodスキーマからTypeScript型を自動生成する
export type SnsLinksSchema = z.infer<typeof socialLinkSchema>

//--------ここまでSNSリンクのデータ形式

// カフェ1件のデータ形式
export const CafeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  area: z.string(),
  areaNameJa: z.string(),
  address: z.string().optional(),
  businessHours: z.string().optional(),
  seats: z.number().optional(),
  imageUrl: z.string().optional(),
  budget: z.string().optional(),
  website: z.string().url().optional(),
  // 実行時には各設備が { available: boolean } の形か検証する
  features:  z.record(z.string(), CafeFeatureSchema),
  sns: socialLinkSchema.optional()
})

// カフェ一覧のデータ形式
export const CafesSchema = z.array(CafeSchema)

// ZodスキーマからTypeScript型を自動生成する
type CafeFromSchema = z.infer<typeof CafeSchema>

// Cafe型を拡張して、featuresの型をより厳密にする
export type Cafe = Omit<CafeFromSchema, 'features'> & {
  features: CafeFeatures
}
