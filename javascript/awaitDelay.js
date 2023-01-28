class AwaitDelayCallback {
    static async delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}
AwaitDelayCallback.callback = [];
