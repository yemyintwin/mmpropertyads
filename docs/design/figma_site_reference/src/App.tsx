import { useState, type ReactNode } from 'react'

type Screen = 'home' | 'results' | 'detail' | 'login' | 'post' | 'account'
type IconName =
  | 'search' | 'pin' | 'bed' | 'bath' | 'area' | 'heart' | 'user' | 'plus'
  | 'arrow' | 'sliders' | 'grid' | 'map' | 'home' | 'message' | 'check'
  | 'chevron' | 'share' | 'shield' | 'camera' | 'menu' | 'x'

const photos = [
  'https://images.unsplash.com/photo-1629288124106-e6d8e752e686?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1701824580039-2156f55f8657?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1604238670645-a28ebd1e01a5?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1652847041658-202c70e7b564?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1629224834618-1cf72b367162?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1539145632639-c13729854e15?auto=format&fit=crop&w=1400&q=85',
]

const listings = [
  { price: '26,800 Lakh', title: 'Skyline residence with lake views', location: 'Golden Valley · Bahan', facts: ['3 beds', '2 baths', '1,216 sq ft'], image: photos[0], badge: 'Featured' },
  { price: '25 Lakh /mo', title: 'Serene garden apartment', location: 'Sanchaung · Yangon', facts: ['2 beds', '2 baths', '893 sq ft'], image: photos[5], badge: 'For rent' },
  { price: '19,800 Lakh', title: 'Modern home near the river', location: 'Star City · Thanlyin', facts: ['2 beds', '2 baths', '1,012 sq ft'], image: photos[2], badge: 'New' },
  { price: '31,500 Lakh', title: 'Light-filled family residence', location: 'Pyay Road · Kamayut', facts: ['4 beds', '3 baths', '1,615 sq ft'], image: photos[3], badge: 'For sale' },
  { price: '21 Lakh /mo', title: 'City-fringe loft with balcony', location: 'Hledan · Kamayut', facts: ['2 beds', '1 bath', '775 sq ft'], image: photos[4], badge: 'For rent' },
  { price: '24,200 Lakh', title: 'Architect-designed city home', location: 'Inya Road · Yangon', facts: ['3 beds', '2 baths', '1,184 sq ft'], image: photos[1], badge: 'New' },
]

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    bed: <><path d="M3 19v-8m18 8v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h18"/><path d="M7 11V7h5a2 2 0 0 1 2 2v2"/></>,
    bath: <><path d="M4 12h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2Z"/><path d="M7 12V6a3 3 0 0 1 6 0"/></>,
    area: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/><path d="M3 8 8 3m8 0 5 5M3 16l5 5m8 0 5-5"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15m6-12v15"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    camera: <><path d="M14 5 12.5 3h-5L6 5H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="4"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    x: <path d="m6 6 12 12M18 6 6 18"/>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Button({ children, variant = 'primary', icon, onClick, full, type = 'button' }: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
  icon?: IconName; onClick?: () => void; full?: boolean; type?: 'button' | 'submit'
}) {
  return <button type={type} onClick={onClick} className={`btn btn-${variant}${full ? ' btn-full' : ''}`}>{icon && <Icon name={icon} size={18}/>}<span>{children}</span></button>
}

function Header({ screen, go, loggedIn }: { screen: Screen; go: (s: Screen) => void; loggedIn: boolean }) {
  const [open, setOpen] = useState(false)
  return <>
    <header className="header">
      <button className="brand" onClick={() => go('home')} aria-label="MM Property Ads home">
        <img className="site-logo" src="/mm-property-ads-logo.png" alt="MM Property Ads"/>
      </button>
      <nav className="desktop-nav" aria-label="Main navigation">
        <button className={screen === 'results' ? 'active' : ''} onClick={() => go('results')}>Buy</button>
        <button onClick={() => go('results')}>Rent</button>
        <button onClick={() => go('results')}>Neighbourhoods</button>
      </nav>
      <div className="header-actions">
        {screen !== 'home' && <button className="search-shortcut" onClick={() => go('results')}><Icon name="search" size={18}/><span>Search homes</span></button>}
        <Button variant="accent" icon="plus" onClick={() => loggedIn ? go('post') : go('login')}>Post an ad</Button>
        <button className="account-btn" onClick={() => loggedIn ? go('account') : go('login')}><Icon name="user" size={18}/><span>{loggedIn ? 'Jamie' : 'Log in'}</span></button>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Open menu"><Icon name={open ? 'x' : 'menu'}/></button>
      </div>
    </header>
    {open && <div className="mobile-drawer">
      <button onClick={() => { go('results'); setOpen(false) }}>Buy a home</button>
      <button onClick={() => { go('results'); setOpen(false) }}>Rent a home</button>
      <button onClick={() => { go(loggedIn ? 'account' : 'login'); setOpen(false) }}>{loggedIn ? 'My account' : 'Log in'}</button>
    </div>}
  </>
}

