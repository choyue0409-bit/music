import { useRef, useState } from 'react'
import { exportAll, importAll } from '../db.js'

export default function Settings() {
  const inputRef = useRef(null)
  const [status, setStatus] = useState('')

  async function onExport() {
    setStatus('导出中…')
    try {
      const data = await exportAll()
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `live-memory-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setStatus('已导出')
    } catch (e) {
      setStatus('导出失败：' + e.message)
    }
  }

  async function onImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('导入中…')
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      await importAll(json)
      setStatus('导入成功，刷新一下')
    } catch (err) {
      setStatus('导入失败：' + err.message)
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">设置</h1>

      <section className="space-y-3">
        <h2 className="font-medium">备份与迁移</h2>
        <p className="text-sm text-ink-300">
          数据存在你这台设备的浏览器里。换设备前，记得先导出文件保存好。
        </p>
        <div className="flex gap-3">
          <button
            onClick={onExport}
            className="px-4 py-2 rounded-lg bg-ink-800 border border-ink-700 hover:border-accent"
          >
            导出全部
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-ink-800 border border-ink-700 hover:border-accent"
          >
            导入备份
          </button>
          <input ref={inputRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
        </div>
        {status && <div className="text-sm text-ink-300">{status}</div>}
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">关于</h2>
        <p className="text-sm text-ink-300 leading-relaxed">
          这是一个记录你看过的演唱会、音乐节的小手账。<br />
          照片、视频都存在你自己的浏览器里，不会上传到任何服务器。
        </p>
      </section>
    </div>
  )
}
