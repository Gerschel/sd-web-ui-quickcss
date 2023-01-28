class FaviconHandler {
    static setFavicon() {
        let root = gradioApp();
        if (!root) {
            console.error("gradioApp() returned null, can't find the element.");
            return;
        }
        let link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = getComputedStyle(root.querySelector('.icon-container')).backgroundImage.replace(/^url\("|"\)$/g, '');
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    static async conditionalTrigger() {
        while (!gradioApp().querySelector('.icon-container')) {
            await AwaitDelayCallback.delay(2000);
        }
        FaviconHandler.setFavicon();
    }
}
document.addEventListener("DOMContentLoaded", async function () { await FaviconHandler.conditionalTrigger(); });
