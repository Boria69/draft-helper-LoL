import { useState, useEffect, useCallback, useMemo } from 'react'

const theme = {
  colors: {
    bg: {
      primary: '#0f172a',
      secondary: '#1e1b4b',
      card: '#1e293b',
      cardHover: '#334155'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#cbd5e1'
    },
    accent: {
      gold: '#c29958',
      goldLight: '#d4af72',
      blue: '#3b82f6',
      blueLight: '#60a5fa',
      red: '#ef4444',
      redLight: '#f87171',
      success: '#10b981',
      purple: '#8b5cf6'
    }
  },
  spacing: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '30px',
    huge: '40px',
    massive: '50px'
  },
  radius: {
    sm: '8px',
    md: '10px',
    lg: '12px',
    xl: '14px',
    xxl: '16px',
    full: '20px'
  },
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
    md: '0 4px 12px rgba(0, 0, 0, 0.2)',
    lg: '0 4px 15px rgba(194, 153, 88, 0.3)',
    glow: '0 0 20px rgba(194, 153, 88, 0.3)'
  },
  transitions: {
    fast: 'all 0.3s ease',
    smooth: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
    slow: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)'
  }
}

const styles = {
  container: {
    padding: theme.spacing.lg,
    background: `linear-gradient(135deg, ${theme.colors.bg.primary} 0%, ${theme.colors.bg.secondary} 100%)`,
    color: theme.colors.text.primary,
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing.huge,
    paddingBottom: theme.spacing.xxxl,
    borderBottom: `2px solid ${theme.colors.accent.gold}20`
  },
  title: {
    fontSize: '48px',
    fontWeight: '700',
    background: `linear-gradient(135deg, ${theme.colors.accent.gold} 0%, ${theme.colors.accent.goldLight} 100%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textTransform: 'uppercase',
    letterSpacing: '6px',
    marginBottom: theme.spacing.sm,
    textShadow: `0 2px 10px ${theme.colors.accent.gold}20`
  },
  subtitle: {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontWeight: '500'
  },
  input: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.cardHover}`,
    backgroundColor: theme.colors.card,
    color: 'white',
    width: '300px',
    fontSize: '14px',
    transition: theme.transitions.fast,
    outline: 'none',
    boxShadow: theme.shadow.md
  },
  inputFocus: {
    borderColor: theme.colors.accent.gold,
    boxShadow: `0 0 20px ${theme.colors.accent.gold}30`
  },
  select: {
    backgroundColor: theme.colors.bg.secondary,
    color: theme.colors.accent.gold,
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    border: `2px solid ${theme.colors.accent.gold}`,
    borderRadius: theme.radius.md,
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    boxShadow: theme.shadow.md
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'center',
    marginBottom: theme.massive,
    maxHeight: '450px',
    overflowY: 'auto',
    padding: theme.spacing.xxl,
    backgroundColor: `${theme.colors.bg.primary}80`,
    borderRadius: theme.radius.full,
    border: `1px solid ${theme.colors.cardHover}80`,
    backdropFilter: 'blur(10px)'
  },
  champCard: {
    textAlign: 'center',
    backgroundColor: `${theme.colors.card}cc`,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    cursor: 'pointer',
    transition: theme.transitions.smooth,
    border: `2px solid ${theme.colors.cardHover}80`,
    backdropFilter: 'blur(10px)',
    boxShadow: theme.shadow.sm
  },
  champImg: {
    width: '80px',
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.md,
    transition: 'transform 0.3s ease'
  },
  champName: {
    fontSize: '14px',
    fontWeight: '700',
    marginTop: theme.spacing.sm,
    color: theme.colors.text.primary
  },
  champRole: {
    fontSize: '11px',
    color: theme.colors.text.muted,
    fontWeight: '500',
    marginTop: '4px'
  },
  removeHint: {
    fontSize: '8px',
    color: theme.colors.accent.redLight,
    marginTop: '6px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  button: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl * 2}`,
    fontWeight: '700',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: theme.transitions.fast,
    boxShadow: theme.shadow.md,
    border: 'none'
  },
  primaryButton: {
    background: `linear-gradient(135deg, ${theme.colors.accent.gold} 0%, ${theme.colors.accent.goldLight} 100%)`,
    color: theme.colors.bg.primary,
    fontWeight: '700',
    boxShadow: theme.shadow.lg
  },
  secondaryButton: {
    background: `linear-gradient(135deg, ${theme.colors.bg.secondary} 0%, ${theme.colors.bg.primary} 100%)`,
    color: theme.colors.accent.gold,
    border: `2px solid ${theme.colors.accent.gold}`,
    fontWeight: '700',
    boxShadow: theme.shadow.md
  },
  suggestionCard: {
    padding: theme.spacing.xl,
    background: `linear-gradient(135deg, ${theme.colors.accent.purple}20 0%, ${theme.colors.accent.blue}15 100%)`,
    border: `2px solid ${theme.colors.accent.purple}40`,
    borderRadius: theme.radius.xxl,
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    transition: theme.transitions.fast,
    boxShadow: theme.shadow.md
  },
  winProbability: {
    color: theme.colors.success,
    fontSize: '22px',
    fontWeight: '700'
  }
}

