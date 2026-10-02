# 论文配图来源

主页 6 篇代表作的配图均从下列原始论文 PDF 直接渲染、裁剪而来。保留原图内容和图内标签，仅移除页面正文、页眉、页脚及图外长图注，再编码为 WebP；未使用 AI 生成，也未重新绘制图示。页面提供简短中英文说明，并可点击放大查看和跳转至原文。

下表的 PDF 页码从 1 开始计数，与浏览器 `#page=` 定位一致；期刊印刷页码另行注明。论文年份和配图版本分别记录，避免将较晚的预印本修订日期误当作首次发表年份。

| 论文                                                                                                                                                       | 原图     | PDF 页码       | 配图所用版本                                                               | 原始 PDF 来源                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [FedEve: On Bridging the Client Drift and Period Drift for Cross-device Federated Learning](https://arxiv.org/abs/2508.14539)                              | Figure 2 | 5              | arXiv:2508.14539v1，2025-08-20                                             | [作者预印本 PDF](https://arxiv.org/pdf/2508.14539v1#page=5)                                               |
| [FedMcon: an adaptive aggregation method for federated learning via meta controller](https://journal.hep.com.cn/fitee/EN/10.1631/FITEE.2400530)            | Figure 2 | 7；印刷页 1384 | FITEE 正式期刊版，2025，26(8):1378–1393                                    | [期刊正式版 PDF](https://journal.hep.com.cn/fitee/EN/PDF/10.1631/FITEE.2400530#page=7)                    |
| [Merging LoRAs like Playing LEGO: Pushing the Modularity of LoRA to Extremes Through Rank-Wise Clustering](https://openreview.net/forum?id=j6fsbpAllN)     | Figure 3 | 5              | 作者预印本 arXiv:2409.16167v3；论文条目链接至 ICLR 2025 的 OpenReview 页面 | [作者预印本 PDF（v3）](https://arxiv.org/pdf/2409.16167v3#page=5)                                         |
| [Will LLMs Scaling Hit the Wall? Breaking Barriers via Distributed Resources on Massive Edge Devices](https://arxiv.org/abs/2503.08223)                    | Figure 6 | 9              | arXiv:2503.08223v3，2026-04-09；论文首次提交于 2025 年                     | [作者预印本 PDF（v3）](https://arxiv.org/pdf/2503.08223v3#page=9)                                         |
| [Model Tailor: Mitigating Catastrophic Forgetting in Multi-modal Large Language Models](https://proceedings.mlr.press/v235/zhu24l.html)                    | Figure 2 | 4              | ICML 2024 / PMLR 235 正式会议版                                            | [PMLR 正式版 PDF](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zhu24l/zhu24l.pdf#page=4) |
| [Federated mutual learning: a collaborative machine learning method for heterogeneous data, models, and objectives](https://doi.org/10.1631/FITEE.2300098) | Figure 2 | 6；印刷页 1395 | FITEE 正式期刊版，2023，24(10):1390–1402                                   | [期刊正式版 PDF](https://jzus.zju.edu.cn/opentxt.php?doi=10.1631/FITEE.2300098#page=6)                    |

## 本地文件与图示内容

| 文件                                             | 尺寸        | 图示内容                                                          |
| ------------------------------------------------ | ----------- | ----------------------------------------------------------------- |
| `public/images/papers/fedeve-2025.webp`          | 1796 × 771  | 服务端预测与客户端观测的贝叶斯融合，以及 FedEve 的预测—观测流程。 |
| `public/images/papers/fedmcon-journal-2025.webp` | 2146 × 1067 | 元学习、反馈控制系统与联邦聚合的三个对应视角。                    |
| `public/images/papers/lora-lego-2025.webp`       | 1400 × 1162 | LoRA 最小语义单元的分组、聚类与重构。                             |
| `public/images/papers/llm-scaling-2025.webp`     | 1636 × 755  | 全球边缘设备上的小模型协同训练大语言模型。                        |
| `public/images/papers/model-tailor-2024.webp`    | 1868 × 476  | 识别模型补丁，并通过补偿修饰保留原有能力。                        |
| `public/images/papers/fml-2023.webp`             | 1828 × 924  | 本地个性化模型与共享 meme 模型之间的深度互学习。                  |

原论文及图示的作者、出版信息由上方论文链接标注。裁剪后的图片不构成新的研究结果，也不改变原图的内容含义。核对日期：2026-10-02。

研究区的交互 loss landscape 由 `src/LossLandscape.jsx` 独立实现，用于呈现研究方向及其联系；它没有使用上述论文的实验数据。论文原图与 loss landscape 的来源分别记录。

原始 PDF 与本地编辑记录不包含在网站构建产物中。
