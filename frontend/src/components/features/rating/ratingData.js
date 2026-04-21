export const ratingValues = {
  NOT_MET: "CHUA_DAT",
  DEVELOPING: "DANG_PHAT_TRIEN",
  MEETS: "DAT_YEU_CAU",
  EXCEEDS: "VUOT_TROI",
}

export const ratingOptions = [
  { value: ratingValues.NOT_MET, label: "Chưa đạt" },
  { value: ratingValues.DEVELOPING, label: "Đang phát triển" },
  { value: ratingValues.MEETS, label: "Đạt yêu cầu" },
  { value: ratingValues.EXCEEDS, label: "Vượt trội" },
]
