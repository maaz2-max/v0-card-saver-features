export function formatCardNumber(value: string): string {
  const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g
  const onlyNumbers = value.replace(/[^\d]/g, "")

  return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) => [$1, $2, $3, $4].filter((group) => !!group).join(" "))
}

export function formatExpiryDate(value: string): string {
  const regex = /^(\d{0,2})(\d{0,2})$/g
  const onlyNumbers = value.replace(/[^\d]/g, "")

  return onlyNumbers.replace(regex, (regex, $1, $2) => [$1, $2].filter((group) => !!group).join("/"))
}
