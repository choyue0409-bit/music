// App shell — screen routing via state, prefs persisted in localStorage,
// loads shows from db on mount and refreshes after save/delete.

import { useState, useEffect, useCallback, useMemo } from 'react'
import { THEMES, applyFontPreset } from './design.js'
import { TabBar } from './TabBar.jsx'
import { listShows, getShow, deleteShow, computeStats } from './db.js'
import { HomeScreen } from './screens/Home.jsx'
import { DetailScreen } from './screens/Detail.jsx'
import { AddScreen } from './screens/Add.jsx'
import { SearchScreen } from './screens/Search.jsx'
import { MeScreen } from './screens/Me.jsx'

const PREFS_KEY = 'iwasthere:prefs:v1'

const DEFAULT_PREFS = {
  themeName: 'cream',
  lang: 'zh',
  variant: 'classic',
  fontStyle: 'editorial',
  primaryStamp: '',
  customPaperBg: '',
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_PREFS
}

function savePrefs(p) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(p))
}

export default function App() {
  const [prefs, setPrefs] = useState(loadPrefs)
  const [screen, setScreen] = useState('home')
  const [openId, setOpenId] = useState(null)
  const [shows, setShows] = useState([])

  const refresh = useCallback(() => setShows(listShows()), [])
  useEffect(() => { refresh() }, [refresh])
  useEffect(() => { savePrefs(prefs) }, [prefs])

  // Apply font preset (mutates FONTS so all components pick it up)
  applyFontPreset(prefs.fontStyle)

  // Theme = base palette + optional overrides for stamp ink + paper bg
  const baseTheme = THEMES[prefs.themeName] || THEMES.cream
  const theme = {
    ...baseTheme,
    stamp: prefs.primaryStamp || baseTheme.stamp,
    accent: prefs.primaryStamp || baseTheme.accent,
    ...(prefs.customPaperBg
      ? { paperBg: prefs.customPaperBg, appBg: prefs.customPaperBg }
      : {}),
  }

  const stats = useMemo(() => computeStats(shows), [shows])

  const updatePref = (patch) => setPrefs((p) => ({ ...p, ...patch }))
  const resetPrefs = () => setPrefs(DEFAULT_PREFS)

  const onTab = (id) => {
    if (id === 'add') { setScreen('add'); return }
    setScreen(id)
    setOpenId(null)
  }
  const onOpen = (id) => { setOpenId(id); setScreen('detail') }
  const onBack = () => { setOpenId(null); setScreen('home') }
  const onDelete = async () => {
    if (!openId) return
    if (!confirm(prefs.lang === 'zh' ? '删除这张票根？' : 'Delete this stub?')) return
    await deleteShow(openId)
    refresh()
    onBack()
  }
  const onSaved = (saved) => {
    refresh()
    setOpenId(saved.id)
    setScreen('detail')
  }

  const tabActive = screen === 'detail' ? 'home' : screen

  return (
    <div style={{ minHeight: '100vh', background: theme.appBg, color: theme.paperFg }}>
      <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
        {screen === 'home' && (
          <HomeScreen
            theme={theme} lang={prefs.lang} variant={prefs.variant}
            shows={shows} stats={stats} onOpen={onOpen}
          />
        )}
        {screen === 'detail' && (
          <DetailScreen
            theme={theme} lang={prefs.lang} variant={prefs.variant}
            show={getShow(openId)}
            onBack={onBack} onDelete={onDelete}
          />
        )}
        {screen === 'add' && (
          <AddScreen
            theme={theme} lang={prefs.lang}
            onClose={() => setScreen('home')}
            onSaved={onSaved}
          />
        )}
        {screen === 'search' && (
          <SearchScreen
            theme={theme} lang={prefs.lang} variant={prefs.variant}
            shows={shows} onOpen={onOpen}
          />
        )}
        {screen === 'me' && (
          <MeScreen
            theme={theme} lang={prefs.lang} stats={stats}
            prefs={prefs}
            baseTheme={baseTheme}
            onUpdatePref={updatePref}
            onReset={resetPrefs}
          />
        )}

        <TabBar active={tabActive} onTab={onTab} theme={theme} lang={prefs.lang}/>
      </div>
    </div>
  )
}
