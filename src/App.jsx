import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
//  GOLDEN SELF-ALCHEMY  ♛
//  Midnight Gold Theme | #0a192f base | #ffd700 gold | #E2725B terracota
// ═══════════════════════════════════════════════════════════════════

// ── STORAGE (localStorage simula Firestore com merge antiduplicidade) ──
const DB = {
  get: (key) => { try { return JSON.parse(localStorage.getItem("gsa_" + key)) || null; } catch { return null; } },
  set: (key, val) => localStorage.setItem("gsa_" + key, JSON.stringify(val)),
  merge: (key, newItems, idField = "id") => {
    const existing = DB.get(key) || [];
    const map = {};
    existing.forEach(i => { map[i[idField]] = i; });
    newItems.forEach(i => { map[i[idField]] = { ...map[i[idField]], ...i }; });
    const merged = Object.values(map);
    DB.set(key, merged);
    return merged;
  }
};

// ── DADOS INICIAIS ──────────────────────────────────────────────────
const PILARES_DEFAULT = [
  { id: "espiritual", label: "Espiritual", icon: "✦", pct: 60, nota: "" },
  { id: "mental", label: "Mental", icon: "◈", pct: 75, nota: "" },
  { id: "fisico", label: "Físico", icon: "◉", pct: 50, nota: "" },
  { id: "financeiro", label: "Financeiro", icon: "♛", pct: 40, nota: "" },
  { id: "profissional", label: "Profissional", icon: "◆", pct: 65, nota: "" },
  { id: "social", label: "Social", icon: "◎", pct: 70, nota: "" },
  { id: "ludico", label: "Lúdico", icon: "✿", pct: 55, nota: "" },
];

const INSIGHTS = [
  "Amiga, organizar os números é governar seu império. Qual o nosso foco de expansão hoje?",
  "Cada real destinado a você mesma é um 'não' dito ao ciclo de escassez. Continue.",
  "Abundância começa na mente antes de aparecer na conta. Você está construindo.",
  "A mulher que entende suas finanças não pede permissão para nada.",
  "Planejamento não é restrição. É liberdade com endereço.",
  "Amiga, pequenos passos consistentes constroem impérios. O que fazemos hoje?",
  "Seu futuro self já está agradecida pelo que você registra agora.",
];

