// app/schemas/cafe.ts
import { z } from 'zod'
import featureMaster from '@@/data/features.json'

// features.json のキーを型へ反映する
export type FeatureKey = keyof typeof featureMaster
// 各設備のデータ形式
export const CafeFeatureSchema = z.object({
  available: z.boolean()
}).passthrough()

export type CafeFeature = z.infer<typeof CafeFeatureSchema>
// features.json にある設備キーだけをTypeScript上で使えるようにする
export type CafeFeatures = Partial<Record<FeatureKey, CafeFeature>>

// カフェ1件のデータ形式
export const CafeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  area: z.string(),
  areaNameJa: z.string(),
  address: z.string().optional(),
  businessHours: z.string().optional(),
  imageUrl: z.string().optional(),
  budget: z.string().optional(),
  website: z.string().url().optional(),
  // 実行時には各設備が { available: boolean } の形か検証する
  features:  z.record(z.string(), CafeFeatureSchema)
})

// カフェ一覧のデータ形式
export const CafesSchema = z.array(CafeSchema)

type CafeFromSchema = z.infer<typeof CafeSchema> 

// ZodスキーマからTypeScript型を自動生成する
export type Cafe = Omit<CafeFromSchema, 'features'> & {
  features: CafeFeatures
}