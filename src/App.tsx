import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingBag, Menu, Sparkles, ArrowUpRight, Heart, ShieldCheck, Truck, MessageCircle, X } from "lucide-react";

type Product = { id: string; name: string; description: string; price: number; image_url?: string | null; category?: string; featured?: boolean };
const fallback: Product[] = [
  { id:"p1", name:"Kit de productividad", description:"Herramientas digitales para organizar tus proyectos.", price:149, category:"Digital", featured:true, image_url:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=85" },
  { id:"p2", name:"Accesorios esenciales", description:"Pequeños detalles que hacen la diferencia.", price:229, category:"Accesorios", featured:true, image_url:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85" },
  { id:"p3", name:"Pack creativo", description:"Recursos para dar forma a tus mejores ideas.", price:99, category:"Digital", image_url:"https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85" }
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(fallback);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    fetch("/api/products").then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (Array.isArray(data.products) && data.products.length) setProducts(data.products);
      setApiReady(true);
    }).catch(() => setApiReady(false));
  }, []);

  const categories = useMemo(() => ["Todos", ...Array.from(new Set(products.map(p => p.category || "General")))], [products]);
  const visible = products.filter(p => (category === "Todos" || (p.category || "General") === category) && (p.name + " " + p.description).toLowerCase().includes(query.toLowerCase()));
  const add = (p: Product) => setCart(old => [...old, p]);
  const money = (n: number) => new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", maximumFractionDigits:0 }).format(n);

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><ShoppingBag size={19}/></span><span>Galaxia <b>Shop</b><small>DESCUBRE TU UNIVERSO</small></span></a>
      <nav className={menuOpen ? "nav open" : "nav"}><a href="#catalogo" onClick={()=>setMenuOpen(false)}>Catálogo</a><a href="#beneficios" onClick={()=>setMenuOpen(false)}>Beneficios</a><a href="#contacto" onClick={()=>setMenuOpen(false)}>Contacto</a></nav>
      <div className="actions"><button className="cart-btn" onClick={()=>document.getElementById("cart-panel")?.classList.toggle("show")} aria-label="Abrir carrito"><ShoppingBag size={18}/><span>Carrito</span><i>{cart.length}</i></button><button className="menu-btn" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menú">{menuOpen ? <X/> : <Menu/>}</button></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
        <div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> TU PRÓXIMO DESCUBRIMIENTO</div><h1>Un universo de<br/><span>posibilidades.</span></h1><p>Encuentra productos seleccionados, novedades y ofertas pensadas para ti.</p><a className="primary-btn" href="#catalogo">Explorar tienda <ArrowUpRight size={17}/></a><div className="hero-note"><ShieldCheck size={15}/> Compra con confianza · Atención cercana</div></div>
        <div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="planet"><span>✦</span></div><div className="float-card card-top"><Sparkles size={15}/> Nuevos hallazgos</div><div className="float-card card-bottom"><span className="live-dot"/> Ofertas en órbita</div></div>
      </section>

      <section className="catalog section-wrap" id="catalogo">
        <div className="section-heading"><div><div className="eyebrow">SELECCIÓN GALÁCTICA</div><h2>Explora el catálogo</h2><p>Encuentra eso que estabas buscando.</p></div><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar productos..."/></div></div>
        <div className="category-row">{categories.map(c=><button key={c} className={category===c?"chip active":"chip"} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="product-grid">{visible.map(p=><article className="product-card" key={p.id}><div className="product-image"><img src={p.image_url || fallback[0].image_url || ""} alt={p.name}/><button className="favorite" aria-label="Favorito"><Heart size={17}/></button>{p.featured && <span className="product-tag">DESTACADO</span>}</div><div className="product-info"><span className="product-category">{p.category || "General"}</span><h3>{p.name}</h3><p>{p.description}</p><div className="product-bottom"><strong>{money(Number(p.price))}</strong><button onClick={()=>add(p)} className="add-btn">Agregar <span>+</span></button></div></div></article>)}</div>
        {!visible.length && <div className="empty">No encontramos productos con esa búsqueda.</div>}
        {!apiReady && <div className="dev-note">Vista de demostración · El catálogo se conectará automáticamente al cargar los productos de Neon.</div>}
      </section>

      <section className="benefits section-wrap" id="beneficios"><div className="benefit"><span><ShieldCheck/></span><div><b>Compra segura</b><small>Protección y claridad en cada paso.</small></div></div><div className="benefit"><span><Truck/></span><div><b>Entrega clara</b><small>Información transparente sobre tu pedido.</small></div></div><div className="benefit"><span><MessageCircle/></span><div><b>Atención cercana</b><small>Estamos para resolver tus dudas.</small></div></div></section>
    </main>
    <footer id="contacto"><a className="brand" href="#"><span className="brand-mark"><ShoppingBag size={18}/></span><span>Galaxia <b>Shop</b><small>DESCUBRE TU UNIVERSO</small></span></a><span>© {new Date().getFullYear()} Galaxia Shop. Todos los derechos reservados.</span><a href="https://t.me/" target="_blank" rel="noreferrer">Contactar <ArrowUpRight size={14}/></a></footer>
    <aside className="cart-panel" id="cart-panel"><div className="cart-head"><b>Tu carrito ({cart.length})</b><button onClick={()=>document.getElementById("cart-panel")?.classList.remove("show")}><X size={18}/></button></div>{cart.length ? <>{cart.map((p,i)=><div className="cart-line" key={i}><span>{p.name}</span><b>{money(p.price)}</b></div>)}<div className="cart-total"><span>Total</span><b>{money(cart.reduce((s,p)=>s+p.price,0))}</b></div><p className="cart-hint">El proceso de pago se habilitará al configurar la pasarela Clip.</p></> : <p className="cart-hint">Tu carrito está esperando su primer descubrimiento.</p>}</aside>
  </div>;
}