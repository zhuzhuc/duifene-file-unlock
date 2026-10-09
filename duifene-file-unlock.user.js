// ==UserScript==
// @name         对分易文件大小限制解除
// @namespace    https://greasyfork.org/users/你的用户ID
// @version      3.0
// @description  解除对分易上传文件时的大小限制校验，允许上传超过平台限制的文件。
// @author       zzc
// @match        *://*.duifene.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    console.log('[文件限制解除] 脚本启动');

    // ========== 1. 覆盖 FileSize，永远返回 1 ==========
    const fakeFileSize = function(target, maxSize) {
        console.log('[文件限制解除] FileSize 被拦截，返回 1');
        return 1;
    };

    try {
        window.FileSize = fakeFileSize;
    } catch (e) {
        console.log('[文件限制解除] 覆盖 FileSize 失败:', e);
    }

    // 定时守护，防止页面改回去
    setInterval(function() {
        if (window.FileSize !== fakeFileSize) {
            console.log('[文件限制解除] FileSize 被重置，重新覆盖');
            window.FileSize = fakeFileSize;
        }
    }, 500);

    // ========== 2. 劫持 input[type=file] 的 change 事件，改 size ==========
    function patchFiles(input) {
        if (!input || input._patched) return;
        input._patched = true;

        input.addEventListener('change', function() {
            const files = this.files;
            if (!files || !files.length) return;

            for (let i = 0; i < files.length; i++) {
                try {
                    Object.defineProperty(files[i], 'size', {
                        value: 1,
                        writable: false,
                        configurable: false
                    });
                    console.log('[文件限制解除] 已改 size:', files[i].name, '→ 1');
                } catch (e) {
                    console.log('[文件限制解除] 改 size 失败:', e);
                }
            }
        }, true);
    }

    function patchAllInputs() {
        document.querySelectorAll('input[type="file"]').forEach(patchFiles);
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            m.addedNodes.forEach(function(node) {
                if (node.nodeType !== 1) return;
                if (node.tagName === 'INPUT' && node.type === 'file') {
                    patchFiles(node);
                }
                if (node.querySelectorAll) {
                    node.querySelectorAll('input[type="file"]').forEach(patchFiles);
                }
            });
        });
    });

    function startObserver() {
        if (document.documentElement) {
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
            patchAllInputs();
            console.log('[文件限制解除] 已开始监听文件输入框');
        } else {
            setTimeout(startObserver, 10);
        }
    }
    startObserver();

    window.addEventListener('DOMContentLoaded', function() {
        patchAllInputs();
        console.log('[文件限制解除] DOMContentLoaded 补丁完成');
    });

    console.log('[文件限制解除] 初始化完成');
})();
