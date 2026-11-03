import { z } from 'zod'
import { CafeSchema } from '@/schemas/cafe'

// Zodスキーマを使って、検索用の型定義を作成
export const SearchOptionsSchema = z.object({
  keyword: z.string().optional(),
  area: z.string().optional(),
  tag: z.string().optional()
})

// Zodスキーマを使って、検索APIのレスポンス型を作成
export const SearchApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  results: z.array(CafeSchema), // CafeSchemaを使ってresultsの型を定義
  conditions: z.any().optional(),
  isFallback: z.boolean().optional()
})

// ZodスキーマからTypeScript型を自動生成する
export type SearchOptions = z.infer<typeof SearchOptionsSchema>
export type SearchApiResponse = z.infer<typeof SearchApiResponseSchema>
