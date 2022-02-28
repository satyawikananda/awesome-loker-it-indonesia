import { writeFile } from "fs"
import { join } from "path"
import dayjs from "dayjs"
import "dayjs/locale/id"
import { fetchData } from "./utils/fetch"
import { salaryFormat } from "./utils/salaryFormat"
import { locations } from "./const"

interface TemplateInterface {
  data: Array<unknown>
  location: string
}

const table = (data: any) => {
  return Object.keys(data)
    .map((key) => {
      const logo: string =
        data[key]["companyMeta"]["logoUrl"] !== ""
          ? data[key]["companyMeta"]["logoUrl"]
          : "https://i.ibb.co/sqvTCh9/112815900-stock-vector-no-image-available-icon-flat-vector.webp"
      const companyName: string =
        data[key]["companyMeta"]["isPrivate"] !== true
          ? data[key]["companyMeta"]["name"]
          : "Nama perusahaan dirahasiakan"
      return (
        "|![logo-perusahaan](" +
        logo +
        ")|" +
        companyName +
        "|" +
        data[key]["jobTitle"] +
        "|" +
        salaryFormat(data[key]["salaryRange"]["min"]) +
        "-" +
        salaryFormat(data[key]["salaryRange"]["max"]) +
        "|" +
        data[key]["locations"][0]["name"] +
        "|" +
        data[key]["description"] +
        "|" +
        dayjs(data[key]["postedAt"]).locale("id").format("dddd, DD MMMM YYYY") +
        "|" +
        data[key]["jobUrl"] +
        "|\n"
      )
    })
    .join("")
}

const template = ({ data, location }: TemplateInterface) => {
  const region: string =
    location.split("-").join(" ").charAt(0).toUpperCase() + location.slice(1).replace("-", " ")
  const template = `
  # Lowongan kerja di ${region}

  ### Diperbarui pada tanggal ${dayjs().locale("id").format("dddd, DD MMMM YYYY")}

  Berikut merupakan daftar lowongan kerja yang ada di ${region}

  |Logo Perusahaan | Nama Perusahaan | Judul Pekerjaan | Gaji Pekerjaan | Lokasi | Deskripsi | Tanggal diunggah | Pranala |
  | -------------- | --------------- | --------------- | --------- | --------- | -------------- | ------- | ----------- |
  ${table(data)}

  [Kembali ke daftar lowongan kerja 🔙](../README.md#daftar-lowongan-kerja)
  `

  return template
}

const createMarkdown = async () => {
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i]
    console.log(`Sedang memproses lowongan kerja ${location}`)
    const openingFile = join(__dirname, "..", "loker/", `loker-${location}.md`)
    const data = await fetchData(location)
    writeFile(openingFile, template({ data, location }), (err) => {
      if (err) console.error(err)
    })
    console.log(`Selesai memproses lowongan kerja ${location}`)
  }
}

createMarkdown()
