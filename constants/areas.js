// constants/areas.ts

// ① エリアのマスターデータ（画面で表示するためのリスト）
export const AREAS = [
  { id: "shibuya", name: "渋谷", imageUrl: "/nomad-cafe-info/images/areas/shibuya.png" },
  { id: "shinjuku", name: "新宿", imageUrl: "/nomad-cafe-info/images/areas/shinjuku.png" },
  { id: "umeda", name: "梅田", imageUrl: "/nomad-cafe-info/images/areas/umeda.png" },
  { id: "namba", name: "難波", imageUrl: "/nomad-cafe-info/images/areas/nanba.png" },
  { id: "nagoya", name: "名古屋", imageUrl: "/nomad-cafe-info/images/areas/nagoya.png" },
  { id: "fukuoka", name: "福岡", imageUrl: "/nomad-cafe-info/images/areas/fukuoka.png" }
] 

// ② 自動的に "shibuya" ➔ "渋谷" に変換できる辞書（MAP）を作る
export const AREA_MAP = Object.fromEntries(
  AREAS.map(area => [area.id, area.name])
)