// タグのマスターデータ
export const TAGS = [
  { name: '電源', key: 'power' },
  { name: 'Wifi', key: 'wifi' },
  { name: 'モーニング', key: 'morning' },
  { name: 'ランチ', key: 'lunch' },
  { name: '一人席', key: 'single' },
  { name: '禁煙', key: 'no-smoking' },
  { name: '打あわせ可', key: 'meeting' }
]

// キーから日本語名へ素早く変換するための連想配列（Map）
export const TAG_MAP = Object.fromEntries(
  TAGS.map(tag => [tag.key, tag.name])
)