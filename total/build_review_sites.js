const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const SUBJECT1_HTML = path.join(ROOT, 'subject1_exam_detailed_guide.html');
const SAMPLE_GUIDE_HTML = path.join(ROOT, 'ipas_subject1_3_guide.html');
const TOTAL_HTML = path.join(ROOT, 'ipas_total_review.html');
const OUTPUT_SUBJECT1 = path.join(ROOT, 'subject1_exam_detailed_guide.html');
const OUTPUT_SUBJECT3 = path.join(ROOT, 'subject3_exam_detailed_guide.html');
const OUTPUT_TOTAL = path.join(ROOT, 'ipas_total_review.html');

const SUBJECT1_MEMORY = {
  1: { memoryTip: '情感分析就是判斷文字情緒，不是翻譯也不是摘要。', mnemonic: '情感看情緒' },
  2: { memoryTip: 'Transformer 翻譯強在自注意力能抓長距上下文。', mnemonic: '長文靠注意' },
  3: { memoryTip: 'BERT 的 MLM 是隨機遮詞，再用雙向上下文猜回來。', mnemonic: '遮詞雙向猜' },
  4: { memoryTip: 'Word2Vec 重預測，GloVe 重共現統計。', mnemonic: '預測對共現' },
  5: { memoryTip: 'TF-IDF 遇長文本時，詞頻偏高可能掩蓋真正關鍵詞。', mnemonic: '長文 TF 易膨脹' },
  6: { memoryTip: 'N-gram 只看固定窗口，所以抓不住長距依賴。', mnemonic: 'N 元只看近' },
  7: { memoryTip: 'IoU 閾值越高，代表框要更重疊才算對。', mnemonic: 'IoU 高更嚴' },
  8: { memoryTip: 'Softmax 轉機率分布，Max-Pooling 只留區域最大值。', mnemonic: '軟分布硬取大' },
  9: { memoryTip: '資料增強若破壞原始語意，模型表現反而會下降。', mnemonic: '增強勿變義' },
  10: { memoryTip: '要同時顧 Precision 和 Recall，就看 F1。', mnemonic: '精召看 F1' },
  11: { memoryTip: 'DBSCAN 兩大參數就是 epsilon 與 MinPts。', mnemonic: '密度靠 ε 與點數' },
  12: { memoryTip: '多重共線性嚴重時，可用 PCA 先把相關特徵轉正交。', mnemonic: '共線先做 PCA' },
  13: { memoryTip: 'Kubernetes 主要做部署、擴展、協調與運行管理。', mnemonic: 'K8s 管部署' },
  14: { memoryTip: '超參數調整怕過擬合，就用交叉驗證挑最穩設定。', mnemonic: '調參先交叉' },
  15: { memoryTip: 'Model Registry 是模型版本與部署狀態的管理中心。', mnemonic: '模型版本倉' },
  16: { memoryTip: 'Seq2Seq 最典型就是翻譯、摘要這種序列轉序列任務。', mnemonic: '序到序做轉寫' },
  17: { memoryTip: 'RAG 檢索最怕只語意像，但其實不回答問題。', mnemonic: '像不等於對' },
  18: { memoryTip: 'Attention 太平均時，可用稀疏化讓模型重新聚焦。', mnemonic: '注意太散就稀疏' },
  19: { memoryTip: '低資源語言常靠 Back-Translation 擴充偽平行語料。', mnemonic: '低資源靠回譯' },
  20: { memoryTip: 'GAN 模式崩潰常用 WGAN 損失來改善。', mnemonic: '崩潰換 WGAN' },
  21: { memoryTip: '多模態缺資料時，最穩的是讓模型天生能處理模態缺失。', mnemonic: '缺模態先容錯' },
  22: { memoryTip: '偵測資料漂移就是比新舊分布差異，例如 KL divergence。', mnemonic: '漂移看分布' },
  23: { memoryTip: '高風險 AI 上線最好先小範圍試點，再逐步擴張。', mnemonic: '先小後大' },
  24: { memoryTip: '對抗樣本是模型脆弱性問題，不是防火牆就能解。', mnemonic: '模型攻擊非網攻' },
  25: { memoryTip: '著作權風險最根本的防線在訓練資料授權治理。', mnemonic: '版權先管資料' },
  26: { memoryTip: '多重共線性下，LASSO 可穩定係數又兼做特徵選擇。', mnemonic: '共線選 LASSO' },
  27: { memoryTip: 'JSON 日誌先遞迴展開，再依時間窗做聚合特徵最實務。', mnemonic: '展欄再聚時窗' },
  28: { memoryTip: '混合型資料要分開處理：連續縮放、類別編碼，再做交互。', mnemonic: '連續縮放類別編碼' },
  29: { memoryTip: 'CI 的核心是每次提交都自動 build、test、lint。', mnemonic: '提交即驗證' },
  30: { memoryTip: '不可否認性靠雜湊加數位簽章，不靠效能或備援。', mnemonic: '雜湊加簽章' },
  31: { memoryTip: '高流量 AI 服務要靠水平擴展與自動伸縮，不靠單機硬撐。', mnemonic: '高流量靠橫擴' },
  32: { memoryTip: '要提早發現模型衰退，優先盯輸入分布漂移指標。', mnemonic: '先盯漂移 PSI' },
  33: { memoryTip: 'Word2Vec 想學低頻詞，Skip-gram 往往比 CBOW 更有利。', mnemonic: '低頻用 Skip-gram' },
  34: { memoryTip: '要同時分像素類別又分個體，就選全景分割。', mnemonic: '類別個體全都分' },
  35: { memoryTip: 'CLIP 的關鍵是把圖和文拉到同一嵌入空間做零樣本辨識。', mnemonic: '圖文同空間' },
  36: { memoryTip: '題目強調系統化測試多組參數時，通常就是 Grid Search。', mnemonic: '系統化就網格' },
  37: { memoryTip: '顯存不夠時，先想縮小 batch 並把負載分散。', mnemonic: '顯存爆先縮批' },
  38: { memoryTip: 'Stable Diffusion 想要更細緻，多半先加步數與換好 sampler。', mnemonic: '清晰加步數' },
  39: { memoryTip: 'ARIMA 殘差還有自相關，代表模型還沒抓完時序結構。', mnemonic: '殘差不白要重調' },
  40: { memoryTip: 'VAE、GAN、Diffusion 三者差別重點在生成機制，不只是解碼器。', mnemonic: '三模三機制' },
  41: { memoryTip: '同一份交叉驗證資料又拿來選參又拿來報分，會太樂觀。', mnemonic: '選參評估要分開' },
  42: { memoryTip: '新資料分布變了，先做 drift detection，不是先亂加模型容量。', mnemonic: '分布變先偵測' },
  43: { memoryTip: '要比資料利用效率，就看不同標註比例下誰掉分較少。', mnemonic: '少標註比真功' },
  44: { memoryTip: '同時要預測又要生成虛擬樣本，就要上生成模型。', mnemonic: '要生成選 VAE/GAN' },
  45: { memoryTip: 'PCA 不保證更準，但常能加速訓練並降低過擬合。', mnemonic: '降維省時降噪' },
  46: { memoryTip: 'MLOps 對 drift 要做持續監測，而不是等準確率掉了才補救。', mnemonic: '漂移即時監測' },
  47: { memoryTip: '多任務互相拉扯時，常是 loss 權重沒平衡。', mnemonic: '多任務平 loss' },
  48: { memoryTip: 'DBSCAN 慢通常卡在鄰近點搜尋，可用 KD-Tree 或 Ball Tree。', mnemonic: '分群慢先索引' },
  49: { memoryTip: '跨語言與族群偏差，多半是資料代表性問題，不是靠 embedding 正規化解決。', mnemonic: '偏差多半在資料' },
  50: { memoryTip: '主題對但細節錯，常是圖文嵌入對齊還不夠精準。', mnemonic: '大意對細節偏' }
};

