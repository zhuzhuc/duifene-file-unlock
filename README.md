# 对分易文件大小限制解除

> 解除对分易（duifene.com）上传文件时的大小限制校验。

## 🚀 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击 [安装脚本](https://greasyfork.org/zh-CN/scripts/599344)
3. 刷新对分易页面即可生效

## ✨ 功能

- 覆盖全局 `FileSize` 函数，让校验永远通过
- 修改 `file.size` 属性，防止页面直接读取原始大小
- 支持动态加载的文件输入框

## ⚠️ 注意

- 本脚本仅绕过**前端校验**，如果服务器端也校验，可能无效
- 请遵守学校/平台规定

## 📄 License

MIT
