const { run } = require('runjs')
const chalk = require('chalk')
const config = require('../vue.config.js')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
  const report = rawArgv.includes('--report')

  run(`vue-cli-service build ${args}`)
  const path = require('path')
  const express = require('express')
  const publicPath = config.publicPath
  const port = process.env.PORT || 9526
  const app = express()
  const rootPath = path.resolve(__dirname, '..')
  app.use(express.static(`${rootPath}/dist`))

  app.use(express.static(`${rootPath}/screen`))

  app.get('/dist', function response(req, res) {
    res.sendFile(path.join(rootPath, 'dist/index.html'))
  })
  app.get('/screen', function response(req, res) {
    res.sendFile(path.join(rootPath, 'screen/index.html'))
  })
  app.get('*', function response(req, res) {
    res.redirect('/dist')
  })

  app.listen(port, function() {
    console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))
    if (report) {
      console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
    }
  })
  // const port = 9526
  // const publicPath = config.publicPath

  // var connect = require('connect')
  // var serveStatic = require('serve-static')
  // const app = connect()

  // app.use(
  //   publicPath,
  //   serveStatic('./dist', {
  //     index: ['index.html', '/']
  //   })
  // )

  // app.listen(port, function() {
  //   console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))
  //   if (report) {
  //     console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
  //   }
  // })
} else {
  run(`vue-cli-service build ${args}`)
}
