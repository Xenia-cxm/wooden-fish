document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const woodenFishContainer = document.getElementById('wooden-fish').parentElement;
    let woodenFish = document.getElementById('wooden-fish');
    const meritCountElement = document.getElementById('merit-count');
    const meritPopup = document.getElementById('merit-popup');
    const meritCounter = document.getElementById('merit-counter');
    const wishDiyBtn = document.getElementById('wish-diy');
    const shareBtn = document.getElementById('share-btn');
    const shareCountElement = document.querySelector('.share-count');
    const languageToggle = document.getElementById('language-toggle');
    const progressBar = document.getElementById('progress-bar');
    const achievementNotification = document.getElementById('achievement-notification');
    const achievementText = document.getElementById('achievement-text');

    // 游戏化元素 - 成就系统
    const achievements = [
        { id: 'first_merit', name: { en: 'First Merit', zh: '初次功德' }, description: { en: 'Earn your first merit point', zh: '获得你的第一个功德点' }, threshold: 1, achieved: false },
        { id: 'ten_merits', name: { en: 'Beginner Monk', zh: '初级信徒' }, description: { en: 'Earn 10 merit points', zh: '获得10个功德点' }, threshold: 10, achieved: false },
        { id: 'fifty_merits', name: { en: 'Dedicated Follower', zh: '虔诚信徒' }, description: { en: 'Earn 50 merit points', zh: '获得50个功德点' }, threshold: 50, achieved: false },
        { id: 'hundred_merits', name: { en: 'Enlightened One', zh: '觉悟者' }, description: { en: 'Earn 100 merit points', zh: '获得100个功德点' }, threshold: 100, achieved: false },
        { id: 'first_critical', name: { en: 'Critical Success', zh: '暴击成功' }, description: { en: 'Get your first critical hit', zh: '获得你的第一次暴击' }, threshold: 0, achieved: false, special: 'critical' },
        { id: 'wish_set', name: { en: 'Wishful Thinking', zh: '许愿成功' }, description: { en: 'Set your first wish', zh: '设置你的第一个心愿' }, threshold: 0, achieved: false, special: 'wish' }
    ];
    
    // 进度等级和目标
    const levels = [
        { level: 1, name: { en: 'Novice', zh: '新手' }, threshold: 0 },
        { level: 2, name: { en: 'Apprentice', zh: '学徒' }, threshold: 10 },
        { level: 3, name: { en: 'Practitioner', zh: '修行者' }, threshold: 50 },
        { level: 4, name: { en: 'Adept', zh: '精通者' }, threshold: 100 },
        { level: 5, name: { en: 'Master', zh: '大师' }, threshold: 200 },
        { level: 6, name: { en: 'Grandmaster', zh: '宗师' }, threshold: 500 },
        { level: 7, name: { en: 'Enlightened', zh: '觉悟者' }, threshold: 1000 }
    ];
    
    // 当前等级
    let currentLevel = levels[0];
    
    // 更新等级和进度条
    function updateProgressAndLevel() {
        // 找到当前等级
        let nextLevelIndex = 1;
        for (let i = levels.length - 1; i >= 0; i--) {
            if (meritCount >= levels[i].threshold) {
                currentLevel = levels[i];
                nextLevelIndex = Math.min(i + 1, levels.length - 1);
                break;
            }
        }
        
        // 计算到下一级的进度
        const nextLevel = levels[nextLevelIndex];
        const progressToNextLevel = nextLevel.threshold - currentLevel.threshold;
        const currentProgress = meritCount - currentLevel.threshold;
        const progressPercentage = Math.min(100, Math.max(0, (currentProgress / progressToNextLevel) * 100));
        
        // 更新进度条
        progressBar.style.width = `${progressPercentage}%`;
        
        // 更新等级提示
        const levelTooltip = document.createElement('div');
        levelTooltip.className = 'absolute -top-8 left-0 text-xs text-indigo-600 whitespace-nowrap';
        levelTooltip.textContent = `${currentLevel.name[currentLang]} Lv.${currentLevel.level} (${meritCount}/${nextLevel.threshold})`;
        
        // 移除旧的提示
        const oldTooltip = progressBar.parentElement.querySelector('.absolute');
        if (oldTooltip) {
            progressBar.parentElement.removeChild(oldTooltip);
        }
        
        progressBar.parentElement.appendChild(levelTooltip);
    }
    
    // 检查成就
    function checkAchievements() {
        let newAchievements = false;
        
        for (const achievement of achievements) {
            if (achievement.achieved) continue;
            
            let achieved = false;
            
            if (achievement.special === 'critical' && lastCriticalHit) {
                achieved = true;
                lastCriticalHit = false; // 重置标志
            } else if (achievement.special === 'wish' && userWish && !achievement.achieved) {
                achieved = true;
            } else if (meritCount >= achievement.threshold) {
                achieved = true;
            }
            
            if (achieved) {
                achievement.achieved = true;
                showAchievementNotification(achievement);
                newAchievements = true;
            }
        }
        
        return newAchievements;
    }
    
    // 显示成就通知
    function showAchievementNotification(achievement) {
        achievementText.textContent = achievement.name[currentLang];
        
        // 显示通知
        achievementNotification.style.opacity = '1';
        achievementNotification.style.transform = 'translateX(0)';
        
        // 添加声音效果
        const achievementSound = new Audio('assets/achievement.mp3');
        achievementSound.volume = 0.5;
        achievementSound.play().catch(e => console.log('成就音效播放失败:', e));
        
        // 3秒后隐藏
        setTimeout(() => {
            achievementNotification.style.opacity = '0';
            achievementNotification.style.transform = 'translateX(100%)';
        }, 3000);
    }
    
    // 暴击标志
    let lastCriticalHit = false;

    // 首先完全删除木鱼元素并重建一个全新的
    const newWoodenFish = document.createElement('div');
    newWoodenFish.id = 'wooden-fish';
    newWoodenFish.className = 'wooden-fish hover:scale-105 transition-transform duration-300 cursor-pointer mb-6 relative group';
    newWoodenFish.innerHTML = `
        <div class="absolute inset-0 bg-amber-300 rounded-full opacity-0 group-hover:opacity-20 group-active:opacity-40 transition-opacity duration-300 transform scale-110"></div>
        <img src="assets/wooden-fish.png" alt="Wooden Fish" class="w-48 md:w-64 mx-auto drop-shadow-lg">
    `;
    woodenFish.replaceWith(newWoodenFish);
    woodenFish = newWoodenFish; // 更新引用

    // 音效 - 创建新的音频上下文和缓冲区
    let tapSound = new Audio('assets/wooden-fish-sound.mp3');
    tapSound.preload = 'auto';
    
    // 功德计数器 - 每次刷新页面时重置为0
    let meritCount = 0;
    // 保持分享计数
    let shareCount = localStorage.getItem('shareCount') ? parseInt(localStorage.getItem('shareCount')) : 0;
    
    // 心愿内容
    let userWish = localStorage.getItem('woodenFishWish') || '';
    
    // 初始化显示
    meritCountElement.textContent = meritCount;
    shareCountElement.textContent = shareCount;

    // 检测设备类型 - 更精确的移动设备检测
    const isMobile = (() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        
        // 检查触摸事件支持
        const hasTouchSupport = 'ontouchstart' in window || 
                               navigator.maxTouchPoints > 0 || 
                               navigator.msMaxTouchPoints > 0;
                               
        return mobileRegex.test(userAgent) && hasTouchSupport;
    })();
    
    console.log(`设备类型: ${isMobile ? '移动设备' : '桌面设备'}`);
    
    // 语言设置 - 默认英文，从localStorage中获取
    let currentLang = localStorage.getItem('woodenFishLang') || 'en';
    
    // 翻译对照表
    const translations = {
        en: {
            title: "Digital Wooden Fish",
            subtitle: "Find digital zen through mindful tapping",
            tapInstructions: "Press Spacebar or tap to accumulate merit",
            criticalHitSoon: "Critical Hit Soon!",
            combo: "Combo",
            merit: "Merit",
            yourWish: "Your Wish",
            customizeWish: "Customize Wish",
            share: "Share",
            tapForMerit: "Tap for Merit",
            aboutTitle: "About Digital Wooden Fish",
            aboutContent1: "The Digital Wooden Fish is inspired by the Buddhist tradition of wooden fish drums used during chanting and meditation. In many Asian cultures, tapping on a wooden fish is believed to accumulate merit and bring good fortune.",
            aboutContent2: "Our digital version brings this mindful practice to your screen, offering a moment of calm in your busy day. Each tap represents a moment of mindfulness and presence.",
            culturePerspectiveTitle: "Eastern & Western Cultural Perspectives",
            easternPerspective: "In Eastern Buddhist tradition, the wooden fish (木鱼, mù yú) symbolizes wakeful vigilance. Fish never close their eyes, representing constant awareness. The rhythmic tapping serves as a way to accumulate merit (功德, gōng dé) – positive spiritual energy that contributes to one's karma and future well-being.",
            westernComparison: "For Western audiences, this practice can be compared to several familiar concepts:",
            westernPoint1: "Similar to prayer beads or rosaries in Christianity, where repetitive prayers accumulate spiritual benefits",
            westernPoint2: "Comparable to mindfulness practices in Western psychology, promoting present-moment awareness",
            westernPoint3: "Like digital gratitude journals that help cultivate appreciation and positive mental states",
            westernPoint4: "Akin to meditation apps that offer moments of pause and reflection in daily life",
            culturalConclusion: "While Western traditions often emphasize personal salvation or individual well-being, the Eastern concept of merit focuses on both personal spiritual growth and benefiting others. By tapping the wooden fish, you participate in a centuries-old tradition reimagined for the digital age – bringing together Eastern spiritual practices with contemporary Western mindfulness approaches.",
            howToUseTitle: "How to Use",
            tapFishTitle: "Tap the Fish",
            tapFishDesc: "Click on the wooden fish or press spacebar to tap",
            makeWishTitle: "Make a Wish",
            makeWishDesc: "Customize your wishes and intentions",
            shareTitle: "Share",
            shareDesc: "Share your merit count with friends",
            promptWish: "Enter your wish:",
            wishSet: "Your wish has been set: ",
            meritTowardsWish: "Merit will be accumulated towards this wish.",
            wishCleared: "Wish has been cleared",
            shareText: "I've tapped the wooden fish {0} times and accumulated {0} merit!",
            myWishIs: "My wish is: ",
            joinMe: "Join me in tapping the digital wooden fish!",
            shareFailure: "Sharing failed:",
            shareLinkGenerated: "Share link generated:",
            shareLinkCopied: "Share link has been copied to clipboard!",
            shareLink: "Share link:"
        },
        zh: {
            title: "电子木鱼",
            subtitle: "数电子木鱼，记录你禅修，获得平静心",
            tapInstructions: "按空格键或点击木鱼来积攒功德",
            criticalHitSoon: "即将暴击！",
            combo: "连击",
            merit: "功德",
            yourWish: "您的心愿",
            customizeWish: "许愿",
            share: "分享",
            tapForMerit: "点击积攒功德",
            aboutTitle: "关于电子木鱼",
            aboutContent1: "电子木鱼是受到佛教传统中木鱼敲击仪式的启发而创建的数字化产品。在许多亚洲文化中，敲击木鱼被认为可以积累功德并带来好运。",
            aboutContent2: "我们的电子版本将这种正念的修行带到了你的屏幕上，在忙碌的一天中提供一刻安宁。每一次点击都代表着正念和当下的存在。",
            culturePerspectiveTitle: "东西方文化视角",
            easternPerspective: "在东方佛教传统中，木鱼（木鱼, mù yú）象征着警觉的意识。鱼从不闭眼，代表着持续的觉知。有节奏的敲击是积累功德（功德, gōng dé）的方式——这种积极的精神能量有助于一个人的因果和未来福祉。",
            westernComparison: "对于西方观众，这种修行可以与几个熟悉的概念相比较：",
            westernPoint1: "类似于基督教中的念珠或玫瑰经，重复的祈祷积累精神福祉",
            westernPoint2: "相当于西方心理学中的正念练习，促进当下的觉知",
            westernPoint3: "如同数字感恩日记，帮助培养感激之情和积极的心理状态",
            westernPoint4: "类似于冥想应用程序，在日常生活中提供暂停和反思的时刻",
            culturalConclusion: "虽然西方传统往往强调个人救赎或个人福祉，但东方功德的概念同时关注个人精神成长和利益他人。通过点击电子木鱼，你参与了一个百年传统的数字化重塑——将东方精神实践与当代西方正念方法结合在一起。",
            howToUseTitle: "使用方法",
            tapFishTitle: "敲击木鱼",
            tapFishDesc: "点击木鱼或按空格键敲击",
            makeWishTitle: "许下心愿",
            makeWishDesc: "自定义您的心愿和意向",
            shareTitle: "分享",
            shareDesc: "与朋友分享您的功德数",
            promptWish: "输入你的心愿：",
            wishSet: "您的心愿已设置: ",
            meritTowardsWish: "功德值将用于实现此心愿。",
            wishCleared: "已清除心愿",
            shareText: "我已经敲了{0}次木鱼，积攒了{0}功德！",
            myWishIs: "我的心愿是：",
            joinMe: "来和我一起敲电子木鱼吧！",
            shareFailure: "分享失败:",
            shareLinkGenerated: "分享链接已生成:",
            shareLinkCopied: "分享链接已复制到剪贴板！",
            shareLink: "分享链接:"
        }
    };
    
    // 更新UI语言
    function applyTranslations() {
        // 更新按钮文本
        document.querySelectorAll(`.lang-${currentLang}`).forEach(el => el.style.display = 'inline');
        document.querySelectorAll(`.lang-${currentLang === 'en' ? 'zh' : 'en'}`).forEach(el => el.style.display = 'none');
        
        // 更新主标题和副标题
        document.querySelector('h1').textContent = translations[currentLang].title;
        document.querySelector('header p').textContent = translations[currentLang].subtitle;
        
        // 更新敲击标题 - 使用多种选择器策略，确保一定能找到标题
        const tapTitleSelectors = [
            '.tap-title',  // 类选择器
            'section:first-of-type h2',  // 第一个section的h2
            'main > section:first-child h2',  // main下第一个section的h2
            // 通过内容匹配
            'h2:contains("Tap for Merit")', 
            'h2:contains("敲击获取功德")',
            'h2:contains("功德")',
            'h2:contains("tap")',
            'h2:contains("merit")'
        ];
        
        // 自定义:contains选择器
        let tapTitle = null;
        
        // 首先尝试直接类选择器
        tapTitle = document.querySelector('.tap-title');
        
        // 如果没找到，尝试通过位置选择
        if (!tapTitle) {
            tapTitle = document.querySelector('section:first-of-type h2') || 
                      document.querySelector('main > section:first-child h2');
        }
        
        // 如果还是没找到，尝试通过内容匹配
        if (!tapTitle) {
            const allH2s = document.querySelectorAll('h2');
            for (const h2 of allH2s) {
                const text = h2.textContent.toLowerCase();
                if (text.includes('tap') || 
                    text.includes('merit') || 
                    text.includes('功德') || 
                    text.includes('敲击')) {
                    tapTitle = h2;
                    break;
                }
            }
        }
        
        // 如果找到了，更新内容
        if (tapTitle) {
            tapTitle.textContent = translations[currentLang].tapForMerit;
            console.log('已更新敲击标题:', tapTitle);
        } else {
            console.warn('无法找到敲击标题元素');
        }
        
        // 更新指令文本
        document.querySelector('.instruction').textContent = translations[currentLang].tapInstructions;
        
        // 更新功德标签
        document.querySelector('.merit-label').textContent = translations[currentLang].merit;
        
        // 更新按钮文本
        wishDiyBtn.innerHTML = `<i class="fas fa-heart"></i> ${translations[currentLang].customizeWish}`;
        shareBtn.innerHTML = `<i class="fas fa-share-alt"></i> ${translations[currentLang].share}`;
        
        // 更新对话框元素（如果对话框已经打开）
        const wishDialogTitle = document.querySelector('.wish-dialog-title');
        const wishInput = document.getElementById('wish-input');
        if (wishDialogTitle) {
            wishDialogTitle.textContent = translations[currentLang].promptWish;
        }
        if (wishInput) {
            wishInput.placeholder = currentLang === 'en' ? "Type your wish here..." : "在这里输入您的心愿...";
        }
        
        // 更新各部分标题
        document.querySelectorAll('h2').forEach(h2 => {
            // 更灵活的匹配逻辑，捕获所有可能的混合形式
            if (h2.textContent.includes('Tap for Merit') || 
                h2.textContent.includes('Tap for 功德') || 
                h2.textContent.includes('敲击获取功德') ||
                h2.textContent.includes('Tap') && h2.textContent.includes('功德') ||
                h2.textContent.includes('Merit') && h2.textContent.includes('敲击')) {
                // 直接替换为对应语言的完整文本
                h2.textContent = translations[currentLang].tapForMerit;
            } else if (h2.textContent.includes('About') || h2.textContent.includes('关于')) {
                h2.textContent = translations[currentLang].aboutTitle;
            } else if (h2.textContent.includes('How to Use') || h2.textContent.includes('使用方法')) {
                h2.textContent = translations[currentLang].howToUseTitle;
            }
        });
        
        // 更新关于电子木鱼部分内容
        const aboutSection = document.querySelector('section:nth-of-type(2)');
        if (aboutSection) {
            // 1. 直接更新标题 - 不依赖特定类
            const aboutH2 = aboutSection.querySelector('h2');
            if (aboutH2) {
                aboutH2.textContent = translations[currentLang].aboutTitle;
            }
            
            // 2. 直接操作所有段落 - 不依赖特定类
            const allParagraphs = aboutSection.querySelectorAll('p');
            if (allParagraphs.length >= 2) {
                // 必须更新的前两个段落
                allParagraphs[0].textContent = translations[currentLang].aboutContent1;
                allParagraphs[1].textContent = translations[currentLang].aboutContent2;
                
                // 如果有足够的段落，尝试更新剩余内容
                if (allParagraphs.length >= 4) {
                    allParagraphs[2].textContent = translations[currentLang].easternPerspective;
                    allParagraphs[3].textContent = translations[currentLang].westernComparison;
                }
                
                // 查找结论段落 - 通常是最后一个或倒数第二个
                if (allParagraphs.length >= 5) {
                    // 尝试识别结论段落 - 通常包含"While Western"或相关词语
                    for (let i = 4; i < allParagraphs.length; i++) {
                        if (allParagraphs[i].textContent.includes('while') || 
                            allParagraphs[i].textContent.includes('bringing') ||
                            allParagraphs[i].textContent.includes('西方传统') ||
                            allParagraphs[i].textContent.includes('参与了')) {
                            allParagraphs[i].textContent = translations[currentLang].culturalConclusion;
                            break;
                        }
                    }
                }
            }
            
            // 3. 更新"东西方文化视角"标题 - 使用内容匹配而不是特定选择器
            const allHeadings = aboutSection.querySelectorAll('h3, h4, .text-xl, .font-semibold');
            for (const heading of allHeadings) {
                if (heading.textContent.includes('Eastern') || 
                    heading.textContent.includes('Western') || 
                    heading.textContent.includes('东西方') ||
                    heading.textContent.includes('文化视角')) {
                    heading.textContent = translations[currentLang].culturePerspectiveTitle;
                    break;
                }
            }
            
            // 4. 更新列表项 - 寻找所有可能的列表
            const lists = aboutSection.querySelectorAll('ul, ol');
            for (const list of lists) {
                const items = list.querySelectorAll('li');
                if (items.length >= 4) {
                    // 使用完整的HTML替换，保留原有格式
                    if (currentLang === 'en') {
                        items[0].innerHTML = `<span class="font-medium">Similar to prayer beads or rosaries in Christianity</span>, where repetitive prayers accumulate spiritual benefits`;
                        items[1].innerHTML = `<span class="font-medium">Comparable to mindfulness practices in Western psychology</span>, promoting present-moment awareness`;
                        items[2].innerHTML = `<span class="font-medium">Like digital gratitude journals</span> that help cultivate appreciation and positive mental states`;
                        items[3].innerHTML = `<span class="font-medium">Akin to meditation apps</span> that offer moments of pause and reflection in daily life`;
                    } else {
                        items[0].innerHTML = `<span class="font-medium">类似于基督教中的念珠或玫瑰经</span>，重复的祈祷积累精神福祉`;
                        items[1].innerHTML = `<span class="font-medium">相当于西方心理学中的正念练习</span>，促进当下的觉知`;
                        items[2].innerHTML = `<span class="font-medium">如同数字感恩日记</span>，帮助培养感激之情和积极的心理状态`;
                        items[3].innerHTML = `<span class="font-medium">类似于冥想应用程序</span>，在日常生活中提供暂停和反思的时刻`;
                    }
                }
            }
        }
        
        // 更新"How to Use"部分
        const howToUseSection = document.querySelector('section:nth-of-type(3)');
        if (howToUseSection) {
            const items = howToUseSection.querySelectorAll('.grid > div');
            if (items.length >= 3) {
                items[0].querySelector('h3').textContent = translations[currentLang].tapFishTitle;
                items[0].querySelector('p').textContent = translations[currentLang].tapFishDesc;
                
                items[1].querySelector('h3').textContent = translations[currentLang].makeWishTitle;
                items[1].querySelector('p').textContent = translations[currentLang].makeWishDesc;
                
                items[2].querySelector('h3').textContent = translations[currentLang].shareTitle;
                items[2].querySelector('p').textContent = translations[currentLang].shareDesc;
            }
        }
        
        // 更新心愿显示
        updateWishDisplay();
    }
    
    // 语言切换事件
    languageToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        localStorage.setItem('woodenFishLang', currentLang);
        applyTranslations();
    });
    
    // 初始化语言
    applyTranslations();

    // 暴击相关变量
    let lastTapTime = 0;           // 上次点击时间
    let consecutiveTaps = 0;       // 连续快速点击次数
    let tapInterval = 800;         // 快速点击的时间间隔阈值(毫秒)
    let tapThreshold = Math.floor(Math.random() * 13) + 8;  // 触发暴击所需的连续点击次数(随机8-20次)
    let criticalCooldown = false;  // 暴击冷却状态
    
    // 事件处理全局状态管理 - 全新实现
    const tapState = {
        processing: false,           // 是否正在处理点击
        lastTimestamp: 0,            // 上次点击的时间戳
        touchId: null,               // 当前触摸ID
        debounceTime: 300,           // 去抖动时间(毫秒)
        lockTime: 500,               // 锁定时间(毫秒)
        audioPlaying: false,         // 音频是否正在播放
        audioError: false            // 音频是否发生错误
    };
    
    // 安全的音频播放函数
    function safePlayAudio() {
        if (tapState.audioPlaying) {
            console.log('音频已在播放中，跳过');
            return Promise.resolve();
        }
        
        if (tapState.audioError) {
            console.log('音频系统错误，跳过');
            return Promise.reject(new Error('音频系统错误'));
        }
        
        tapState.audioPlaying = true;
        
        try {
            // 重置音频状态
            tapSound.pause();
            tapSound.currentTime = 0;
            
            // 播放音频并处理完成事件
            return tapSound.play()
                .then(() => {
                    // 音频播放成功，等待结束
                    return new Promise((resolve) => {
                        // 音频自然结束或提前停止时
                        const handleEnded = () => {
                            tapSound.removeEventListener('ended', handleEnded);
                            tapState.audioPlaying = false;
                            resolve();
                        };
                        
                        tapSound.addEventListener('ended', handleEnded, { once: true });
                        
                        // 设置安全超时，确保状态最终会被重置
                        setTimeout(() => {
                            tapState.audioPlaying = false;
                            tapSound.removeEventListener('ended', handleEnded);
                            resolve();
                        }, 1000); // 1秒后超时
                    });
                })
                .catch(error => {
                    console.error('音频播放错误:', error);
                    tapState.audioPlaying = false;
                    
                    // 尝试重新加载音频
                    return new Promise((resolve) => {
                        tapSound = new Audio('assets/wooden-fish-sound.mp3');
                        tapSound.addEventListener('canplaythrough', () => {
                            resolve();
                        }, { once: true });
                        
                        // 设置超时，防止长时间等待
                        setTimeout(resolve, 2000);
                    });
                });
        } catch (error) {
            console.error('严重的音频系统错误:', error);
            tapState.audioError = true;
            tapState.audioPlaying = false;
            return Promise.reject(error);
        }
    }
    
    // 预加载音频 - 更安全的方式
    function preloadAudio() {
        tapSound.load();
        
        if (isMobile) {
            // 在移动设备上，我们需要用户交互来解锁音频
            console.log('移动设备: 等待用户交互来解锁音频');
            
            // 在整个文档上监听一次性的触摸事件
            document.body.addEventListener('touchstart', function initAudio() {
                console.log('用户交互: 尝试解锁音频');
                
                // 播放并立即暂停音频以解锁
                const unlockPromise = tapSound.play()
                    .then(() => {
                        console.log('音频解锁成功');
                        tapSound.pause();
                        tapSound.currentTime = 0;
                    })
                    .catch(error => {
                        console.warn('音频解锁尝试失败:', error);
                        // 错误处理 - 可能需要重新加载
                        tapSound = new Audio('assets/wooden-fish-sound.mp3');
                        tapSound.load();
                    })
                    .finally(() => {
                        // 无论成功失败，都移除这个一次性事件监听器
                        document.body.removeEventListener('touchstart', initAudio);
                    });
                
                // 为了防止音频解锁阻塞UI，我们给一个超时
                setTimeout(() => {
                    document.body.removeEventListener('touchstart', initAudio);
                }, 5000);
            }, { once: true, passive: true });
        } else {
            console.log('桌面设备: 音频预加载');
        }
    }
    
    // 调用预加载
    preloadAudio();

    // 波纹效果函数
    function createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const rect = woodenFish.getBoundingClientRect();
        
        ripple.style.left = `${x - rect.left}px`;
        ripple.style.top = `${y - rect.top}px`;
        ripple.style.width = `${Math.max(rect.width, rect.height) * 0.5}px`;
        ripple.style.height = `${Math.max(rect.width, rect.height) * 0.5}px`;
        
        woodenFish.appendChild(ripple);
        
        setTimeout(() => {
            if (woodenFish.contains(ripple)) {
                ripple.remove();
            }
        }, 800);
    }

    // 统一的点击处理函数 - 完全重写
    function handleTap(clientX, clientY) {
        // 获取当前时间戳
        const now = Date.now();
        
        // 防抖动检查 - 如果两次点击间隔太短，忽略这次点击
        if (now - tapState.lastTimestamp < tapState.debounceTime) {
            console.log(`防抖: 忽略过快的点击 (${now - tapState.lastTimestamp}ms < ${tapState.debounceTime}ms)`);
            return false;
        }
        
        // 状态锁检查 - 如果当前正在处理点击，忽略这次点击
        if (tapState.processing) {
            console.log('状态锁: 当前正在处理点击，忽略');
            return false;
        }
        
        // 更新状态
        tapState.lastTimestamp = now;
        tapState.processing = true;
        
        // 创建视觉效果
        createRippleEffect(clientX, clientY);
        
        // 执行木鱼敲击逻辑
        tapWoodenFish();
        
        // 设置状态锁定时间
        setTimeout(() => {
            console.log('状态锁: 重置处理状态');
            tapState.processing = false;
        }, tapState.lockTime);
        
        return true;
    }
    
    // 鼠标和触摸事件设置 - 使用事件委托
    function setupEventListeners() {
        console.log('设置事件监听器 - 清除旧监听器');
        
        // 清除所有可能的事件监听 (通过克隆和替换)
        const wrapper = document.createElement('div');
        wrapper.className = woodenFishContainer.className;
        wrapper.innerHTML = woodenFishContainer.innerHTML;
        woodenFishContainer.parentNode.replaceChild(wrapper, woodenFishContainer);
        
        // 重新获取引用
        woodenFish = document.getElementById('wooden-fish');
        
        // 为移动设备添加事件处理
        if (isMobile) {
            console.log('设置移动设备触摸事件');
            
            // 触摸开始事件 - 使用捕获阶段
            woodenFish.addEventListener('touchstart', function(e) {
                console.log('触摸开始事件触发');
                e.preventDefault();
                e.stopPropagation();
                
                // 如果已经有触摸ID，忽略这次触摸
                if (tapState.touchId !== null) {
                    console.log('已有触摸ID，忽略');
                    return false;
                }
                
                // 只处理第一个触摸点
                const touch = e.touches[0];
                tapState.touchId = touch.identifier;
                
                // 调用通用处理函数
                const result = handleTap(touch.clientX, touch.clientY);
                console.log(`触摸处理结果: ${result ? '成功' : '被忽略'}`);
                
                return false;
            }, { capture: true, passive: false });
            
            // 触摸结束事件 - 用于重置触摸ID
            woodenFish.addEventListener('touchend', function(e) {
                console.log('触摸结束事件触发');
                e.preventDefault();
                e.stopPropagation();
                
                // 验证触摸ID是否匹配
                if (e.changedTouches.length > 0) {
                    for (let i = 0; i < e.changedTouches.length; i++) {
                        if (e.changedTouches[i].identifier === tapState.touchId) {
                            console.log('触摸ID匹配，重置');
                            tapState.touchId = null;
                            break;
                        }
                    }
                } else {
                    // 始终重置，以防万一
                    tapState.touchId = null;
                }
                
                return false;
            }, { capture: true, passive: false });
            
            // 取消触摸
            woodenFish.addEventListener('touchcancel', function(e) {
                console.log('触摸取消事件触发');
                e.preventDefault();
                e.stopPropagation();
                tapState.touchId = null;
                return false;
            }, { capture: true, passive: false });
            
            // 阻止触摸移动
            woodenFish.addEventListener('touchmove', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, { capture: true, passive: false });
            
            // 阻止所有鼠标事件
            ['mousedown', 'mouseup', 'mousemove', 'click'].forEach(eventType => {
                woodenFish.addEventListener(eventType, function(e) {
                    console.log(`阻止鼠标事件: ${eventType}`);
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }, { capture: true, passive: false });
            });
        } else {
            console.log('设置桌面设备点击事件');
            
            // 桌面设备 - 只使用点击事件
            woodenFish.addEventListener('click', function(e) {
                console.log('点击事件触发');
                e.preventDefault();
                e.stopPropagation();
                
                // 调用通用处理函数
                handleTap(e.clientX, e.clientY);
                
                return false;
            }, { capture: false });
        }
        
        // 空格键事件监听
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space' || e.key === ' ') {
                console.log('空格键事件触发');
                e.preventDefault();
                
                // 获取木鱼中心坐标
                const rect = woodenFish.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // 调用通用处理函数
                handleTap(centerX, centerY);
            }
        });
        
        console.log('事件监听器设置完成');
        
        // 确保在DOM更新后重新应用翻译
        applyTranslations();
    }
    
    // 设置事件监听器
    setupEventListeners();

    // 木鱼敲击核心函数
    function tapWoodenFish() {
        // 获取当前时间用于连击判断
        const currentTime = Date.now();
        
        // 判断是否为快速点击（点击间隔小于阈值）
        const isQuickTap = (currentTime - lastTapTime) < tapInterval;
        lastTapTime = currentTime;
        
        // 根据点击速度更新连续点击计数
        if (isQuickTap) {
            consecutiveTaps++;
            
            // 每次快速点击时都显示连击提示
            if (consecutiveTaps > 1) {
                showComboHint(consecutiveTaps);
            }
        } else {
            // 如果点击间隔过长，重置连击计数
            consecutiveTaps = 1;
        }
        
        // 判断是否触发暴击（连续快速点击达到阈值且不在冷却状态）
        const isCritical = consecutiveTaps >= tapThreshold && !criticalCooldown;
        
        // 如果触发暴击，重置连击计数并设置冷却时间
        if (isCritical) {
            consecutiveTaps = 0;
            criticalCooldown = true;
            lastCriticalHit = true; // 设置暴击标志
            
            // 重新设置随机目标连击数
            tapThreshold = Math.floor(Math.random() * 13) + 8;
            
            // 暴击后3秒冷却时间
            setTimeout(() => {
                criticalCooldown = false;
            }, 3000);
            
            // 添加游戏化元素 - 暴击提示和特效增强
            const criticalMessage = document.createElement('div');
            criticalMessage.className = 'fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-amber-100 text-amber-800 px-8 py-4 rounded-xl shadow-xl z-50 font-bold text-xl';
            criticalMessage.textContent = currentLang === 'en' ? '✨ CRITICAL HIT! ✨' : '✨ 暴击！✨';
            criticalMessage.style.opacity = '0';
            criticalMessage.style.transition = 'opacity 0.3s, transform 0.5s';
            document.body.appendChild(criticalMessage);
            
            setTimeout(() => {
                criticalMessage.style.opacity = '1';
                criticalMessage.style.transform = 'translate(-50%, -10px)';
            }, 10);
            
            setTimeout(() => {
                criticalMessage.style.opacity = '0';
                criticalMessage.style.transform = 'translate(-50%, -30px)';
                setTimeout(() => {
                    document.body.removeChild(criticalMessage);
                }, 500);
            }, 1500);
        }
        
        const meritIncrease = isCritical ? 5 : 1;
        
        // 播放动画
        woodenFish.classList.add('tapped');
        if (isCritical) {
            woodenFish.classList.add('critical');
            setTimeout(() => {
                woodenFish.classList.remove('critical');
            }, 500);
        }
        setTimeout(() => {
            woodenFish.classList.remove('tapped');
        }, 100);
        
        // 安全播放音频
        safePlayAudio().catch(err => {
            console.error('音频播放失败，继续执行功能流程', err);
        });
        
        // 增加功德
        meritCount += meritIncrease;
        meritCountElement.textContent = meritCount;
        
        // 更新进度条和等级
        updateProgressAndLevel();
        
        // 检查成就
        checkAchievements();
        
        // 显示功德弹出动画
        const meritText = document.createElement('div');
        // 根据是否有心愿显示不同的文本
        if (userWish) {
            meritText.textContent = `${userWish} +${meritIncrease}`;
            meritText.style.maxWidth = '200px';
            meritText.style.overflow = 'hidden';
            meritText.style.textOverflow = 'ellipsis';
            meritText.style.whiteSpace = 'nowrap';
        } else {
            meritText.textContent = `+${meritIncrease}`;
        }
        meritText.classList.add('merit-animation');
        
        // 暴击时添加特殊样式
        if (isCritical) {
            meritText.classList.add('critical-hit');
        }
        
        // 随机位置 - 在木鱼上方
        const rect = woodenFish.getBoundingClientRect();
        const x = rect.left + rect.width/2 + (Math.random() * 60 - 30);
        const y = rect.top + rect.height/2;
        
        meritText.style.position = 'fixed';
        meritText.style.left = `${x}px`;
        meritText.style.top = `${y}px`;
        meritText.style.zIndex = '1000';
        meritText.style.color = isCritical ? '#FF6B00' : '#F59E0B';
        meritText.style.fontSize = isCritical ? '2.5rem' : '1.5rem';
        meritText.style.fontWeight = 'bold';
        meritText.style.pointerEvents = 'none';
        
        document.body.appendChild(meritText);
        
        // 暴击时添加额外的视觉效果
        if (isCritical) {
            // 添加光晕效果
            const glow = document.createElement('div');
            glow.className = 'critical-glow';
            glow.style.position = 'fixed';
            glow.style.left = `${rect.left + rect.width/2 - 100}px`;
            glow.style.top = `${rect.top + rect.height/2 - 100}px`;
            glow.style.width = '200px';
            glow.style.height = '200px';
            glow.style.borderRadius = '50%';
            glow.style.background = 'radial-gradient(circle, rgba(255,107,0,0.5) 0%, rgba(255,107,0,0) 70%)';
            glow.style.zIndex = '10';
            glow.style.pointerEvents = 'none';
            document.body.appendChild(glow);
            
            // 创建粒子效果
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.className = 'critical-particle';
                particle.style.position = 'fixed';
                particle.style.left = `${rect.left + rect.width/2}px`;
                particle.style.top = `${rect.top + rect.height/2}px`;
                particle.style.width = '10px';
                particle.style.height = '10px';
                particle.style.borderRadius = '50%';
                particle.style.backgroundColor = '#FF6B00';
                particle.style.zIndex = '10';
                particle.style.pointerEvents = 'none';
                
                // 使用style设置动画变量
                const rotation = i * 30;
                particle.style.setProperty('--rotate', `${rotation}deg`);
                particle.style.opacity = '0';
                particle.style.animation = 'particle-burst 0.8s ease-out forwards';
                document.body.appendChild(particle);
                
                // 移除粒子
                setTimeout(() => {
                    document.body.removeChild(particle);
                }, 800);
            }
            
            // 移除光晕
            setTimeout(() => {
                document.body.removeChild(glow);
            }, 800);
        }
        
        // 删除动画元素
        setTimeout(() => {
            document.body.removeChild(meritText);
        }, 1500);
    }

    // 显示连击提示
    function showComboHint(comboCount) {
        const comboHint = document.createElement('div');
        comboHint.textContent = `${translations[currentLang].combo} x${comboCount} (${comboCount}/${tapThreshold})`;
        comboHint.className = 'combo-hint';
        
        // 获取木鱼位置
        const fishRect = woodenFish.getBoundingClientRect();
        
        // 样式设置
        comboHint.style.position = 'fixed';
        
        // 根据设备类型调整位置
        if (isMobile) {
            // 移动设备：放在木鱼下方
            comboHint.style.left = `${fishRect.left + fishRect.width/2}px`;
            comboHint.style.top = `${fishRect.bottom + 20}px`;
            comboHint.style.transform = 'translateX(-50%)';
        } else {
            // 桌面设备：放在木鱼右侧靠近处
            comboHint.style.left = `${fishRect.right + 20}px`;
            comboHint.style.top = `${fishRect.top + fishRect.height/2}px`;
            comboHint.style.transform = 'translateY(-50%)';
        }
        
        comboHint.style.color = '#6366F1';
        comboHint.style.fontSize = '1.25rem';
        comboHint.style.fontWeight = 'bold';
        comboHint.style.padding = '5px 15px';
        comboHint.style.borderRadius = '15px';
        comboHint.style.backgroundColor = 'rgba(243, 244, 246, 0.85)';
        comboHint.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        comboHint.style.zIndex = '1000';
        comboHint.style.opacity = '0';
        comboHint.style.transition = 'opacity 0.3s';
        
        // 根据进度改变颜色
        const progress = comboCount / tapThreshold;
        if (progress >= 0.8) {
            comboHint.style.color = '#FF6B00';
            comboHint.style.backgroundColor = 'rgba(255, 248, 223, 0.9)';
            comboHint.style.borderLeft = '3px solid #FF6B00';
            comboHint.style.borderRight = '3px solid #FF6B00';
            comboHint.textContent = `${translations[currentLang].combo} x${comboCount} (${comboCount}/${tapThreshold}) ${translations[currentLang].criticalHitSoon}`;
        } else if (progress >= 0.5) {
            comboHint.style.color = '#F59E0B';
            comboHint.style.borderBottom = '2px solid #F59E0B';
        }
        
        document.body.appendChild(comboHint);
        
        // 淡入效果
        setTimeout(() => {
            comboHint.style.opacity = '1';
            
            // 淡出并移除效果
            setTimeout(() => {
                comboHint.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(comboHint);
                }, 300);
            }, 1000);
        }, 10);
    }

    // 更新心愿显示
    function updateWishDisplay() {
        const wishDisplayArea = document.getElementById('wish-display-area');
        wishDisplayArea.innerHTML = '';
        
        // 如果有心愿，显示它
        if (userWish) {
            const wishDisplay = document.createElement('div');
            wishDisplay.className = 'wish-display bg-indigo-50 px-4 py-2 rounded-lg shadow-sm text-center mb-2';
            wishDisplay.innerHTML = `<i class="fas fa-heart text-pink-500"></i> <span class="font-medium">${translations[currentLang].yourWish}:</span> ${userWish}`;
            wishDisplayArea.appendChild(wishDisplay);
        }
        
        // 检查心愿成就
        checkAchievements();
    }
    
    // 心愿DIY
    wishDiyBtn.addEventListener('click', () => {
        // 获取对话框元素
        const wishDialog = document.getElementById('wish-dialog');
        const wishInput = document.getElementById('wish-input');
        const wishCancel = document.getElementById('wish-cancel');
        const wishConfirm = document.getElementById('wish-confirm');
        const dialogTitle = document.querySelector('.wish-dialog-title');
        
        // 设置对话框标题和初始值
        dialogTitle.textContent = translations[currentLang].promptWish;
        wishInput.value = userWish;
        wishInput.placeholder = currentLang === 'en' ? "Type your wish here..." : "在这里输入您的心愿...";
        
        // 显示对话框
        wishDialog.classList.remove('hidden');
        wishInput.focus();
        
        // 取消按钮事件
        wishCancel.onclick = () => {
            wishDialog.classList.add('hidden');
        };
        
        // 确认按钮事件
        wishConfirm.onclick = () => {
            const wish = wishInput.value.trim();
            userWish = wish;
            localStorage.setItem('woodenFishWish', userWish);
            
            if (userWish) {
                // 创建一个提示框而不是使用alert
                const toast = document.createElement('div');
                toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-indigo-100 text-indigo-800 px-6 py-3 rounded-lg shadow-lg z-50';
                toast.textContent = `${translations[currentLang].wishSet}${userWish}`;
                document.body.appendChild(toast);
                
                // 3秒后自动消失
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transition = 'opacity 0.5s';
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 500);
                }, 3000);
                
                // 更新心愿显示
                updateWishDisplay();
            } else {
                // 创建一个提示框
                const toast = document.createElement('div');
                toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-indigo-100 text-indigo-800 px-6 py-3 rounded-lg shadow-lg z-50';
                toast.textContent = translations[currentLang].wishCleared;
                document.body.appendChild(toast);
                
                // 3秒后自动消失
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transition = 'opacity 0.5s';
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 500);
                }, 3000);
                
                // 更新心愿显示
                updateWishDisplay();
            }
            
            // 隐藏对话框
            wishDialog.classList.add('hidden');
        };
        
        // 按下Enter键确认
        wishInput.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                wishConfirm.click();
            }
        };
    });
    
    // 分享功能
    shareBtn.addEventListener('click', () => {
        shareCount++;
        shareCountElement.textContent = shareCount;
        localStorage.setItem('shareCount', shareCount);
        
        // Create share link
        const shareUrl = window.location.href;
        let shareText = translations[currentLang].shareText.replace('{0}', meritCount);
        
        // If there's a wish, include it
        if (userWish) {
            shareText += ` ${translations[currentLang].myWishIs}${userWish}.`;
        }
        
        shareText += ` ${translations[currentLang].joinMe}`;
        
        // Use Web Share API (for mobile devices)
        if (navigator.share) {
            navigator.share({
                title: translations[currentLang].title,
                text: shareText,
                url: shareUrl
            }).catch(error => {
                console.log(`${translations[currentLang].shareFailure} ${error}`);
                alert(`${translations[currentLang].shareLinkGenerated}\n${shareText}\n${shareUrl}`);
            });
        } else {
            // Copy to clipboard
            const textarea = document.createElement('textarea');
            textarea.value = `${shareText} ${shareUrl}`;
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                alert(translations[currentLang].shareLinkCopied);
            } catch (err) {
                alert(`${translations[currentLang].shareLink}\n${shareText}\n${shareUrl}`);
            }
            
            document.body.removeChild(textarea);
        }
    });

    // 初始化功能
    updateProgressAndLevel();
    
    // 首次访问时显示点击提示，3秒后自动消失
    setTimeout(() => {
        const clickHint = document.querySelector('#wooden-fish .absolute');
        if (clickHint) {
            clickHint.style.opacity = '0';
            setTimeout(() => {
                clickHint.style.display = 'none';
            }, 500);
        }
    }, 3000);
}); 