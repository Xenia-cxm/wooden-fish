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
            aboutTitle: "About Digital Wooden Fish",
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
            aboutTitle: "关于电子木鱼",
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
        
        // 更新指令文本
        document.querySelector('.instruction').textContent = translations[currentLang].tapInstructions;
        
        // 更新功德标签
        document.querySelector('.merit-label').textContent = translations[currentLang].merit;
        
        // 更新按钮文本
        wishDiyBtn.innerHTML = `<i class="fas fa-heart"></i> ${translations[currentLang].customizeWish}`;
        shareBtn.innerHTML = `<i class="fas fa-share-alt"></i> ${translations[currentLang].share}`;
        
        // 更新各部分标题
        document.querySelectorAll('h2').forEach(h2 => {
            if (h2.textContent.includes('Tap for Merit')) {
                h2.textContent = `Tap for ${translations[currentLang].merit}`;
            } else if (h2.textContent.includes('About')) {
                h2.textContent = translations[currentLang].aboutTitle;
            } else if (h2.textContent.includes('How to Use')) {
                h2.textContent = translations[currentLang].howToUseTitle;
            }
        });
        
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

    // 功德计数器拖动功能
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    // 初始化计数器位置（如果有保存的位置）
    const savedPosition = localStorage.getItem('meritCounterPosition');
    if (savedPosition) {
        try {
            const position = JSON.parse(savedPosition);
            meritCounter.style.position = 'absolute';
            meritCounter.style.left = position.left + 'px';
            meritCounter.style.top = position.top + 'px';
        } catch (e) {
            console.error('无法恢复位置:', e);
        }
    }
    
    // 鼠标拖动事件
    meritCounter.addEventListener('mousedown', initDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // 触摸拖动事件
    meritCounter.addEventListener('touchstart', initDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDrag);
    
    function initDrag(e) {
        // 只有点击计数器本身时才能拖动
        if (e.target === meritCounter || meritCounter.contains(e.target)) {
            e.preventDefault();
            isDragging = true;
            
            // 设置相对定位如果还不是
            if (getComputedStyle(meritCounter).position !== 'absolute') {
                const rect = meritCounter.getBoundingClientRect();
                meritCounter.style.position = 'absolute';
                meritCounter.style.left = rect.left + 'px';
                meritCounter.style.top = rect.top + 'px';
            }
            
            // 记录开始坐标
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
            }
            
            startLeft = parseInt(getComputedStyle(meritCounter).left) || 0;
            startTop = parseInt(getComputedStyle(meritCounter).top) || 0;
            
            // 添加激活样式
            meritCounter.classList.add('dragging');
        }
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        let currentX, currentY;
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        } else {
            currentX = e.clientX;
            currentY = e.clientY;
        }
        
        // 计算新位置
        const newLeft = startLeft + (currentX - startX);
        const newTop = startTop + (currentY - startY);
        
        // 限制在可视区域内
        const mainSection = document.querySelector('main');
        
        // 应用新位置
        meritCounter.style.left = newLeft + 'px';
        meritCounter.style.top = newTop + 'px';
        
        // 保存位置
        localStorage.setItem('meritCounterPosition', JSON.stringify({
            left: newLeft,
            top: newTop
        }));
    }
    
    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            meritCounter.classList.remove('dragging');
        }
    }

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
        
        // 播放音效
        if (tapSound.paused) {
            tapSound.currentTime = 0;
            tapSound.play().catch(e => console.log('无法播放音效:', e));
        } else {
            const newSound = tapSound.cloneNode();
            newSound.play().catch(e => console.log('无法播放音效:', e));
        }
        
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
    
    // 点击事件
    woodenFish.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 添加波纹效果
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        // 设置波纹的位置
        const rect = woodenFish.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = `${Math.max(rect.width, rect.height) * 0.5}px`;
        ripple.style.height = `${Math.max(rect.width, rect.height) * 0.5}px`;
        
        woodenFish.appendChild(ripple);
        
        // 动画完成后移除波纹元素
        setTimeout(() => {
            woodenFish.removeChild(ripple);
        }, 800);
        
        tapWoodenFish();
    });
    
    // 触摸事件支持
    woodenFish.addEventListener('touchstart', tapWoodenFish, { passive: false });
    
    // 键盘空格事件
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.code === 'Space') {
            event.preventDefault();
            tapWoodenFish();
        }
    });
    
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
        const wish = prompt(translations[currentLang].promptWish, userWish);
        if (wish !== null) {  // User didn't cancel
            userWish = wish;
            localStorage.setItem('woodenFishWish', userWish);
            
            if (userWish) {
                alert(`${translations[currentLang].wishSet}${userWish}\n${translations[currentLang].meritTowardsWish}`);
                // Update wish display
                updateWishDisplay();
            } else {
                alert(translations[currentLang].wishCleared);
                // Remove wish display
                updateWishDisplay();
            }
        }
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
}); 