function SearchBar({ onSearch }: { onSearch: () => void }) {
  return <div className="search-shell">
    <div className="search-tabs"><button className="active">Buy</button><button>Rent</button></div>
    <div className="search-fields">
      <button className="search-field wide"><Icon name="pin" size={20}/><span><small>LOCATION</small><b>Where do you want to live?</b></span></button>
      <button className="search-field"><span><small>PROPERTY TYPE</small><b>All homes</b></span><Icon name="chevron" size={16}/></button>
      <button className="search-field desktop-field"><span><small>PRICE RANGE</small><b>Any price</b></span><Icon name="chevron" size={16}/></button>
      <button className="search-field desktop-field"><span><small>BEDROOMS</small><b>Any beds</b></span><Icon name="chevron" size={16}/></button>
      <button className="search-submit" onClick={onSearch} aria-label="Search"><Icon name="search"/><span>Search</span></button>
    </div>
  </div>
}

function ListingCard({ item, onOpen, compact = false }: { item: typeof listings[number]; onOpen: () => void; compact?: boolean }) {
  const [saved, setSaved] = useState(false)
  return <article className={`listing-card${compact ? ' compact' : ''}`}>
    <div className="listing-image" onClick={onOpen}>
      <img src={item.image} alt={item.title}/>
      <span className="photo-badge">{item.badge}</span>
      <button className={`heart${saved ? ' saved' : ''}`} onClick={(e) => { e.stopPropagation(); setSaved(!saved) }} aria-label="Save listing"><Icon name="heart" size={19}/></button>
    </div>
    <button className="listing-copy" onClick={onOpen}>
      <strong>{item.price}</strong><h3>{item.title}</h3><p><Icon name="pin" size={15}/>{item.location}</p>
      <div className="facts"><span><Icon name="bed" size={16}/>{item.facts[0]}</span><span><Icon name="bath" size={16}/>{item.facts[1]}</span><span><Icon name="area" size={16}/>{item.facts[2]}</span></div>
      <small>Listed 2 days ago</small>
    </button>
  </article>
}

