import fs from "fs";
import { kmeans } from "ml-kmeans";
import { openai } from "./app.service.mjs";

let data = JSON.parse(fs.readFileSync("./data/posts_with_embedding.json"));

const k = 4;

const { clusters, centroids, distance } = kmeans(
  data.map((item) => item.embedding),
  k
);

data = data.map((item, index) => {
  const clusterIndex = clusters[index];

  return {
    ...item,
    clusterIndex,
    distance: distance(centroids[clusterIndex], item.embedding),
  };
});

for (let i = 0; i < k; i++) {
  console.log(`\nCluster ${i + 1}`);

  const clusterData = data
    .filter((item) => item.clusterIndex === i)
    .sort((a, b) => a.distance - b.distance);

  const clusterDataSample = clusterData
    .map((item) => item.title)
    .slice(0, 5)
    .join(",");

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `这些内容有什么共同特点，请用一句话简要描述一下：${clusterDataSample}`,
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
  });

  console.log(
    `\n摘要：${response.data.choices[0].text.replace("\n\n", "\n")} \n\n内容：`
  );

  clusterData.forEach((item) => {
    console.log(item.title, item.category, item.distance);
  });
}
