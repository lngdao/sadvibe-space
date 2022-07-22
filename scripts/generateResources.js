const path = require('path')
const fs = require('fs')
const hjson = require('hjson')
const chalk = require('chalk')
const { exec } = require('child_process')

const ROOT_PATH = path.join(__dirname, '../')
// const IMAGE_ENTRY_PATH = path.join(ROOT_PATH, 'src/assets/imagesAsset.ts')
const STRING_ENTRY_PATH = path.join(ROOT_PATH, 'src/translation/T.ts')
// const ASSETS_PATH = path.join(ROOT_PATH, 'src/assets')
// const IMAGES_PATH = path.join(ASSETS_PATH, 'images')
const TRANSLATION_PATH = path.join(ROOT_PATH, 'src/translation')
const TRANSLATION_RESOURCE_PATH = path.join(
  ROOT_PATH,
  'src/translation/resources/en.ts'
)

const IMAGE_EXTENSION = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'jfif',
  'JPG',
  'JPEG',
]

const log = console.log
const logTitle = text =>
  log(
    chalk
      .bgHex('#4285f4')
      .hex('#d3ebe9')
      .bold('\n' + text.toUpperCase() + '\n')
  )
const logTxt = text => log(chalk.hex('#b3b1ad')(text + ' ✓'))
const logError = text => log(chalk.hex('#cd5c5c')('\n' + text))

let loadingInterval

function clearLoading() {
  if (loadingInterval) clearInterval(loadingInterval)
}

const loading = function (processTxt = 'loading') {
  clearLoading()
  var P = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  var x = 0

  loadingInterval = setInterval(function () {
    process.stdout.write('\r' + P[x++] + ` ${processTxt.toUpperCase()}...`)
    x &= 3
  }, 100)

  return loadingInterval
}

function isPathExist() {
  clearLoading()
  const pathExist =
    // fs.existsSync(ASSETS_PATH) && fs.existsSync(TRANSLATION_PATH)
    fs.existsSync(TRANSLATION_PATH)
  return pathExist
}

const getImageExtension = file => {
  const pattern = new RegExp('.[0-9a-zA-Z]+$')

  return file.match(pattern)?.toString().slice(1)
}

const parseImgFileName = file => {
  let fileName = file.slice(0, file.lastIndexOf('.'))
  const specialCharInFileName = fileName.match(/[^A-Za-z0-9]/g)
  if (!!specialCharInFileName?.length) {
    specialCharInFileName.forEach(item => {
      fileName = fileName.replace(item, '_')
    })
  }

  return fileName
}

function writeImages() {
  if (fs.existsSync(IMAGES_PATH)) {
    let index = 0
    loading('scan images folder')

    const content = fs.readdirSync(IMAGES_PATH)

    logTxt(`> Found ${content.length} files...`)

    const imgArr = content.filter(file =>
      IMAGE_EXTENSION.includes(getImageExtension(file))
    )

    const imgArrParse = Array.from(new Set(imgArr))

    imgArrParse.forEach(item => {
      loading(`rename ${item}`)
      fs.renameSync(
        path.join(IMAGES_PATH, item),
        path.join(
          IMAGES_PATH,
          `${parseImgFileName(item)}.${getImageExtension(item)}`
        )
      )
    })

    content.length != 0 && logTxt('> Remove special character...')

    const properties = imgArrParse
      .map(name => {
        loading(`write ${name}`)
        return `${parseImgFileName(name)}: require('./images/${name}')`
      })
      .join(',\n  ')

    const string = `const images = {
  ${properties}
}

export default images`

    content.length != 0 && logTxt(`> Write ${imgArrParse.length} images...`)

    fs.writeFileSync(IMAGE_ENTRY_PATH, string, 'utf8')
    logTitle(` ------ ${imgArrParse.length} images created ------ `)
  } else {
    logTitle(' ------ 0 image created ------ ')
  }
}

function writeStrings() {
  if (fs.existsSync(TRANSLATION_RESOURCE_PATH)) {
    const content = fs.readFileSync(TRANSLATION_RESOURCE_PATH, 'utf8')

    const json = hjson.parse(
      content.replace('export default', '').replace(';', '')
    )

    logTxt('> Parse json...')

    const stringsName = Object.keys(json)

    const properties = stringsName
      .map(name => {
        loading(`write ${name}`)
        return `${name}: t('${name}')`
      })
      .join(',\n\t\t')

    const string = `import { useTranslation } from 'react-i18next';

const T = () => {
  const { t } = useTranslation()

  return {
    ${properties}
  }
}

export default T`

    fs.writeFileSync(STRING_ENTRY_PATH, string, 'utf8')

    stringsName.length != 0 && logTxt(`> Write ${stringsName.length} strings...`)

    logTitle(` ------ ${stringsName.length} string created ------ `)
  } else throw Error('Not found translation resource file')
}

function execute() {
  logTitle(' START GENERATING RESOURCES... ')
  loading('clean file before')

  if (isPathExist()) {
    // writeImages()
    writeStrings()
  } else {
    throw Error(
      "Check assets, translation files. Looks like one of them doesn't exist"
    )
  }

  exec(
    // `npx prettier --write ${STRING_ENTRY_PATH} && npx prettier --write ${IMAGE_ENTRY_PATH}`,
    `npx prettier --write ${STRING_ENTRY_PATH}`,
    (err, stdout, stderr) => {
      // if (err) {
      //   throw Error(err.message)
      // }
      // if (stderr) {
      //   throw Error(stderr)
      // }
      console.log(`${stdout}`)
    }
  )
}

try {
  execute()
} catch (err) {
  logError(err)
} finally {
  clearLoading()
}
