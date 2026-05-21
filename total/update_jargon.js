const fs = require('fs');

const files = [
    'ipas_total_review.html',
    'subject1_exam_detailed_guide.html',
    'subject3_exam_detailed_guide.html'
];

const jargonDict = {
    'Transformer': '一款基於「注意力機制」的AI模型架構，擅長處理長篇文字，是ChatGPT的底層基礎。',
    'NLP|自然語言處理': '讓電腦聽懂、看懂、理解人類語言的技術。',
    '情感分析|Sentiment Analysis': 'AI判斷一段文字帶有正向、負向或中立情緒的技術。',
    '自注意力機制|Self-Attention Mechanism': '讓模型在看一個詞時，能同時注意到句子中其他重要字詞的技術。',
    '卷積運算|Convolution Operation': '常用於影像處理，用一個小方塊在圖片上滑動來尋找邊緣或形狀特徵的計算方式。',
    '強化學習|Reinforcement Learning': '讓AI從錯誤中學習的策略（做對給獎勵、做錯給懲罰）。',
    '資料增強|Data Augmentation': '把原有的資料稍微修改（如圖片旋轉、放大），人為創造出更多訓練樣本的方法。',
    'BERT': '一種Google開發的語言模型，強項是能「雙向」看完整句話的前後文來理解詞意。',
    'MLM|遮罩語言模型': '把句子裡的一些字遮起來，讓AI像玩填空題一樣猜出那些字，藉此學習語言。',
    '對抗訓練|對抗樣本訓練': '加入微小擾動的「陷阱題」給AI練習，讓AI變得抗干擾、不容易被騙。',
    '解碼器|Decoder': '生成式AI的「輸出端」，負責把學到的特徵轉換成人類看懂的文字或圖片。',
    '詞向量|Word Embedding': '把人類的文字轉換成電腦看得懂的數字座標，意思相近的詞在空間中距離越近。',
    'Word2Vec': '把詞轉換成向量的經典技術，主要透過「猜前後文」來學習詞意。',
    'GloVe': '另一種把詞轉成向量的技術，主要透過統計「兩個詞有多常一起出現」來學習。',
    '共現統計': '計算兩個詞在大量文章中，有多常一起出現的統計方法。',
    'TF-IDF': '用來找出文章關鍵字的統計法。常出現的字通常分數高，但在所有文章都出現的字分數會被壓低。',
    'N-gram': '假設每一個字只和它前面的N個字有關，以此來計算句子出現機率的傳統統計模型。',
    'mAP|平均精確率': '衡量AI在圖片中「框出所有類別物件」綜合準確度的一種常見給分標準。',
    'IoU|交併比|IoU 閾值': '計算「AI畫的預測框」跟「人工畫的真實框」重疊程度的指標，越高代表框得越準。',
    '召回率|Recall': '在所有「真正標準答案」中，AI成功挑出抓中幾個。注重的是「不要漏抓」。',
    'Softmax': '把AI輸出的一堆任意數字，轉換成加起來等於100%的「機率」，用來判斷模型最猜哪個類別。',
    'Max-Pooling|最大池化': '把圖片區域縮小，只保留區塊裡數值最大（最明顯）的特徵，用來簡化後續計算。',
    'F1分數|F1 Score|F1-score|F1 分數': '綜合考量「精確率」和「召回率」的調和平均，常在正負樣本不平衡時用來評估模型好壞。',
    'DBSCAN': '一種AI分群演算法，只要資料密集就圈成一群，而且能自動把孤立的點當作「雜訊」。',
    '多重共線性|Multicollinearity': '當你用來預測的多個特徵間高度相關（例如坪數和平方公尺），會讓模型係數計算混亂的問題。',
    'PCA|主成分分析': '把原本很多、很雜的資料特徵，濃縮轉換成幾個互不干擾、且能保留最大資訊量的「主成分」。',
    'Kubernetes|K8s': '一種用來管理、自動調度大量放在「容器」裡的應用程式的平台。',
    '泛化能力|Generalization': '預測模型除了在訓練背熟答案外，真正在「面對沒看過的新資料」時也能給出準確預測的能力。',
    '交叉驗證|Cross-Validation': '把資料切塊，輪流拿一塊當考卷、其他當練習題，藉此反覆測試模型真實實力的方法。',
    '早期停止|Early Stopping': 'AI在訓練過程中，一旦發現「在驗證集」越考越差時，就提早結束訓練以防止過擬合。',
    'MLOps': '一套讓AI從開發訓練、上線部署到持續監控，都能像自動化流水線順暢運作的管理方式。',
    'RAG|檢索增強生成': '讓AI回答問題前，先去系統裡「搜尋正確的參考文件」，再根據搜到的內容回答，減少AI亂編。',
    'Attention Collapse|注意力分布過於平均': 'AI在算注意力時，每個字都分配差不多的重要性，導致模型抓不到真正的重點。',
    '稀疏化|Sparsity Constraint': '強迫模型把許多不重要的參數或注意力權重直接變成「零」，以強化模型對少數關鍵的專注度。',
    'Back-Translation|反向翻譯': '先將A語言翻譯成B語言，再把B語言翻回A語言，用以創造出更多不同句型的新訓練資料。',
    'LASSO|L1正則化': '透過數學懲罰，強迫模型把不重要特徵的係數直接變成零，自動幫你做到「特徵篩選」。',
    'GAN|生成對抗網路': '由兩個神經網路（一個造假、一個抓假）互相博弈，藉此訓練出能產出逼真資料的生成模型。',
    'Wasserstein距離|WGAN': '一種改良版的數學量測距離，能讓GAN在訓練時不容易發生崩潰，過程更穩定。',
    '資料漂移|資料分佈漂移|Data Drift': '模型上線後，使用者輸入的新資料特性漸漸偏離當初訓練用的資料，導致預測準確率下滑。',
    '概念漂移|Concept Drift': '資料本身沒什麼變，但是「應有的正確答案」定義改變了，導致舊模型預測失效。',
    '差分隱私|Differential Privacy': '故意在資料運算結果中加入受控的背景雜訊，確保外部無法反推回特定個人的真實隱私。',
    '決策樹|Decision Tree': '讓AI像玩「猜猜看」一樣，根據條件(是或否)一層一層往下問，最後得出分類或數值結果。',
    'SVM|支持向量機': '演算法試圖在不同類別的資料群中，劃出一條「最寬的界線（邊界最大化）」來分隔它們。',
    '持續整合|CI': '工程師一提交程式碼，系統就自動幫忙建置與執行各種測試，及早發現錯誤（多用於軟體開發）。',
    '水平擴展|Auto Scaling': '在流量大時自動幫系統臨時增加多台伺服器，流量小再慢慢縮減，彈性調配雲端資源。',
    '語義分割|Semantic Segmentation': 'AI判斷圖片中「每一個像素」是屬於哪個類別（天空、車子），但不會區分不同的車。',
    '實例分割|Instance Segmentation': '除判斷特定類別外，還能把同類物件一個個區分出來（這是第一輛車、第二輛車）。',
    '全景分割|Panoptic Segmentation': '語義分割 + 實例分割的終極版。背景（天空馬路）都塗色，同時也把個別物件（人車）一物一物區分開。',
    '零樣本分類|Zero-shot Classification': 'AI事先完全沒用過該類別的照片訓練，但只要靠文字描述，它就能認出圖片內容。',
    '網格搜尋|Grid Search': '將所有想要嘗試的模型參數組成一張表，AI乖乖地把每一種組合全部試過一遍找最優解。',
    '隨機搜尋|Random Search': '不照表全試，而是在參數範圍內「隨機」抽樣測試，通常在參數維度很高時能更快找到不錯的結果。',
    'Stable Diffusion': '目前極具代表性的AI圖像生成開源模型，透過控制雜訊從無到有來繪製圖片。',
    '擴散模型|Diffusion Model': '這類生成模型是藉由「先一步步把圖片變雜訊，再學習怎麼一步步去雜訊還原圖片」的方式來運作。',
    'CFG值': '文字生圖的控制參數之一。調越高，AI越死板遵守你的提示詞；調低則AI會自己發放飛創意。',
    '採樣器|Sampler': '決定去雜訊生成圖片時所採用的數值演算法與路徑，它會影響圖片生成的特徵細節與速度。',
    'VAE|變分自編碼器': '把資料壓縮轉換成潛在空間裡的一種「機率分布」，需要時再從這個分布裡隨機抽樣，還原生成出新資料。',
    '精確率|Precision': 'AI判斷為「陽性或有罪」的所有結果中，到底有多少是真的。注重的是減少「誤報/抓錯人」。',
    '批次大小|Batch Size': 'AI在訓練時，每次「看多少筆資料」才去更新一次它的權重公式。',
    'KL散度|KL Divergence': '資訊理論中用來測量「這兩種機率分布形狀到底差多遠」的指標。',
    'T檢定|t-test|t檢定': '用來檢驗兩組樣本的「平均值」之間有沒有統計上的顯著差異。',
    '卡方檢定|Chi-square Test': '用來檢驗兩個「類別型變數」（例如科系與性別）之間是不是有顯著的關聯性。',
    'L2正則化|Ridge': '透過懲罰，強迫模型所有的特徵係數都盡量縮小變平滑（但不歸零），讓模型預測不易過度波動。',
    '梯度消失|Gradient Vanishing': '在很深的神經網路裡，回傳的調整訊號（誤差）越傳越小，導致最前面的層根本學不到東西。',
    '局部最優解|Local Minimum': 'AI在尋求最佳解（找最低谷）時，不小心卡在一個半山腰的小坑洞，誤以為已經到底了。',
    'KD-Tree|Ball Tree': '幫多維空間資料建立的「樹狀索引」，這樣要找鄰近點時就能快速跳過不可能的區域，計算快很多。',
    '特徵工程|Feature Engineering': '分析師把原始資料整理、轉換、合成出能夠讓AI更好理解且更有預測力的新表格欄位。',
    'XGBoost': '一種極強大的「梯度提升決策樹」框架，靠著一棵樹接著一棵樹修正前者的錯誤，在多數表格式比賽中稱霸。',
    '蒙地卡羅方法|Monte Carlo Method': '遇到很難用公式算出的問題，就用電腦瘋狂丟「幾萬次亂數隨機抽樣」，用大量嘗試結果來估算正確答案。',
    '同態加密|Homomorphic Encryption': '猶如把數據「鎖在透明保險箱」，可以在不解密的情況下，直接對裡面的密文做數學運算。',
    'MSE|均方誤差': '把每次預測的「誤差值平方」再全加起來算平均，數值越小代表模型整體猜得越準。',
    'RMSE|均方根誤差': '把 MSE 算好的結果再進行「開根號」，這樣誤差單位的量級就能跟原始要預測的目標單位一樣了。',
    'Sigmoid': '一種經典啟動函數，特徵是把輸出全部壓縮到「0 到 1」之間，看起來像機率值，但在深層網路容易引發梯度消失。',
    'ReLU': '神經網路最受歡迎的啟動函數。遇到負數變0，正數保持不變。這能簡單快速保留訊號特徵並引進非線性。',
    'Dropout': '神經網路訓練常用絕招，故意在每一次訓練時隨機「關掉」一些神經元，強迫剩下的神經元獨立思考避免死背。',
    '批次正規化|Batch Normalization': '在網路層與層之間，馬上將傳遞的數字「標準化（均值0標準差1）」，能防止數字爆掉，讓訓練快又穩。',
    '特徵縮放|Feature Scaling|標準化': '把數值大小差別很大的各種欄位，轉換壓縮到差不多的數值範圍，避免模型大小眼。',
    '時間複雜度 O\\(n²\\)|O\\(n²\\)': '代表演算法需要計算「資料量平方」的次數（100筆就要1萬次），只要資料一多就會慢到跑不動。',
    'k-Fold|K-Fold': '把資料切塊，輪流挑一塊當作驗證、其他作訓練，如此能減少單次切分帶來的運氣誤差。',
    '殘差|Residual': '觀測結果的真實數字，減去模型預測出來的數字，所剩下的那段不能被模型完美解釋的「差距」。',
    'SMOTE|過採樣': '當罕見的正樣本太少時，就在資料點之間用演算法「無中生有」插入一些合成的假正樣本，幫模型平衡學習。',
    '動量|Momentum': '在梯度下降優化中幫模型加上「慣性」，這樣模型滾下山遇到小坑洞也能靠衝力滑過去，加快走向最低谷。',
    'Adam': '非常常見的優化演算法，它同時具備了慣性(動量)的優勢，且會「自動」幫每個參數調整適合的學習步幅。',
    '遷移學習|Transfer Learning': '把其他人用海量資料預先訓練好的超強AI拿來，只稍微訓練它認得你的專屬小任務資料。',
    'AutoML|自動化機器學習': '丟入資料後，系統能全自動從特徵處理、選演算法到調整超參數一手包辦的懶人包技術。',
    '多任務學習|Multi-task Learning': '教一個AI同時做多件事（如又看懂意圖又抓取人名），讓不同任務的知識互相幫助以節省資源。',
    'PSI|Population Stability Index': '一種衡量「當初模型訓練抓到的特性分布」跟「實際上線後進來的特性分布」到底漂移了多遠的分數。',
    'Model Registry': 'AI模型專用的倉庫，負責統一管理模型的所有改版紀錄、來源細節與各種狀態。',
    '欠擬合|Underfitting': '模型學得太少，連在練習題（訓練資料）上都考得很差，無法掌握資料規則。',
    '過擬合|Overfitting': '模型把練習題（訓練資料）死背下來，考得極高分，但在沒看過的題目（測試資料）上慘敗。',
    '離群點|異常值|Outlier': '和其他正常資料差異極大的點（比如說一堆10歲的小孩中混進一個100歲的老人）。',
    '同態加密|Homomorphic Encryption': '能在「不解密」的狀態下，直接拿加密的資料作數學運算的技術，非常保護隱私。',
    '差分隱私|Differential Privacy': '透過加入受控噪音，確保就算公開了總體統計數據，別人也無法反推出你個人的私密資料。'
};

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    const regex = /const questions = (\[.*\]);/sm;
    const match = content.match(regex);

    if (match) {
        let qs = JSON.parse(match[1]);
        qs.forEach((q) => {
            if (q.sourceKey === "subject1-official" || q.sourceKey === "subject3-official") {
                let foundJargons = new Set();
                let textToScan = [q.question, q.explanation, q.memoryTip, q.mnemonic].join(" ");
                Object.values(q.options).forEach(opt => textToScan += " " + opt);
                if (q.notes) {
                    q.notes.forEach(note => textToScan += " " + note);
                }
                
                for (const [keys, expl] of Object.entries(jargonDict)) {
                    const keyArray = keys.split('|');
                    for (const k of keyArray) {
                        try {
                           let r = new RegExp(k, 'i'); // Simple check (assuming dictionary terms are safe)
                           if (r.test(textToScan)) {
                               foundJargons.add(`<b>${keyArray[0]}</b>：${expl}`);
                               break;
                           }
                        } catch(e) { }
                    }
                }
                
                if (foundJargons.size > 0) {
                    if (!q.notes) q.notes = [];
                    // Remove old annotations if accidentally re-running
                    q.notes = q.notes.filter(n => !n.includes("💡 <b>名詞翻譯百科</b>"));
                    
                    let jargonText = "💡 <b>名詞翻譯百科</b>（給初學者的白話解說）：<ul>" + Array.from(foundJargons).map(j => `<li>${j}</li>`).join("") + "</ul>";
                    q.notes.push(jargonText);
                    q.notesSummary = "選項背景知識與名詞白話解說";
                }
            }
        });
        
        let newQsJson = JSON.stringify(qs);
        const codeStart = content.indexOf('const questions = ');
        const codeEnd = content.indexOf(';', match.index + 'const questions = '.length + match[1].length);
        
        const newCode = content.substring(0, match.index) + 'const questions = ' + newQsJson + content.substring(codeEnd);
        fs.writeFileSync(file, newCode, 'utf-8');
        console.log(`Updated ${file}`);
    }
});
