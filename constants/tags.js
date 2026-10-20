import featureMaster from '@@/data/features.json'

// featureMasterからタグの配列を作成 
export const TAGS = Object.entries(featureMaster).map(([key, item]) => ({
  name: item.name, 
  key: key // featureMasterのキーをタグのkeyとして使用
}))

// TAG_MAPは、TAGS配列をオブジェクトに変換したもの  キーはタグのkeyで、値はタグのname
export const TAG_MAP = Object.fromEntries(
  TAGS.map(tag => [tag.key, tag.name])
)