const SUBJECT3_DATA = [
  { no: 1, answer: 'B', question: '某零售企業建立一個銷售預測模型，希望評估該模型在不同月份的新資料上，是否仍能維持穩定的預測表現。資料科學團隊計畫利用統計方法檢驗模型對未觀察資料的適應能力與泛化效果。下列哪一種方法最適合用於此目的？', options: { A: 'F檢定（F-test）', B: '交叉驗證（Cross-Validation）', C: '配對樣本t檢定（Paired-sample t-test）', D: '卡方檢定（Chi-square Test）' }, explanation: '題目重點在評估模型對未觀察資料的泛化能力，最標準的方法就是交叉驗證，因此答案為 B。它可透過不同資料切分反覆驗證模型穩定性，比單次切分更能反映實際表現。', notes: ['交叉驗證常用來估計模型泛化誤差。', 'F 檢定、t 檢定、卡方檢定主要是統計假設檢定。'], memoryTip: '看到「泛化能力、未觀察資料、穩定表現」就先想到交叉驗證。', mnemonic: '泛化先交叉' },
  { no: 2, answer: 'C', question: '在建立迴歸或分類模型時，若希望避免模型過度擬合（Overfitting），可透過加入正則化項以限制模型的複雜度。其中，L1正則化（Lasso）的主要效果為何？', options: { A: '增加模型參數的數量，以提升表現靈活度', B: '強化梯度穩定性，避免參數更新過度震盪', C: '產生稀疏模型（Sparse Model），使部分參數權重收斂為零', D: '提高學習率（Learning Rate），加速模型收斂速度' }, explanation: 'L1 正則化會把部分係數壓到 0，形成稀疏模型，所以答案是 C。這不只可降低過擬合，也常兼具特徵選擇效果。', notes: ['L1 常對不重要特徵直接歸零。', 'L2 會縮小權重，但通常不會直接變成 0。'], memoryTip: 'L1 最好記的關鍵字就是「稀疏、歸零、選特徵」。', mnemonic: 'L1 會歸零' },
  { no: 3, answer: 'C', question: '在訓練非線性模型時，若目標函數為非凸函數（Non-convex Function），演算法在參數更新過程中可能出現多個極值點，導致最佳化結果不穩定。請問此時最可能發生下列哪一種情況？', options: { A: '梯度消失', B: '資料過少', C: '局部最優解', D: '過擬合' }, explanation: '非凸函數常有多個局部極值，因此最佳化過程容易卡在局部最優解，答案為 C。這是非凸最佳化最典型的風險之一。', notes: ['非凸問題不保證一定找到全域最優。', '深度學習最佳化常需靠初始化與優化技巧改善。'], memoryTip: '看到「非凸、多個極值點」就聯想到容易卡在局部最優。', mnemonic: '非凸卡局部' },
  { no: 4, answer: 'B', question: '在執行 DBSCAN（Density-Based Spatial Clustering of Applications with Noise）群集分析時，若某資料點鄰域內的樣本數不足以形成核心點（Core Point），且該點未被任何核心點的鄰域所包含，也未與其他群集形成密度可達關係（Density Reachability），此資料點最終將被歸類為哪一種類型？', options: { A: '鄰近點（Neighbor Point）', B: '雜訊點（Noise Point）', C: '邊界點（Border Point）', D: '潛在點（Potential Point）' }, explanation: '題目描述的是既不是核心點，也不屬於任何核心點可達範圍的資料點，因此會被視為雜訊點，答案是 B。DBSCAN 的特色之一就是能把離群點直接標成 noise。', notes: ['核心點需滿足鄰域內最小樣本數。', '邊界點雖不是核心點，但仍落在核心點鄰域內。'], memoryTip: 'DBSCAN 中「不成群、不可達」通常就是雜訊。', mnemonic: '不成群即雜訊' },
  { no: 5, answer: 'A', question: '某智慧製造公司開發一套影像辨識系統，用於自動檢測生產線上的瑕疵產品。系統採用卷積神經網路（Convolutional Neural Network, CNN）作為主要模型架構，其中第一層卷積層（Convolutional Layer）主要負責的功能為下列何者？', options: { A: '自動提取輸入影像中的局部特徵', B: '降低影像維度以加速運算效率', C: '增加神經元與參數數量以提升模型容量', D: '整合所有特徵並輸出最終分類結果' }, explanation: 'CNN 的卷積層核心工作是擷取局部特徵，例如邊緣、紋理與局部形狀，因此答案是 A。第一層通常學到較低階的視覺特徵。', notes: ['卷積核會在影像上滑動做局部運算。', '最終分類通常由後段全連接層或分類頭完成。'], memoryTip: '卷積層先看局部，小範圍抓特徵。', mnemonic: '卷積抓局部' },
  { no: 6, answer: 'C', question: '某智慧城市團隊開發一套交通監控系統，用於即時辨識路口監視器影像中的車輛與行人。團隊比較後發現，卷積神經網路（Convolutional Neural Network, CNN）在訓練與推論效率上，明顯優於傳統的全連接神經網路（Fully Connected Neural Network, FCNN）。請問下列何者為主要原因？', options: { A: 'CNN 能自動學習影像的旋轉與比例不變性', B: 'CNN 可直接跳過人工特徵提取步驟進行分類', C: 'CNN 透過區域感知（Local Receptive Field）與參數共享（Parameter Sharing）機制，降低模型參數量與運算複雜度', D: 'CNN 捨棄激勵函數（Activation Function），以加快運算速度' }, explanation: 'CNN 比 FCNN 更適合影像，關鍵就在局部感受野與參數共享，因此答案是 C。它能用較少參數處理高維影像資料，效率自然更好。', notes: ['參數共享讓同一組卷積核可重複掃描整張圖。', 'FCNN 直接展平影像時參數量通常非常大。'], memoryTip: '影像任務選 CNN，常因局部感知加參數共享。', mnemonic: '局部共享省參數' },
  { no: 7, answer: 'A', question: '下列哪一種應用最適合採用長短期記憶網路（Long Short-Term Memory, LSTM）模型？', options: { A: '預測未來七天的電力需求變化趨勢', B: '辨識監視影像中不同類別的物件', C: '將大量顧客資料依相似特徵自動分群', D: '將高維度的感測器資料壓縮成低維表示' }, explanation: 'LSTM 特別擅長處理時間序列與長短期依賴，因此最適合拿來做電力需求預測，答案是 A。題幹中的「未來七天趨勢」就是典型時序任務。', notes: ['LSTM 是 RNN 的改良版本。', '影像辨識更常見 CNN，分群則屬非監督學習。'], memoryTip: '看到「未來趨勢、時序預測」就優先聯想到 LSTM。', mnemonic: '時序找 LSTM' },
  { no: 8, answer: 'D', question: '資訊增益（Information Gain）常用於衡量特徵對分類結果的不確定性貢獻程度，並據以進行特徵選擇。此方法主要應用於下列哪一類模型架構中？', options: { A: '使用 L1 正則化進行特徵篩選的線性模型', B: '利用激活函數（Activation Function）進行特徵擷取的深度神經網路', C: '透過核函數（Kernel Function）將特徵映射至高維空間的分類模型', D: '透過遞迴分裂方式建立分類規則的決策樹模型' }, explanation: '資訊增益是決策樹選分裂特徵時最經典的指標之一，因此答案是 D。它衡量分裂後不確定性減少多少。', notes: ['資訊增益與熵（Entropy）概念密切相關。', 'ID3、C4.5 等樹模型常用此類指標。'], memoryTip: '只要看到資訊增益，通常就是在想決策樹怎麼分裂。', mnemonic: '資訊增益選樹枝' },
  { no: 9, answer: 'A', question: '在建構以距離為基礎的機器學習模型（如KNN、SVM）時，下列哪一項資料前處理方式最為關鍵？', options: { A: '進行特徵縮放（Feature Scaling），使各特徵變數具有相似的數值範圍', B: '將連續型特徵變數轉換為類別型變數', C: '以平均值或中位數進行缺失值補齊', D: '進行隨機抽樣以平衡資料筆數' }, explanation: 'KNN、SVM 這類模型很依賴距離或內積，若各特徵尺度差太大會讓某些欄位主導結果，因此答案是 A。先做特徵縮放通常是必要步驟。', notes: ['KNN 對尺度特別敏感。', 'SVM 尤其在使用 RBF kernel 時也常先做標準化。'], memoryTip: '凡是「距離型模型」，先想縮放再想建模。', mnemonic: '距離先縮放' },
  { no: 10, answer: 'C', question: '下列哪一種應用情境最適合導入AutoML，以提升模型開發效率？', options: { A: '公司已有完整的MLOps平台與資深資料科學團隊，模型更新採固定流程', B: '製造部門的生產良率模型已長期穩定運作，只需定期調整參數', C: '行銷部門希望在短時間內比較多種顧客流失預測模型，缺乏專職工程師與時間進行手動建模', D: '財務部門正在開發高度客製化的信用風險評估模型，需要精細控制特徵工程與演算法細節' }, explanation: 'AutoML 最適合在時間緊、資源有限、又想快速比較多模型時使用，因此答案是 C。若需求高度客製化，反而常需要手動精調。', notes: ['AutoML 可自動處理模型選擇與部分調參。', '高度監管或高度客製場景通常仍需人工主導。'], memoryTip: '沒時間、沒專職工程師、要快比模型，AutoML 最有價值。', mnemonic: '快比模型用 AutoML' },
  { no: 11, answer: 'D', question: '相較於Grid Search，Random Search在超參數調整上具備哪一項主要優勢？', options: { A: '可自動產生模型架構', B: '可使用更大的訓練集', C: '避免模型過擬合', D: '能更有效率搜尋高維參數空間' }, explanation: '在高維超參數空間中，Random Search 往往比 Grid Search 更有效率，因此答案是 D。因為它不會把大量計算浪費在不敏感的維度上。', notes: ['Grid Search 會完整枚舉所有組合。', 'Random Search 在有限預算下常更划算。'], memoryTip: '參數維度一多，隨機搜尋通常比網格更省。', mnemonic: '高維用隨機' },
  { no: 12, answer: 'C', question: '某智慧製造公司開發一套設備故障預測系統，利用感測器資料訓練深度神經網路（Deep Neural Network, DNN）模型，以提前偵測異常運作跡象。在訓練過程中，團隊發現模型收斂速度不穩定：有時過快導致過擬合，有時又遲遲無法達到最佳準確率。開發團隊可以藉由調整下列哪一項超參數（Hyperparameter）以改善此問題？', options: { A: '每個神經元的輸出結果', B: '損失函數（Loss Function）在訓練過程中的梯度變化值（Gradient）', C: '學習率（Learning Rate），控制模型權重更新的速度', D: '模型在訓練後產生的權重值' }, explanation: '題目描述的是收斂太快或太慢的問題，最直接該調的是學習率，因此答案是 C。學習率過大可能震盪或過快貼合，過小則收斂過慢。', notes: ['學習率是最重要的訓練超參數之一。', '權重與梯度是訓練過程產物，不是此處主要可調超參數。'], memoryTip: '收斂快慢不穩，先查 learning rate。', mnemonic: '快慢看學習率' },
  { no: 13, answer: 'B', question: '標籤偏差(Label Bias)通常是因為什麼原因造成？', options: { A: '訓練資料量過大', B: '標記資料本身帶有主觀偏見', C: '模型結構設計不當', D: '特徵數量設定過多' }, explanation: '標籤偏差的根源多半來自人工標註本身帶入主觀偏見，所以答案是 B。也就是標籤從一開始就偏了，模型只會把偏差學得更穩。', notes: ['資料偏差可出現在抽樣、特徵與標註多個環節。', '標籤偏差常見於醫療、內容審核與社會資料。'], memoryTip: 'Label bias 先想「人怎麼標、標的人有沒有偏見」。', mnemonic: '標籤偏在人' },
  { no: 14, answer: 'C', question: '下列哪一種AI應用情境中，模型的可解釋性（Explainability）最為關鍵？', options: { A: '電商平台利用深度學習模型預測用戶的下一次購買時間，以優化推播行銷策略', B: '新創公司使用機器學習演算法自動調整廣告出價策略，以提升點擊轉換率', C: '醫院導入AI模型分析病患影像並給出腫瘤惡性可能性，作為臨床醫師診斷依據', D: '銀行導入AI模型預測客戶流失率，並自動推薦留客優惠方案' }, explanation: '醫療診斷涉及高風險決策與臨床責任，可解釋性特別重要，因此答案是 C。醫師需要理解模型依據，不能只接受黑箱結論。', notes: ['高風險領域常要求可解釋與可追溯。', '醫療、金融、司法都特別重視 AI 可解釋性。'], memoryTip: '只要牽涉人命或重大風險，就把 explainability 權重拉高。', mnemonic: '高風險重解釋' },
  { no: 15, answer: 'B', question: '在線性迴歸模型中，若R²值為0.85，其意義為何？', options: { A: '模型準確率為85%', B: '85%的變異可被模型解釋', C: '預測誤差為15%', D: '模型有85%的信心水準' }, explanation: 'R² 代表模型能解釋目標變異的比例，因此 0.85 表示 85% 的變異可由模型解釋，答案是 B。它不是分類準確率，也不是信心水準。', notes: ['R² 常用於迴歸，不用於分類準確率。', 'R² 高不代表模型一定沒有偏誤。'], memoryTip: 'R² 的關鍵字就是「解釋變異比例」。', mnemonic: 'R平方解變異' },
  { no: 16, answer: 'A', question: '在二元分類問題中，若精確率（Precision）為0.8，召回率（Recall）為0.6，則F1分數（F1 Score）為何？', options: { A: '0.686', B: '0.700', C: '0.720', D: '0.750' }, explanation: 'F1 = 2PR / (P + R) = 2 × 0.8 × 0.6 / 1.4 = 0.6857，約為 0.686，因此答案是 A。這題是標準公式計算題，考場上要熟背。', notes: ['F1 是 Precision 與 Recall 的調和平均。', '類別不平衡時常比 Accuracy 更有參考價值。'], memoryTip: 'F1 公式直接背：2PR 除以 P+R。', mnemonic: '二PR除總和' },
  { no: 17, answer: 'B', question: '下列哪一種優化演算法內建動量（Momentum）的設計機制？', options: { A: 'SGD+Momentum', B: 'Adam', C: 'RMSProp', D: 'Adagrad' }, explanation: 'Adam 結合了一階動量與二階動量估計，因此屬於內建 momentum 機制的代表方法，答案是 B。SGD+Momentum 也有動量，但題幹強調「內建設計機制」時通常指 Adam。', notes: ['Adam 同時用到一階與二階矩估計。', 'Adagrad、RMSProp 側重自適應學習率。'], memoryTip: '看到「內建動量」最常直覺聯想到 Adam。', mnemonic: 'Adam 帶動量' },
  { no: 18, answer: 'A', question: '下列何者最能同時反映XGBoost（eXtreme Gradient Boosting）相較於傳統梯度提升決策樹（Gradient Boosting Decision Tree, GBDT）的主要技術改進？', options: { A: '引入正則化項（Regularization）以抑制過擬合，並支援缺失值自動處理與並行化訓練', B: '改以隨機森林（Random Forest）架構取代樹模型以提升準確率', C: '以類神經網路（Neural Network）取代弱分類器（Weak Learners）', D: '採用批次正規化（Batch Normalization）技術提升模型穩定性' }, explanation: 'XGBoost 的經典優勢就是正則化、缺失值處理、並行化與工程最佳化，因此答案為 A。其他選項都不是 XGBoost 的核心改進方向。', notes: ['XGBoost 是強化版的 boosting tree。', '在表格型資料上常有非常強的表現。'], memoryTip: 'XGBoost 要記「正則化、缺值、並行」三件事。', mnemonic: '正缺並三強' },
  { no: 19, answer: 'C', question: '某醫療機構開發疾病早期偵測模型，正樣本（確診病例）僅佔 3%。在模型訓練與評估過程中，下列哪一種作法最不適合用於提升對少數類病例的預測能力？', options: { A: '使用SMOTE 過採樣', B: '調整類別權重', C: '使用準確率（Accuracy）作為評估指標', D: '欠採樣多數類(Undersampling the majority class)' }, explanation: '當正樣本只有 3% 時，Accuracy 很容易被多數類誤導，因此最不適合的是 C。這種情境應更重視 Recall、F1、PR-AUC 等指標。', notes: ['類別極不平衡時 Accuracy 常失真。', 'SMOTE 與 class weight 都是常見不平衡處理法。'], memoryTip: '少數類問題最怕只看 Accuracy。', mnemonic: '少數別看準確率' },
  { no: 20, answer: 'C', question: '某電子商務公司為開發商品評論情感分析模型，希望模型能捕捉評論中不同特徵之間的關聯影響，例如「商品價格」與「顧客滿意度」的互動效果。下列哪一種特徵工程設計方式最適合用於建立互動特徵（Interaction Features）？', options: { A: '將單一特徵取平方', B: '對所有特徵進行對數轉換', C: '將兩個或多個特徵進行乘積或交互組合', D: '對特徵進行標準化' }, explanation: '互動特徵的本質就是刻畫特徵之間聯合作用，因此答案是 C。最常見做法就是做乘積、交叉項或組合項。', notes: ['交互項常見於線性模型與特徵工程。', '單一特徵平方屬非線性轉換，不等於互動。'], memoryTip: '看到 interaction feature，就想兩個特徵一起作用。', mnemonic: '互動靠交乘' },
  { no: 21, answer: 'C', question: '某語音辨識系統開發團隊採用 Transformer 架構，為了讓模型能同時理解語音片段中的發音特徵、語速變化與語意脈絡等多層次資訊，團隊在設計中導入了多頭注意力（Multi-head Attention）機制。請問下列何者為此機制的主要優點？', options: { A: '減少模型參數量以降低訓練成本', B: '加速整體注意力計算過程', C: '從不同表示子空間（Representation Subspaces）同時捕捉多樣化關聯資訊', D: '避免梯度消失（Gradient Vanishing）問題' }, explanation: '多頭注意力能讓不同頭從不同子空間同時學習多種關聯，因此答案是 C。這也是 Transformer 能捕捉多層次訊息的重要原因。', notes: ['每個 head 可學不同關注模式。', '多頭注意力重點是表徵多樣性，不是單純加速。'], memoryTip: 'Multi-head 的關鍵不是多，而是「多角度看關係」。', mnemonic: '多頭多視角' },
  { no: 22, answer: 'B', question: '某電商平台希望預測顧客是否會購買特定商品。系統蒐集顧客的瀏覽紀錄、停留時間、商品類別偏好與過去購買行為，並以此推估「在觀察到這些行為特徵的情況下，該顧客會購買的機率」。若模型採用貝氏定理（Bayes’Theorem）進行推論，下列敘述何者最符合其核心運作機制？', options: { A: '根據歷史樣本自動分群，找出行為相似的顧客群', B: '以條件機率方式計算顧客屬於「會購買」或「不會購買」的分類機率', C: '以最小平方誤差（Mean Squared Error）為損失函數，預測顧客的購買金額', D: '依據回饋信號（Feedback Signal）透過強化學習（Reinforcement Learning）動態調整推薦策略' }, explanation: '貝氏定理的核心就是根據條件機率更新事件發生的機率，因此答案是 B。題目明講要估計在已知特徵下的購買機率，正是 Bayes 的思路。', notes: ['Naive Bayes 是常見分類模型。', 'Bayes 重點是先驗、似然與後驗機率。'], memoryTip: 'Bayes 幾乎都在考「已知條件下的機率更新」。', mnemonic: '貝氏算條件' },
  { no: 23, answer: 'A', question: '一家再生能源公司希望預測未來三個月太陽能發電量的波動範圍。由於氣候條件具有高度隨機性，且輸入變數（如日照時數、雲量、溫度）之間存在不確定關係，工程團隊決定以隨機抽樣方式模擬多種可能情境，以估算整體發電量的機率分佈與風險區間。請問此時所採用的技術最符合下列哪一種方法？', options: { A: '蒙地卡羅方法（Monte Carlo Method）', B: 'K-means聚類（K-means Clustering）', C: '支持向量迴歸（Support Vector Regression, SVR）', D: '特徵選取（Feature Selection）' }, explanation: '題幹強調用隨機抽樣模擬多種情境來估計分布與風險，這正是蒙地卡羅方法，答案是 A。它常用於處理高不確定性問題。', notes: ['Monte Carlo 核心是大量隨機模擬。', '常用於風險分析、金融、能源與機率估計。'], memoryTip: '看到「隨機抽樣模擬很多情境」就想 Monte Carlo。', mnemonic: '抽樣模擬蒙卡' },
  { no: 24, answer: 'C', question: '某房地產公司利用多元迴歸模型（Multiple Regression Model）預測房價，並繪製殘差圖（Residual Plot）檢查模型品質。結果顯示部分資料點的殘差極大，且在高價區樣本中出現系統性彎曲分佈現象。根據此觀察，下列何者為最可能的正確解釋？', options: { A: '模型過度擬合（Overfitting），導致在訓練資料上表現過好、泛化能力不足', B: '模型特徵數量不足，導致欠擬合（Underfitting）', C: '模型存在異常值（Outlier）或非線性關係，違反迴歸假設', D: '殘差圖呈現隨機分佈，表示模型已完全符合所有假設' }, explanation: '殘差若出現系統性彎曲與極端大殘差，通常代表有非線性關係或異常值，答案是 C。理想殘差圖應該接近隨機散布，而不是有明顯結構。', notes: ['殘差圖可檢查線性、變異齊一與異常值。', '有規律圖樣通常表示模型假設被破壞。'], memoryTip: '殘差有圖樣，不是好事，常表示模型假設出問題。', mnemonic: '殘差有形就有病' },
  { no: 25, answer: 'A', question: '某金融機構正在建立傳統信用評分卡模型，採用邏輯迴歸（Logistic Regression）作為建模方法，並依循監理機關建議的標準化流程進行模型開發。下列哪一項不是傳統信用評分卡模型開發流程中的常見步驟？', options: { A: '使用生成式模型進行特徵學習', B: '進行特徵選擇與多重共線性（Multicollinearity）分析', C: '進行分箱（Binning）與資訊值（Information Value, IV）檢定', D: '使用樣本穩定性指標（Population Stability Index, PSI）檢驗模型穩定性' }, explanation: '傳統評分卡流程重視分箱、IV、共線性分析與穩定性檢查，不會以生成式模型做特徵學習，因此答案是 A。這題在考傳統 scorecard 的典型流程。', notes: ['評分卡常用 WOE、IV、PSI。', '傳統金融模型偏好可解釋與監管友善流程。'], memoryTip: '評分卡是傳統金融工法，不走生成式花路線。', mnemonic: '評分卡不玩生成' },
  { no: 26, answer: 'D', question: '在防止監督式學習模型過擬合（Overfitting）時，下列哪一種策略不屬於降低模型複雜度或限制學習能力的作法？', options: { A: '採用L1或L2正則化', B: '在訓練過程中使用Dropout 技術', C: '採取早期停止（Early Stopping）機制', D: '擴增輸入特徵變數以提升模型表達能力' }, explanation: '正則化、Dropout、Early Stopping 都是在限制模型學習能力，但增加特徵通常會提升表達能力，不屬於降低複雜度，因此答案是 D。這反而可能讓模型更容易過擬合。', notes: ['降複雜度的核心是限制自由度。', '特徵越多不一定越好，也可能帶入噪音。'], memoryTip: '防過擬合在做減法，不是在做加法。', mnemonic: '防過擬合先減法' },
  { no: 27, answer: 'D', question: '某智慧製造團隊在開發瑕疵影像檢測模型時，發現使用線性激活函數（Activation Function）後，模型的訓練準確率長期停滯，懷疑模型無法學習到足夠複雜的特徵表達。若要改善此問題，下列哪一項調整方案最為合適？', options: { A: '增加卷積層（Convolutional Layer）數量，使網路更深以強化特徵提取', B: '將輸入影像先進行灰階化處理，降低運算量', C: '使用Sigmoid 激活函數，以將輸出壓縮至[0,1]範圍', D: '改用ReLU（Rectified Linear Unit）激活函數，以引入非線性並提升模型表達能力' }, explanation: '若一直用線性激活，深層網路的非線性表達能力會不足，因此改用 ReLU 才是關鍵，答案為 D。ReLU 能有效引入非線性且訓練上通常較穩定。', notes: ['深度網路若缺乏非線性，堆深效果有限。', 'ReLU 是 CNN 中最常見的活化函數之一。'], memoryTip: '模型學不到複雜特徵，先檢查有沒有足夠非線性。', mnemonic: '表達不夠換 ReLU' },
  { no: 28, answer: 'C', question: '一家零售電商公司希望建立顧客流失預測模型，用以判斷哪些會員可能在三個月內不再消費。團隊以去年會員資料進行訓練，並僅採用「曾經購買三次以上」的活躍顧客紀錄作為樣本。模型上線後，對整體會員進行預測時，發現模型對於新註冊會員與低消費會員的預測準確率明顯偏低。下列何者為造成此現象最可能的原因？', options: { A: '特徵設計未排除與會員忠誠度高度相關的變數，導致特徵偏差（Feature Bias）', B: '標記（Label）由人工標註，導致標籤偏差（Label Bias）', C: '訓練樣本僅涵蓋高活躍顧客，造成取樣偏差（Sampling Bias）', D: '模型未進行超參數調整，導致過擬合（Overfitting）' }, explanation: '訓練資料只含高活躍會員，卻拿去預測整體會員，代表樣本代表性不足，屬取樣偏差，因此答案是 C。模型沒看過新會員與低消費會員，自然難以泛化。', notes: ['Sampling bias 會讓訓練分布與部署分布不一致。', '樣本代表性不足是很多上線失敗的根因。'], memoryTip: '訓練樣本只挑特定族群，常直接導向 sampling bias。', mnemonic: '樣本偏，預測偏' },
  { no: 29, answer: 'D', question: '在工業設備故障預測專案中，模型訓練與超參數調整均依賴於一段歷史數據作為驗證集。然而，隨著設備運行環境與工況條件的變化，原有驗證集已無法充分反映現況，導致模型在實際部署後的預測準確率逐漸下降。下列哪一種策略最能有效提升模型在長期運行環境中的穩健性與泛化能力？', options: { A: '固定驗證集內容，並透過模型正則化技巧（如 L2 正則化）強化模型泛化', B: '將全部歷史資料納入訓練，不使用驗證集，依靠早期停止（Early Stopping）控制訓練', C: '簡化模型架構，減少模型參數數量以降低過擬合風險', D: '採用時間序列交叉驗證（Time Series Cross Validation）或滑動視窗驗證（Rolling Window Validation）方法，動態更新驗證資料以適應時間演進' }, explanation: '題目關鍵在資料分布會隨時間演進，因此最合適的是時間序列交叉驗證或滑動視窗驗證，答案是 D。這能更貼近真實部署情境。', notes: ['時序資料不可隨意打亂切分。', 'Rolling window 常用於金融、設備、需求預測。'], memoryTip: '資料會隨時間變，就要用時間感知的驗證法。', mnemonic: '時間資料用滑窗' },
  { no: 30, answer: 'C', question: '某情感分析模型在英文資料集上取得macro F1-score = 0.91。當該模型部署於西班牙文資料集時，F1-score 驟降至0.58。下列哪一項解釋最合理，且與F1-score 變化相關？', options: { A: 'macro F1-score 本身波動性高，建議改用 micro-average F1-score 評估', B: '模型在西班牙文語料上過度擬合，導致評估結果偏高', C: '語言轉移造成召回率（Recall）下降，模型無法正確辨識關鍵情緒詞彙', D: '以均方誤差（MSE）取代 F1-score 評估可獲得更準確的結果' }, explanation: '跨語言部署常出現語言轉移問題，造成情緒詞辨識失準與 Recall 下降，因此答案是 C。Recall 掉了，F1 自然會明顯下滑。', notes: ['Macro F1 對各類別一視同仁。', '跨語言遷移常受詞彙、語法與文化差異影響。'], memoryTip: '換語言後 F1 大跌，優先想語言轉移與召回下降。', mnemonic: '跨語言掉召回' },
  { no: 31, answer: 'B', question: '某能源公司利用歷史氣象與用電資料，開發長期電力需求預測模型，採用深度神經網路架構進行訓練。在訓練過程中，模型在訓練集上的損失值持續下降，但在驗證集上，損失在第80輪後開始波動，呈現週期性上升與下降。團隊懷疑模型受到季節性資料波動與隨機噪音影響，導致驗證損失難以穩定收斂。若要在此情境下合理運用早期停止法（Early Stopping）以確保模型具最佳泛化能力，下列哪一項策略最為適當？', options: { A: '直接根據訓練集損失最低點停止訓練，以確保模型充分擬合所有樣本', B: '監控驗證集損失並設定適度的耐心值（Patience），在連續多輪未改善後再停止訓練', C: '改以測試集損失作為早停依據，以提升模型最終評估一致性', D: '將所有資料重新合併後訓練至收斂，避免因資料分割導致評估波動' }, explanation: 'Early Stopping 的標準做法就是監控驗證集並設定 patience，因此答案是 B。這樣能避免因短暫波動就過早停止，也不會用到不該碰的測試集。', notes: ['訓練集損失不能代表泛化能力。', '測試集應保留到最後評估，不該拿來做早停。'], memoryTip: '早停一定盯驗證集，不盯訓練集，更不能盯測試集。', mnemonic: '早停看驗證' },
  { no: 32, answer: 'D', question: '某電信公司開發客戶流失預測模型，使用大量顧客行為特徵，例如通話時長、上網頻率、帳單金額、客服聯絡次數等。在訓練過程中，團隊發現部分特徵彼此高度相關，但同時也懷疑有些特徵對流失預測的貢獻度有限。若希望模型在避免過擬合（Overfitting）的同時，能自動篩選出較具代表性的特徵，採用下列哪一種方法最為合適？', options: { A: '使用早期停止法（Early Stopping）控制訓練回合數，避免過擬合（Overfitting）', B: '同時移除多重共線性特徵並採用L2正則化（Ridge），以確保模型穩定收斂', C: '僅使用L2正則化（Ridge），抑制所有權重幅度但保留全部特徵', D: '採用L1正則化（Lasso），透過懲罰項使部分特徵係數縮為0' }, explanation: '題目要的是兼顧防過擬合與自動篩特徵，最符合的就是 L1 正則化，因此答案是 D。Lasso 會把不重要特徵壓成 0，保留較代表性的欄位。', notes: ['L1 有特徵選擇效果。', 'L2 主要縮小係數，但通常不會直接淘汰特徵。'], memoryTip: '要「自動篩特徵」就優先想到 L1/Lasso。', mnemonic: '要篩特徵選 L1' },
  { no: 33, answer: 'B', question: '某資料科學團隊正在開發一個客戶相似度比對系統，用於計算所有客戶之間的相似度分數。若系統需逐一比對每一位客戶與其他所有客戶的資料組合，此時演算法的時間複雜度最可能為哪一種？其代表意義為何？', options: { A: 'O(n) — 執行時間與資料量成線性關係', B: 'O(n²) — 執行時間與資料量平方成正比', C: 'O(1) — 執行時間固定不變', D: 'O(log n) — 執行時間與資料量呈對數成長關係' }, explanation: '若每位客戶都要跟其他所有客戶逐一比對，就是典型兩兩組合，複雜度為 O(n²)，答案是 B。資料量一大，計算成本會迅速上升。', notes: ['pairwise comparison 常見平方級成長。', '複雜度觀念在相似度計算與分群很重要。'], memoryTip: '兩兩全比對，幾乎都先猜平方級。', mnemonic: '兩兩比平方' },
  { no: 34, answer: 'D', question: '某醫療人工智慧團隊正在開發心臟病風險預測模型，資料量僅有150筆，其中陽性個案不到8%。由於樣本數稀少且類別分布極不平衡，團隊希望在有限資料下，仍能準確評估模型在不同資料上的表現穩定性，同時避免訓練資料被過度切分而影響模型效能。若團隊希望在有限樣本下，同時兼顧資料的利用率與各類別在驗證折中的比例一致性，最適合採用下列哪一種交叉驗證方法？', options: { A: '5-Fold交叉驗證（5-Fold Cross Validation）', B: '留一法交叉驗證（Leave-One-Out Cross Validation）', C: '隨機交叉驗證（Random Cross Validation）', D: '分層留一法交叉驗證（Stratified Leave-One-Out Cross Validation）' }, explanation: '資料少又極度不平衡時，要盡量利用資料並維持類別比例，分層留一法最貼題，因此答案是 D。題幹特別強調樣本利用率與比例一致性，這正是關鍵。', notes: ['分層可維持各折類別比例。', '樣本極少時，留一法能最大化訓練資料利用。'], memoryTip: '少樣本又不平衡，要同時想到「分層」和「盡量用滿資料」。', mnemonic: '少又偏，用分層留一' },
  { no: 35, answer: 'A', question: '某公司針對製程感測器資料進行主成分分析（PCA），經標準化與協方差矩陣分解後，得到三個主成分的特徵值如下：λ1=6.0, λ2=3.0, λ3=1.0。若團隊決定僅保留能解釋至少 80% 總變異量的主成分，以進行後續模型建構，下列哪一項敘述最合理且數據解讀正確？', options: { A: '前兩個主成分合計解釋90%的總變異量，因此可安全降維至二維，且仍保留大部分資訊', B: '第一主成分解釋60%的變異量，表示資料結構呈現明顯線性關係，僅保留一維即可避免過擬合', C: '雖然前兩個主成分可解釋超過 80% 變異量，但第二主成分貢獻仍高達30%，不宜捨棄第三主成分', D: '三個特徵值相差不大，顯示各主成分變異均衡，降維可能導致資訊損失' }, explanation: '總變異量為 10，前兩個主成分合計 9，因此解釋率為 90%，答案是 A。既然門檻是至少 80%，保留兩個主成分已足夠。', notes: ['PCA 解釋率 = 主成分特徵值 / 總特徵值。', 'PCA 常用累積解釋變異決定保留維度。'], memoryTip: 'PCA 題先把特徵值加總，再算累積比例。', mnemonic: '先總和再累積' },
  { no: 36, answer: 'D', question: '某銀行計畫與多家合作機構共同訓練一個AI信用風險預測模型，為避免客戶交易資料在傳輸與運算過程中外洩，技術團隊評估使用同態加密（Homomorphic Encryption）技術。下列何者最能正確描述同態加密在此應用中的關鍵特性？', options: { A: '系統以隨機雜訊（Noise）干擾輸出，確保統計結果不洩漏個資', B: '各參與銀行透過安全通道交換私鑰，確保模型參數一致', C: '將原始資料壓縮並同時加密，以減少加密後資料量與運算時間', D: '資料在加密狀態下仍可進行數值運算，模型訓練可於未解密資料上完成' }, explanation: '同態加密最核心的特性，就是資料不解密也能直接運算，因此答案為 D。這使得敏感資料可在隱私保護下參與計算。', notes: ['Homomorphic Encryption 是隱私計算的重要技術。', '其代價通常是計算成本高。'], memoryTip: '同態加密最常考的句子就是「密文上可運算」。', mnemonic: '密文也能算' },
  { no: 37, answer: 'B', question: '某跨銀行風控平台希望整合多家銀行的用戶行為資料，用於訓練信用風險預測模型。由於競爭與法規限制，各銀行僅願意提供加密後資料，且資料在任何時間不得被平台解密。同時，平台需建立安全通訊協議以確保資料在傳輸過程未被竄改或重放。下列哪一組技術最能完整對應上述需求？', options: { A: '對稱加密（Symmetric Encryption）＋ 單向雜湊（Hash Function）＋ 非對稱加密（Asymmetric Encryption）＋ 差分隱私（Differential Privacy）', B: '同態加密（Homomorphic Encryption）＋ 非對稱加密（Asymmetric Encryption）＋ 單向雜湊（One-way Hash Function）＋ 對稱加密（Symmetric Encryption）', C: '差分隱私（Differential Privacy）＋ 對稱加密（Symmetric Encryption）＋ 同態加密（Homomorphic Encryption）＋ 數位簽章（Digital Signature）', D: '同態加密（Homomorphic Encryption）＋ 安全多方計算（Secure Multi-party Computation, MPC）＋ 雜湊函數（Hash Function）＋ 對稱加密（Symmetric Encryption）' }, explanation: '題目需求包含密文運算、金鑰交換/安全傳輸、完整性檢查與高效率通道保護，最完整對應的是 B。也就是用同態加密處理密文運算，再搭配非對稱、雜湊與對稱加密處理通訊安全。', notes: ['對稱加密常用於高效率資料傳輸。', '雜湊可協助完整性驗證與防竄改。'], memoryTip: '這類組合題先拆需求：密文運算、金鑰交換、完整性、傳輸效率。', mnemonic: '算鑰驗傳四件組' },
  { no: 38, answer: 'B', question: '附圖程式碼所計算的是哪一類型的評估指標？', options: { A: 'MAE', B: 'MSE', C: 'RMSE', D: 'R²' }, explanation: '依答案可判斷附圖程式碼是在計算平方誤差後再取平均，因此屬於 MSE，答案是 B。若還多做了平方根才會變成 RMSE。', notes: ['MSE 對大誤差懲罰較重。', 'RMSE 是 MSE 再開根號，單位會回到原尺度。'], memoryTip: '平方再平均是 MSE；平方、平均、再開根才是 RMSE。', mnemonic: '平方均值是 MSE' },
  { no: 39, answer: 'C', question: '附圖程式碼實現的是哪一種正則化技術？', options: { A: 'L1正則化', B: 'L2正則化', C: 'Dropout', D: 'Batch Normalization' }, explanation: '依答案可知附圖程式碼是在訓練時隨機丟棄部分神經元，屬於 Dropout，答案是 C。Dropout 透過降低神經元共適應來抑制過擬合。', notes: ['Dropout 是訓練時隨機屏蔽部分單元。', 'BatchNorm 主要做分布穩定化，不是同一種正則化手段。'], memoryTip: '看到隨機關閉部分神經元，就幾乎是 Dropout。', mnemonic: '隨機關節點' },
  { no: 40, answer: 'C', question: '依據附圖程式碼進行資料處理，下列何者正確？', options: { A: 'np.linalg.inv(A) 計算矩陣 A 的行列式', B: 'v1 * v2 結果為 array([5, 7, 9])', C: 'np.dot(v1, v2) 結果為 np.int64(32)', D: 'np.linalg.eig(A) 計算矩陣 A 的反矩陣' }, explanation: '只有 C 正確，因為向量內積若 v1=[1,2,3]、v2=[4,5,6] 會得到 32。其餘選項把 inverse、eigen 與逐元素乘法的意義都混淆了。', notes: ['np.dot 用於向量內積或矩陣乘法。', 'inv 是反矩陣，eig 是特徵值與特徵向量分解。'], memoryTip: 'NumPy 常考三件事：逐元素乘法、內積、矩陣函數不要搞混。', mnemonic: 'dot 是內積' },
  { no: 41, answer: 'D', question: '考慮擲出骰子並採用Monte Carlo方法估算條件機率，參考附圖程式碼。事件 A：擲出偶數。事件 B：擲出大於3。請問下列何者為條件機率P(A∣B)的正確值？', options: { A: 'A_and_B.sum() / (A.sum() * B.sum())', B: 'A_and_B.sum() / (A.sum() + B.sum())', C: 'A_and_B.sum() / A.sum()', D: 'A_and_B.sum() / B.sum()' }, explanation: '條件機率定義為 P(A∣B)=P(A∩B)/P(B)，因此答案是 D。Monte Carlo 只是用模擬次數近似這個比例，本質公式不變。', notes: ['條件機率分母是條件事件。', 'A∩B 表示同時滿足 A 與 B 的樣本。'], memoryTip: 'P(A|B) 一定記成「交集除以 B」。', mnemonic: '條件分母放 B' },
  { no: 42, answer: 'B', question: '在深度神經網路中，不同層的參數量（parameter count）差異極大。有些層雖然數量少但計算量大，有些則相反。了解參數分佈情形，有助於模型壓縮與遷移學習設計。請問在VGG16中，下列何者的參數量最多？', options: { A: '卷積層(Conv2d)', B: '全連接層(Linear)', C: 'ReLU激活函數', D: '池化層(MaxPool2d, AdaptiveAvgPool2d)' }, explanation: 'VGG16 的大部分參數集中在後段全連接層，因此答案是 B。表中的 Linear-33 與後續 FC 層參數量遠高於卷積層。', notes: ['VGG16 的 FC 層參數非常大。', 'ReLU 與池化層通常沒有可訓練參數。'], memoryTip: 'VGG16 要記：參數多看 FC，FLOPs 多看 Conv。', mnemonic: '參數在 FC' },
  { no: 43, answer: 'A', question: '在神經網路中，了解各層的運算量分佈，有助於模型壓縮與硬體加速的策略設計。請問在VGG16中，下列何者運算量(FLOPs)最多？', options: { A: '卷積層(Conv2d)', B: '全連接層(Linear)', C: 'ReLU激活函數', D: '池化層(MaxPool2d, AdaptiveAvgPool2d)' }, explanation: 'VGG16 的運算量主要消耗在卷積層，答案是 A。因為卷積會在整個特徵圖空間上反覆做大量乘加運算。', notes: ['參數量大不一定代表 FLOPs 最大。', '卷積層常是 CNN 推論加速的主要目標。'], memoryTip: 'CNN 中算得最兇的通常是卷積，不是池化也不是 ReLU。', mnemonic: '算力在 Conv' },
  { no: 44, answer: 'D', question: 'VGG16層數深且結構規則，由多層卷積、池化及全連接層組成。了解各層的輸入/輸出維度、參數量及記憶體需求，有助於掌握CNN模型的組成邏輯與實作技巧。根據VGG16的模型架構，下列敘述何者正確？', options: { A: 'AdaptiveAvgPool2d的輸出會被攤平後傳入第一個全連接層；由於前一層池化輸出空間為 4×4，所以第一個線性層的輸入維度是 512×4×4 = 8192', B: 'Linear-33（第一個全連接層）報出的102,764,544參數只包含權重，偏差（bias）沒有算在內', C: '根據列出的「Estimated Total Size (MB) = 624.98」，表示訓練此模型只需大約625MB的GPU記憶體（包含所有optimizer state與梯度），所以一張 1 GB的GPU就足夠訓練', D: 'VGG16包含13層卷積層（conv）與3層全連接層（FC），總參數數目約為 138,357,544（約138.36M）' }, explanation: 'D 正確描述了 VGG16 的標準結構與總參數量，因此答案是 D。其餘選項不是輸入維度算錯，就是對參數或記憶體估計的理解有誤。', notes: ['VGG16 經典記法是 13 Conv + 3 FC。', '模型摘要中的記憶體估計不等於完整訓練實際需求。'], memoryTip: 'VGG16 的最穩定記法就是「13 個卷積、3 個全連接」。', mnemonic: 'VGG 十三卷三全' },
  { no: 45, answer: 'B', question: '在實務應用中，我們常使用遷移學習(transfer learning)技巧，即載入預訓練模型（如VGG16），凍結部分層的參數，只針對特定任務重新訓練最後幾層，這種做法可節省訓練時間並提升模型效能。假設你要對VGG16進行遷移學習(transfer learning)，希望凍結卷積層的參數，只訓練最後全連接層(classifier)。下列哪段程式碼寫法正確？', options: { A: '（原 PDF 附圖中的程式碼選項 A 未成功擷取）', B: '（原 PDF 附圖中的程式碼選項 B 未成功擷取；依答案判斷此項應為凍結卷積層參數、僅訓練 classifier 的正確寫法）', C: '（原 PDF 附圖中的程式碼選項 C 未成功擷取）', D: '（原 PDF 附圖中的程式碼選項 D 未成功擷取）' }, explanation: '依答案可知正確作法應是把卷積層 requires_grad=False，並保留最後 classifier 參數可訓練，因此答案是 B。這是遷移學習中最常見的「凍結 backbone、訓練 head」模式。', notes: ['遷移學習常先凍結 feature extractor。', '只訓練 classifier 可降低訓練成本並減少過擬合。'], memoryTip: 'Transfer learning 常見套路：前面凍結、後面微調。', mnemonic: '凍前訓後' },
  { no: 46, answer: 'B', question: '在郵遞區號自動辨識的研究中，研究人員收集了一份手寫數字影像資料集，每一張影像為8×8的灰階圖片，共包含多個手寫數字樣本。這份資料集來自UCI Machine Learning Repository，常被用於數字辨識與機器學習方法的教學與實驗。在過程中，研究人員發現資料中可能存在雜訊，例如筆跡模糊或影像中附加的干擾點，這會影響後續分類模型的效能。因此，他們希望透過資料降噪的方法，提升後續分類的準確度。同時，他們也想透過 KNN (K-Nearest Neighbors) 搭配交叉驗證來評估模型表現，確保模型在不同資料切割下都能有穩定的預測能力。假設研究人員已將含有雜訊的手寫數字影像存放在變數noisy中。部分資料經視覺化後的外觀如下：他們嘗試使用PCA進行降噪，並希望能保留影像的主要特徵，同時去除影像中的雜訊。然而，當程式執行後，觀察到影像仍然含有明顯的雜訊。研究人員懷疑是程式中某個步驟的設定不正確，導致PCA沒有發揮降噪的作用，需要修改程式碼才能讓降噪有效。請問哪一段程式碼需要修改，才能讓PCA對noisy影像有效去噪？', options: { A: '程式碼A', B: '程式碼B', C: '程式碼C', D: '程式碼D' }, explanation: '依答案可知需要修改的是程式碼 B。PCA 降噪的關鍵通常在於主成分保留數或重建流程設定，若這一步錯了，就無法有效去除雜訊。', notes: ['PCA 降噪通常先降維再 inverse transform 重建。', '保留太多主成分，雜訊也可能一起保留下來。'], memoryTip: 'PCA 去噪重點不在套模型，而在保留多少成分與如何重建。', mnemonic: 'PCA 先降再還' },
  { no: 47, answer: 'B', question: '研究人員在對digits資料集進行分類時，決定使用KNN並搭配交叉驗證來評估模型準確率。他們撰寫了四組不同的程式碼來進行KNN訓練與交叉驗證，但不確定哪幾組程式碼能正確執行並輸出準確率。每組程式碼在資料切割、模型訓練、交叉驗證函數的使用上略有差異，研究人員希望找出可以正確完成任務的程式碼組合，以確保模型評估的可靠性。請問哪幾組程式碼能正確使用KNN搭配交叉驗證，對digits資料集進行訓練並輸出準確率？', options: { A: '程式碼A、程式碼B、程式碼C、程式碼D', B: '程式碼A、程式碼C', C: '程式碼A、程式碼B', D: '程式碼C、程式碼D' }, explanation: '依答案可知正確組合是程式碼 A 與程式碼 C，因此答案是 B。這類題通常在考 cross_val_score、資料切分與 estimator 用法是否正確。', notes: ['交叉驗證要注意資料與模型物件的正確傳入。', 'KNN 常搭配標準化與適當 k 值調整。'], memoryTip: '交叉驗證題常在抓 API 用法、fit 時機與資料切分是否正確。', mnemonic: '交叉驗證看 API' },
  { no: 48, answer: 'C', question: '使用鐵達尼號(Titanic)資料集進行多層感知機(Multilayer Perceptron, MLP)分類預測分析，其中survived為反應變數(1表示存活，0表示死亡)。參考下圖程式碼，下列何者正確？A：X_train -= X_train.mean(axis=0) 將每個訓練集特徵的平均值調整為0。B：X_train /= X_train.std(axis=0) 將每個訓練集特徵的標準差調整為0。C：X_train 處理結果會將資料壓縮到 0 和 1 之間。D：標準化結果防止梯度爆炸或消失。E：標準化是屬於特徵選擇(Feature Selection)方法。F：X_train 程式碼應修正為 X_train = X_train.std(axis=0), X_test 程式碼應修正為 X_test = X_test.std(axis=0)。', options: { A: 'A、B、C、D', B: 'A、E', C: 'A、D', D: 'A、C、F' }, explanation: 'A 正確，因為減去平均值會讓每欄中心化到 0；D 也合理，標準化有助於神經網路訓練穩定，因此答案是 C。B、C、E、F 都把標準化與正規化或特徵選擇概念混淆了。', notes: ['Standardization 是均值 0、標準差 1。', '0 到 1 區間通常是 Min-Max normalization。'], memoryTip: '標準化不是壓到 0~1，而是拉成平均 0、標準差 1。', mnemonic: '標準化零均一差' },
  { no: 49, answer: 'C', question: '參考下圖執行結果，下列何者正確？', options: { A: 'activation="relu"其數學式為 ；', B: '空格1值為110，空格2值為100；', C: '空格1值為100，空格2值為110；', D: 'activation="sigmoid"一般用於多類別分類預測模型' }, explanation: '依執行結果對應，空格1應為 100、空格2應為 110，因此答案是 C。另 D 也不正確，互斥多類別通常更常用 Softmax 而非 Sigmoid。', notes: ['ReLU 常見數學式為 max(0, x)。', 'Sigmoid 常用於二元分類或多標籤情境。'], memoryTip: '這題主要是對照輸出結果填空，但也順便考活化函數基本用途。', mnemonic: '多類別多半 Softmax' },
  { no: 50, answer: 'C', question: '參考下圖執行結果，下列何者正確？A：空格1須填入 "b-"。B：空格2須填入 "b--"。C：空格1須填入 "r-"。D：空格2須填入 "r--"。E：驗證損失明顯較訓練損失減少更明顯。', options: { A: 'B、C', B: 'A、C、D', C: 'A、D', D: 'C、D、E' }, explanation: '依答案組合可知正確的是 A 與 D，因此選項 C 正確。也就是空格1為 "b-"、空格2為 "r--"，常見於用藍色實線畫訓練曲線、紅色虛線畫驗證曲線。', notes: ['Matplotlib 中 b- 常表示藍色實線。', 'r-- 常表示紅色虛線。'], memoryTip: '畫 learning curve 常見搭配：train 用藍實線，valid 用紅虛線。', mnemonic: '藍實紅虛' }
];

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function textFromHtml(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSubject1Questions() {
  const tryReadQuestions = (filePath) => {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const html = fs.readFileSync(filePath, 'utf8');
    const match = html.match(/const questions = (\[[\s\S]*?\]);/);
    return match ? vm.runInNewContext(match[1]) : null;
  };

  let questions = tryReadQuestions(SUBJECT1_HTML);

  if (!questions) {
    const totalQuestions = tryReadQuestions(TOTAL_HTML) || [];
    questions = totalQuestions.filter((item) => item.sourceKey === 'subject1-official');
  }

  if (!questions || questions.length === 0) {
    throw new Error('Cannot find subject1 question data in subject1_exam_detailed_guide.html or ipas_total_review.html');
  }

  return questions.map((item) => normalizeQuestionNotes({
    ...item,
    notes: [],
    memoryTip: SUBJECT1_MEMORY[item.no]?.memoryTip || '',
    mnemonic: SUBJECT1_MEMORY[item.no]?.mnemonic || '',
    sourceKey: 'subject1-official',
    sourceLabel: '第一科正式題',
    sectionLabel: '第一科｜正式考題'
  }));
}

function parseChoices(blockHtml) {
  const options = {};
  const regex = /<li><strong>\(([A-D])\)<\/strong>([\s\S]*?)<\/li>/g;
  let match;
  while ((match = regex.exec(blockHtml))) {
    options[match[1]] = textFromHtml(match[2]);
  }
  return options;
}

function parseSampleGuide() {
  const html = fs.readFileSync(SAMPLE_GUIDE_HTML, 'utf8');
  const subjectRegex = /<section class="subject" id="([^"]+)">([\s\S]*?)<\/section>/g;
  const result = [];
  let subjectMatch;
  while ((subjectMatch = subjectRegex.exec(html))) {
    const subjectId = subjectMatch[1];
    const sectionHtml = subjectMatch[2];
    const title = textFromHtml((sectionHtml.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || subjectId);
    const cardRegex = /<article class="question-card">([\s\S]*?)<\/article>/g;
    let cardMatch;
    while ((cardMatch = cardRegex.exec(sectionHtml))) {
      const cardHtml = cardMatch[1];
      const no = Number((cardHtml.match(/<span class="badge qno">第\s*(\d+)\s*題<\/span>/) || [])[1]);
      const answer = ((cardHtml.match(/<span class="badge answer">答案：([A-D])<\/span>/) || [])[1]) || '';
      const question = textFromHtml((cardHtml.match(/<div class="question-text">([\s\S]*?)<\/div>/) || [])[1] || '');
      const questionMedia = (cardHtml.match(/<figure class="question-media">([\s\S]*?)<\/figure>/) || [])[1] || '';
      const choicesBlock = (cardHtml.match(/<ul class="choices">([\s\S]*?)<\/ul>/) || [])[1] || '';
      const explanation = (cardHtml.match(/<div class="explanation"><strong>詳解：<\/strong>([\s\S]*?)<\/div>/) || [])[1] || '';
      const detailsSummary = textFromHtml((cardHtml.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1] || '選項背景知識');
      const notes = [];
      const noteRegex = /<li>([\s\S]*?)<\/li>/g;
      const detailsBlock = (cardHtml.match(/<details>[\s\S]*?<ul class="option-notes">([\s\S]*?)<\/ul>[\s\S]*?<\/details>/) || [])[1] || '';
      let noteMatch;
      while ((noteMatch = noteRegex.exec(detailsBlock))) {
        notes.push(textFromHtml(noteMatch[1]));
      }
      result.push(normalizeQuestionNotes({
        no,
        answer,
        question,
        questionMedia,
        options: parseChoices(choicesBlock),
        explanation,
        notes,
        notesSummary: detailsSummary,
        sourceKey: `sample-${subjectId}`,
        sourceLabel: title.includes('科目一') ? '樣題科目一' : '樣題科目三',
        sectionLabel: `${title}｜樣題整理`,
        memoryTip: '',
        mnemonic: ''
      }));
    }
  }
  return result;
}

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

