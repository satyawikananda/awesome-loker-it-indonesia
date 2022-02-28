export const salaryFormat = (salary: number) => {
  if (salary === null) return "-"
  const format = "Rp. " + new Intl.NumberFormat("id-ID").format(salary)
  return format
}
