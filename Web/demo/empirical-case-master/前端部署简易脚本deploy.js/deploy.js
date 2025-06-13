const cp = require('child_process')
const ssh = require('ssh2')
const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

// 命令执行的模式
const mode = process.argv.slice(2)[0] || 'test'

// 打包后的名称
const distName = 'dist.tar.gz'

// 不同环境打包变量
const unzipDirMode = {
  test: {
    spawn: 'pnpm build:test',
    // 解压文件名
    unzipDir: 'back_end/',
    // 终端定位位置 cd
    servicePath: '/workspace/test',
    // 压缩包存放位置
    serviceFilePath: `/workspace/test/${distName}`
  },
  production: {
    spawn: 'pnpm build:prod',
    unzipDir: 'back_end/',
    servicePath: '/workspace/pro/',
    serviceFilePath: `/workspace/pro/${distName}`
  }
}

// 文件所在地
const distPath = path.resolve(__dirname, '../dist')
// 打包后位置
const zipPath = path.resolve(__dirname, `../${distName}`)
// 远程服务器存放位置
const { spawn, servicePath, serviceFilePath, unzipDir } = unzipDirMode[mode]
// 服务器连接信息
const connectInfo = {
  host: 'ip',
  port: '端口',
  username: '服务器用户名',
  password: '服务器密码'
}
//链接服务器
let conn = new ssh.Client()

async function start() {
  try {
    // 1. 打包
    await build()
    // 2. 压缩zip
    await startZip()
    // 3. 将zip文件传输至远程服务器
    await connect()
    // 4. 部署解压
    await shellCmd(conn)

    console.log('---部署完成---')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    // 5. 断开ssh，并删除本地压缩包
    conn.end()
    delZip()
  }
}
start()

/**
 * 1. 本地构建项目
 */
function build() {
  return new Promise((resolve, reject) => {
    //对项目进行打包，然后生成压缩文件
    let pro = cp.spawn(spawn, {
      shell: true,
      stdio: 'inherit'
    })
    pro.on('exit', code => {
      //打包完成后  开始链接目标服务器，并自动部署
      if (code === 0) {
        console.log('---构建成功---')
        resolve()
      } else {
        reject(new Error('构建失败'))
      }
    })
  })
}

/**
 * 2. 将打包后文件压缩zip
 * @returns
 */
function startZip() {
  return new Promise((resolve, reject) => {
    console.log('---开始打包tar---')
    //定义打包格式和相关配置
    const archive = archiver('tar', {
      gzip: true, // 如果需要压缩，可以使用 gzip
      gzipOptions: { level: 9 } // gzip 压缩级别
    }).on('error', err => reject(err))

    const output = fs.createWriteStream(zipPath)
    //监听流的打包
    output.on('close', () => {
      console.log('---目标打包完成---')
      resolve(true)
    })
    //开始压缩
    archive.pipe(output)
    // 文件夹压缩
    archive.directory(distPath, false)
    archive.finalize()
  })
}

/**
 * 3. 将zip文件传输至远程服务器
 */
function connect() {
  return new Promise((resolve, reject) => {
    conn
      .on('ready', () => {
        conn.sftp((err, sftp) => {
          if (err) {
            return reject(err)
          }
          sftp.fastPut(zipPath, serviceFilePath, {}, (err, result) => {
            if (err) {
              return reject(err)
            }
            //开始上传
            console.log('---压缩包上传成功---')
            resolve()
          })
        })
      })
      .on('error', err => reject(err))
      .connect(connectInfo)
  })
}

/**
 * 4. 解压部署操作
 * @param {*} conn
 */
async function shellCmd(conn) {
  return new Promise((resolve, reject) => {
    conn.shell((err, stream) => {
      if (err) {
        return reject(err)
      }
      //进入服务器暂存地址
      //解压上传的压缩包
      //移动解压后的文件到发布目录
      //删除压缩包
      //退出
      const commands = `
        cd ${servicePath} &&
        mkdir -p ${unzipDir} &&
        tar -xzf ${distName} -C ${unzipDir} &&
				rm -rf ${distName} &&
        exit
				`
      console.log('终端执行命令:', commands)
      stream
        .on('close', () => resolve())
        .on('data', data => console.log(data.toString()))
        .stderr.on('data', data => console.error('Error:', data.toString()))

      stream.end(commands)
    })
  })
}

/**
 * 5. 删除本地的dist.zip
 */
function delZip() {
  fs.unlink(zipPath, function (err) {
    if (err) {
      console.error('删除文件失败:', err.message)
    }
    console.log('---文件:' + zipPath + '删除成功！---')
  })
}