const PERFIS = [
  { id: "evitador", label: "Evitador", desc: "Evita olhar para o dinheiro por medo ou ansiedade.", cor: "#E2725B" },
  { id: "adorador", label: "Adorador", desc: "Vê o dinheiro como solução para todos os problemas.", cor: "#C5B358" },
  { id: "status", label: "Buscador de Status", desc: "Usa o dinheiro para provar valor social.", cor: "#7B8EC8" },
  { id: "vigilante", label: "Vigilante", desc: "Controla o dinheiro com cuidado — às vezes com ansiedade.", cor: "#5BC8A8" },
];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// ═══════════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════════
export default function GoldenSelfAlchemy() {
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [insight, setInsight] = useState(INSIGHTS[0]);
  const [insightVisible, setInsightVisible] = useState(true);
  const insightIdx = useRef(0);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 700);
    const iv = setInterval(() => {
      setInsightVisible(false);
      setTimeout(() => {
        insightIdx.current = (insightIdx.current + 1) % INSIGHTS.length;
        setInsight(INSIGHTS[insightIdx.current]);
        setInsightVisible(true);
      }, 500);
    }, 7000);
    return () => clearInterval(iv);
  }, []);

  if (!loaded) return <Loading />;

  const TABS = [
    { id: "dashboard", icon: "◈", label: "7 Pilares" },
    { id: "financeiro", icon: "♛", label: "Soberania" },
    { id: "oficina", icon: "◆", label: "Oficina" },
    { id: "idiomas", icon: "✦", label: "Idiomas" },
    { id: "mentor", icon: "◉", label: "Mentor IA" },
  ];

  return (
    <div style={s.root}>
      {/* Fundo estrelar */}
      <div style={s.bg} />
      <div style={s.bgStars} />

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div style={s.sideOverlay} onClick={() => setSidebarOpen(false)}>
          <div style={s.sidebar} onClick={e => e.stopPropagation()}>
            <div style={s.sideHeader}>
              <span style={s.sideLogo}>♛ Golden Self-Alchemy</span>
              <button style={s.closeBtn} onClick={() => setSidebarOpen(false)}>✕</button>
            </div>
            {TABS.map(t => (
              <button key={t.id} style={{ ...s.sideItem, ...(tab === t.id ? s.sideItemActive : {}) }}
                onClick={() => { setTab(t.id); setSidebarOpen(false); }}>
                <span style={s.sideItemIcon}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header style={s.header}>
        <button style={s.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
        <div style={s.headerCenter}>
          <span style={s.headerLogo}>♛</span>
          <span style={s.headerTitle}>Golden Self-Alchemy</span>
        </div>
        <div style={s.headerDot} />
      </header>

      {/* Termostato de Abundância */}
      <div style={{ ...s.insightBar, opacity: insightVisible ? 1 : 0 }}>
        <span style={s.insightStar}>✦</span>
        <p style={s.insightText}>{insight}</p>
      </div>

      {/* Conteúdo */}
      <main style={s.main}>
        {tab === "dashboard" && <TabDashboard />}
        {tab === "financeiro" && <TabFinanceiro />}
        {tab === "oficina" && <TabOficina />}
        {tab === "idiomas" && <TabIdiomas />}
        {tab === "mentor" && <TabMentor />}
      </main>

      {/* Bottom nav */}
      <nav style={s.bottomNav}>
        {TABS.map(t => (
          <button key={t.id} style={{ ...s.navBtn, ...(tab === t.id ? s.navBtnActive : {}) }}
            onClick={() => setTab(t.id)}>
            <span style={s.navIcon}>{t.icon}</span>
            <span style={s.navLabel}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ABA 1 — DASHBOARD 7 PILARES
// ═══════════════════════════════════════════════════════════════════
function TabDashboard() {
  const [pilares, setPilares] = useState(() => DB.get("pilares") || PILARES_DEFAULT);
  const [editing, setEditing] = useState(null);
  const [tempPct, setTempPct] = useState(0);
  const [tempNota, setTempNota] = useState("");

  const save = (id) => {
    const updated = pilares.map(p => p.id === id ? { ...p, pct: tempPct, nota: tempNota } : p);
    setPilares(updated);
    DB.set("pilares", updated);
    setEditing(null);
  };

  return (
    <div style={s.tabWrap}>
      <SectionTitle icon="◈" title="Evolução dos 7 Pilares" sub="Clique em qualquer anel para atualizar" />
      <div style={s.pilaresGrid}>
        {pilares.map(p => (
          <div key={p.id} style={s.pilarCard} onClick={() => { setEditing(p.id); setTempPct(p.pct); setTempNota(p.nota); }}>
            <RingProgress pct={p.pct} icon={p.icon} size={80} />
            <p style={s.pilarLabel}>{p.label}</p>
            <p style={s.pilarPct}>{p.pct}%</p>
            {p.nota && <p style={s.pilarNota}>"{p.nota}"</p>}
          </div>
        ))}
      </div>

      {editing && (() => {
        const p = pilares.find(x => x.id === editing);
        return (
          <Modal title={`Atualizar · ${p.label}`} onClose={() => setEditing(null)}>
            <label style={s.label}>Progresso: <strong style={{ color: "#ffd700" }}>{tempPct}%</strong></label>
            <input type="range" min={0} max={100} value={tempPct}
              onChange={e => setTempPct(Number(e.target.value))} style={s.range} />
            <label style={s.label}>Anotação do dia</label>
            <textarea style={s.textarea} rows={3} value={tempNota}
              onChange={e => setTempNota(e.target.value)}
              placeholder="Como está essa área hoje, amiga?" />
            <button style={s.btnGold} onClick={() => save(editing)}>Salvar ♛</button>
          </Modal>
        );
      })()}
    </div>
  );
}

// ─── Anel SVG ─────────────────────────────────────────────────────
function RingProgress({ pct, icon, size = 80 }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a2f4a" strokeWidth={size * 0.1} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={pct >= 70 ? "#C5B358" : pct >= 40 ? "#E2725B" : "#4a6080"}
        strokeWidth={size * 0.1} strokeDasharray={circ} strokeDashoffset={fill}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fontSize={size * 0.28} fill="#ffd700">{icon}</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ABA 2 — SOBERANIA FINANCEIRA
// ═══════════════════════════════════════════════════════════════════
function TabFinanceiro() {
  const [lancamentos, setLancamentos] = useState(() => DB.get("lancamentos") || []);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ desc: "", valor: "", tipo: "entrada", categoria: "QUITAÇÃO" });
  const [perfilAtivo, setPerfilAtivo] = useState(DB.get("perfil") || "vigilante");

  const categorias = ["QUITAÇÃO/INVESTIMENTO", "GASTO PESSOAL/AUTOCUIDADO", "GASTO DESNECESSÁRIO"];

  const entradas = lancamentos.filter(l => l.tipo === "entrada").reduce((s, l) => s + l.valor, 0);
  const saidas = lancamentos.filter(l => l.tipo !== "entrada").reduce((s, l) => s + Math.abs(l.valor), 0);
  const quitacoes = lancamentos.filter(l => l.categoria === "QUITAÇÃO/INVESTIMENTO").reduce((s, l) => s + Math.abs(l.valor), 0);
  const autocuidado = lancamentos.filter(l => l.categoria === "GASTO PESSOAL/AUTOCUIDADO").reduce((s, l) => s + Math.abs(l.valor), 0);
  const saldo = entradas - saidas;

  const openAdd = () => { setEditItem(null); setForm({ desc: "", valor: "", tipo: "entrada", categoria: "QUITAÇÃO/INVESTIMENTO" }); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ desc: item.desc, valor: String(Math.abs(item.valor)), tipo: item.tipo, categoria: item.categoria }); setModal(true); };

  const saveForm = () => {
    if (!form.desc || !form.valor) return;
    const v = parseFloat(form.valor) * (form.tipo === "entrada" ? 1 : -1);
    if (editItem) {
      const upd = lancamentos.map(l => l.id === editItem.id ? { ...l, desc: form.desc, valor: v, tipo: form.tipo, categoria: form.categoria } : l);
      setLancamentos(upd); DB.set("lancamentos", upd);
    } else {
      const novo = { id: uid(), desc: form.desc, valor: v, tipo: form.tipo, categoria: form.categoria, data: new Date().toLocaleDateString("pt-BR") };
      const upd = [novo, ...lancamentos];
      setLancamentos(upd); DB.set("lancamentos", upd);
    }
    setModal(false);
  };

  const del = (id) => { const upd = lancamentos.filter(l => l.id !== id); setLancamentos(upd); DB.set("lancamentos", upd); };

  const setPerf = (id) => { setPerfilAtivo(id); DB.set("perfil", id); };

  return (
    <div style={s.tabWrap}>
      <SectionTitle icon="♛" title="Soberania Financeira" sub="Fluxo de caixa e evolução" />

      {/* Perfis psicológicos */}
      <div style={s.card}>
        <p style={s.cardTitle}>Termostato de Abundância · Perfil Ativo</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PERFIS.map(p => (
            <button key={p.id} style={{ ...s.perfilBtn, borderColor: p.cor, background: perfilAtivo === p.id ? p.cor + "33" : "transparent", color: perfilAtivo === p.id ? p.cor : "#8aadcf" }}
              onClick={() => setPerf(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        {(() => { const p = PERFIS.find(x => x.id === perfilAtivo); return p ? <p style={{ color: "#8aadcf", fontSize: 12, marginTop: 10, fontStyle: "italic" }}>{p.desc}</p> : null; })()}
      </div>

      {/* Bancos */}
      <div style={s.card}>
        <p style={s.cardTitle}>Carteiras Conectadas</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Nubank", "Neon", "Mercado Pago"].map(b => (
            <div key={b} style={s.bankChip}>{b}</div>
          ))}
          <div style={{ ...s.bankChip, borderStyle: "dashed", color: "#C5B358", borderColor: "#C5B358" }}>+ Banco</div>
        </div>
      </div>

      {/* Lançamentos */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ color: "#ffd700", fontFamily: "Georgia, serif", margin: 0 }}>Lançamentos</p>
        <button style={s.btnAdd} onClick={openAdd}>+ Registrar</button>
      </div>

      {lancamentos.length === 0 && <p style={s.empty}>Nenhum lançamento ainda. Registre o primeiro, amiga!</p>}
      {lancamentos.map(l => (
        <div key={l.id} style={s.txRow}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, color: "#e8f0fe", fontSize: 14, fontFamily: "Georgia, serif" }}>{l.desc}</p>
            <p style={{ margin: 0, color: "#4a6f8a", fontSize: 11 }}>{l.data} · {l.categoria}</p>
          </div>
          <p style={{ margin: "0 12px 0 0", color: l.valor > 0 ? "#C5B358" : "#E2725B", fontWeight: "bold", fontFamily: "Georgia, serif", fontSize: 15, whiteSpace: "nowrap" }}>
            {l.valor > 0 ? "+" : ""}{fmt(l.valor)}
          </p>
          <button style={s.iconBtn} onClick={() => openEdit(l)}>✏</button>
          <button style={{ ...s.iconBtn, color: "#E2725B" }} onClick={() => del(l.id)}>🗑</button>
        </div>
      ))}

      {modal && (
        <Modal title={editItem ? "Editar Lançamento" : "Novo Lançamento"} onClose={() => setModal(false)}>
          <label style={s.label}>Descrição</label>
          <input style={s.input} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Ex: Salário, Conta de luz..." />
          <label style={s.label}>Valor (R$)</label>
          <input style={s.input} type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} placeholder="0,00" />
          <label style={s.label}>Tipo</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {["entrada", "saida"].map(t => (
              <button key={t} style={{ ...s.tipoBtn, ...(form.tipo === t ? s.tipoBtnActive : {}) }} onClick={() => setForm({ ...form, tipo: t })}>
                {t === "entrada" ? "Entrada" : "Saída"}
              </button>
            ))}
          </div>
          <label style={s.label}>Categoria</label>
          <select style={s.select} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button style={s.btnGold} onClick={saveForm}>Salvar ♛</button>
        </Modal>
      )}

      {/* Footer caixa */}
      <div style={s.footerCaixa}>
        <FooterItem label="Saldo em Caixa" valor={saldo} color={saldo >= 0 ? "#C5B358" : "#E2725B"} />
        <div style={s.footerDiv} />
        <FooterItem label="Quitações" valor={quitacoes} color="#E2725B" />
        <div style={s.footerDiv} />
        <FooterItem label="Invest. em Mim" valor={autocuidado} color="#C5B358" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ABA 3 — OFICINA DE ALQUIMIA
// ═══════════════════════════════════════════════════════════════════
const STATUS_FLOW = ["Design", "Cura", "Acabamento", "Venda"];

function TabOficina() {
  const [projetos, setProjetos] = useState(() => DB.get("projetos") || []);
  const [insumos, setInsumos] = useState(() => DB.get("insumos") || []);
  const [modalProj, setModalProj] = useState(false);
  const [modalIns, setModalIns] = useState(false);
  const [formProj, setFormProj] = useState({ nome: "", tipo: "Relógio de Resina", status: "Design" });
  const [formIns, setFormIns] = useState({ nome: "", qtd: "" });
  const [editProj, setEditProj] = useState(null);
  const [editIns, setEditIns] = useState(null);

  const saveProj = () => {
    if (!formProj.nome) return;
    if (editProj) {
      const upd = projetos.map(p => p.id === editProj.id ? { ...p, ...formProj } : p);
      setProjetos(upd); DB.set("projetos", upd);
    } else {
      const upd = [{ id: uid(), ...formProj }, ...projetos];
      setProjetos(upd); DB.set("projetos", upd);
    }
    setModalProj(false); setEditProj(null);
  };

  const nextStatus = (id) => {
    const upd = projetos.map(p => {
      if (p.id !== id) return p;
      const idx = STATUS_FLOW.indexOf(p.status);
      return { ...p, status: STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)] };
    });
    setProjetos(upd); DB.set("projetos", upd);
  };

  const delProj = (id) => { const upd = projetos.filter(p => p.id !== id); setProjetos(upd); DB.set("projetos", upd); };

  const saveIns = () => {
    if (!formIns.nome) return;
    if (editIns) {
      const upd = insumos.map(i => i.id === editIns.id ? { ...i, ...formIns } : i);
      setInsumos(upd); DB.set("insumos", upd);
    } else {
      const upd = [{ id: uid(), ...formIns }, ...insumos];
      setInsumos(upd); DB.set("insumos", upd);
    }
    setModalIns(false); setEditIns(null);
  };

  const delIns = (id) => { const upd = insumos.filter(i => i.id !== id); setInsumos(upd); DB.set("insumos", upd); };

  const STATUS_COLORS = { Design: "#7B8EC8", Cura: "#C5B358", Acabamento: "#E2725B", Venda: "#5BC8A8" };

  return (
    <div style={s.tabWrap}>
      <SectionTitle icon="◆" title="Oficina de Alquimia" sub="Gestão de produção e insumos" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ color: "#ffd700", fontFamily: "Georgia, serif", margin: 0 }}>Projetos</p>
        <button style={s.btnAdd} onClick={() => { setEditProj(null); setFormProj({ nome: "", tipo: "Relógio de Resina", status: "Design" }); setModalProj(true); }}>+ Novo</button>
      </div>

      {projetos.length === 0 && <p style={s.empty}>Nenhum projeto ainda. Crie o primeiro!</p>}
      {projetos.map(p => (
        <div key={p.id} style={s.projCard}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 4px", color: "#e8f0fe", fontFamily: "Georgia, serif", fontSize: 15 }}>{p.nome}</p>
            <p style={{ margin: 0, color: "#4a6f8a", fontSize: 11 }}>{p.tipo}</p>
          </div>
          <button style={{ ...s.statusBadge, background: STATUS_COLORS[p.status] + "33", color: STATUS_COLORS[p.status], borderColor: STATUS_COLORS[p.status] }}
            onClick={() => nextStatus(p.id)}>
            {p.status} →
          </button>
          <button style={s.iconBtn} onClick={() => { setEditProj(p); setFormProj({ nome: p.nome, tipo: p.tipo, status: p.status }); setModalProj(true); }}>✏</button>
          <button style={{ ...s.iconBtn, color: "#E2725B" }} onClick={() => delProj(p.id)}>🗑</button>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 8px" }}>
        <p style={{ color: "#ffd700", fontFamily: "Georgia, serif", margin: 0 }}>Insumos & Estoque</p>
        <button style={s.btnAdd} onClick={() => { setEditIns(null); setFormIns({ nome: "", qtd: "" }); setModalIns(true); }}>+ Item</button>
      </div>

      {insumos.length === 0 && <p style={s.empty}>Nenhum insumo cadastrado.</p>}
      {insumos.map(i => (
        <div key={i.id} style={{ ...s.txRow, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, color: "#e8f0fe", fontSize: 14, fontFamily: "Georgia, serif" }}>{i.nome}</p>
          </div>
          <p style={{ margin: "0 12px 0 0", color: "#C5B358", fontFamily: "Georgia, serif" }}>Qtd: {i.qtd}</p>
          <button style={s.iconBtn} onClick={() => { setEditIns(i); setFormIns({ nome: i.nome, qtd: i.qtd }); setModalIns(true); }}>✏</button>
          <button style={{ ...s.iconBtn, color: "#E2725B" }} onClick={() => delIns(i.id)}>🗑</button>
        </div>
      ))}

      {modalProj && (
        <Modal title={editProj ? "Editar Projeto" : "Novo Projeto"} onClose={() => setModalProj(false)}>
          <label style={s.label}>Nome</label>
          <input style={s.input} value={formProj.nome} onChange={e => setFormProj({ ...formProj, nome: e.target.value })} placeholder="Ex: Relógio Azul Safira" />
          <label style={s.label}>Tipo</label>
          <select style={s.select} value={formProj.tipo} onChange={e => setFormProj({ ...formProj, tipo: e.target.value })}>
            <option>Relógio de Resina</option>
            <option>Camiseta</option>
            <option>Outro</option>
          </select>
          <label style={s.label}>Status</label>
          <select style={s.select} value={formProj.status} onChange={e => setFormProj({ ...formProj, status: e.target.value })}>
            {STATUS_FLOW.map(st => <option key={st}>{st}</option>)}
          </select>
          <button style={s.btnGold} onClick={saveProj}>Salvar ♛</button>
        </Modal>
      )}

      {modalIns && (
        <Modal title={editIns ? "Editar Insumo" : "Novo Insumo"} onClose={() => setModalIns(false)}>
          <label style={s.label}>Nome do insumo</label>
          <input style={s.input} value={formIns.nome} onChange={e => setFormIns({ ...formIns, nome: e.target.value })} placeholder="Ex: Resina epóxi, Pigmento dourado..." />
          <label style={s.label}>Quantidade</label>
          <input style={s.input} value={formIns.qtd} onChange={e => setFormIns({ ...formIns, qtd: e.target.value })} placeholder="Ex: 2 frascos, 500ml..." />
          <button style={s.btnGold} onClick={saveIns}>Salvar ♛</button>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ABA 4 — LABORATÓRIO DE IDIOMAS
// ═══════════════════════════════════════════════════════════════════
function TabIdiomas() {
  const [cards, setCards] = useState(() => DB.get("idiomas") || []);
  const [modal, setModal] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [form, setForm] = useState({ pt: "", en: "", th: "", idioma: "Inglês" });
  const [flip, setFlip] = useState({});

  const hoje = new Date().toLocaleDateString("pt-BR");
  const ontem = new Date(Date.now() - 86400000).toLocaleDateString("pt-BR");
  const revisao = cards.filter(c => c.data === ontem);

  const save = () => {
    if (!form.pt) return;
    if (editCard) {
      const upd = cards.map(c => c.id === editCard.id ? { ...c, ...form } : c);
      setCards(upd); DB.set("idiomas", upd);
    } else {
      const upd = [{ id: uid(), ...form, data: hoje, arquivado: false }, ...cards];
      setCards(upd); DB.set("idiomas", upd);
    }
    setModal(false); setEditCard(null);
  };

  const arquivar = (id) => {
    const upd = cards.map(c => c.id === id ? { ...c, arquivado: true } : c);
    setCards(upd); DB.set("idiomas", upd);
  };

  const del = (id) => { const upd = cards.filter(c => c.id !== id); setCards(upd); DB.set("idiomas", upd); };

  const toggleFlip = (id) => setFlip(f => ({ ...f, [id]: !f[id] }));

  const ativos = cards.filter(c => !c.arquivado);

  return (
    <div style={s.tabWrap}>
      <SectionTitle icon="✦" title="Laboratório de Idiomas" sub="Inglês & Tailandês" />

      {revisao.length > 0 && (
        <div style={s.revisaoBox}>
          <p style={{ color: "#C5B358", fontFamily: "Georgia, serif", margin: "0 0 8px", fontSize: 13 }}>
            ✦ Revisão forçada de ontem ({revisao.length} {revisao.length === 1 ? "frase" : "frases"})
          </p>
          {revisao.map(c => (
            <div key={c.id} style={{ color: "#8aadcf", fontSize: 12, marginBottom: 4 }}>
              <strong style={{ color: "#e8f0fe" }}>{c.pt}</strong> → {c.en || c.th}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ color: "#ffd700", fontFamily: "Georgia, serif", margin: 0 }}>Flashcards ({ativos.length})</p>
        <button style={s.btnAdd} onClick={() => { setEditCard(null); setForm({ pt: "", en: "", th: "", idioma: "Inglês" }); setModal(true); }}>+ Novo</button>
      </div>

      {ativos.length === 0 && <p style={s.empty}>Nenhum flashcard ainda. Adicione sua primeira frase!</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {ativos.map(c => (
          <div key={c.id} style={{ ...s.flashCard, background: flip[c.id] ? "#1a3a5c" : "#0f2744" }}
            onClick={() => toggleFlip(c.id)}>
            <p style={{ color: "#C5B358", fontSize: 10, letterSpacing: "0.1em", margin: "0 0 6px" }}>{c.idioma} · toque para virar</p>
            {flip[c.id]
              ? <p style={{ color: "#ffd700", fontFamily: "Georgia, serif", fontSize: 14, margin: "0 0 6px" }}>{c.en || c.th}</p>
              : <p style={{ color: "#e8f0fe", fontFamily: "Georgia, serif", fontSize: 14, margin: "0 0 6px" }}>{c.pt}</p>
            }
            <p style={{ color: "#4a6f8a", fontSize: 10, margin: 0 }}>{c.data}</p>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }} onClick={e => e.stopPropagation()}>
              <button style={{ ...s.iconBtn, fontSize: 11 }} onClick={() => { setEditCard(c); setForm({ pt: c.pt, en: c.en, th: c.th, idioma: c.idioma }); setModal(true); }}>✏</button>
              <button style={{ ...s.iconBtn, fontSize: 11, color: "#C5B358" }} onClick={() => arquivar(c.id)}>✓ fixei</button>
              <button style={{ ...s.iconBtn, fontSize: 11, color: "#E2725B" }} onClick={() => del(c.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editCard ? "Editar Flashcard" : "Novo Flashcard"} onClose={() => setModal(false)}>
          <label style={s.label}>Idioma</label>
          <select style={s.select} value={form.idioma} onChange={e => setForm({ ...form, idioma: e.target.value })}>
            <option>Inglês</option>
            <option>Tailandês</option>
          </select>
          <label style={s.label}>Português</label>
          <input style={s.input} value={form.pt} onChange={e => setForm({ ...form, pt: e.target.value })} placeholder="Frase em português..." />
          <label style={s.label}>{form.idioma}</label>
          <input style={s.input} value={form.idioma === "Inglês" ? form.en : form.th}
            onChange={e => setForm(form.idioma === "Inglês" ? { ...form, en: e.target.value } : { ...form, th: e.target.value })}
            placeholder={`Tradução em ${form.idioma}...`} />
          <button style={s.btnGold} onClick={save}>Salvar ♛</button>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ABA 5 — MENTOR IA (Claude API)
// ═══════════════════════════════════════════════════════════════════
function TabMentor() {
  const [msgs, setMsgs] = useState(() => DB.get("chat") || [
    { role: "assistant", content: "Olá, amiga! Sou seu Mentor IA. Estou aqui para te apoiar com foco, clareza e alta performance. O que está no seu coração hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    DB.set("chat", newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Você é o Mentor IA do Golden Self-Alchemy, um ecossistema pessoal de alta performance. 
Trate sempre a usuária como 'amiga'. Seja encorajador, grounded e focado em alta performance. 
Use linguagem calorosa, direta e inspiradora. Integre conceitos de psicologia financeira (transição de escassez para abundância), autoconhecimento e os 7 pilares: Espiritual, Mental, Físico, Financeiro, Profissional, Social e Lúdico.
Seja conciso mas profundo. Responda em português do Brasil.`,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Não consegui responder agora, amiga. Tente novamente.";
      const updated = [...newMsgs, { role: "assistant", content: reply }];
      setMsgs(updated);
      DB.set("chat", updated);
    } catch {
      const updated = [...newMsgs, { role: "assistant", content: "Houve um erro de conexão, amiga. Tente novamente em instantes." }];
      setMsgs(updated);
      DB.set("chat", updated);
    }
    setLoading(false);
  };

  const clearChat = () => { const reset = [msgs[0]]; setMsgs(reset); DB.set("chat", reset); };

  return (
    <div style={{ ...s.tabWrap, paddingBottom: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SectionTitle icon="◉" title="Mentor IA" sub="Seu amigo de alta performance" />
        <button style={{ ...s.btnAdd, fontSize: 11 }} onClick={clearChat}>Limpar</button>
      </div>

      <div style={s.chatBox}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{ ...s.bubble, ...(m.role === "user" ? s.bubbleUser : s.bubbleAssist) }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
            <div style={s.bubbleAssist}>
              <span style={{ color: "#C5B358" }}>✦ ✦ ✦</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={s.chatInput}>
        <input style={s.chatField} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Escreva aqui, amiga..." />
        <button style={s.sendBtn} onClick={send} disabled={loading}>→</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  COMPONENTES UTILITÁRIOS
// ═══════════════════════════════════════════════════════════════════
function Loading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a192f", gap: 16 }}>
      <span style={{ fontSize: 40, color: "#ffd700" }}>♛</span>
      <p style={{ color: "#C5B358", fontFamily: "Georgia, serif", letterSpacing: "0.2em", fontSize: 13 }}>CARREGANDO SEU IMPÉRIO...</p>
    </div>
  );
}

function SectionTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ color: "#C5B358", fontSize: 11, letterSpacing: "0.15em", margin: "0 0 2px", textTransform: "uppercase" }}>{icon} {sub}</p>
      <h2 style={{ color: "#ffd700", fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: 22, margin: 0 }}>{title}</h2>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#ffd700", fontFamily: "Georgia, serif", fontWeight: "normal", margin: 0, fontSize: 18 }}>{title}</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FooterItem({ label, valor, color }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <p style={{ color: "#4a6f8a", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 3px" }}>{label}</p>
      <p style={{ color, fontSize: 13, fontWeight: "bold", fontFamily: "Georgia, serif", margin: 0 }}>{fmt(valor)}</p>
    </div>
  );
}

const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

// ═══════════════════════════════════════════════════════════════════
//  ESTILOS — MIDNIGHT GOLD
// ═══════════════════════════════════════════════════════════════════
const s = {
  root: { fontFamily: "'Georgia', serif", background: "#0a192f", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 80, color: "#e8f0fe", overflowX: "hidden" },
  bg: { position: "fixed", inset: 0, background: "radial-gradient(ellipse at 20% 10%, #1a3a6c22 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, #ffd70008 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 },
  bgStars: { position: "fixed", inset: 0, backgroundImage: "radial-gradient(1px 1px at 20% 30%, #ffd70033 0%, transparent 100%), radial-gradient(1px 1px at 70% 15%, #ffd70022 0%, transparent 100%), radial-gradient(1px 1px at 50% 70%, #ffd70011 0%, transparent 100%)", pointerEvents: "none", zIndex: 0 },
  header: { background: "linear-gradient(180deg, #0d2240 0%, #0a192f 100%)", borderBottom: "1px solid #1a3a6c", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 },
  menuBtn: { background: "none", border: "none", color: "#C5B358", fontSize: 22, cursor: "pointer", padding: 4 },
  headerCenter: { display: "flex", alignItems: "center", gap: 8 },
  headerLogo: { color: "#ffd700", fontSize: 20 },
  headerTitle: { color: "#ffd700", fontFamily: "Georgia, serif", fontSize: 16, letterSpacing: "0.04em" },
  headerDot: { width: 8, height: 8, borderRadius: "50%", background: "#C5B358", boxShadow: "0 0 8px #C5B358" },
  insightBar: { background: "linear-gradient(90deg, #0d2240, #122a4a)", borderLeft: "2px solid #C5B358", margin: "0 0 0 0", padding: "10px 16px", display: "flex", gap: 10, alignItems: "flex-start", transition: "opacity 0.5s ease", position: "relative", zIndex: 1 },
  insightStar: { color: "#C5B358", fontSize: 12, flexShrink: 0, marginTop: 2 },
  insightText: { color: "#8aadcf", fontSize: 12, lineHeight: 1.55, margin: 0, fontStyle: "italic" },
  main: { position: "relative", zIndex: 1 },
  tabWrap: { padding: "20px 16px 20px" },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#0d2240", borderTop: "1px solid #1a3a6c", display: "flex", zIndex: 20 },
  navBtn: { flex: 1, background: "none", border: "none", color: "#4a6f8a", padding: "10px 0 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "color 0.2s" },
  navBtnActive: { color: "#ffd700" },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 9, letterSpacing: "0.05em" },
  sideOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex" },
  sidebar: { background: "#0d2240", width: 260, padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4, borderRight: "1px solid #1a3a6c" },
  sideHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sideLogo: { color: "#ffd700", fontFamily: "Georgia, serif", fontSize: 14 },
  closeBtn: { background: "none", border: "none", color: "#4a6f8a", fontSize: 18, cursor: "pointer" },
  sideItem: { background: "none", border: "none", color: "#8aadcf", padding: "12px 14px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Georgia, serif", textAlign: "left" },
  sideItemActive: { background: "#1a3a6c", color: "#ffd700" },
  sideItemIcon: { fontSize: 16 },
  card: { background: "#0f2744", border: "1px solid #1a3a6c", borderRadius: 12, padding: "16px", marginBottom: 12 },
  cardTitle: { color: "#C5B358", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" },
  pilaresGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 },
  pilarCard: { background: "#0f2744", border: "1px solid #1a3a6c", borderRadius: 12, padding: "14px 8px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s", ":hover": { borderColor: "#ffd700" } },
  pilarLabel: { color: "#8aadcf", fontSize: 11, margin: "8px 0 2px", letterSpacing: "0.05em" },
  pilarPct: { color: "#ffd700", fontFamily: "Georgia, serif", fontSize: 16, margin: 0 },
  pilarNota: { color: "#4a6f8a", fontSize: 10, margin: "4px 0 0", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  txRow: { display: "flex", alignItems: "flex-start", background: "#0f2744", border: "1px solid #1a3a6c", borderRadius: 10, padding: "12px 14px", marginBottom: 8 },
  projCard: { display: "flex", alignItems: "center", background: "#0f2744", border: "1px solid #1a3a6c", borderRadius: 10, padding: "12px 14px", marginBottom: 8, gap: 8 },
  statusBadge: { border: "1px solid", borderRadius: 20, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif", whiteSpace: "nowrap" },
  flashCard: { border: "1px solid #1a3a6c", borderRadius: 12, padding: "14px", cursor: "pointer", transition: "background 0.3s", minHeight: 100 },
  revisaoBox: { background: "#0f2744", border: "1px solid #C5B35833", borderRadius: 12, padding: 14, marginBottom: 16 },
  chatBox: { background: "#0a1929", border: "1px solid #1a3a6c", borderRadius: 12, padding: 14, height: 380, overflowY: "auto", marginBottom: 12 },
  bubble: { maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.55, fontFamily: "Georgia, serif" },
  bubbleUser: { background: "#1a3a6c", color: "#e8f0fe", borderBottomRightRadius: 4 },
  bubbleAssist: { background: "#0f2744", color: "#8aadcf", borderBottomLeftRadius: 4, border: "1px solid #1a3a6c" },
  chatInput: { display: "flex", gap: 8 },
  chatField: { flex: 1, background: "#0f2744", border: "1px solid #1a3a6c", borderRadius: 10, padding: "12px 14px", color: "#e8f0fe", fontFamily: "Georgia, serif", fontSize: 13, outline: "none" },
  sendBtn: { background: "linear-gradient(135deg, #C5B358, #ffd700)", border: "none", borderRadius: 10, width: 46, color: "#0a192f", fontSize: 18, cursor: "pointer", fontWeight: "bold" },
  footerCaixa: { position: "fixed", bottom: 60, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#0d1f3a", borderTop: "1px solid #1a3a6c", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "12px 10px", zIndex: 15 },
  footerDiv: { width: 1, height: 28, background: "#1a3a6c" },
  perfilBtn: { border: "1px solid", borderRadius: 20, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif", transition: "all 0.2s" },
  bankChip: { background: "#1a3a6c33", border: "1px solid #1a3a6c", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#8aadcf" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 50, display: "flex", alignItems: "flex-end", backdropFilter: "blur(4px)" },
  modal: { background: "#0d2240", border: "1px solid #1a3a6c", borderRadius: "16px 16px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 430, margin: "0 auto" },
  label: { display: "block", color: "#4a6f8a", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 },
  input: { width: "100%", background: "#0a192f", border: "1px solid #1a3a6c", borderRadius: 8, padding: "12px 14px", color: "#e8f0fe", fontFamily: "Georgia, serif", fontSize: 14, marginBottom: 14, boxSizing: "border-box", outline: "none" },
  select: { width: "100%", background: "#0a192f", border: "1px solid #1a3a6c", borderRadius: 8, padding: "12px 14px", color: "#e8f0fe", fontFamily: "Georgia, serif", fontSize: 14, marginBottom: 14, boxSizing: "border-box", outline: "none" },
  textarea: { width: "100%", background: "#0a192f", border: "1px solid #1a3a6c", borderRadius: 8, padding: "12px 14px", color: "#e8f0fe", fontFamily: "Georgia, serif", fontSize: 14, marginBottom: 14, boxSizing: "border-box", outline: "none", resize: "vertical" },
  range: { width: "100%", marginBottom: 14, accentColor: "#ffd700" },
  btnGold: { width: "100%", background: "linear-gradient(135deg, #C5B358, #ffd700)", border: "none", borderRadius: 10, padding: 14, color: "#0a192f", fontFamily: "Georgia, serif", fontSize: 15, letterSpacing: "0.06em", cursor: "pointer", fontWeight: "bold" },
  btnAdd: { background: "#E2725B22", border: "1px solid #E2725B", color: "#E2725B", borderRadius: 20, padding: "6px 16px", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" },
  iconBtn: { background: "none", border: "none", color: "#4a6f8a", fontSize: 14, cursor: "pointer", padding: "2px 4px" },
  empty: { color: "#2a4a6a", fontStyle: "italic", fontSize: 13, textAlign: "center", padding: "20px 0" },
  tipoBtn: { flex: 1, background: "#0a192f", border: "1px solid #1a3a6c", borderRadius: 8, padding: "10px", color: "#8aadcf", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12 },
  tipoBtnActive: { background: "#1a3a6c", color: "#ffd700", borderColor: "#ffd700" },
};
