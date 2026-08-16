import featureMaster from '../data/features.json'

// タグのマスターデータ（features.json から自動生成）
export const TAGS = Object.entries(featureMaster).map(([key, item]) => ({
  name: item.name,
  key: key
}))

// キーから日本語名へ素早く変換するための連想配列（Map）
export const TAG_MAP = Object.fromEntries(
  TAGS.map(tag => [tag.key, tag.name])
)