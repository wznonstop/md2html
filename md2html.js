/**
 * Created by wz on 2019/2/21.
 */
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const markdown = require('marked');

const currentPath = path.resolve(__dirname);

const fsExistsSync = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const askMdPath = `请输入md文件所在文件夹的绝对路径(如${currentPath}),\n可以到该文件夹执行\`pwd | pbcopy\`命令获取文件路径，
再粘贴到本处并按回车键确认：\n`
rl.question(askMdPath, (filePath) => {
  if (fsExistsSync(filePath)) {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        throw err;
        rl.close();
      };
      let counter = 0;
        files.forEach((file) => {
        const mdFilePath = path.resolve(filePath, file);
        fs.readFile(mdFilePath, (err, data) => {
          if (err) {
            throw err;
            rl.close();
          };
          console.log(`${file} 转换中...\n`);
          const markdownContent = data.toString();
          const htmlContent = markdown(markdownContent);
          const exportsDir = path.resolve(__dirname, './exports');
          if (!fsExistsSync(exportsDir)) {
            fs.mkdirSync(exportsDir);
          }
          const htmlFileName = file.replace(/\.md/, '.html');
          const htmlPath = path.resolve(exportsDir, htmlFileName);
          const htmlHeader = '<!doctype html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <meta charset="UTF-8">\n' +
            '    <meta name="viewport"\n' +
            '          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">\n' +
            '    <meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
            '    <title>Document</title>\n' +
            '    <link rel="stylesheet" href="../md.css">\n' +
            '</head>\n' +
            '<body class="markdown-body">\n';
          const htmlFooter = '\n</body>\n' +
            '</html>';
          fs.writeFileSync(htmlPath, `${htmlHeader}${htmlContent}${htmlFooter}`, {
            flag: 'w',
          });
          counter++;
          if (counter === files.length) {
            console.log('转换完成，请到当前目录的exports文件夹下查看');
            rl.close();
          }
        });
      });
    })
  } else {
    console.log('文件夹路径错误，请重试！');
    rl.close();
  }
})