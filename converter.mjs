// 引入文件系统和路径模块
import fs from "fs";
import path from "path";

// 引入 JSON 数据
import posts from "./data/posts.json" assert { type: "json" };

// 对每一个 post 进行处理
const processedPosts = posts.map((post) => {
  // 在 title 属性值的结尾添加字符串'-->'
  const newTitle = post.title + "-->";

  // 替换 title 属性名为 'prompt'
  const { title, ...rest } = post;
  const processedPost = { prompt: newTitle, ...rest };

  // 在 category 属性值的开头添加空格，在结尾添加字符串'$!'
  const newCategory = ` ${processedPost.category}$!`;

  // 替换 category 属性名为 'completion'
  const { category, ...rest2 } = processedPost;
  return { completion: newCategory, ...rest2 };
});

// 将处理后的数据写入文件
const filePath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "data",
  "posts_new.json"
);

fs.writeFileSync(filePath, JSON.stringify(processedPosts, null, 2));
