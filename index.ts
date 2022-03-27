type ReplaceParam = Parameters<String['replace']>
class Mutator implements MutationObserver {
  observer: MutationObserver
  constructor(private replaceParams: ReplaceParam[] = []) {
    function replace(target: string | null, replaces: ReplaceParam[]): string | null {
      if(replaces.length === 0 || target == null) return target
      return replace(target.replace(...replaces[0]), replaces.slice(1))
    }

    this.observer = new MutationObserver(records => {
      for(const record of records) {
        if(!(record.target instanceof HTMLElement)) continue
        if(record.target.tagName !== 'SCRIPT') continue
        const content = record.addedNodes[0]
        content.textContent = replace(content.textContent, replaceParams)
      }
    })
  }

  addReplace(...replaceParam: ReplaceParam[]): this {
    this.replaceParams.push(...replaceParam)
    return this
  }

  observe(...params: Parameters<MutationObserver['observe']>): this {
    this.observer.observe(...params)
    return this
  }

  disconnect(): this {
    this.observer.disconnect()
    return this
  }

  takeRecords(): MutationRecord[] {
    return this.observer.takeRecords()
  }
}