function firstSentence(value) {
  const text = textFromHtml(value || '');
  const match = text.match(/^(.+?[。！？!?])(?:\s|$)/);
  return match ? match[1].trim() : text;
}

function cleanInlineText(value) {
  return textFromHtml(value || '').replace(/\s+/g, ' ').trim();
}

function trimSentenceEnding(value) {
  return cleanInlineText(value).replace(/[。！？!?；;]+$/g, '');
}

function shortenText(value, maxLength = 28) {
  const text = cleanInlineText(value);
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}…`;
}

function isOfficialQuestion(item) {
  return /official/.test(item?.sourceKey || '') || /正式題/.test(item?.sourceLabel || '');
}

function inferOptionCategory(optionText) {
  const text = cleanInlineText(optionText);

  if (/(Accuracy|Precision|Recall|F1|MSE|RMSE|R²|IoU|PSI|KL|AUC|mAP|指標|分數|機率|解釋率)/i.test(text)) {
    return '一種評估指標或判讀標準';
  }
  if (/(CNN|RNN|LSTM|Transformer|BERT|GAN|VAE|CLIP|DBSCAN|PCA|LASSO|KNN|SVM|ARIMA|XGBoost|Kubernetes|AutoML|Seq2Seq|RAG|Model Registry|Dropout|Softmax|Batch Normalization|Adam|Grid Search|Random Search)/i.test(text)) {
    return '某個模型、演算法或系統機制';
  }
  if (/(交叉驗證|正則化|資料增強|標準化|特徵縮放|遷移學習|時間序列交叉驗證|滑動視窗|分箱|對抗訓練|回譯|分層留一法)/.test(text)) {
    return '一種資料處理、訓練或驗證策略';
  }
  if (/(資料|特徵|樣本|語料|分布|欄位|向量|權重|參數|嵌入|主成分|殘差|矩陣)/.test(text)) {
    return '資料、特徵或參數層面的概念';
  }
  return `「${text}」這類相近概念`;
}

function getBackgroundNotePool(item) {
  const explicitNotes = extractExplicitOptionNotes(item.notes || []);
  const hasExplicitNotes = OPTION_KEYS.some((key) => explicitNotes[key]);

  if (isOfficialQuestion(item) && hasExplicitNotes) {
    return [];
  }

  return (item.notes || [])
    .map((note) => cleanInlineText(note))
    .filter(Boolean)
    .filter((note) => !/^\([A-D]\)/.test(note));
}

function buildSupportSentence(item, key, notePool, focus) {
  if (notePool.length) {
    const index = OPTION_KEYS.indexOf(key) % notePool.length;
    const note = trimSentenceEnding(notePool[index]);
    if (note) {
      return `補充：${note}。`;
    }
  }
  return focus ? `記法：${trimSentenceEnding(focus)}。` : '';
}

const OFFICIAL_NOTE_LIMIT = 20;
const OFFICIAL_NOTE_RULES = [
  { pattern: /F檢定|F-test/i, note: '檢定變異數差異' },
  { pattern: /t檢定|Paired-sample t-test/i, note: '檢定平均數差異' },
  { pattern: /卡方檢定|Chi-square/i, note: '檢定類別變數關聯' },
  { pattern: /Faiss|ScaNN/i, note: '向量近鄰搜尋庫' },
  { pattern: /上下文視窗/, note: '受上下文視窗限制' },
  { pattern: /查詢意圖|語意相似/, note: '避免語意像意圖錯' },
  { pattern: /高維空間|記憶體占用|計算成本/, note: '高維嵌入成本高' },
  { pattern: /人名|地名|組織名稱|實體資訊/, note: '命名實體辨識任務' },
  { pattern: /翻譯/, note: '將文字轉成另一語言' },
  { pattern: /摘要/, note: '濃縮文本重點內容' },
  { pattern: /關鍵字.*頻率統計|可視化/, note: '統計關鍵詞出現頻率' },
  { pattern: /趨勢曲線|數值序列/, note: '連續值時序預測' },
  { pattern: /自注意力|Self-Attention/i, note: '自注意力抓長距脈絡' },
  { pattern: /卷積運算|Convolution/i, note: '卷積擅長局部特徵' },
  { pattern: /強化學習|Reinforcement Learning/i, note: '靠回饋更新策略' },
  { pattern: /資料增強|Data Augmentation/i, note: '擴增樣本多樣性' },
  { pattern: /遮罩語言模型|MLM/i, note: '雙向預測遮罩詞' },
  { pattern: /雙向上下文/, note: '同時利用前後文' },
  { pattern: /局部特徵/, note: '擷取邊緣紋理特徵' },
  { pattern: /降低影像維度/, note: '降維減少計算量' },
  { pattern: /最終分類結果/, note: '輸出最終類別判斷' },
  { pattern: /Word2Vec/i, note: '以預測學詞向量' },
  { pattern: /GloVe/i, note: '基於詞共現統計' },
  { pattern: /TF-IDF/i, note: '統計詞項重要性' },
  { pattern: /N-gram/i, note: '只看固定長度上下文' },
  { pattern: /IoU/i, note: '衡量預測框重疊' },
  { pattern: /Softmax/i, note: '輸出類別機率分布' },
  { pattern: /Max-Pooling/i, note: '保留局部最大值' },
  { pattern: /F1/i, note: '精確率召回率調和平均' },
  { pattern: /Accuracy/i, note: '整體預測正確比例' },
  { pattern: /RMSE/i, note: '根均方誤差' },
  { pattern: /MSE/i, note: '均方誤差' },
  { pattern: /DBSCAN/i, note: '密度式分群方法' },
  { pattern: /局部最優/, note: '陷在非全域最佳點' },
  { pattern: /梯度消失/, note: '深層網路梯度變小' },
  { pattern: /過擬合/, note: '訓練好但泛化差' },
  { pattern: /雜訊點/, note: '不屬任何主要群集' },
  { pattern: /邊界點/, note: '位於核心點鄰域' },
  { pattern: /鄰近點/, note: '靠近目標的周邊點' },
  { pattern: /潛在點/, note: '待判定的候選點' },
  { pattern: /Epsilon|ε/i, note: '鄰域半徑參數' },
  { pattern: /MinPts/i, note: '核心點最少鄰點數' },
  { pattern: /PCA/i, note: '轉成正交主成分' },
  { pattern: /Kubernetes/i, note: '容器編排與自動擴縮' },
  { pattern: /Model Registry/i, note: '集中管模型版本狀態' },
  { pattern: /Seq2Seq/i, note: '序列到序列生成' },
  { pattern: /RAG/i, note: '檢索增強生成架構' },
  { pattern: /稀疏化約束|Sparsity/i, note: '讓注意力更集中' },
  { pattern: /Back-Translation|回譯/i, note: '回譯擴增平行語料' },
  { pattern: /WGAN/i, note: '改善GAN訓練穩定性' },
  { pattern: /KL divergence|KL/i, note: '衡量分布差異程度' },
  { pattern: /PSI/i, note: '監測資料分布漂移' },
  { pattern: /LASSO|L1正則化|L1/i, note: '壓零兼特徵選擇' },
  { pattern: /L2正則化|Ridge|L2/i, note: '縮小權重抑制過擬合' },
  { pattern: /稀疏模型|Sparse Model/i, note: '部分權重壓到零' },
  { pattern: /學習率|Learning Rate/i, note: '控制權重更新步幅' },
  { pattern: /梯度穩定性|震盪/, note: '減少參數更新震盪' },
  { pattern: /Grid Search/i, note: '枚舉參數組合搜尋' },
  { pattern: /Random Search/i, note: '隨機抽參較省計算' },
  { pattern: /Adagrad/i, note: '適合稀疏特徵更新' },
  { pattern: /Adam/i, note: '結合動量與自適應率' },
  { pattern: /SGD/i, note: '基本梯度下降法' },
  { pattern: /Momentum/i, note: '用慣性減少震盪' },
  { pattern: /Dropout/i, note: '隨機關閉部分神經元' },
  { pattern: /交叉驗證|Cross-Validation/i, note: '反覆切分估模型泛化' },
  { pattern: /早期停止|Early Stopping/i, note: '驗證不升即提前停' },
  { pattern: /標準化|Standardization/i, note: '均值0標準差1' },
  { pattern: /正規化|Min-Max/i, note: '縮放到固定數值區間' },
  { pattern: /特徵縮放|Feature Scaling/i, note: '統一特徵尺度' },
  { pattern: /蒙地卡羅|Monte Carlo/i, note: '隨機抽樣估計分布' },
  { pattern: /殘差圖|Residual Plot/i, note: '檢查線性與異常值' },
  { pattern: /LSTM/i, note: '擅長處理時序依賴' },
  { pattern: /CNN/i, note: '擷取局部空間特徵' },
  { pattern: /RNN/i, note: '處理序列關聯資料' },
  { pattern: /KNN|SVM/i, note: '距離尺度會影響結果' },
  { pattern: /Bayes|貝氏/i, note: '依條件機率更新判斷' },
  { pattern: /Information Gain|資訊增益/i, note: '衡量分裂後熵下降' },
  { pattern: /Macro F1/i, note: '各類別F1平均' },
  { pattern: /Sampling Bias|取樣偏差/i, note: '樣本分布不代表母體' },
  { pattern: /滑動視窗|Rolling Window/i, note: '時序資料滑窗驗證' },
  { pattern: /Leave-One-Out|留一法/i, note: '盡量保留訓練資料量' },
  { pattern: /分層|Stratified/i, note: '維持各類別比例' },
  { pattern: /Explainability|可解釋性/i, note: '高風險場景更重要' },
  { pattern: /Label Bias|標籤偏差/i, note: '標註主觀偏見造成' },
  { pattern: /R²/i, note: '解釋目標變異比例' }
];

function limitOfficialNote(text) {
  return cleanInlineText(text).replace(/[。！？!?；;]+$/g, '').slice(0, OFFICIAL_NOTE_LIMIT);
}

function compactOfficialKnowledge(optionText) {
  const text = cleanInlineText(optionText);

  for (const rule of OFFICIAL_NOTE_RULES) {
    if (rule.pattern.test(text)) {
      return limitOfficialNote(rule.note);
    }
  }

  const compact = text
    .replace(/（[^）]{1,40}）/g, '')
    .replace(/[，；。].*$/g, '')
    .replace(/^(透過|利用|採用|使用|將|以|對於|針對)/, '')
    .replace(/(方式|方法|機制|系統|模型|策略|功能|作用)$/g, '')
    .replace(/\s+/g, '');

  if (compact.length <= OFFICIAL_NOTE_LIMIT) {
    return compact;
  }

  const shortened = compact
    .replace(/(的|與|及|並|或|進行|一種|主要|可以|用於|建立|提升|降低)/g, '')
    .replace(/\s+/g, '');

  return limitOfficialNote(shortened || compact);
}

function buildOfficialCompactNotes(item) {
  const optionKeys = OPTION_KEYS.filter((key) => item.options && item.options[key]);
  return optionKeys.map((key) => `(${key}) ${compactOfficialKnowledge(item.options[key])}`);
}

function extractExplicitOptionNotes(notes) {
  const result = {};
  for (const rawNote of notes || []) {
    const note = cleanInlineText(rawNote);
    const match = note.match(/^\(([A-D])\)\s*(.+)$/);
    if (match) {
      result[match[1]] = match[2].trim();
    }
  }
  return result;
}

function buildPerOptionNotes(item) {
  const optionKeys = OPTION_KEYS.filter((key) => item.options && item.options[key]);
  const explicitNotes = extractExplicitOptionNotes(item.notes || []);

  if (isOfficialQuestion(item)) {
    return buildOfficialCompactNotes(item);
  }

  if (optionKeys.length && optionKeys.every((key) => explicitNotes[key])) {
    return optionKeys.map((key) => `(${key}) ${explicitNotes[key]}`);
  }

  const explanationSentence = firstSentence(item.explanation || '');
  const correctText = cleanInlineText(item.options?.[item.answer] || item.memoryTip || item.mnemonic || '題幹關鍵條件');
  const focus = cleanInlineText(item.memoryTip || item.mnemonic || correctText || '題幹關鍵條件');
  const notePool = getBackgroundNotePool(item);

  return optionKeys.map((key) => {
    const optionText = cleanInlineText(item.options[key]);
    if (key === item.answer) {
      const extraSentence = buildSupportSentence(item, key, notePool, focus);
      return `(${key}) ${optionText}：直接對應題幹重點，所以是正確答案。${explanationSentence || `本題要抓的就是「${focus}」。`}${extraSentence}`;
    }
    const optionCategory = inferOptionCategory(optionText);
    const extraSentence = buildSupportSentence(item, key, notePool, focus);
    const distractorLead = optionCategory.startsWith('「')
      ? `這一項屬於${optionCategory}`
      : `這一項偏向${optionCategory}`;
    return `(${key}) ${optionText}：${distractorLead}，屬於常見易混概念。${extraSentence}`;
  });
}

function normalizeQuestionNotes(item) {
  return {
    ...item,
    notes: buildPerOptionNotes(item),
    notesSummary: '選項背景知識'
  };
}

function addMetadata(questions, sourceKey, sourceLabel, sectionLabel) {
  return questions.map((item) => normalizeQuestionNotes({
    ...item,
    sourceKey,
    sourceLabel,
    sectionLabel,
    notesSummary: item.notesSummary || '題目選項相關背景知識'
  }));
}

function rangeOptions(maxNo) {
  const options = ['<option value="all">全部題號</option>'];
  for (let start = 1; start <= maxNo; start += 10) {
    const end = Math.min(start + 9, maxNo);
    options.push(`<option value="${start}-${end}">${start}-${end}</option>`);
  }
  return options.join('');
}

function buildCommonCss() {
  return `
    :root {
      --bg: #f4f7fb;
      --panel: #ffffff;
      --soft: #f8fbff;
      --panel-soft: #f8fbff;
      --text: #1f2937;
      --muted: #64748b;
      --line: #d9e3f0;
      --primary: #2563eb;
      --primary-soft: #dbeafe;
      --success: #15803d;
      --success-soft: #dcfce7;
      --warn: #d97706;
      --warn-soft: #fef3c7;
      --shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", "Microsoft JhengHei", sans-serif;
      color: var(--text);
      background: linear-gradient(180deg, #eaf2ff 0, var(--bg) 220px);
      line-height: 1.7;
      transition: background 0.25s ease, color 0.25s ease;
    }
    body.dark-mode {
      --bg: #0f172a;
      --panel: #111827;
      --soft: #182235;
      --panel-soft: #1f2937;
      --text: #e5eefb;
      --muted: #94a3b8;
      --line: #334155;
      --primary: #60a5fa;
      --primary-soft: #1e3a8a;
      --success: #4ade80;
      --success-soft: #14532d;
      --warn: #f59e0b;
      --warn-soft: #3b2b12;
      --shadow: 0 14px 32px rgba(2, 6, 23, 0.45);
      background: linear-gradient(180deg, #0b1220 0, var(--bg) 220px);
    }
    .container {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 24px 0 56px;
    }
    .hero, .toolbar, .question-card, .footer, .quick-nav {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 22px;
      box-shadow: var(--shadow);
    }
    .hero {
      padding: 28px;
      margin-bottom: 18px;
    }
    h1, h2, h3 { margin: 0; }
    h1 { font-size: clamp(1.8rem, 3vw, 2.6rem); margin-bottom: 10px; }
    .lead { color: var(--muted); margin: 0; }
    .chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
    .chip { padding: 6px 12px; border-radius: 999px; background: var(--primary-soft); color: var(--primary); font-size: 0.92rem; font-weight: 700; }
    .toolbar { padding: 16px 18px; margin-bottom: 18px; display: grid; gap: 12px; }
    .toolbar-grid { display: grid; grid-template-columns: minmax(240px,1.7fr) repeat(2, minmax(150px,0.9fr)); gap: 12px; }
    .toolbar-actions { display: flex; flex-wrap: wrap; gap: 10px; }
    input, select {
      width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line); background: #fff; font-size: 0.98rem; color: #0f172a;
    }
    .tool-button, .review-button {
      appearance: none; border: 1px solid var(--line); background: var(--panel); color: var(--text); border-radius: 999px; padding: 10px 14px; font-size: 0.92rem; font-weight: 700; cursor: pointer;
    }
    .tool-button.active, .review-button.active { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }
    .meta-text { color: var(--muted); font-size: 0.95rem; }
    .layout { position: relative; }
    .question-list { display: grid; gap: 16px; }
    .question-card { padding: 20px; transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
    .question-card.review-marked { border-color: #f59e0b; box-shadow: 0 12px 28px rgba(245, 158, 11, 0.18); }
    .card-top { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; align-items: center; }
    .badge { display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 999px; font-size: 0.9rem; font-weight: 700; }
    .badge.no { background: #f8fafc; border: 1px solid var(--line); color: var(--text); }
    .badge.answer { background: var(--success-soft); color: var(--success); cursor: pointer; user-select: none; }
    .badge.answer.is-hidden { background: #e2e8f0; color: #475569; border: 1px dashed #cbd5e1; }
    .badge.answer.is-hidden::before { content: "🙈 "; }
    .badge.source { background: var(--primary-soft); color: var(--primary); }
    .question-text { font-size: 1.05rem; margin-bottom: 12px; }
    .question-media { margin: 0 0 12px; }
    .question-media img { display: block; width: min(100%, 860px); margin: 0 auto; border: 1px solid #d9e3f0; border-radius: 14px; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08); background: #fff; }
    .question-media figcaption { margin-top: 8px; color: var(--muted); font-size: 0.92rem; text-align: center; }
    .choices-block, .explanation, .memory-box, details { border-radius: 14px; padding: 14px 16px; margin-bottom: 12px; }
    .choices-block { background: var(--soft); border: 1px solid #d7e5f7; }
    .choices-title { color: var(--primary); font-weight: 700; margin-bottom: 8px; }
    .choices { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    .choices li { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 10px; }
    .choices strong { color: #0f172a; margin-right: 6px; }
    .explanation { background: #fffdf6; border: 1px solid #f3dfb2; }
    .memory-box { background: #eefaf3; border: 1px solid #c8efd6; }
    .memory-box h4 { margin: 0 0 8px; font-size: 0.95rem; color: #0f6b36; }
    .memory-box p { margin: 0; }
    .mnemonic { margin-top: 8px; font-weight: 800; color: #0f6b36; }
    .answer-dependent.is-hidden { display: none; }
    details { background: #fbfdff; border: 1px dashed #bfd0e8; }
    summary { cursor: pointer; color: var(--primary); font-weight: 700; }
    .notes { margin: 10px 0 0; padding-left: 20px; }
    .footer { margin-top: 22px; padding: 20px; color: var(--muted); }
    .quick-nav { position: fixed; top: 24px; right: 20px; width: 220px; max-height: calc(100vh - 48px); overflow: auto; padding: 16px; z-index: 20; }
    .quick-nav h3 { font-size: 1rem; margin-bottom: 10px; }
    .quick-nav-section + .quick-nav-section { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); }
    .quick-nav-title { font-size: 0.9rem; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
    .quick-nav-links { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .quick-nav a { display: inline-flex; align-items: center; justify-content: center; min-height: 32px; border-radius: 10px; background: var(--panel-soft); border: 1px solid var(--line); color: var(--text); text-decoration: none; font-size: 0.88rem; font-weight: 700; }
    .quick-nav a.review-link { border-color: #f59e0b; color: #b45309; background: #fff7ed; }
    .quick-nav a:hover { background: var(--primary-soft); color: var(--primary); }
    .top-link { position: fixed; right: 20px; bottom: 20px; background: var(--primary); color: #fff; text-decoration: none; border-radius: 999px; padding: 10px 14px; font-weight: 700; box-shadow: var(--shadow); }
    .hidden { display: none !important; }
    body.dark-mode .hero,
    body.dark-mode .toolbar,
    body.dark-mode .question-card,
    body.dark-mode .footer,
    body.dark-mode .quick-nav,
    body.dark-mode .tool-button,
    body.dark-mode .review-button { background: var(--panel); border-color: var(--line); color: var(--text); }
    body.dark-mode input,
    body.dark-mode select,
    body.dark-mode .choices li,
    body.dark-mode details,
    body.dark-mode .choices-block,
    body.dark-mode .badge.no { background: var(--panel-soft); border-color: var(--line); color: var(--text); }
    body.dark-mode .choices strong,
    body.dark-mode .explanation strong,
    body.dark-mode details strong,
    body.dark-mode .memory-box strong { color: #f8fafc; }
    body.dark-mode .question-media img { background: #0f172a; border-color: #334155; }
    body.dark-mode .badge.answer.is-hidden { background: #334155; color: #cbd5e1; border-color: #475569; }
    body.dark-mode .explanation { background: #2a2314; border-color: #6b5a2b; }
    body.dark-mode .memory-box { background: #142b22; border-color: #28543f; }
    body.dark-mode .memory-box h4, body.dark-mode .mnemonic { color: #86efac; }
    body.dark-mode .quick-nav a { background: var(--panel-soft); border-color: var(--line); color: var(--text); }
    body.dark-mode .quick-nav a.review-link { background: #3b2b12; border-color: #f59e0b; color: #fbbf24; }
    body.dark-mode .top-link { color: #eff6ff; }
    @media (max-width: 880px) { .toolbar-grid { grid-template-columns: 1fr; } }
    @media (max-width: 720px) { .container { width: min(100% - 20px, 1180px); } .hero, .toolbar, .question-card, .footer { border-radius: 16px; } .quick-nav { display: none; } }
    @media (min-width: 1200px) { .container { width: min(1180px, calc(100% - 320px)); margin-left: auto; margin-right: auto; } }
  `;
}

function buildPage({ title, lead, chips, questions, pageKey, filterType, resultLabel, footerTitle, footerText, extraSelectLabel, extraSelectOptions }) {
  const maxNo = Math.max(...questions.map((q) => q.no));
  const rangeHtml = rangeOptions(maxNo);
  const extraFilter = filterType === 'source'
    ? `<select id="extraFilter"><option value="all">全部來源</option>${extraSelectOptions}</select>`
    : `<select id="extraFilter">${rangeHtml}</select>`;

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${htmlEscape(title)}</title>
  <style>${buildCommonCss()}</style>
</head>
<body>
  <aside class="quick-nav" aria-label="快速選題">
    <h3>快速選題</h3>
    <div id="quickNavContent"></div>
  </aside>
  <div class="container" id="top">
    <header class="hero">
      <h1>${htmlEscape(title)}</h1>
      <p class="lead">${lead}</p>
      <div class="chips">${chips.map((chip) => `<span class="chip">${chip}</span>`).join('')}</div>
    </header>

    <section class="toolbar">
      <div class="toolbar-grid">
        <input id="searchInput" type="text" placeholder="搜尋題目、詳解、關鍵字、口訣，例如：Transformer、LASSO、交叉驗證" />
        ${extraFilter}
        <select id="answerFilter">
          <option value="all">全部答案</option>
          <option value="A">答案 A</option>
          <option value="B">答案 B</option>
          <option value="C">答案 C</option>
          <option value="D">答案 D</option>
        </select>
      </div>
      <div class="toolbar-actions">
        <button class="tool-button" id="themeToggle" type="button">🌙 Dark Mode</button>
        <button class="tool-button" id="answerToggle" type="button">👁️ 顯示全部答案</button>
        <button class="tool-button" id="reviewFilterToggle" type="button">⭐ 只看已標註題</button>
      </div>
      <div class="meta-text" id="resultCount">${resultLabel}</div>
    </section>

    <section class="question-list" id="questionList"></section>

    <section class="footer">
      <h3>${footerTitle}</h3>
      <p>${footerText}</p>
    </section>
  </div>

  <a class="top-link" href="#top">回到頂部</a>

  <script>
    const questions = ${JSON.stringify(questions)};
    const pageKey = ${JSON.stringify(pageKey)};
    const filterType = ${JSON.stringify(filterType)};

    const list = document.getElementById('questionList');
    const resultCount = document.getElementById('resultCount');
    const searchInput = document.getElementById('searchInput');
    const extraFilter = document.getElementById('extraFilter');
    const answerFilter = document.getElementById('answerFilter');
    const themeToggle = document.getElementById('themeToggle');
    const answerToggle = document.getElementById('answerToggle');
    const reviewFilterToggle = document.getElementById('reviewFilterToggle');
    const navRoot = document.getElementById('quickNavContent');

    const STORAGE = {
      theme: pageKey + '-theme',
      review: pageKey + '-review',
      reviewFilter: pageKey + '-review-filter'
    };

    const revealedIds = new Set();
    const markedIds = new Set(JSON.parse(localStorage.getItem(STORAGE.review) || '[]'));
    let reviewOnlyMode = localStorage.getItem(STORAGE.reviewFilter) === 'true';
    let allAnswersVisible = false;

    if (localStorage.getItem(STORAGE.theme) === 'dark') {
      document.body.classList.add('dark-mode');
    }

    function updateThemeButton() {
      const dark = document.body.classList.contains('dark-mode');
      themeToggle.textContent = dark ? '☀️ Light Mode' : '🌙 Dark Mode';
      themeToggle.classList.toggle('active', dark);
    }

    function saveMarkedIds() {
      localStorage.setItem(STORAGE.review, JSON.stringify([...markedIds]));
    }

    function updateReviewFilterButton() {
      reviewFilterToggle.textContent = reviewOnlyMode ? '⭐ 顯示全部題目' : '⭐ 只看已標註題';
      reviewFilterToggle.classList.toggle('active', reviewOnlyMode);
    }

    function updateAnswerToggleButton() {
      answerToggle.textContent = allAnswersVisible ? '🙈 隱藏全部答案' : '👁️ 顯示全部答案';
      answerToggle.classList.toggle('active', allAnswersVisible);
    }

    function buildQuestionId(item) {
      return item.sourceKey + '-q-' + item.no;
    }

    function isVisibleByFilter(item, keyword, extraValue, answerValue) {
      const haystack = [item.question, item.explanation, item.memoryTip, item.mnemonic, ...Object.values(item.options), ...(item.notes || [])].join(' ').toLowerCase();
      const matchKeyword = !keyword || haystack.includes(keyword);
      const matchAnswer = answerValue === 'all' || item.answer === answerValue;
      let matchExtra = true;
      if (filterType === 'range' && extraValue !== 'all') {
        const [start, end] = extraValue.split('-').map(Number);
        matchExtra = item.no >= start && item.no <= end;
      }
      if (filterType === 'source' && extraValue !== 'all') {
        matchExtra = item.sourceKey === extraValue;
      }
      const matchReview = !reviewOnlyMode || markedIds.has(buildQuestionId(item));
      return matchKeyword && matchAnswer && matchExtra && matchReview;
    }

    function answerBadgeHtml(item, questionId) {
      const visible = revealedIds.has(questionId);
      return '<span class="badge answer ' + (visible ? '' : 'is-hidden') + '" data-question-id="' + questionId + '" aria-pressed="' + (visible ? 'true' : 'false') + '" title="' + (visible ? '點擊隱藏答案' : '點擊顯示答案') + '">' + (visible ? ('答案：' + item.answer) : '點擊顯示答案') + '</span>';
    }

    function render(items) {
      list.innerHTML = items.map(item => {
        const questionId = buildQuestionId(item);
        const answerVisible = revealedIds.has(questionId);
        const optionsHtml = Object.entries(item.options).map(([key, value]) => '<li class="' + (item.answer === key ? 'correct' : '') + '"><strong>(' + key + ')</strong>' + value + '</li>').join('');
        const notesHtml = (item.notes || []).map(note => '<li>' + note + '</li>').join('');
        return [
          '<article class="question-card ' + (markedIds.has(questionId) ? 'review-marked ' : '') + (answerVisible ? 'answer-visible' : '') + '" id="' + questionId + '" data-source-key="' + item.sourceKey + '">',
          '  <div class="card-top">',
          '    <span class="badge no">第 ' + item.no + ' 題</span>',
          '    <span class="badge source">' + item.sourceLabel + '</span>',
          '    ' + answerBadgeHtml(item, questionId),
          '    <button class="review-button ' + (markedIds.has(questionId) ? 'active' : '') + '" type="button" data-review-id="' + questionId + '">' + (markedIds.has(questionId) ? '⭐ 已標註' : '☆ 標註複習') + '</button>',
          '  </div>',
          '  <div class="question-text">' + item.question + '</div>',
          item.questionMedia ? ('  <figure class="question-media">' + item.questionMedia + '</figure>') : '',
          '  <div class="choices-block">',
          '    <div class="choices-title">題目選項</div>',
          '    <ul class="choices">' + optionsHtml + '</ul>',
          '  </div>',
          '  <div class="explanation answer-dependent ' + (answerVisible ? '' : 'is-hidden') + '"><strong>詳解：</strong>' + item.explanation + '</div>',
          (item.memoryTip || item.mnemonic ? ('<div class="memory-box answer-dependent ' + (answerVisible ? '' : 'is-hidden') + '"><h4>好記版解說</h4><p>' + (item.memoryTip || '') + '</p>' + (item.mnemonic ? ('<div class="mnemonic">口訣：' + item.mnemonic + '</div>') : '') + '</div>') : ''),
          '  <details>',
          '    <summary>' + (item.notesSummary || '題目選項相關背景知識') + '</summary>',
          '    <ul class="notes">' + notesHtml + '</ul>',
          '  </details>',
          '</article>'
        ].join('');
      }).join('');
      resultCount.textContent = '目前顯示 ' + items.length + ' 題／共 ' + questions.length + ' 題';
      wireCardInteractions(items);
      buildQuickNav(items);
      syncAnswerToggleState();
    }

    function setCardAnswerState(questionId, visible) {
      const card = document.getElementById(questionId);
      if (!card) return;
      const badge = card.querySelector('.badge.answer');
      const item = questions.find(entry => buildQuestionId(entry) === questionId);
      if (!badge || !item) return;
      badge.classList.toggle('is-hidden', !visible);
      badge.textContent = visible ? ('答案：' + item.answer) : '點擊顯示答案';
      badge.setAttribute('aria-pressed', visible ? 'true' : 'false');
      badge.title = visible ? '點擊隱藏答案' : '點擊顯示答案';
      card.classList.toggle('answer-visible', visible);
      card.querySelectorAll('.answer-dependent').forEach(el => el.classList.toggle('is-hidden', !visible));
    }

    function wireCardInteractions(items) {
      document.querySelectorAll('.badge.answer').forEach((badge) => {
        badge.addEventListener('click', () => {
          const questionId = badge.dataset.questionId;
          if (revealedIds.has(questionId)) {
            revealedIds.delete(questionId);
            setCardAnswerState(questionId, false);
          } else {
            revealedIds.add(questionId);
            setCardAnswerState(questionId, true);
          }
          syncAnswerToggleState();
        });
      });

      document.querySelectorAll('.review-button').forEach((button) => {
        button.addEventListener('click', () => {
          const questionId = button.dataset.reviewId;
          if (markedIds.has(questionId)) {
            markedIds.delete(questionId);
          } else {
            markedIds.add(questionId);
          }
          saveMarkedIds();
          filterQuestions();
        });
      });
    }

    function syncAnswerToggleState() {
      const visibleIds = Array.from(list.querySelectorAll('.question-card')).map(card => card.id);
      allAnswersVisible = visibleIds.length > 0 && visibleIds.every(id => revealedIds.has(id));
      updateAnswerToggleButton();
    }

    function buildQuickNav(items) {
      const groups = new Map();
      items.forEach(item => {
        if (!groups.has(item.sectionLabel)) groups.set(item.sectionLabel, []);
        groups.get(item.sectionLabel).push(item);
      });
      navRoot.innerHTML = Array.from(groups.entries()).map(([label, entries]) => {
        const links = entries.map(item => {
          const questionId = buildQuestionId(item);
          const reviewClass = markedIds.has(questionId) ? 'review-link' : '';
          return '<a class="' + reviewClass + '" href="#' + questionId + '">' + item.no + '</a>';
        }).join('');
        return '<section class="quick-nav-section"><div class="quick-nav-title">' + label + '</div><div class="quick-nav-links">' + links + '</div></section>';
      }).join('');
    }

    function filterQuestions() {
      const keyword = searchInput.value.trim().toLowerCase();
      const extraValue = extraFilter.value;
      const answerValue = answerFilter.value;
      const filtered = questions.filter(item => isVisibleByFilter(item, keyword, extraValue, answerValue));
      render(filtered);
      localStorage.setItem(STORAGE.reviewFilter, String(reviewOnlyMode));
      updateReviewFilterButton();
    }

    searchInput.addEventListener('input', filterQuestions);
    extraFilter.addEventListener('change', filterQuestions);
    answerFilter.addEventListener('change', filterQuestions);

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem(STORAGE.theme, document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      updateThemeButton();
    });

    answerToggle.addEventListener('click', () => {
      const visibleIds = Array.from(list.querySelectorAll('.question-card')).map(card => card.id);
      const shouldShow = !allAnswersVisible;
      visibleIds.forEach((id) => {
        if (shouldShow) revealedIds.add(id); else revealedIds.delete(id);
        setCardAnswerState(id, shouldShow);
      });
      syncAnswerToggleState();
    });

    reviewFilterToggle.addEventListener('click', () => {
      reviewOnlyMode = !reviewOnlyMode;
      filterQuestions();
    });

    updateThemeButton();
    updateReviewFilterButton();
    filterQuestions();
  </script>
</body>
</html>`;
}

function buildSingleGuides(subject1Questions, subject3Questions) {
  const subject1Page = buildPage({
    title: '114年第二次 AI應用規劃師中級｜第一科詳解整理（好記版）',
    lead: '依據正式試題整理 50 題題幹、四個選項、正確答案、詳解、題目選項相關背景知識，並補上好記版解說與口訣型記憶版。',
    chips: ['第一科：人工智慧技術應用與規劃', '共 50 題', '含口訣型記憶版', '可搜尋 / 快速選題 / 標註複習'],
    questions: subject1Questions,
    pageKey: 'ipas-subject1-detailed',
    filterType: 'range',
    resultLabel: '共 50 題',
    footerTitle: '備註',
    footerText: '本頁已補入好記版解說與口訣型記憶版，適合快速複習與課堂教學。若你要，我也可以再補成可列印版或錯題本模式。'
  });

  const subject3Page = buildPage({
    title: '114年第二次 AI應用規劃師中級｜第三科詳解整理（好記版）',
    lead: '依據第三科正式試題整理 50 題題幹、四個選項、正確答案、詳解、背景知識，並補上好記版解說與口訣型記憶版。',
    chips: ['第三科：機器學習技術與應用', '共 50 題', '含口訣型記憶版', '可搜尋 / 快速選題 / 標註複習'],
    questions: subject3Questions,
    pageKey: 'ipas-subject3-detailed',
    filterType: 'range',
    resultLabel: '共 50 題',
    footerTitle: '備註',
    footerText: '第三科部分題目涉及原 PDF 圖片或程式碼截圖，已依題意與答案補成可複習版本；若你提供原圖，我也可以再補成逐行對照版。'
  });

  fs.writeFileSync(OUTPUT_SUBJECT1, subject1Page, 'utf8');
  fs.writeFileSync(OUTPUT_SUBJECT3, subject3Page, 'utf8');
}

function buildTotalSite(sampleQuestions, subject1Questions, subject3Questions) {
  const allQuestions = [
    ...sampleQuestions,
    ...subject1Questions,
    ...subject3Questions
  ];
  const sourceOptions = Array.from(new Map(allQuestions.map(item => [item.sourceKey, item.sourceLabel])).entries())
    .map(([key, label]) => `<option value="${key}">${label}</option>`)
    .join('');

  const totalPage = buildPage({
    title: 'iPAS 中級 AI 應用規劃師｜總複習網站',
    lead: '整合樣題版科目一＋科目三、第一科正式考題與第三科正式考題，保留搜尋、快速選題、答案顯示、標註複習與 dark mode 等功能，方便一站式總複習。',
    chips: ['樣題整理 30 題', '第一科正式題 50 題', '第三科正式題 50 題', '總計 130 題'],
    questions: allQuestions,
    pageKey: 'ipas-total-review',
    filterType: 'source',
    resultLabel: '共 130 題',
    footerTitle: '整合說明',
    footerText: '本網站已整合三份內容來源：樣題整理、第一科正式題、第三科正式題。你可以用來源篩選快速切換，也能標註不熟題目做集中複習。',
    extraSelectLabel: '來源',
    extraSelectOptions: sourceOptions
  });

  fs.writeFileSync(OUTPUT_TOTAL, totalPage, 'utf8');
}

function main() {
  const subject1Questions = getSubject1Questions();
  const subject3Questions = addMetadata(SUBJECT3_DATA, 'subject3-official', '第三科正式題', '第三科｜正式考題');
  const sampleQuestions = parseSampleGuide();
  buildSingleGuides(subject1Questions, subject3Questions);
  buildTotalSite(sampleQuestions, subject1Questions, subject3Questions);
  console.log('Generated:');
  console.log('- subject1_exam_detailed_guide.html');
  console.log('- subject3_exam_detailed_guide.html');
  console.log('- ipas_total_review.html');
}

main();