const getHoverStyles = (baseColor) => {
  const glow = `${baseColor}40`
  return {
    card: {
      enter: {
        transform: 'translateY(-8px) scale(1.05)',
        boxShadow: `0 12px 24px ${glow}`,
        borderColor: baseColor
      },
      leave: {
        transform: 'translateY(0) scale(1)',
        boxShadow: `0 0 20px ${baseColor}20`
      }
    },
    button: {
      enter: {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 20px ${baseColor}40`
      },
      leave: {
        transform: 'translateY(0)',
        boxShadow: theme.shadow.lg
      }
    }
  }
}

const useHover = (enterStyles, leaveStyles) => {
  const handleMouseEnter = useCallback((e) => {
    Object.assign(e.currentTarget.style, enterStyles);
  }, [enterStyles]);

  const handleMouseLeave = useCallback((e) => {
    Object.assign(e.currentTarget.style, leaveStyles);
  }, [leaveStyles]);

  return { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave };
}

function ChampionCard({ champStr, borderColor, team, version, onRemove }) {
  const name = champStr.split('_')[0];
  const role = champStr.split('_')[1];

  const hoverStyles = useMemo(() => getHoverStyles(borderColor).card, [borderColor]);
  const { onMouseEnter, onMouseLeave } = useHover(hoverStyles.enter, hoverStyles.leave);

  return (
    <div
      onClick={() => onRemove(champStr, team)}
      style={{
        ...styles.champCard,
        borderColor,
        boxShadow: `0 0 20px ${borderColor}20`
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Remove ${name} from ${team} team`}
      onKeyDown={(e) => e.key === 'Enter' && onRemove(champStr, team)}
    >
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${name}.png`}
        alt={name}
        style={styles.champImg}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onError={(e) => e.target.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png"}
      />
      <div style={styles.champName}>{name}</div>
      <div style={styles.champRole}>{role}</div>
      <div style={styles.removeHint}>Click to remove</div>
    </div>
  );
}

function SuggestionCard({ champion, winProbability, version }) {
  const { onMouseEnter, onMouseLeave } = useHover(
    { transform: 'translateY(-8px)', borderColor: `${theme.colors.accent.purple}60` },
    { transform: 'translateY(0)', borderColor: `${theme.colors.accent.purple}40` }
  );

  return (
    <div
      style={styles.suggestionCard}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}.png`}
        alt={champion}
        style={{ ...styles.champImg, marginBottom: theme.spacing.md, width: '90px' }}
        onError={(e) => e.target.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png"}
      />
      <div style={{ fontWeight: '700', marginBottom: theme.spacing.sm, fontSize: '15px' }}>{champion}</div>
      <div style={styles.winProbability}>{winProbability}%</div>
      <div style={{ fontSize: '11px', color: theme.colors.text.secondary, marginTop: theme.spacing.sm, fontWeight: '500' }}>Win rate</div>
    </div>
  );
}

function WinRateBar({ prediction }) {
  const bluePercentage = prediction ? parseFloat(prediction.blue_win_probability) : 50;
  const blueText = prediction?.blue_win_probability || '50';
  const redText = prediction?.red_win_probability || '50';

  return (
    <div style={{ width: '90%', margin: `${theme.spacing.xxl} auto`, textAlign: 'center' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
        fontSize: '13px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        <span style={{ color: theme.colors.accent.blueLight }}>Blue {blueText}%</span>
        <span style={{ color: theme.colors.accent.redLight }}>Red {redText}%</span>
      </div>

      <div style={{
        height: '24px',
        width: '100%',
        backgroundColor: `${theme.colors.bg.primary}99`,
        borderRadius: theme.radius.lg,
        display: 'flex',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${theme.colors.cardHover}66`
      }}>
        <div style={{
          width: `${bluePercentage}%`,
          background: `linear-gradient(90deg, ${theme.colors.accent.blue} 0%, ${theme.colors.accent.blueLight} 100%)`,
          transition: theme.transitions.slow,
          boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.2), -2px 0 8px rgba(59, 130, 246, 0.4)'
        }} />
        <div style={{
          flex: 1,
          background: `linear-gradient(90deg, ${theme.colors.accent.red} 0%, ${theme.colors.accent.redLight} 100%)`,
          transition: theme.transitions.slow,
          boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.2), 2px 0 8px rgba(239, 68, 68, 0.4)'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: theme.spacing.md, fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        <span>Blue Team</span>
        <span>Red Team</span>
      </div>
    </div>
  );
}

function ChampionPickerItem({ name, version, onAdd }) {
  const buttonBase = {
    border: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700',
    transition: theme.transitions.fast,
    boxShadow: theme.shadow.sm
  };

  const buttonHover = {
    onMouseEnter: (e) => e.target.style.transform = 'translateY(-2px)',
    onMouseLeave: (e) => e.target.style.transform = 'translateY(0)'
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${name}.png`}
        style={{ width: '70px', borderRadius: theme.radius.lg, border: `2px solid ${theme.colors.cardHover}99`, transition: theme.transitions.fast, cursor: 'pointer' }}
        alt={name}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.colors.accent.gold;
          e.currentTarget.style.boxShadow = `0 0 15px ${theme.colors.accent.gold}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${theme.colors.cardHover}99`;
          e.currentTarget.style.boxShadow = 'none';
        }}
        onError={(e) => e.target.src = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png'}
      />
      <div style={{ marginTop: theme.spacing.sm, display: 'flex', gap: theme.spacing.xs, justifyContent: 'center' }}>
        <button
          onClick={() => onAdd(name, 'blue')}
          style={{
            ...buttonBase,
            background: `linear-gradient(135deg, ${theme.colors.accent.blue} 0%, ${theme.colors.accent.blueLight} 100%)`,
            color: 'white',
            boxShadow: `0 2px 8px ${theme.colors.accent.blue}30`
          }}
          {...buttonHover}
          aria-label={`Add ${name} to blue team`}
        >
          BLUE
        </button>
        <button
          onClick={() => onAdd(name, 'red')}
          style={{
            ...buttonBase,
            background: `linear-gradient(135deg, ${theme.colors.accent.red} 0%, ${theme.colors.accent.redLight} 100%)`,
            color: 'white',
            boxShadow: `0 2px 8px ${theme.colors.accent.red}30`
          }}
          {...buttonHover}
          aria-label={`Add ${name} to red team`}
        >
          RED
        </button>
      </div>
    </div>
  );
}

function App() {
  const [blueTeam, setBlueTeam] = useState([]);
  const [redTeam, setRedTeam] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [laneInput, setLaneInput] = useState('MIDDLE');
  const [searchTerm, setSearchTerm] = useState('');
  const [version, setVersion] = useState('14.5.1');
  const [allChamps, setAllChamps] = useState([]);

  const inputHover = useMemo(() => ({
    onFocus: (e) => Object.assign(e.target.style, styles.inputFocus),
    onBlur: (e) => {
      e.target.style.borderColor = theme.colors.cardHover;
      e.target.style.boxShadow = theme.shadow.md;
    }
  }), []);

  useEffect(() => {
    const initApp = async () => {
      try {
        const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionRes.json();
        const latest = versions[0];
        setVersion(latest);

        const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`);
        const data = await champRes.json();
        const names = Object.keys(data.data).sort();

        ['Ambessa', 'Mel', 'Aurora', 'Zaahen', 'Yunara'].forEach(c => {
          if (!names.includes(c)) names.push(c);
        });

        setAllChamps(names);
        console.log(`App initialized on Patch ${latest} with ${names.length} champions.`);
      } catch (err) {
        console.error('Failed to sync with Riot:', err);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (blueTeam.length > 0 || redTeam.length > 0) {
      const autoPredict = async () => {
        try {
          const res = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blue_team: blueTeam, red_team: redTeam }),
          });
          const data = await res.json();
          setPrediction(data);
        } catch (err) {
          console.error('Silent prediction failed:', err);
        }
      };

      const timer = setTimeout(autoPredict, 300);
      return () => clearTimeout(timer);
    } else {
      setPrediction(null);
    }
  }, [blueTeam, redTeam]);

  const addChamp = useCallback((name, team) => {
    if (!name) return;
    const formatted = `${name}_${laneInput}`;
    const allPicked = [...blueTeam, ...redTeam].map(c => c.split('_')[0]);

    if (allPicked.includes(name)) {
      alert('Champion already picked!');
      return;
    }
    if (team === 'blue' && blueTeam.length < 5) setBlueTeam([...blueTeam, formatted]);
    if (team === 'red' && redTeam.length < 5) setRedTeam([...redTeam, formatted]);
  }, [laneInput, blueTeam, redTeam]);

  const removeChamp = useCallback((nameWithRole, team) => {
    if (team === 'blue') {
      setBlueTeam(blueTeam.filter(c => c !== nameWithRole));
    } else {
      setRedTeam(redTeam.filter(c => c !== nameWithRole));
    }
  }, [blueTeam, redTeam]);

  const getSuggestions = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8000/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blue_team: blueTeam, red_team: redTeam, needed_role: laneInput }),
      });
      const data = await res.json();
      setSuggestions(data.top_suggestions);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    }
  }, [blueTeam, redTeam, laneInput]);

  const resetDraft = useCallback(() => {
    setBlueTeam([]);
    setRedTeam([]);
    setPrediction(null);
    setSuggestions([]);
  }, []);

  const primaryButtonHover = useHover(
    getHoverStyles(theme.colors.accent.gold).button.enter,
    getHoverStyles(theme.colors.accent.gold).button.leave
  );

  const secondaryButtonHover = useHover(
    { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)' },
    { transform: 'translateY(0)', boxShadow: theme.shadow.md }
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>DRAFT ORACLE</h1>
        <p style={styles.subtitle}>AI-Powered League of Legends Champion Predictor</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: theme.spacing.xl, marginBottom: theme.huge }}>
        <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
          <input
            placeholder="Search Champion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
            {...inputHover}
          />
          <select
            value={laneInput}
            onChange={(e) => setLaneInput(e.target.value)}
            style={styles.select}
            {...inputHover}
          >
            <option style={{ backgroundColor: theme.colors.bg.secondary, color: theme.colors.text.primary }} value="TOP">TOP</option>
            <option style={{ backgroundColor: theme.colors.bg.secondary, color: theme.colors.text.primary }} value="JUNGLE">JUNGLE</option>
            <option style={{ backgroundColor: theme.colors.bg.secondary, color: theme.colors.text.primary }} value="MIDDLE">MIDDLE</option>
            <option style={{ backgroundColor: theme.colors.bg.secondary, color: theme.colors.text.primary }} value="BOTTOM">ADC</option>
            <option style={{ backgroundColor: theme.colors.bg.secondary, color: theme.colors.text.primary }} value="UTILITY">SUPPORT</option>
          </select>
        </div>
        <p style={{ color: theme.colors.text.secondary, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Selecting for: <span style={{ color: theme.colors.accent.gold, fontWeight: '700' }}>{laneInput}</span>
        </p>
      </div>

      <div style={styles.gridContainer}>
        {allChamps.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
          <ChampionPickerItem
            key={c}
            name={c}
            version={version}
            onAdd={addChamp}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 1fr', gap: theme.spacing.xxxl, alignItems: 'center', marginBottom: theme.massive, maxWidth: '1400px', margin: '0 auto 50px auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: theme.spacing.md }}>
          {blueTeam.map(c => (
            <ChampionCard
              key={c}
              champStr={c}
              borderColor={theme.colors.accent.blue}
              team="blue"
              version={version}
              onRemove={removeChamp}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.accent.gold, textShadow: `0 0 10px ${theme.colors.accent.gold}30` }}>VS</div>
          <WinRateBar prediction={prediction} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: theme.spacing.md }}>
          {redTeam.map(c => (
            <ChampionCard
              key={c}
              champStr={c}
              borderColor={theme.colors.accent.red}
              team="red"
              version={version}
              onRemove={removeChamp}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: theme.spacing.xxxl }}>
        <div style={{ display: 'flex', gap: theme.spacing.xl }}>
          <button
            onClick={getSuggestions}
            style={{ ...styles.button, ...styles.primaryButton }}
            {...primaryButtonHover}
          >
            AI SUGGESTIONS
          </button>

          <button
            onClick={resetDraft}
            style={{ ...styles.button, ...styles.secondaryButton }}
            {...secondaryButtonHover}
          >
            RESET
          </button>
        </div>

        {suggestions.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: theme.spacing.xl,
            maxWidth: '600px',
            width: '100%'
          }}>
            {suggestions.map(s => (
              <SuggestionCard
                key={s.champion}
                champion={s.champion}
                winProbability={s.win_probability}
                version={version}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App