function HomePage({ go }: { go: (s: Screen) => void }) {
  return <main>
    <section className="hero">
      <img className="hero-bg" src={photos[1]} alt="Modern city skyline"/>
      <div className="hero-overlay"/>
      <div className="hero-content">
        <span className="eyebrow light">PROPERTY, MADE PERSONAL</span>
        <h1>Find a place that<br/><em>feels like you.</em></h1>
        <p>Thoughtfully selected homes for every way of living, all in one place.</p>
        <SearchBar onSearch={() => go('results')}/>
        <div className="hero-note"><span>Popular:</span><button onClick={() => go('results')}>Bahan</button><button onClick={() => go('results')}>Sanchaung</button><button onClick={() => go('results')}>Kamayut</button></div>
      </div>
    </section>

    <section className="section">
      <div className="section-head"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Homes worth discovering</h2><p>Fresh listings selected for quality, location and character.</p></div><Button variant="secondary" onClick={() => go('results')}>View all homes <Icon name="arrow" size={17}/></Button></div>
      <div className="listing-grid featured">{listings.slice(0, 3).map((x, i) => <ListingCard key={i} item={x} onOpen={() => go('detail')}/>)}</div>
    </section>

    <section className="areas-section">
      <div className="section section-inner">
        <div className="section-head"><div><span className="eyebrow">EXPLORE AREAS</span><h2>Find your neighbourhood</h2></div></div>
        <div className="area-grid">
          {[
            ['Golden Valley', 'Quiet streets, refined living', photos[5], '142 homes'],
            ['Thanlyin', 'River views and open space', photos[3], '238 homes'],
            ['Kamayut', 'Connected city living', photos[1], '186 homes'],
          ].map((a, i) => <button className={`area-card area-${i + 1}`} key={a[0]} onClick={() => go('results')}><img src={a[2]} alt=""/><span><small>{a[3]}</small><strong>{a[0]}</strong><em>{a[1]}</em></span><i><Icon name="arrow" size={19}/></i></button>)}
        </div>
      </div>
    </section>

    <section className="section how">
      <div className="how-intro"><span className="eyebrow">SIMPLE BY DESIGN</span><h2>Your next move,<br/>made easier.</h2><p>Whether you're searching or selling, every step stays clear and considered.</p></div>
      <div className="steps">
        {[
          ['01', 'Discover', 'Search and filter verified homes in the areas you love.'],
          ['02', 'Connect', 'Speak directly with owners and trusted agents.'],
          ['03', 'Move', 'Make confident decisions with everything in one place.'],
        ].map(s => <div className="step" key={s[0]}><span>{s[0]}</span><div><h3>{s[1]}</h3><p>{s[2]}</p></div></div>)}
      </div>
    </section>

    <section className="cta">
      <div><span className="eyebrow light">YOUR PROPERTY, OUR AUDIENCE</span><h2>Have a home to share?</h2><p>Reach serious buyers and renters with a listing that makes your property stand out.</p></div>
      <Button variant="accent" icon="plus" onClick={() => go('login')}>Post your property</Button>
    </section>
  </main>
}

