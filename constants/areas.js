// constants/areas.ts

// ① エリアのマスターデータ（画面で表示するためのリスト）
export const AREAS = [
  { id: "shibuya", name: "渋谷", imageUrl: "/images/areas/shibuya.webp" },
  { id: "shinjuku", name: "新宿", imageUrl: "/images/areas/shinjuku.webp" },
  { id: "umeda", name: "梅田", imageUrl: "/images/areas/umeda.webp" },
  { id: "namba", name: "難波", imageUrl: "/images/areas/nanba.webp" },
  { id: "nagoya", name: "名古屋", imageUrl: "/images/areas/nagoya.webp" },
  { id: "fukuoka", name: "福岡", imageUrl: "/images/areas/fukuoka.webp" }
] 

// ② 自動的に "shibuya" ➔ "渋谷" に変換できる辞書（MAP）を作る
export const AREA_MAP = Object.fromEntries(
  AREAS.map(area => [area.id, area.name])
)
