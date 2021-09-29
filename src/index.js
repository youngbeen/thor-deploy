#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const { prompt } = require('enquirer')
const style = require('chalk')
const fileInfo = require('./models/fileInfo.js')

const info = style.cyan.bold
const success = style.green.bold
const warning = style.yellow.bold
const error = style.red.bold
// const tip = style.gray

const currentPath = path.resolve('./')
// let pathInfo = path.parse(currentPath)
const isThorExists = fs.existsSync('../thor')
const isThorScaffoldExists = fs.existsSync('../thor-scaffold')

console.log(info(`🤖 You are going to deploy assets under ${warning(currentPath)}`))

if (isThorExists || isThorScaffoldExists) {
  prompt([
    {
      type: 'MultiSelect',
      name: 'fileNames',
      message: 'Select files to sync or deploy',
      choices: fileInfo
    }
  ]).then(res => {
    // console.log(res)
    if (res && res.fileNames && res.fileNames.length) {
      console.log(info(`🚚 Trying to move ${res.fileNames.length} ${res.fileNames.length > 1 ? 'files' : 'file'}...`))
      syncFiles(res.fileNames)
    }
  }).catch(error => {
    console.log(error)
  })
} else {
  console.log(error('Not found any thor or thor-scaffold projects'))
}

const syncFiles = (files) => {
  let successCount = 0
  files.forEach(f => {
    if (fs.existsSync(f)) {
      isThorExists && fs.copySync(f, `../thor/template/pc/${f}`)
      isThorScaffoldExists && fs.copySync(f, `../thor-scaffold/template/pc/${f}`)
      console.log(success(`✅ ${info(f)} -- Success`))
      successCount++
    } else {
      console.log(error(`❌ ${warning(f)} does not exist`))
    }
  })
  console.log('')
  console.log(info(`📋 ${successCount} success, ${files.length - successCount} fail`))
}