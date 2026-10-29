# Cloudflare Pages 构建配置

- 框架预设：None
- 根目录：留空（仓库根目录）
- 构建命令：npm run build
- 构建输出目录：dist

package.json 和 scripts/build.mjs 为纯静态文件打包，不需要安装任何第三方依赖，不需要 Wrangler 或 Worker。

如果更希望完全无构建，也可移除构建命令，输出目录指向静态网页所在的仓库根目录。不要执行不存在的 npm 构建脚本。