function ResultsPage({ go }: { go: (s: Screen) => void }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [activePin, setActivePin] = useState(0)
  const activeListing = listings[activePin]
  return <main className="results-page">
    <div className="results-search"><SearchBar onSearch={() => {}}/></div>
    <div className="crumbs"><button onClick={() => go('home')}>Home</button><Icon name="chevron" size={13}/><span>Properties for sale</span></div>
    <section className="results-heading">
      <div><span className="eyebrow">PROPERTIES NEAR YOU</span><h1>Homes for sale</h1><p>342 properties found</p></div>
      <div className="result-actions"><button className={`view-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')} aria-label="Grid view"><Icon name="grid" size={17}/></button><button className={`view-btn${view === 'map' ? ' active' : ''}`} onClick={() => setView('map')}><Icon name="map" size={17}/><span>Map</span></button><select aria-label="Sort results"><option>Newest first</option><option>Price: low to high</option></select></div>
    </section>
    <div className="mobile-filter-bar"><Button variant="secondary" icon="sliders" onClick={() => setFilterOpen(!filterOpen)}>Filters</Button><button className={view === 'map' ? 'active' : ''} onClick={() => setView(view === 'map' ? 'grid' : 'map')}><Icon name={view === 'map' ? 'grid' : 'map'} size={16}/>{view === 'map' ? 'List' : 'Map'}</button><button>Sort <Icon name="chevron" size={14}/></button></div>
    {filterOpen && <aside className="filters mobile-filters open">
      <div className="filter-title"><h2>Filters</h2><button onClick={() => setFilterOpen(false)}>Close</button></div>
      <label>Price range</label><div className="dual-input"><input placeholder="Min price"/><input placeholder="Max price"/></div>
      <label>Property type</label><div className="chips"><button className="selected">All</button><button>Condo</button><button>Apartment</button><button>House</button></div>
      <label>Bedrooms</label><div className="chips row"><button>Studio</button><button>1</button><button className="selected">2</button><button>3</button><button>4+</button></div>
      <Button full onClick={() => setFilterOpen(false)}>Show 342 homes</Button>
    </aside>}
    {view === 'grid' ? <div className="results-layout">
      <aside className="filters desktop-filters">
        <div className="filter-title"><h2>Filters</h2><button>Clear all</button></div>
        <label>Price range</label><div className="dual-input"><input placeholder="Min price"/><input placeholder="Max price"/></div>
        <label>Property type</label><div className="chips"><button className="selected">All</button><button>Condo</button><button>Apartment</button><button>House</button></div>
        <label>Bedrooms</label><div className="chips row"><button>Studio</button><button>1</button><button className="selected">2</button><button>3</button><button>4+</button></div>
        <label>Bathrooms</label><div className="chips row"><button>1+</button><button>2+</button><button>3+</button></div>
        <label>Floor area</label><div className="dual-input"><input placeholder="Min sq ft"/><input placeholder="Max sq ft"/></div>
        <label className="check-line"><input type="checkbox"/> Furnished only</label>
        <Button full onClick={() => setFilterOpen(false)}>Show 342 homes</Button>
      </aside>
      <div className="result-content">
        <div className="active-filters"><span>For sale <button>×</button></span><span>2+ bedrooms <button>×</button></span><button>Clear all</button></div>
        <div className="listing-grid results">{listings.map((x, i) => <ListingCard key={i} item={x} onOpen={() => go('detail')}/>)}</div>
        <div className="save-search"><span><Icon name="heart"/><span><strong>Don’t miss the right home</strong><small>Get notified when new properties match your search.</small></span></span><Button variant="secondary">Save this search</Button></div>
        <div className="pagination"><button>←</button><button className="active">1</button><button>2</button><button>3</button><span>…</span><button>18</button><button>→</button></div>
      </div>
    </div> : <div className="map-view-layout">
      <aside className="map-listings-panel">
        <div className="map-list-head"><div><strong>342 homes</strong><small>Click a listing to locate it on the map</small></div><button><Icon name="sliders" size={17}/> Filters</button></div>
        <div className="map-list-scroll">
          {listings.map((item, i) => <button className={`map-list-card${activePin === i ? ' active' : ''}`} key={item.title} onClick={() => setActivePin(i)}>
            <img src={item.image} alt=""/>
            <span><small>{item.badge}</small><strong>{item.price}</strong><b>{item.title}</b><em><Icon name="pin" size={13}/>{item.location}</em><i>{item.facts.join(' · ')}</i></span>
          </button>)}
        </div>
      </aside>
      <section className="google-map-shell" aria-label="Property map">
        <iframe title="Google Map of properties around Yangon" src="https://www.google.com/maps?q=Yangon%2C%20Myanmar&z=12&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
        <div className="map-toolbar"><button><Icon name="pin" size={16}/> Search this area</button></div>
        <div className="map-price-pins">
          {listings.map((item, i) => <button key={item.title} className={`price-pin pin-${i + 1}${activePin === i ? ' active' : ''}`} onClick={() => setActivePin(i)} aria-label={`${item.price}, ${item.title}`}>{item.price}</button>)}
        </div>
        <article className="map-preview-card">
          <button className="map-preview-image" onClick={() => go('detail')}><img src={activeListing.image} alt={activeListing.title}/><span>{activePin + 1} / {listings.length}</span></button>
          <button className="map-preview-copy" onClick={() => go('detail')}><strong>{activeListing.price}</strong><h2>{activeListing.title}</h2><p><Icon name="pin" size={14}/>{activeListing.location}</p><small>{activeListing.facts.join(' · ')}</small></button>
          <button className="map-preview-heart" aria-label="Save property"><Icon name="heart" size={18}/></button>
        </article>
        <span className="google-map-note">Map data © Google</span>
      </section>
    </div>}
  </main>
}

function DetailPage({ go, loggedIn }: { go: (s: Screen) => void; loggedIn: boolean }) {
  const [contacted, setContacted] = useState(false)
  const contact = () => loggedIn ? setContacted(true) : go('login')
  return <main className="detail-page">
    <div className="crumbs detail-crumb"><button onClick={() => go('home')}>Home</button><Icon name="chevron" size={13}/><button onClick={() => go('results')}>For sale</button><Icon name="chevron" size={13}/><span>Golden Valley</span></div>
    <div className="gallery">
      <button className="gallery-main"><img src={photos[0]} alt="Skyline residence living room"/></button>
      <button><img src={photos[5]} alt="Residence garden"/></button>
      <button><img src={photos[2]} alt="Residence exterior"/></button>
      <button><img src={photos[4]} alt="Building exterior"/></button>
      <span className="photo-count"><Icon name="camera" size={17}/> 12 photos</span>
    </div>
    <div className="detail-layout">
      <article>
        <div className="detail-title">
          <div><span className="status-dot">FOR SALE</span><h1>Skyline residence with lake views</h1><p><Icon name="pin" size={18}/> Golden Valley Road, Bahan · Yangon</p></div>
          <div className="detail-icons"><button aria-label="Share"><Icon name="share"/></button><button aria-label="Save"><Icon name="heart"/></button></div>
        </div>
        <div className="price-mobile">26,800 Lakh</div>
        <div className="key-facts">
          <div><Icon name="bed"/><span><strong>3</strong><small>Bedrooms</small></span></div>
          <div><Icon name="bath"/><span><strong>2</strong><small>Bathrooms</small></span></div>
          <div><Icon name="area"/><span><strong>1,216</strong><small>sq ft</small></span></div>
          <div><Icon name="home"/><span><strong>Condo</strong><small>Property type</small></span></div>
        </div>
        <div className="detail-section"><h2>About this home</h2><p>Wake up to sweeping views of the bay in this beautifully considered three-bedroom residence. Floor-to-ceiling windows fill the living spaces with natural light, while warm finishes create a calm retreat above the city.</p><p>The home includes a generous open-plan kitchen, private balcony, dedicated study nook and access to a 50-metre pool, gym and residents’ lounge.</p><button className="text-link">Read full description <Icon name="chevron" size={15}/></button></div>
        <div className="detail-section"><h2>Amenities</h2><div className="amenities">{['Swimming pool', 'Gym', '24-hour security', 'Balcony', 'Covered parking', 'Air conditioning'].map(x => <span key={x}><Icon name="check" size={17}/>{x}</span>)}</div></div>
        <div className="detail-section"><h2>Location</h2><p className="location-address"><Icon name="pin" size={17}/> Golden Valley Road, Bahan, Yangon</p><div className="listing-google-map"><iframe title="Google Map showing Golden Valley, Bahan" src="https://www.google.com/maps?q=Golden%20Valley%2C%20Bahan%2C%20Yangon&z=15&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div><div className="map-links"><a href="https://www.google.com/maps/search/?api=1&query=Golden%20Valley%2C%20Bahan%2C%20Yangon" target="_blank" rel="noreferrer"><Icon name="map" size={16}/> Open in Google Maps</a><a href="https://www.google.com/maps/dir/?api=1&destination=Golden%20Valley%2C%20Bahan%2C%20Yangon" target="_blank" rel="noreferrer"><Icon name="arrow" size={16}/> Get directions</a></div></div>
        <div className="listing-meta"><span>Listed 2 days ago</span><span>Ad reference: HV-24108</span><button>Report this ad</button></div>
      </article>
      <aside className="contact-card">
        {!contacted ? <>
          <small>ASKING PRICE</small><h2>26,800 Lakh</h2><p>22 Lakh per sq ft</p>
          <div className="agent"><span className="avatar">JL</span><span><strong>Joanne Lim</strong><small>Property owner · Joined 2022</small></span></div>
          <Button full icon="message" onClick={contact}>Contact advertiser</Button>
          <Button full variant="secondary" onClick={contact}>Show phone number</Button>
          <div className="verified"><Icon name="shield" size={19}/><span><strong>Identity verified</strong><small>Responds within a few hours</small></span></div>
        </> : <div className="contact-success"><span><Icon name="check" size={26}/></span><h2>Enquiry started</h2><p>Joanne usually responds within a few hours.</p><textarea placeholder="Hi, I’m interested in this property. Is it still available?" defaultValue="Hi, I’m interested in this property. Is it still available?"/><Button full>Send message</Button></div>}
      </aside>
    </div>
    <section className="section similar"><div className="section-head"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>Similar homes nearby</h2></div></div><div className="listing-grid">{listings.slice(2, 5).map((x, i) => <ListingCard item={x} key={i} onOpen={() => {}}/>)}</div></section>
  </main>
}

function LoginPage({ onLogin, go }: { onLogin: () => void; go: (s: Screen) => void }) {
  const [signup, setSignup] = useState(false)
  return <main className="auth-page">
    <div className="auth-image"><img src={photos[3]} alt="Modern home"/><div><span className="auth-brand logo-on-dark"><img className="site-logo" src="/mm-property-ads-logo.png" alt="MM Property Ads"/></span><blockquote>“The simplest way to find a home that fits your life.”</blockquote><p>Great homes. One thoughtful place.</p></div></div>
    <div className="auth-form">
      <button className="auth-close" onClick={() => go('detail')} aria-label="Close"><Icon name="x"/></button>
      <div className="auth-inner">
        <span className="eyebrow">{signup ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</span>
        <h1>{signup ? 'Start your home journey.' : 'Good to see you.'}</h1>
        <p>{signup ? 'Create an account to post, save and connect.' : 'Log in to continue where you left off.'}</p>
        <div className="socials"><Button full variant="secondary">G&nbsp; Continue with Google</Button><Button full variant="secondary">f&nbsp; Continue with Facebook</Button></div>
        <div className="divider"><span>or continue with email</span></div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin() }}>
          {signup && <div className="form-field"><label>Full name</label><input required placeholder="Jamie Tan"/></div>}
          <div className="form-field"><label>Email address</label><input type="email" required placeholder="you@example.com"/></div>
          <div className="form-field"><label>Password</label><input type="password" required placeholder="At least 8 characters"/></div>
          {!signup && <button type="button" className="forgot">Forgot password?</button>}
          <Button full type="submit">{signup ? 'Create account' : 'Log in'}</Button>
        </form>
        <p className="auth-switch">{signup ? 'Already have an account?' : 'New here?'} <button onClick={() => setSignup(!signup)}>{signup ? 'Log in' : 'Create account'}</button></p>
      </div>
    </div>
  </main>
}

const postSteps = ['Property', 'Location', 'Photos', 'Description', 'Contact', 'Review']
function PostPage({ go }: { go: (s: Screen) => void }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  if (done) return <main className="success-page"><div className="success-icon"><Icon name="check" size={38}/></div><span className="eyebrow">LISTING SUBMITTED</span><h1>Your ad is pending approval.</h1><p>Our moderation team usually reviews new listings within 24 hours. We’ll email you as soon as it’s live.</p><div><Button onClick={() => go('account')}>View my ads</Button><Button variant="secondary" onClick={() => go('home')}>Back to home</Button></div></main>
  return <main className="post-page">
    <div className="post-top"><div><span className="eyebrow">POST A PROPERTY</span><h1>{step === 0 ? 'Tell us about your property' : postSteps[step]}</h1></div><button>Save draft</button></div>
    <div className="stepper">{postSteps.map((s, i) => <div className={`${i === step ? 'active' : ''}${i < step ? ' complete' : ''}`} key={s}><span>{i < step ? <Icon name="check" size={14}/> : i + 1}</span><small>{s}</small></div>)}</div>
    <div className="post-layout">
      <section className="post-form-card">
        {step === 0 && <><h2>Property details</h2><p>Start with the basics. You can review everything before publishing.</p><div className="form-field"><label>Listing type</label><div className="choice-cards"><button className="selected"><Icon name="home"/><strong>For sale</strong></button><button><Icon name="home"/><strong>For rent</strong></button></div></div><div className="form-field"><label>Property type</label><select><option>Select property type</option><option>Condominium</option><option>HDB</option><option>Landed house</option></select></div><div className="form-row"><div className="form-field"><label>Bedrooms</label><select><option>3</option></select></div><div className="form-field"><label>Bathrooms</label><select><option>2</option></select></div></div></>}
        {step === 1 && <><h2>Pin the location</h2><p>Enter the property address, then adjust the pin if needed.</p><div className="form-field"><label>Street address</label><input defaultValue="12 Golden Valley Road"/></div><div className="form-row"><div className="form-field"><label>Township</label><input defaultValue="Bahan"/></div><div className="form-field"><label>City</label><select><option>Yangon</option><option>Mandalay</option><option>Nay Pyi Taw</option></select></div></div><div className="map-placeholder large"><div className="roads"/><span className="map-pin"><Icon name="home" size={18}/></span></div></>}
        {step === 2 && <><h2>Add your best photos</h2><p>Listings with 6 or more quality photos get more enquiries.</p><div className="drop-zone"><span><Icon name="camera" size={28}/></span><strong>Drag and drop photos here</strong><small>or click to browse · JPG or PNG, up to 10 MB</small><Button variant="secondary">Choose photos</Button></div><div className="photo-preview"><div><img src={photos[0]} alt="Cover"/><span>Cover</span></div><div><img src={photos[5]} alt="Photo 2"/></div><div><img src={photos[2]} alt="Photo 3"/></div></div></>}
        {step >= 3 && step < 5 && <><h2>{step === 3 ? 'Description and price' : 'Contact details'}</h2><p>{step === 3 ? 'Help people understand what makes your property special.' : 'Choose how interested people can reach you.'}</p>{step === 3 ? <><div className="form-field"><label>Listing title</label><input defaultValue="Skyline residence with lake views"/></div><div className="form-field"><label>Description</label><textarea defaultValue="A beautifully considered three-bedroom residence with sweeping views and generous natural light."/></div><div className="form-field"><label>Asking price (Lakh MMK)</label><input defaultValue="26,800"/></div></> : <><div className="form-field"><label>Contact name</label><input defaultValue="Jamie Tan"/></div><div className="form-field"><label>Phone number</label><input defaultValue="+95 9 123 456 789"/></div><label className="check-line"><input type="checkbox" defaultChecked/> Allow enquiries through platform messages</label></>}</>}
        {step === 5 && <><h2>Review your listing</h2><p>Check the details before submitting for approval.</p><div className="review-card"><img src={photos[0]} alt="Listing"/><div><span className="status-dot">FOR SALE</span><h3>Skyline residence with lake views</h3><strong>26,800 Lakh</strong><p>3 beds · 2 baths · 1,216 sq ft</p></div></div><div className="review-note"><Icon name="shield"/><span><strong>What happens next?</strong><p>We’ll review your listing for quality and safety before it goes live.</p></span></div></>}
        <div className="form-navigation">{step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}<Button onClick={() => step === 5 ? setDone(true) : setStep(step + 1)}>{step === 5 ? 'Submit for approval' : 'Continue'} <Icon name="arrow" size={17}/></Button></div>
      </section>
      <aside className="post-tip"><Icon name="shield"/><div><strong>Your details are safe</strong><p>We only use your information to verify and display this listing.</p></div></aside>
    </div>
  </main>
}

function AccountPage({ go }: { go: (s: Screen) => void }) {
  const [editing, setEditing] = useState(false)
  return <main className="account-page">
    <div className="account-head"><div><span className="eyebrow">MY ACCOUNT</span><h1>{editing ? 'Edit listing' : 'Good morning, Jamie.'}</h1><p>{editing ? 'Update your property details and save your changes.' : 'Manage your properties and keep up with enquiries.'}</p></div>{!editing && <Button icon="plus" onClick={() => go('post')}>Post a property</Button>}</div>
    {editing ? <section className="edit-card"><div className="edit-preview"><img src={photos[0]} alt="Listing"/><span>Live</span></div><div className="edit-fields"><div className="form-field"><label>Listing title</label><input defaultValue="Skyline residence with lake views"/></div><div className="form-row"><div className="form-field"><label>Price (Lakh MMK)</label><input defaultValue="26,800"/></div><div className="form-field"><label>Status</label><select><option>Live</option><option>Mark as sold</option></select></div></div><div className="form-field"><label>Description</label><textarea defaultValue="Wake up to sweeping views in this beautifully considered three-bedroom residence."/></div><div className="form-navigation"><Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button><Button onClick={() => setEditing(false)}>Save changes</Button></div></div></section> : <div className="account-layout">
      <aside className="account-nav">{[['home', 'My ads'], ['heart', 'Favourites'], ['search', 'Saved searches'], ['message', 'Messages'], ['user', 'Profile & settings']].map((n, i) => <button className={i === 0 ? 'active' : ''} key={n[1]}><Icon name={n[0] as IconName}/>{n[1]}{n[1] === 'Messages' && <span>2</span>}</button>)}</aside>
      <section className="my-ads"><div className="my-ads-head"><h2>My ads <span>3</span></h2><div className="chips row"><button className="selected">All</button><button>Live</button><button>Draft</button><button>Pending</button></div></div>
        <div className="ad-row"><img src={photos[0]} alt="Property"/><div className="ad-main"><span className="tag live">Live</span><h3>Skyline residence with lake views</h3><p>26,800 Lakh · Golden Valley</p><small>248 views · 6 enquiries</small></div><div className="ad-actions"><Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button><button>•••</button></div></div>
        <div className="ad-row"><img src={photos[5]} alt="Property"/><div className="ad-main"><span className="tag pending">Pending</span><h3>Serene garden apartment</h3><p>25 Lakh /mo · Sanchaung</p><small>Submitted today</small></div><div className="ad-actions"><Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button><button>•••</button></div></div>
        <div className="ad-row"><div className="draft-image"><Icon name="camera"/></div><div className="ad-main"><span className="tag draft">Draft</span><h3>Untitled property</h3><p>Last edited 3 days ago</p><small>3 of 6 steps completed</small></div><div className="ad-actions"><Button variant="secondary" onClick={() => go('post')}>Continue</Button><button>•••</button></div></div>
      </section>
    </div>}
  </main>
}

function Footer({ go }: { go: (s: Screen) => void }) {
  return <footer><div className="footer-top"><div className="footer-brand"><span className="logo-on-dark"><img className="site-logo" src="/mm-property-ads-logo.png" alt="MM Property Ads"/></span><p>Thoughtful property search for modern living.</p></div><div><strong>Explore</strong><button onClick={() => go('results')}>Buy</button><button onClick={() => go('results')}>Rent</button><button>Neighbourhoods</button></div><div><strong>List with us</strong><button onClick={() => go('post')}>Post an ad</button><button>How it works</button><button>Pricing</button></div><div><strong>Company</strong><button>About</button><button>Help centre</button><button>Contact</button></div></div><div className="footer-bottom"><span>© 2025 MM Property Ads.</span><span>Privacy · Terms · Accessibility</span></div></footer>
}

function MobileNav({ screen, go, loggedIn }: { screen: Screen; go: (s: Screen) => void; loggedIn: boolean }) {
  return <nav className="bottom-nav"><button className={screen === 'home' ? 'active' : ''} onClick={() => go('home')}><Icon name="home"/><span>Home</span></button><button className={screen === 'results' ? 'active' : ''} onClick={() => go('results')}><Icon name="search"/><span>Search</span></button><button className="nav-post" onClick={() => loggedIn ? go('post') : go('login')}><Icon name="plus"/><span>Post</span></button><button><Icon name="heart"/><span>Saved</span></button><button className={screen === 'account' ? 'active' : ''} onClick={() => loggedIn ? go('account') : go('login')}><Icon name="user"/><span>Account</span></button></nav>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [loggedIn, setLoggedIn] = useState(false)
  const [returnTo, setReturnTo] = useState<Screen>('detail')
  const go = (next: Screen) => {
    if (next === 'login') setReturnTo(screen === 'home' ? 'post' : screen)
    setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const login = () => { setLoggedIn(true); setScreen(returnTo === 'login' ? 'detail' : returnTo) }
  return <div className="app">
    {screen !== 'login' && <Header screen={screen} go={go} loggedIn={loggedIn}/>}
    {screen === 'home' && <HomePage go={go}/>}
    {screen === 'results' && <ResultsPage go={go}/>}
    {screen === 'detail' && <DetailPage go={go} loggedIn={loggedIn}/>}
    {screen === 'login' && <LoginPage onLogin={login} go={go}/>}
    {screen === 'post' && <PostPage go={go}/>}
    {screen === 'account' && <AccountPage go={go}/>}
    {screen !== 'login' && screen !== 'post' && screen !== 'account' && <Footer go={go}/>}
    {screen !== 'login' && <MobileNav screen={screen} go={go} loggedIn={loggedIn}/>}
  </div>
}
