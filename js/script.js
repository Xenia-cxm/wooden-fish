document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素 - 一次性获取所有重要元素引用
    const woodenFishContainer = document.getElementById('wooden-fish').parentElement;
    let woodenFish = document.getElementById('wooden-fish');
    let meritCountElement = document.getElementById('merit-count');
    const meritPopup = document.getElementById('merit-popup');
    const meritCounter = document.getElementById('merit-counter');
    let wishDiyBtn = document.getElementById('wish-diy');
    let shareBtn = document.getElementById('share-btn');
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
    
    // 功德计数器 - 从localStorage中获取，如果不存在则为0
    let meritCount = localStorage.getItem('woodenFishMerit') ? parseInt(localStorage.getItem('woodenFishMerit')) : 0;
    // 保持分享计数
    let shareCount = localStorage.getItem('shareCount') ? parseInt(localStorage.getItem('shareCount')) : 0;
    
    // 心愿内容
    let userWish = localStorage.getItem('woodenFishWish') || '';
    
    // 初始化显示
    if (meritCountElement) {
        meritCountElement.textContent = meritCount;
    }
    
    if (shareCountElement) {
        shareCountElement.textContent = shareCount;
    }
    
    // 音效 - 创建新的音频上下文和缓冲区
    let tapSound = new Audio('assets/wooden-fish-sound.mp3');
    tapSound.preload = 'auto';
    
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
        
        // 更新按钮文本 - 确保总是找到按钮并更新
        const wishButton = document.getElementById('wish-diy');
        if (wishButton) {
            wishButton.innerHTML = `<i class="fas fa-heart"></i> ${translations[currentLang].customizeWish}`;
            console.log('已更新许愿按钮文本:', translations[currentLang].customizeWish);
        } else {
            console.warn('找不到许愿按钮元素');
        }
        
        const shareButton = document.getElementById('share-btn');
        if (shareButton) {
            shareButton.innerHTML = `<i class="fas fa-share-alt"></i> ${translations[currentLang].share}`;
        }
        
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
    function setupLanguageToggle() {
        if (!languageToggle) return;
        
        // 清除旧事件并设置新事件
        const newLangToggle = languageToggle.cloneNode(true);
        languageToggle.parentNode.replaceChild(newLangToggle, languageToggle);
        
        // 设置切换事件
        newLangToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'zh' : 'en';
            localStorage.setItem('woodenFishLang', currentLang);
            applyTranslations();
        });
    }
    
    // 优化连击判断参数
    let lastTapTime = 0;           // 上次点击时间
    let consecutiveTaps = 0;       // 连续快速点击次数
    let tapInterval = 800;         // 快速点击的时间间隔阈值(毫秒)
    let tapThreshold = Math.floor(Math.random() * 8) + 8;  // 降低触发暴击所需的连续点击次数
    let criticalCooldown = false;  // 暴击冷却状态
    let lastCriticalHit = false;   // 记录上次是否为暴击
    
    // 事件处理全局状态管理 - 全新实现
    const tapState = {
        processing: false,           // 是否正在处理点击
        lastTimestamp: 0,            // 上次点击的时间戳
        touchId: null,               // 当前触摸ID
        debounceTime: 150,           // 去抖动时间(毫秒) - 降低为150ms提高响应速度
        lockTime: 200,               // 锁定时间(毫秒) - 降低为200ms增加点击响应
        audioPlaying: false,         // 音频是否正在播放
        audioError: false            // 音频是否发生错误
    };
    
    // 安全的音频播放函数
    function safePlayAudio() {
        if (tapState.audioPlaying) {
            return Promise.resolve();
        }
        
        if (tapState.audioError) {
            return Promise.reject(new Error('音频系统错误'));
        }
        
        // 使用多个音频实例，避免单一实例被占用
        let soundInstance = null;
        
        // 使用音频池
        if (!window.audioPool) {
            window.audioPool = [];
            for (let i = 0; i < 5; i++) {
                const audio = new Audio('assets/wooden-fish-sound.mp3');
                audio.preload = 'auto';
                audio.volume = 0.8;
                window.audioPool.push(audio);
            }
        }
        
        // 从池中获取可用音频
        for (let i = 0; i < window.audioPool.length; i++) {
            const audio = window.audioPool[i];
            if (audio.paused || audio.ended) {
                soundInstance = audio;
                break;
            }
        }
        
        // 如果没有可用音频，创建新实例
        if (!soundInstance) {
            soundInstance = new Audio('assets/wooden-fish-sound.mp3');
            soundInstance.volume = 0.8;
        }
        
        // 播放音频，但不等待完成
        try {
            soundInstance.currentTime = 0;
            return soundInstance.play().catch(() => Promise.resolve());
        } catch (e) {
            return Promise.resolve();
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

    // 核心函数：初始化木鱼界面
    function initializeWoodenFish() {
        console.log('初始化木鱼界面');
        
        // 添加必要的CSS样式，确保功德动画显示正常
        addCustomStyles();
        
        // 只在初始化时替换一次木鱼元素
        if (!document.getElementById('wooden-fish')) {
            console.error('找不到木鱼元素，创建新元素');
            
            const newElement = document.createElement('div');
            newElement.id = 'wooden-fish';
            newElement.className = 'wooden-fish hover:scale-105 transition-transform duration-300 cursor-pointer mb-6 relative group';
            newElement.innerHTML = `
                <div class="absolute inset-0 bg-amber-300 rounded-full opacity-0 group-hover:opacity-20 group-active:opacity-40 transition-opacity duration-300 transform scale-110"></div>
                <img src="assets/wooden-fish.png" alt="Wooden Fish" class="w-48 md:w-64 mx-auto drop-shadow-lg">
            `;
            
            // 如果找到容器，添加到容器中
            if (woodenFishContainer) {
                woodenFishContainer.appendChild(newElement);
            } else {
                // 否则添加到页面主体
                document.body.appendChild(newElement);
            }
            
            // 更新引用
            woodenFish = newElement;
        }
        
        // 重新获取功德计数元素（如果已丢失）
        if (!meritCountElement || !meritCountElement.parentNode) {
            meritCountElement = document.getElementById('merit-count');
            if (meritCountElement) {
                meritCountElement.textContent = meritCount;
            }
        }
        
        // 重新获取按钮元素（如果已丢失）
        if (!wishDiyBtn || !wishDiyBtn.parentNode) {
            wishDiyBtn = document.getElementById('wish-diy');
        }
        
        if (!shareBtn || !shareBtn.parentNode) {
            shareBtn = document.getElementById('share-btn');
        }
        
        // 设置事件监听器 - 不再重新创建元素
        setupEventListeners(false);
        
        // 初始化UI
        updateProgressAndLevel();
        updateWishDisplay();
        
        console.log('木鱼界面初始化完成');
    }
    
    // 添加必要的CSS样式到页面头部
    function addCustomStyles() {
        // 检查是否已添加样式
        if (document.getElementById('wooden-fish-custom-styles')) {
            return;
        }
        
        // 创建样式元素
        const styleEl = document.createElement('style');
        styleEl.id = 'wooden-fish-custom-styles';
        
        // 添加功德动画相关样式
        styleEl.textContent = `
            /* 功德动画弹出样式 */
            .merit-popup-text {
                display: block;
                transform-origin: center bottom;
                will-change: transform, opacity;
                text-align: center;
                white-space: nowrap;
                transform: translateY(-20px);
                animation: floatUp 1.5s ease-out forwards;
                -webkit-animation: floatUp 1.5s ease-out forwards;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                -webkit-font-smoothing: antialiased;
            }
            
            /* 暴击样式 */
            .critical-merit {
                animation: criticalPulse 1.5s ease-out forwards;
                -webkit-animation: criticalPulse 1.5s ease-out forwards;
                transform: scale(1.2) translateY(-20px);
            }
            
            /* 上浮动画 */
            @keyframes floatUp {
                0% { transform: translateY(0); opacity: 0; }
                10% { opacity: 1; }
                70% { opacity: 1; }
                100% { transform: translateY(-80px); opacity: 0; }
            }
            
            @-webkit-keyframes floatUp {
                0% { -webkit-transform: translateY(0); opacity: 0; }
                10% { opacity: 1; }
                70% { opacity: 1; }
                100% { -webkit-transform: translateY(-80px); opacity: 0; }
            }
            
            /* 暴击脉冲动画 */
            @keyframes criticalPulse {
                0% { transform: scale(1) translateY(0); opacity: 0; }
                10% { transform: scale(1.2) translateY(-10px); opacity: 1; }
                20% { transform: scale(1.1) translateY(-20px); }
                70% { opacity: 1; }
                100% { transform: scale(1) translateY(-100px); opacity: 0; }
            }
            
            @-webkit-keyframes criticalPulse {
                0% { -webkit-transform: scale(1) translateY(0); opacity: 0; }
                10% { -webkit-transform: scale(1.2) translateY(-10px); opacity: 1; }
                20% { -webkit-transform: scale(1.1) translateY(-20px); }
                70% { opacity: 1; }
                100% { -webkit-transform: scale(1) translateY(-100px); opacity: 0; }
            }
            
            /* 光晕放大动画 */
            .merit-glow {
                transition: opacity 0.8s, transform 0.8s;
                -webkit-transition: opacity 0.8s, -webkit-transform 0.8s;
                opacity: 1;
                transform: scale(1);
                -webkit-transform: scale(1);
            }
            
            /* 确保木鱼点击动画 */
            .wooden-fish.tapped {
                transform: scale(0.95);
                -webkit-transform: scale(0.95);
                transition: transform 0.1s ease-out;
                -webkit-transition: -webkit-transform 0.1s ease-out;
            }
            
            /* 连击提示样式 */
            .combo-hint {
                animation: fadeInOut 1.3s ease-out forwards;
                -webkit-animation: fadeInOut 1.3s ease-out forwards;
            }
            
            @keyframes fadeInOut {
                0% { opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { opacity: 0; }
            }
            
            @-webkit-keyframes fadeInOut {
                0% { opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { opacity: 0; }
            }
            
            /* 粒子动画 */
            @keyframes particleFade {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.5); }
            }
            
            @-webkit-keyframes particleFade {
                0% { opacity: 1; -webkit-transform: scale(1); }
                100% { opacity: 0; -webkit-transform: scale(0.5); }
            }
        `;
        
        // 添加到文档头部
        document.head.appendChild(styleEl);
        console.log('已添加自定义CSS样式');
    }
    
    // 优化的事件监听设置
    function setupEventListeners(shouldReplaceElement = false) {
        console.log('设置事件监听器');
        
        // 如果指定了替换元素，且元素存在
        if (shouldReplaceElement && woodenFish && woodenFish.parentNode) {
            console.log('替换木鱼元素');
            
            // 获取当前引用的副本
            const oldElement = woodenFish;
            
            // 创建新元素并保留所有属性和内容
            const newElement = oldElement.cloneNode(true);
            
            // 替换元素
            oldElement.parentNode.replaceChild(newElement, oldElement);
            
            // 更新引用
            woodenFish = newElement;
        }
        
        // 为移动设备设置触摸事件
        if (isMobile) {
            console.log('设置移动设备触摸事件');
            
            // 清除可能存在的旧事件（通过元素替换已完成）
            const touchStartHandler = function(e) {
                e.preventDefault();
                
                // 获取第一个触摸点
                const touch = e.touches[0];
                handleTap(touch.clientX, touch.clientY);
            };
            
            // 使用事件捕获提高响应速度，passive: false确保能调用preventDefault
            woodenFish.addEventListener('touchstart', touchStartHandler, { 
                passive: false, 
                capture: true 
            });
            
            // 防止默认行为干扰（如滚动、缩放）
            const touchEndHandler = function(e) {
                e.preventDefault();
            };
            
            ['touchend', 'touchcancel', 'touchmove'].forEach(eventType => {
                woodenFish.addEventListener(eventType, touchEndHandler, { 
                    passive: false,
                    capture: true
                });
            });
        } else {
            console.log('设置桌面设备点击事件');
            
            // 桌面设备设置点击事件 - 使用mousedown而不是click提高响应速度
            woodenFish.addEventListener('mousedown', function(e) {
                e.preventDefault();
                handleTap(e.clientX, e.clientY);
            }, { capture: true });
        }
        
        // 空格键敲击木鱼
        const spaceHandler = function(e) {
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();
                
                // 获取木鱼中心坐标
                const rect = woodenFish.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // 调用点击处理函数
                handleTap(centerX, centerY);
            }
        };
        
        // 移除旧的空格键事件（如果存在）
        document.removeEventListener('keydown', spaceHandler);
        // 添加新的空格键事件
        document.addEventListener('keydown', spaceHandler);
        
        // 设置许愿按钮事件
        setupWishEvents();
        
        // 设置分享按钮事件
        setupShareEvents();
        
        // 设置语言切换事件
        setupLanguageToggle();
        
        console.log('事件监听器设置完成');
    }
    
    // 简化的点击处理函数
    function handleTap(clientX, clientY) {
        // 防抖动 - 降低最小时间间隔为150ms，提高连击响应速度
        const now = Date.now();
        if (now - tapState.lastTimestamp < 150) {
            return false;
        }
        
        // 更新时间戳
        tapState.lastTimestamp = now;
        
        // 创建视觉效果
        createRippleEffect(clientX, clientY);
        
        // 执行木鱼敲击逻辑
        tapWoodenFish();
        
        return true;
    }
    
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
            
            // 只在需要时显示连击提示，节省性能
            if (consecutiveTaps > 1 && (consecutiveTaps % 2 === 0 || consecutiveTaps >= tapThreshold - 2)) {
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
            tapThreshold = Math.floor(Math.random() * 8) + 8;
            
            // 暴击后3秒冷却时间
            setTimeout(() => {
                criticalCooldown = false;
            }, 3000);
            
            // 添加游戏化元素 - 暴击提示，微调位置更靠左侧
            setTimeout(() => {
                const fishRect = woodenFish.getBoundingClientRect();
                const criticalMessage = document.createElement('div');
                criticalMessage.className = 'fixed top-1/4 transform bg-amber-900 text-amber-100 px-8 py-4 rounded-xl shadow-2xl z-50 font-bold text-xl';
                criticalMessage.textContent = currentLang === 'en' ? '✨ CRITICAL HIT! ✨' : '✨ 暴击！✨';
                criticalMessage.style.opacity = '0';
                criticalMessage.style.transition = 'opacity 0.3s, transform 0.5s';
                criticalMessage.style.border = '2px solid #FF9D00';
                criticalMessage.style.boxShadow = '0 0 20px rgba(255, 157, 0, 0.4)';
                criticalMessage.style.left = `${fishRect.left - 250}px`; // 从-150px调整到-250px，更远离木鱼
                criticalMessage.style.pointerEvents = 'none'; // 确保不接收点击事件
                document.body.appendChild(criticalMessage);
                
                setTimeout(() => {
                    criticalMessage.style.opacity = '1';
                    criticalMessage.style.transform = 'translateY(-10px)';
                }, 10);
                
                setTimeout(() => {
                    criticalMessage.style.opacity = '0';
                    criticalMessage.style.transform = 'translateY(-30px)';
                    setTimeout(() => {
                        if (criticalMessage.parentNode) {
                            document.body.removeChild(criticalMessage);
                        }
                    }, 500);
                }, 1500);
            }, 0);
        }
        
        const meritIncrease = isCritical ? 5 : 1;
        
        // 播放动画 - 简化为直接添加移除类名
        woodenFish.classList.add('tapped');
        if (isCritical) {
            woodenFish.classList.add('critical');
            setTimeout(() => woodenFish.classList.remove('critical'), 500);
        }
        setTimeout(() => woodenFish.classList.remove('tapped'), 100);
        
        // 播放音频 - 使用非阻塞方式
        safePlayAudio().catch(() => {});
        
        // 增加功德 - 添加防御性检查
        meritCount += meritIncrease;
        
        // 检查计数器元素是否存在，如果不存在则重新获取
        if (!meritCountElement || meritCountElement.parentNode === null) {
            meritCountElement = document.getElementById('merit-count');
        }
        
        if (meritCountElement) {
            meritCountElement.textContent = meritCount;
        }
        
        // 保存功德值到localStorage - 使用节流保存，提高性能
        if (meritCount % 5 === 0) {
            localStorage.setItem('woodenFishMerit', meritCount);
        }
        
        // 使用requestAnimationFrame提高UI响应性能
        requestAnimationFrame(() => {
            // 更新进度条和等级
            updateProgressAndLevel();
            
            // 检查成就
            checkAchievements();
            
            // 显示功德弹出动画
            showMeritAnimation(meritIncrease, isCritical);
        });
    }
    
    // 显示功德+1/+5动画
    function showMeritAnimation(meritAmount, isCritical) {
        // 创建功德弹出元素
        const meritText = document.createElement('div');
        
        // 设置文本内容
        if (userWish && userWish.trim() !== '') {
            meritText.textContent = `${userWish.length > 12 ? userWish.substring(0, 12) + '...' : userWish} +${meritAmount}`;
        } else {
            meritText.textContent = `+${meritAmount}`;
        }
        
        // 获取木鱼位置
        const rect = woodenFish.getBoundingClientRect();
        
        // 功德+1文本放在木鱼左侧80px的位置
        const randomOffsetY = Math.random() * 20 - 10;
        const xPosition = rect.left - 80; // 从-150px调整到-80px
        
        // 设置样式 - 使用最小必要的属性，减少重排重绘
        Object.assign(meritText.style, {
            position: 'fixed',
            zIndex: '9999',
            left: `${xPosition}px`,
            top: `${rect.top + rect.height/2 + randomOffsetY}px`,
            color: isCritical ? '#FFD700' : '#F59E0B',
            fontWeight: 'bold',
            fontSize: isCritical ? '2rem' : '1.5rem',
            textShadow: isCritical ? '0 0 10px rgba(255, 215, 0, 0.7)' : '0 0 5px rgba(245, 158, 11, 0.5)',
            padding: '5px 10px',
            borderRadius: '15px',
            backgroundColor: isCritical ? 'rgba(44, 27, 0, 0.8)' : 'rgba(30, 27, 17, 0.7)',
            animation: 'float-up 1.5s ease-out forwards',
            pointerEvents: 'none' // 确保不会接收点击事件
        });
        
        // 添加到DOM
        document.body.appendChild(meritText);
        
        // 暴击时添加粒子效果 - 延迟创建，优先响应点击
        if (isCritical) {
            setTimeout(() => {
                addCriticalEffects(rect);
            }, 0);
        }
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (meritText.parentNode) {
                document.body.removeChild(meritText);
            }
        }, 1500);
    }
    
    // 暴击特效函数 - 特效保持在原位（右侧）
    function addCriticalEffects(rect) {
        // 创建光晕效果 - 保持在原位
        const glow = document.createElement('div');
        Object.assign(glow.style, {
            position: 'fixed',
            left: `${rect.left + rect.width/2 - 100}px`,
            top: `${rect.top + rect.height/2 - 100}px`,
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0) 70%)',
            zIndex: '9998',
            pointerEvents: 'none'
        });
        document.body.appendChild(glow);
        
        // 添加粒子效果 - 保持在原位
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            
            // 计算粒子起始位置 - 保持在原位
            const x = rect.left + rect.width/2;
            const y = rect.top + rect.height/2;
            const angle = (i / 8) * 2 * Math.PI;
            const distance = 80;
            
            Object.assign(particle.style, {
                position: 'fixed',
                width: '8px',
                height: '8px',
                backgroundColor: '#FFD700',
                borderRadius: '50%',
                boxShadow: '0 0 8px #FFD700',
                zIndex: '9997',
                opacity: '1',
                pointerEvents: 'none',
                left: `${x}px`,
                top: `${y}px`,
                transition: 'transform 0.8s ease-out, opacity 0.8s ease-out'
            });
            
            document.body.appendChild(particle);
            
            // 触发粒子飞出动画
            requestAnimationFrame(() => {
                const endX = x + Math.cos(angle) * distance;
                const endY = y + Math.sin(angle) * distance;
                particle.style.opacity = '0';
                particle.style.transform = `translate(${endX - x}px, ${endY - y}px)`;
            });
            
            // 动画结束后移除粒子
            setTimeout(() => {
                if (particle.parentNode) {
                    document.body.removeChild(particle);
                }
            }, 800);
        }
        
        // 动画结束后移除光晕
        setTimeout(() => {
            if (glow.parentNode) {
                document.body.removeChild(glow);
            }
        }, 800);
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
        
        // 将连击提示放在右侧，恢复原样
        if (isMobile) {
            // 移动设备：放在木鱼右上方
            comboHint.style.right = '15px';
            comboHint.style.left = 'auto'; // 清除左侧位置
            comboHint.style.top = `${fishRect.top - 10}px`;
            comboHint.style.borderRadius = '15px';
            comboHint.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            comboHint.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        } else {
            // 桌面设备：放在木鱼右侧
            comboHint.style.left = `${fishRect.right + 20}px`;
            comboHint.style.top = `${fishRect.top + fishRect.height/4}px`;
            comboHint.style.transform = 'translateY(-50%)';
        }
        
        // 设置样式
        comboHint.style.color = '#00BFFF';
        comboHint.style.fontSize = '1rem';
        comboHint.style.fontWeight = 'bold';
        comboHint.style.padding = '8px 12px';
        comboHint.style.borderRadius = '12px';
        comboHint.style.backgroundColor = 'rgba(30, 30, 46, 0.8)';
        comboHint.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        comboHint.style.zIndex = '1000';
        comboHint.style.opacity = '0';
        comboHint.style.transition = 'opacity 0.3s';
        comboHint.style.pointerEvents = 'none'; // 确保不会接收点击事件
        
        // 根据进度改变颜色
        const progress = comboCount / tapThreshold;
        if (progress >= 0.8) {
            comboHint.style.color = '#FFD700';
            comboHint.style.backgroundColor = 'rgba(44, 27, 0, 0.9)';
            comboHint.style.borderLeft = '3px solid #FF9D00';
            comboHint.style.borderRight = '3px solid #FF9D00';
            comboHint.textContent = `${translations[currentLang].combo} x${comboCount} (${comboCount}/${tapThreshold}) ${translations[currentLang].criticalHitSoon}`;
        } else if (progress >= 0.5) {
            comboHint.style.color = '#F59E0B';
            comboHint.style.borderBottom = '2px solid #F59E0B';
            comboHint.style.backgroundColor = 'rgba(37, 26, 0, 0.9)';
        }
        
        document.body.appendChild(comboHint);
        
        // 淡入效果
        setTimeout(() => {
            comboHint.style.opacity = '1';
            
            // 淡出并移除效果
            setTimeout(() => {
                comboHint.style.opacity = '0';
                setTimeout(() => {
                    if (comboHint.parentNode) {
                        document.body.removeChild(comboHint);
                    }
                }, 300);
            }, 2000);
        }, 10);
    }

    // 更新心愿显示
    function updateWishDisplay() {
        const wishDisplayArea = document.getElementById('wish-display-area');
        if (!wishDisplayArea) return;
        
        wishDisplayArea.innerHTML = '';
        
        // 如果有心愿，显示它
        if (userWish) {
            const wishDisplay = document.createElement('div');
            wishDisplay.className = 'flex items-center justify-center space-x-2 text-indigo-300';
            wishDisplay.innerHTML = `
                <i class="fas fa-heart text-pink-500"></i>
                <span class="font-medium text-indigo-200">${translations[currentLang].yourWish}:</span>
                <span class="text-amber-300 font-medium">${userWish}</span>
            `;
            wishDisplayArea.appendChild(wishDisplay);
        } else {
            // 如果没有心愿，显示提示
            const emptyWish = document.createElement('div');
            emptyWish.className = 'text-gray-500 italic';
            emptyWish.textContent = currentLang === 'en' ? 'Click "Customize Wish" to set your wish' : '点击"许愿"设置您的心愿';
            wishDisplayArea.appendChild(emptyWish);
        }
        
        // 检查心愿成就
        checkAchievements();
    }
    
    // 许愿系统
    function setupWishEvents() {
        console.log('设置心愿按钮事件');
        
        // 重新获取元素引用（确保最新）
        wishDiyBtn = document.getElementById('wish-diy');
        const wishDialog = document.getElementById('wish-dialog');
        const wishInput = document.getElementById('wish-input');
        const wishConfirm = document.getElementById('wish-confirm');
        const wishCancel = document.getElementById('wish-cancel');
        
        if (!wishDiyBtn) {
            console.error('找不到许愿按钮元素');
            return;
        }
        
        if (!wishDialog || !wishInput || !wishConfirm || !wishCancel) {
            console.error('找不到许愿对话框元素');
            return;
        }
        
        // 清除旧事件
        const newWishBtn = wishDiyBtn.cloneNode(true);
        if (wishDiyBtn.parentNode) {
            wishDiyBtn.parentNode.replaceChild(newWishBtn, wishDiyBtn);
            wishDiyBtn = newWishBtn; // 更新引用
        }
        
        // 许愿按钮点击事件
        wishDiyBtn.onclick = function() {
            console.log('许愿按钮被点击');
            wishDialog.style.display = 'flex';
            wishInput.value = userWish;
            wishInput.focus();
        };
        
        // 确认按钮事件
        wishConfirm.onclick = function() {
            userWish = wishInput.value.trim();
            localStorage.setItem('woodenFishWish', userWish);
            wishDialog.style.display = 'none';
            updateWishDisplay();
            checkAchievements();
        };
        
        // 取消按钮事件
        wishCancel.onclick = function() {
            wishDialog.style.display = 'none';
        };
        
        // 支持回车键提交
        wishInput.onkeydown = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                wishConfirm.click();
            }
        };
        
        // 修复对话框样式
        fixWishDialogStyles();
    }
    
    // 修复心愿对话框样式
    function fixWishDialogStyles() {
        const wishDialog = document.getElementById('wish-dialog');
        const wishInput = document.getElementById('wish-input');
        const dialogTitle = document.querySelector('.wish-dialog-title');
        
        // 确保对话框使用flex布局
        wishDialog.classList.add('hidden'); // 使用hidden而不是display:none
        wishDialog.style.display = 'none';
        
        // 设置对话框标题
        if (dialogTitle) {
            dialogTitle.textContent = translations[currentLang].wishDialogTitle || "Enter your wish:";
        }
        
        // 设置输入框占位符
        if (wishInput) {
            wishInput.placeholder = translations[currentLang].wishPlaceholder || "Type your wish here...";
        }
        
        // 添加回车键提交功能
        wishInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                document.getElementById('wish-confirm').click();
            }
        });
    }
    
    // 分享系统
    function setupShareEvents() {
        console.log('设置分享按钮事件');
        
        // 重新获取元素引用
        shareBtn = document.getElementById('share-btn');
        if (!shareBtn) {
            console.error('找不到分享按钮元素');
            return;
        }
        
        // 清除旧事件
        const newShareBtn = shareBtn.cloneNode(true);
        if (shareBtn.parentNode) {
            shareBtn.parentNode.replaceChild(newShareBtn, shareBtn);
            shareBtn = newShareBtn; // 更新引用
        }
        
        // 分享按钮点击事件
        shareBtn.onclick = function() {
            console.log('分享按钮被点击');
            
            // 增加分享计数
            shareCount++;
            shareCountElement.textContent = shareCount;
            localStorage.setItem('shareCount', shareCount);
            
            // 创建分享内容
            const shareUrl = window.location.href;
            let shareText = translations[currentLang].shareText || `I've accumulated ${meritCount} merit points on Digital Wooden Fish!`;
            shareText = shareText.replace('{0}', meritCount);
            
            // 如果有心愿，包含心愿内容
            if (userWish) {
                const wishText = translations[currentLang].myWishIs || "My wish is: ";
                shareText += ` ${wishText}${userWish}.`;
            }
            
            const joinText = translations[currentLang].joinMe || "Join me!";
            shareText += ` ${joinText}`;
            
            // 使用Web分享API（针对移动设备）
            if (navigator.share) {
                navigator.share({
                    title: translations[currentLang].title,
                    text: shareText,
                    url: shareUrl
                }).catch(error => {
                    console.log(`分享失败: ${error}`);
                    alert(`分享链接已生成:\n${shareText}\n${shareUrl}`);
                });
            } else {
                // 复制到剪贴板
                const textarea = document.createElement('textarea');
                textarea.value = `${shareText} ${shareUrl}`;
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    document.execCommand('copy');
                    alert(translations[currentLang].shareLinkCopied || "Share link copied to clipboard!");
                } catch (err) {
                    alert(`分享链接:\n${shareText}\n${shareUrl}`);
                }
                
                document.body.removeChild(textarea);
            }
        };
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
        // 修改成就通知样式，移到左侧但不要太远
        achievementNotification.style.right = 'auto';
        achievementNotification.style.left = '50px'; // 更靠近中心位置
        achievementNotification.style.transform = 'translateX(-100%)';
        
        achievementText.textContent = achievement.name[currentLang];
        
        // 显示通知
        achievementNotification.style.opacity = '1';
        achievementNotification.style.transform = 'translateX(0)';
        
        // 确保不会接收点击事件
        achievementNotification.style.pointerEvents = 'none';
        
        // 添加声音效果
        const achievementSound = new Audio('assets/achievement.mp3');
        achievementSound.volume = 0.5;
        achievementSound.play().catch(e => console.log('成就音效播放失败:', e));
        
        // 3秒后隐藏
        setTimeout(() => {
            achievementNotification.style.opacity = '0';
            achievementNotification.style.transform = 'translateX(-100%)';
        }, 3000);
    }
    
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
    
    // 初始化
    initializeWoodenFish();
    
    // 初始应用语言翻译
    applyTranslations();
    
    // 如果有功德值，立即更新进度条
    if (meritCount > 0) {
        console.log('从存储中恢复功德:', meritCount);
        setTimeout(() => {
            updateProgressAndLevel();
        }, 200);
    }
    
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