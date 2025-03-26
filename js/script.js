document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const woodenFish = document.getElementById('wooden-fish');
    const meritCountElement = document.getElementById('merit-count');
    const meritPopup = document.getElementById('merit-popup');
    const meritCounter = document.getElementById('merit-counter');
    const wishDiyBtn = document.getElementById('wish-diy');
    const shareBtn = document.getElementById('share-btn');
    const shareCountElement = document.querySelector('.share-count');
    const languageToggle = document.getElementById('language-toggle');

    // 音效
    const tapSound = new Audio('assets/wooden-fish-sound.mp3');
    
    // 功德计数器 - 每次刷新页面时重置为0
    let meritCount = 0;
    // 保持分享计数
    let shareCount = localStorage.getItem('shareCount') ? parseInt(localStorage.getItem('shareCount')) : 0;
    
    // 心愿内容
    let userWish = localStorage.getItem('woodenFishWish') || '';
    
    // 初始化显示
    meritCountElement.textContent = meritCount;
    shareCountElement.textContent = shareCount;

    // 检测设备类型
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
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
            subtitle: "敲电子木鱼，见机甲佛祖，修赛博真经",
            tapInstructions: "按下空格键或点击积攒功德",
            criticalHitSoon: "即将暴击！",
            combo: "连击",
            merit: "功德",
            yourWish: "您的心愿",
            customizeWish: "心愿DIY",
            share: "分享",
            tapForMerit: "敲击获取功德",
            aboutTitle: "关于电子木鱼",
            aboutContent1: "电子木鱼灵感来源于佛教传统中诵经和冥想时使用的木鱼。在许多亚洲文化中，敲击木鱼被认为能积累功德并带来好运。",
            aboutContent2: "我们的数字版本将这种正念练习带到您的屏幕上，在忙碌的一天中提供一刻宁静。每一次敲击代表着一刻的正念与当下。",
            culturePerspectiveTitle: "东西方文化视角",
            easternPerspective: "在东方佛教传统中，木鱼象征着警醒。鱼眼从不闭合，代表着持续的觉知。有节奏地敲击木鱼是积累功德的方式——功德是一种积极的精神能量，有助于改善个人的因果和未来福祉。",
            westernComparison: "对西方受众来说，这种修行可以比作几个熟悉的概念：",
            westernPoint1: "类似于基督教中的念珠或玫瑰经，重复的祈祷积累精神福祉",
            westernPoint2: "相当于西方心理学中的正念练习，促进当下的觉知",
            westernPoint3: "如同数字感恩日记，帮助培养感激之情和积极的心理状态",
            westernPoint4: "类似于冥想应用程序，在日常生活中提供暂停和反思的时刻",
            culturalConclusion: "西方传统通常强调个人救赎或个人福祉，而东方功德概念同时关注个人精神成长和利益他人。通过敲击电子木鱼，您参与了一个为数字时代重新构想的古老传统——将东方精神实践与当代西方正念方法结合在一起。",
            howToUseTitle: "使用方法",
            tapFishTitle: "敲击木鱼",
            tapFishDesc: "点击木鱼或按空格键敲击",
            makeWishTitle: "许下心愿",
            makeWishDesc: "自定义您的心愿和意向",
            shareTitle: "分享",
            shareDesc: "与朋友分享您的功德数",
            promptWish: "请输入您的心愿:",
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
        
        // 更新敲击标题 - 直接使用专门的选择器，确保准确更新
        const tapTitle = document.querySelector('.tap-title');
        if (tapTitle) {
            tapTitle.textContent = translations[currentLang].tapForMerit;
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
            // 获取标题下面的段落
            const paragraphs = aboutSection.querySelectorAll('.prose p');
            if (paragraphs.length >= 2) {
                paragraphs[0].textContent = translations[currentLang].aboutContent1;
                paragraphs[1].textContent = translations[currentLang].aboutContent2;
            } else {
                // 如果没有找到预期的paragraphs，尝试其他选择器
                const allParagraphs = aboutSection.querySelectorAll('p');
                if (allParagraphs.length >= 2) {
                    allParagraphs[0].textContent = translations[currentLang].aboutContent1;
                    allParagraphs[1].textContent = translations[currentLang].aboutContent2;
                }
            }
            
            // 更新东西方文化视角部分
            const h3Elements = aboutSection.querySelectorAll('h3');
            if (h3Elements.length > 0) {
                for (const h3 of h3Elements) {
                    if (h3.textContent.includes('Eastern & Western') || h3.textContent.includes('东西方')) {
                        h3.textContent = translations[currentLang].culturePerspectiveTitle;
                        
                        // 查找并更新该h3后面的内容
                        let nextElement = h3.nextElementSibling;
                        if (nextElement && nextElement.tagName === 'P') {
                            nextElement.textContent = translations[currentLang].easternPerspective;
                            nextElement = nextElement.nextElementSibling;
                        }
                        
                        if (nextElement && nextElement.tagName === 'P') {
                            nextElement.textContent = translations[currentLang].westernComparison;
                            nextElement = nextElement.nextElementSibling;
                        }
                        
                        if (nextElement && nextElement.tagName === 'UL') {
                            const listItems = nextElement.querySelectorAll('li');
                            if (listItems.length >= 4) {
                                // 为了保持格式，使用innerHTML而不是textContent
                                if (currentLang === 'en') {
                                    listItems[0].innerHTML = `<span class="font-medium">Similar to prayer beads or rosaries in Christianity</span>, where repetitive prayers accumulate spiritual benefits`;
                                    listItems[1].innerHTML = `<span class="font-medium">Comparable to mindfulness practices in Western psychology</span>, promoting present-moment awareness`;
                                    listItems[2].innerHTML = `<span class="font-medium">Like digital gratitude journals</span> that help cultivate appreciation and positive mental states`;
                                    listItems[3].innerHTML = `<span class="font-medium">Akin to meditation apps</span> that offer moments of pause and reflection in daily life`;
                                } else {
                                    listItems[0].innerHTML = `<span class="font-medium">类似于基督教中的念珠或玫瑰经</span>，重复的祈祷积累精神福祉`;
                                    listItems[1].innerHTML = `<span class="font-medium">相当于西方心理学中的正念练习</span>，促进当下的觉知`;
                                    listItems[2].innerHTML = `<span class="font-medium">如同数字感恩日记</span>，帮助培养感激之情和积极的心理状态`;
                                    listItems[3].innerHTML = `<span class="font-medium">类似于冥想应用程序</span>，在日常生活中提供暂停和反思的时刻`;
                                }
                            }
                            nextElement = nextElement.nextElementSibling;
                        }
                        
                        if (nextElement && nextElement.tagName === 'P') {
                            nextElement.textContent = translations[currentLang].culturalConclusion;
                        }
                    }
                }
            } else {
                // 如果没有找到h3元素，尝试直接更新所有内容
                const allContent = aboutSection.innerHTML;
                if (allContent.includes('Eastern & Western') || allContent.includes('eastern perspective')) {
                    // 深度扫描整个关于部分的段落
                    const allAboutParagraphs = aboutSection.querySelectorAll('p');
                    
                    // 映射段落到翻译内容
                    if (allAboutParagraphs.length >= 5) {
                        allAboutParagraphs[0].textContent = translations[currentLang].aboutContent1;
                        allAboutParagraphs[1].textContent = translations[currentLang].aboutContent2;
                        allAboutParagraphs[2].textContent = translations[currentLang].easternPerspective;
                        allAboutParagraphs[3].textContent = translations[currentLang].westernComparison;
                        allAboutParagraphs[4].textContent = translations[currentLang].culturalConclusion;
                    }
                    
                    // 查找并更新标题
                    const cultureTitleEl = aboutSection.querySelector('h3, strong');
                    if (cultureTitleEl) {
                        cultureTitleEl.textContent = translations[currentLang].culturePerspectiveTitle;
                    }
                    
                    // 查找并更新列表项
                    const listItems = aboutSection.querySelectorAll('li');
                    if (listItems.length >= 4) {
                        if (currentLang === 'en') {
                            listItems[0].innerHTML = `<span class="font-medium">Similar to prayer beads or rosaries in Christianity</span>, where repetitive prayers accumulate spiritual benefits`;
                            listItems[1].innerHTML = `<span class="font-medium">Comparable to mindfulness practices in Western psychology</span>, promoting present-moment awareness`;
                            listItems[2].innerHTML = `<span class="font-medium">Like digital gratitude journals</span> that help cultivate appreciation and positive mental states`;
                            listItems[3].innerHTML = `<span class="font-medium">Akin to meditation apps</span> that offer moments of pause and reflection in daily life`;
                        } else {
                            listItems[0].innerHTML = `<span class="font-medium">类似于基督教中的念珠或玫瑰经</span>，重复的祈祷积累精神福祉`;
                            listItems[1].innerHTML = `<span class="font-medium">相当于西方心理学中的正念练习</span>，促进当下的觉知`;
                            listItems[2].innerHTML = `<span class="font-medium">如同数字感恩日记</span>，帮助培养感激之情和积极的心理状态`;
                            listItems[3].innerHTML = `<span class="font-medium">类似于冥想应用程序</span>，在日常生活中提供暂停和反思的时刻`;
                        }
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
    
    // 预加载音频
    const preloadAudio = () => {
        tapSound.load();
        // 移动设备需要一个用户交互才能播放音频
        if (isMobile) {
            document.body.addEventListener('touchstart', function initAudio() {
                tapSound.play().then(() => {
                    tapSound.pause();
                    tapSound.currentTime = 0;
                    document.body.removeEventListener('touchstart', initAudio);
                }).catch(error => {
                    console.log('音频初始化失败:', error);
                });
            }, { once: true });
        }
    };
    
    preloadAudio();
    
    // 创建一个标记，用于防止事件重复触发
    let isTapping = false;

    // 点击或触摸事件控制变量
    let lastEventTime = 0;
    const eventThreshold = 500; // 事件间隔阈值(毫秒)
    
    // 完全清除之前的所有事件监听器
    woodenFish.removeEventListener('click', tapWoodenFish);
    woodenFish.removeEventListener('touchstart', tapWoodenFish);
    woodenFish.removeEventListener('touchend', () => {});
    woodenFish.removeEventListener('touchmove', () => {});
    
    // 创建添加波纹效果的函数
    function createRippleEffect(element, x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        
        ripple.style.left = `${x - rect.left}px`;
        ripple.style.top = `${y - rect.top}px`;
        ripple.style.width = `${Math.max(rect.width, rect.height) * 0.5}px`;
        ripple.style.height = `${Math.max(rect.width, rect.height) * 0.5}px`;
        
        element.appendChild(ripple);
        
        // 动画完成后移除波纹元素
        setTimeout(() => {
            if (element.contains(ripple)) {
                element.removeChild(ripple);
            }
        }, 800);
    }
    
    // 统一的事件处理函数
    function handleTap(e) {
        e.preventDefault();
        
        // 阻止事件冒泡
        e.stopPropagation();
        
        const now = Date.now();
        
        // 如果事件触发太快或正在处理中，忽略它
        if (now - lastEventTime < eventThreshold || isTapping) {
            return;
        }
        
        // 更新时间和状态
        lastEventTime = now;
        isTapping = true;
        
        // 添加波纹效果
        let clientX, clientY;
        if (e.type === 'touchstart') {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        createRippleEffect(woodenFish, clientX, clientY);
        
        // 敲击木鱼
        tapWoodenFish();
        
        // 设置延时，允许下一次点击
        setTimeout(() => {
            isTapping = false;
        }, 100);
    }
    
    // 根据设备类型只绑定一种事件
    if (isMobile) {
        // 在移动设备上，只使用触摸事件
        woodenFish.addEventListener('touchstart', handleTap, { passive: false });
        
        // 阻止所有其他相关事件
        woodenFish.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        
        woodenFish.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        
        // 阻止点击事件
        woodenFish.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    } else {
        // 在桌面设备上，只使用鼠标事件
        woodenFish.addEventListener('click', handleTap);
    }
    
    // 键盘空格事件
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.code === 'Space') {
            event.preventDefault();
            
            const now = Date.now();
            
            // 如果事件触发太快或正在处理中，忽略它
            if (now - lastEventTime < eventThreshold || isTapping) {
                return;
            }
            
            lastEventTime = now;
            isTapping = true;
            
            tapWoodenFish();
            
            // 设置延时，允许下一次点击
            setTimeout(() => {
                isTapping = false;
            }, 100);
        }
    });

    // 敲击木鱼函数
    function tapWoodenFish() {
        // 获取当前时间
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
            
            // 重新设置随机目标连击数
            tapThreshold = Math.floor(Math.random() * 13) + 8;
            
            // 暴击后3秒冷却时间
            setTimeout(() => {
                criticalCooldown = false;
            }, 3000);
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
        
        // 完全重写音频播放逻辑
        (function playSound() {
            try {
                // 重置音频状态
                tapSound.pause();
                tapSound.currentTime = 0;
                
                // 播放音频
                let played = false;
                const playPromise = tapSound.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            played = true;
                        })
                        .catch(error => {
                            console.log('无法播放音效:', error);
                            // 如果未能播放，尝试创建新的音频对象播放
                            if (!played) {
                                const newSound = new Audio('assets/wooden-fish-sound.mp3');
                                newSound.play().catch(e => console.log('备用音频播放失败:', e));
                            }
                        });
                }
            } catch (error) {
                console.log('音频播放错误:', error);
            }
        })();
        
        // 增加功德
        meritCount += meritIncrease;
        meritCountElement.textContent = meritCount;
        
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
}); 