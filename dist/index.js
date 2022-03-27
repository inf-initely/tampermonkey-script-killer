"use strict";
class Mutator {
    replaceParams;
    observer;
    constructor(replaceParams = []) {
        this.replaceParams = replaceParams;
        function replace(target, replaces) {
            if (replaces.length === 0 || target == null)
                return target;
            return replace(target.replace(...replaces[0]), replaces.slice(1));
        }
        this.observer = new MutationObserver(records => {
            for (const record of records) {
                if (!(record.target instanceof HTMLElement))
                    continue;
                if (record.target.tagName !== 'SCRIPT')
                    continue;
                const content = record.addedNodes[0];
                content.textContent = replace(content.textContent, replaceParams);
            }
        });
    }
    addReplace(...replaceParam) {
        this.replaceParams.push(...replaceParam);
        return this;
    }
    observe(...params) {
        this.observer.observe(...params);
        return this;
    }
    disconnect() {
        this.observer.disconnect();
        return this;
    }
    takeRecords() {
        return this.observer.takeRecords();
    }
}
