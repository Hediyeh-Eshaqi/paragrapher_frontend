import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell, BookOpen, Bookmark, Check, ChevronLeft, Compass, CreditCard, Heart,
  LogOut, Mail, MessageCircle, Plus, Quote as QuoteIcon, Search, Send,
  ShieldCheck, Sparkles, Store, Trash2, Users, UserRound, X,
} from "lucide-react";
import { api } from "./api";
import "./App.css";

const navItems = [
  { id: "home", label: "خانه", icon: Compass },
  { id: "communities", label: "جامعه‌ها", icon: Users },
  { id: "quotes", label: "نقل‌قول‌ها", icon: QuoteIcon },
  { id: "store", label: "بازار کتاب", icon: Store },
  { id: "groups", label: "گروه‌ها", icon: MessageCircle },
  { id: "chat", label: "پیام‌ها", icon: Mail },
  { id: "profile", label: "پروفایل", icon: UserRound },
];

const pageTitles = {
  ...Object.fromEntries(navItems.map((item) => [item.id, item.label])),
  communityCreate: "ساخت جامعه",
  notifications: "اعلان‌ها",
  search: "جست‌وجو",
};

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

function Avatar({ user, size = "normal" }) {
  const initial = user?.display_name?.trim()?.[0] || user?.username?.[0] || "پ";
  return user?.avatar_url ? (
    <img className={"avatar avatar-" + size} src={api.assetUrl(user.avatar_url)} alt="" />
  ) : (
    <span className={"avatar avatar-" + size}>{initial}</span>
  );
}

function Button({ children, kind = "primary", className = "", ...props }) {
  return <button className={"button button-" + kind + " " + className} {...props}>{children}</button>;
}

function Panel({ children, className = "" }) {
  return <section className={"panel " + className}>{children}</section>;
}

function Empty({ children }) {
  return <div className="empty-state">{children}</div>;
}

function BrandMark({ className = "" }) {
  return <img className={`brand-mark ${className}`} src="/book-page-mark.png" alt="" />;
}

export function AuthScreen({ onSignIn, busy = false, error = "" }) {
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", display_name: "", password: "" });
  const change = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    await onSignIn(form, registering);
  }
  return (
    <main className="auth-shell">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <section className="auth-card">
        <BrandMark className="brand-mark-large" />
        <div className="auth-brand-name">پاراگراف</div>
        <div className="eyebrow">خانه‌ای برای کتاب‌خوان‌ها</div>
        <h1>هر کتاب، شروع یک گفت‌وگو</h1>
        <p className="muted auth-intro">نقل‌قول‌های دوست‌داشتنی‌ات را نگه دار، به جامعه‌های کتاب‌خوانی بپیوند و کتاب بعدی‌ات را پیدا کن.</p>
        <div className="auth-tabs">
          <button className={!registering ? "active" : ""} onClick={() => setRegistering(false)}>ورود</button>
          <button className={registering ? "active" : ""} onClick={() => setRegistering(true)}>ساخت حساب</button>
        </div>
        <form className="stack-form" onSubmit={submit}>
          {registering && <label>نام نمایشی<input required value={form.display_name} onChange={change("display_name")} autoComplete="name" /></label>}
          <label>نام کاربری<input required value={form.username} onChange={change("username")} autoComplete="username" /></label>
          {registering && <label>ایمیل<input required type="email" value={form.email} onChange={change("email")} autoComplete="email" /></label>}
          <label>گذرواژه<input required type="password" minLength="10" value={form.password} onChange={change("password")} autoComplete={registering ? "new-password" : "current-password"} /></label>
          {error && <div role="alert" className="inline-error">{error}</div>}
          <Button type="submit" disabled={busy}>{busy ? "لطفاً صبر کنید…" : registering ? "ساخت حساب و ورود" : "ورود به پاراگراف"}<ChevronLeft size={18} /></Button>
        </form>
        <div className="demo-hint">
          <ShieldCheck size={18} />
          <span>برای آشنایی سریع، وارد شوید:<br /><b dir="ltr">nima_reader</b> / <b dir="ltr">ParagrapherDemo123!</b></span>
        </div>
      </section>
      <div className="auth-footer">کتاب‌ها را با هم بهتر می‌خوانیم <Sparkles size={15} /></div>
    </main>
  );
}

function QuoteCard({ quote, user, onChanged, onError }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(quote.text);
  const [working, setWorking] = useState(false);
  async function toggleLike() {
    if (!user) return onError("برای پسندیدن نقل‌قول ابتدا وارد شوید.");
    setWorking(true);
    try {
      await (quote.is_liked ? api.delete("/quotes/" + quote.id + "/likes/me") : api.put("/quotes/" + quote.id + "/likes/me"));
      await onChanged();
    } catch (error) { onError(error.message); } finally { setWorking(false); }
  }
  async function openReplies() {
    if (!showReplies) {
      try { setReplies(await api.get("/quotes/" + quote.id + "/replies")); }
      catch (error) { onError(error.message); }
    }
    setShowReplies(!showReplies);
  }
  async function sendReply(event) {
    event.preventDefault();
    if (!replyText.trim()) return;
    setWorking(true);
    try {
      await api.post("/quotes/" + quote.id + "/replies", { text: replyText });
      setReplyText("");
      setReplies(await api.get("/quotes/" + quote.id + "/replies"));
      await onChanged();
    } catch (error) { onError(error.message); } finally { setWorking(false); }
  }
  async function saveEdit() {
    setWorking(true);
    try {
      await api.patch("/quotes/" + quote.id, { text: editText });
      setEditing(false);
      await onChanged();
    } catch (error) { onError(error.message); } finally { setWorking(false); }
  }
  async function remove() {
    if (!window.confirm("این نقل‌قول حذف شود؟")) return;
    try { await api.delete("/quotes/" + quote.id); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  const own = user && quote.user?.username === user.username;
  return (
    <article className="quote-card">
      <div className="quote-topline">
        <Avatar user={quote.user} />
        <div className="quote-author">
          <b>{quote.user?.display_name || quote.user?.username}</b>
          <span>{quote.community?.name} · {formatDate(quote.created_at)}</span>
        </div>
        {quote.reference && <span className="quote-reference">{quote.reference}</span>}
      </div>
      {editing ? <textarea className="quote-edit" aria-label="ویرایش نقل‌قول" value={editText} onChange={(event) => setEditText(event.target.value)} /> : <p className="quote-text">{quote.text}</p>}
      {quote.character && <div className="quote-character">از زبان {quote.character}</div>}
      {!!quote.tags?.length && <div className="tag-row">{quote.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div>}
      <div className="quote-actions">
        <button className={quote.is_liked ? "quote-action liked" : "quote-action"} onClick={toggleLike} disabled={working} aria-label={quote.is_liked ? "برداشتن پسند" : "پسندیدن نقل‌قول"}><Heart size={17} fill={quote.is_liked ? "currentColor" : "none"} />{quote.like_count || 0}</button>
        <button className="quote-action" onClick={openReplies}><MessageCircle size={17} />{quote.reply_count || replies.length || 0} پاسخ</button>
        {own && !editing && <button className="text-action" onClick={() => setEditing(true)}>ویرایش</button>}
        {own && !editing && <button className="text-action danger-text" onClick={remove}>حذف</button>}
        {editing && <><Button kind="quiet" onClick={() => setEditing(false)}>لغو</Button><Button kind="small" onClick={saveEdit} disabled={working}>ذخیره</Button></>}
        <span className="quote-spacer" />
        <button className="share-action" aria-label="رفتن به جامعه" onClick={() => window.dispatchEvent(new CustomEvent("paragrapher-community", { detail: quote.community?.slug }))}><Bookmark size={17} /></button>
      </div>
      {showReplies && <div className="reply-area">
        {replies.map((reply) => <div className="reply-item" key={reply.id}><Avatar user={reply.user} size="small" /><div><b>{reply.user?.display_name}</b><p>{reply.text}</p><time>{formatDate(reply.created_at)}</time></div></div>)}
        {!replies.length && <p className="muted small-copy">هنوز پاسخی ثبت نشده است.</p>}
        {user && <form className="reply-form" onSubmit={sendReply}><input aria-label="متن پاسخ" placeholder="دیدگاهت را بنویس…" value={replyText} onChange={(event) => setReplyText(event.target.value)} /><Button type="submit" kind="small" disabled={working || !replyText.trim()} aria-label="ارسال پاسخ"><Send size={16} /></Button></form>}
      </div>}
    </article>
  );
}

function CommunityCard({ community, user, onChanged, onOpen, onError }) {
  const [working, setWorking] = useState(false);
  async function join() {
    if (!user) return onError("برای پیوستن ابتدا وارد شوید.");
    setWorking(true);
    try {
      await (community.is_member ? api.delete("/communities/" + community.slug + "/join") : api.post("/communities/" + community.slug + "/join"));
      await onChanged();
    } catch (error) { onError(error.message); } finally { setWorking(false); }
  }
  async function like() {
    if (!user) return onError("برای پسندیدن جامعه ابتدا وارد شوید.");
    try {
      await (community.is_liked ? api.delete("/communities/" + community.slug + "/likes/me") : api.put("/communities/" + community.slug + "/likes/me"));
      await onChanged();
    } catch (error) { onError(error.message); }
  }
  return <article className="community-card">
    <button className="community-open" onClick={() => onOpen(community)}>
      <span className="community-monogram">{community.name?.[0] || "ک"}</span>
      <span className="community-copy"><b>{community.name}</b><small>{community.member_count} عضو · {community.like_count} پسند</small></span>
      <ChevronLeft size={18} />
    </button>
    <p>{community.description}</p>
    <div className="card-actions">
      <Button kind="soft" onClick={join} disabled={working || community.is_private && !community.is_member}>{community.is_member ? "عضو هستید" : community.is_private ? "خصوصی" : "پیوستن"}</Button>
      <button className={community.is_liked ? "quote-action liked" : "quote-action"} onClick={like} aria-label="پسندیدن جامعه"><Heart size={16} fill={community.is_liked ? "currentColor" : "none"} /></button>
    </div>
  </article>;
}

function BookCard({ book, user, onChanged, onError }) {
  const [busy, setBusy] = useState(false);
  async function act(path, body = {}) {
    if (!user) return onError("برای استفاده از بازار ابتدا وارد شوید.");
    setBusy(true);
    try { await api.post(path, body); await onChanged(); }
    catch (error) { onError(error.message); } finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm("آگهی کتاب حذف شود؟")) return;
    try { await api.delete("/books/" + book.id); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  return <article className="book-card">
    <div className="book-cover">{book.image_url ? <img src={api.assetUrl(book.image_url)} alt="" /> : <BookOpen size={28} />}</div>
    <div className="book-body">
      <div className="book-kicker">{book.genre || "کتاب"} · {book.community?.name}</div>
      <h3>{book.title}</h3>
      <p className="muted">نوشته‌ی {book.author}</p>
      {book.description && <p className="book-description">{book.description}</p>}
      <div className="book-bottom"><b>{book.price} سکه</b><span>{book.seller?.display_name}</span></div>
      {user && book.seller?.username !== user.username && book.status !== "sold" && <div className="card-actions">
        <Button kind="soft" disabled={busy || book.status === "reserved"} onClick={() => act("/books/" + book.id + "/reserve")}>{book.status === "reserved" ? "رزرو شده" : "رزرو ۳۰ دقیقه‌ای"}</Button>
        <Button kind="small" disabled={busy} onClick={() => act("/books/" + book.id + "/purchase")}>خرید کتاب</Button>
        <Button kind="quiet" disabled={busy} onClick={() => act("/loans", { book_id: book.id })}>درخواست امانت</Button>
      </div>}
      {user && book.seller?.username === user.username && <div className="card-actions"><Button kind="quiet" onClick={remove}><Trash2 size={15} /> حذف آگهی</Button></div>}
      {book.status === "sold" && <span className="tag">فروخته شد</span>}
    </div>
  </article>;
}

function HomePage({ daily, popular, communities, topCommunities, books, user, onChanged, onError, go }) {
  return <div className="page-grid">
    <div className="main-column">
      <Panel className="daily-panel">
        <div className="section-heading"><div><span className="eyebrow">هر روز، یک جمله‌ی تازه</span><h2>نقل‌قول امروز</h2></div><span className="daily-sun">✳</span></div>
        {daily?.quote ? <><p className="daily-quote">«{daily.quote.text}»</p><div className="daily-meta">{daily.quote.character ? daily.quote.character + " · " : ""}{daily.quote.reference} <span>از {daily.quote.user?.display_name}</span></div><QuoteCard quote={daily.quote} user={user} onChanged={onChanged} onError={onError} /></> : <Empty>هنوز نقل‌قولی برای نمایش نیست. اولین نقل‌قول را در یک جامعه ثبت کنید.</Empty>}
      </Panel>
      <div className="section-heading section-heading-inline"><div><span className="eyebrow">از دل جامعه‌ها</span><h2>نقل‌قول‌های محبوب</h2></div><button className="text-action" onClick={() => go("quotes")}>همه‌ی نقل‌قول‌ها <ChevronLeft size={16} /></button></div>
      <div className="stack-list">{popular.length ? popular.map((quote) => <QuoteCard key={quote.id} quote={quote} user={user} onChanged={onChanged} onError={onError} />) : <Empty>هنوز نقل‌قولی ثبت نشده است.</Empty>}</div>
    </div>
    <aside className="side-column">
      <Panel><div className="section-heading"><div><span className="eyebrow">آدم‌های هم‌سلیقه</span><h2>جامعه‌های برتر</h2></div><Users size={19} /></div>
        <div className="mini-community-list">{topCommunities.slice(0, 5).map((item) => <button key={item.id} className="mini-community" onClick={() => go("communities")}><span className="community-monogram small-monogram">{item.name?.[0]}</span><span><b>{item.name}</b><small>{item.member_count} عضو</small></span><ChevronLeft size={16} /></button>)}</div>
        <Button kind="quiet" className="full-width" onClick={() => go("communities")}>دیدن همه‌ی جامعه‌ها <ChevronLeft size={16} /></Button>
      </Panel>
      <Panel><div className="section-heading"><div><span className="eyebrow">برای کتاب‌خانه‌ی بعدی</span><h2>تازه در بازار</h2></div><Store size={19} /></div>
        <div className="mini-book-list">{books.slice(0, 3).map((book) => <div className="mini-book" key={book.id}><BookOpen size={17} /><span><b>{book.title}</b><small>{book.author}</small></span><b className="mini-price">{book.price}</b></div>)}</div>
        <Button kind="quiet" className="full-width" onClick={() => go("store")}>رفتن به بازار <ChevronLeft size={16} /></Button>
      </Panel>
      <div className="quote-note"><Sparkles size={18} /><span>جمله‌های خوب وقتی خوانده می‌شوند که با دیگران به اشتراک گذاشته شوند.</span></div>
    </aside>
  </div>;
}

function CommunitiesPage({ communities, user, onChanged, onOpen, onCreate, onError }) {
  return <div className="content-layout">
    <div className="section-heading"><div><span className="eyebrow">پیدا کردن همراه‌های کتاب‌خوان</span><h2>جامعه‌ها</h2></div><div className="community-heading-actions"><span className="count-pill">{communities.length} جامعه</span>{user && <Button kind="quiet" className="subtle-create" onClick={onCreate}><Plus size={16} /> ایجاد جامعه</Button>}</div></div>
    <div className="community-grid">{communities.map((community) => <CommunityCard key={community.id} community={community} user={user} onChanged={onChanged} onOpen={onOpen} onError={onError} />)}</div>
    {!communities.length && <Empty>هنوز جامعه‌ای پیدا نشده است. می‌توانید اولین جمع کتاب‌خوانی را شکل دهید.<div className="empty-action"><Button kind="soft" onClick={onCreate}><Plus size={16} /> ساخت جامعه</Button></div></Empty>}
  </div>;
}

function CommunityCreatePage({ onBack, onCreated, onError }) {
  const [answers, setAnswers] = useState({ name: "", topic: "", purpose: "", is_private: false });
  const [saving, setSaving] = useState(false);
  const update = (key) => (event) => setAnswers((current) => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  async function create(event) {
    event.preventDefault();
    setSaving(true);
    const description = `موضوع: ${answers.topic.trim()}\n\nدرباره‌ی این جامعه: ${answers.purpose.trim()}`;
    try {
      await api.post("/communities", { name: answers.name.trim(), description, is_private: answers.is_private });
      await onCreated();
    } catch (error) { onError(error.message); } finally { setSaving(false); }
  }

  return <div className="content-layout community-create-page">
    <button className="back-link" onClick={onBack}><ChevronLeft size={18} /> بازگشت به جامعه‌ها</button>
    <Panel className="community-create-intro">
      <span className="community-create-icon"><BookOpen size={22} /></span>
      <span className="eyebrow">یک جمع تازه برای جمله‌های ماندنی</span>
      <h2>جامعه‌ات را بساز</h2>
      <p>با چند پاسخ کوتاه، جای گفت‌وگوی کتاب‌خوان‌ها را شکل بده.</p>
    </Panel>
    <form className="community-create-form" onSubmit={create}>
      <Panel className="community-question">
        <span className="question-number">۱</span>
        <div><h3>نام این جمع چیست؟</h3><p>نامی انتخاب کن که موضوع جامعه را به یاد بیاورد.</p><input aria-label="نام جامعه" required maxLength="120" value={answers.name} onChange={update("name")} placeholder="مثلاً دوستداران رمان‌های معمایی" /></div>
      </Panel>
      <Panel className="community-question">
        <span className="question-number question-number-blue">۲</span>
        <div><h3>درباره‌ی چه چیزی گفت‌وگو می‌کنید؟</h3><p>کتاب، نویسنده یا موضوعی را که دورش جمع می‌شوید بنویس.</p><input aria-label="موضوع جامعه" required maxLength="80" value={answers.topic} onChange={update("topic")} placeholder="مثلاً داستان‌های علمی‌تخیلی فارسی" /></div>
      </Panel>
      <Panel className="community-question">
        <span className="question-number question-number-orange">۳</span>
        <div><h3>اعضا اینجا چه چیزی را به اشتراک می‌گذارند؟</h3><p>کمی درباره‌ی حال‌وهوای جمع و گفت‌وگوهایی که دوست داری شکل بگیرند توضیح بده.</p><textarea aria-label="درباره‌ی جامعه" required maxLength="480" value={answers.purpose} onChange={update("purpose")} placeholder="نقل‌قول‌ها، برداشت‌ها و پیشنهادهای خواندنی…" /></div>
      </Panel>
      <Panel className="community-question privacy-question">
        <span className="question-number">۴</span>
        <div><h3>چه کسانی می‌توانند به جمع بپیوندند؟</h3><p>بعداً هم می‌توانی این انتخاب را تغییر بدهی.</p><label className="check-label"><input type="checkbox" checked={answers.is_private} onChange={update("is_private")} /> فقط با دعوت عضو شوند</label></div>
      </Panel>
      <div className="community-create-actions"><Button kind="quiet" type="button" onClick={onBack}>انصراف</Button><Button type="submit" disabled={saving}><Plus size={17} /> {saving ? "در حال ساخت…" : "ساخت جامعه"}</Button></div>
    </form>
  </div>;
}

function CommunityDetail({ community, user, quotes, onBack, onChanged, onError, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(community.description);
  const [isPrivate, setIsPrivate] = useState(community.is_private);
  const isOwner = user?.username === community.owner?.username || user?.is_admin;
  useEffect(() => { api.get("/communities/" + community.slug + "/categories").then(setCategories).catch(() => setCategories([])); }, [community.slug]);
  async function addCategory(event) {
    event.preventDefault();
    try { await api.post("/communities/" + community.slug + "/categories", { name: categoryName }); setCategoryName(""); setCategories(await api.get("/communities/" + community.slug + "/categories")); }
    catch (error) { onError(error.message); }
  }
  async function invite(event) {
    event.preventDefault();
    try { await api.post("/communities/" + community.slug + "/members", { username: inviteName }); setInviteName(""); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  async function save() {
    try { await api.patch("/communities/" + community.slug, { description, is_private: isPrivate }); setEditing(false); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  return <div className="content-layout">
    <button className="back-link" onClick={onBack}><ChevronLeft size={18} /> بازگشت به جامعه‌ها</button>
    <Panel className="community-hero">
      <span className="community-monogram hero-monogram">{community.name?.[0]}</span>
      <div className="community-hero-copy"><span className="eyebrow">{community.is_private ? "جامعه‌ی خصوصی" : "جامعه‌ی کتاب‌خوانی"}</span><h2>{community.name}</h2>{editing ? <><textarea value={description} onChange={(e) => setDescription(e.target.value)} /><label className="check-label"><input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} /> خصوصی</label><Button kind="small" onClick={save}>ذخیره</Button></> : <p>{community.description}</p>}<div className="tag-row"><span className="tag">{community.member_count} عضو</span><span className="tag">ساخته‌شده در {formatDate(community.created_at)}</span></div></div>
      {isOwner && !editing && <Button kind="quiet" onClick={() => setEditing(true)}>ویرایش</Button>}
      {community.is_member && <Button kind="soft" onClick={async () => { try { await api.patch("/communities/" + community.slug + "/members/me", { subscribed: true }); } catch (e) { onError(e.message); } }}>اعلان‌های جامعه روشن</Button>}
    </Panel>
    <div className="two-column-panels">
      <Panel><div className="section-heading"><div><span className="eyebrow">موضوع‌های این جمع</span><h3>دسته‌بندی‌ها</h3></div><Bookmark size={18} /></div>
        <div className="tag-row">{categories.map((item) => <span className="tag" key={item.id}>{item.name}</span>)}{!categories.length && <span className="muted small-copy">هنوز دسته‌بندی ثبت نشده.</span>}</div>
        {isOwner && <form className="inline-form" onSubmit={addCategory}><input aria-label="نام دسته‌بندی" placeholder="دسته‌بندی تازه" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} /><Button kind="small" type="submit" disabled={!categoryName.trim()}><Plus size={15} /> افزودن</Button></form>}
      </Panel>
      {isOwner && <Panel><div className="section-heading"><div><span className="eyebrow">دعوت از خواننده‌ها</span><h3>افزودن عضو</h3></div><Users size={18} /></div><form className="inline-form" onSubmit={invite}><input aria-label="نام کاربری عضو" placeholder="نام کاربری" value={inviteName} onChange={(e) => setInviteName(e.target.value)} /><Button kind="small" type="submit" disabled={!inviteName.trim()}>دعوت</Button></form></Panel>}
    </div>
    <div className="section-heading section-heading-inline"><div><span className="eyebrow">جمله‌های ثبت‌شده</span><h3>نقل‌قول‌های جامعه</h3></div><Button kind="small" onClick={() => onSelect(community.slug)}><Plus size={16} /> نقل‌قول تازه</Button></div>
    <div className="stack-list">{quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} user={user} onChanged={onChanged} onError={onError} />)}</div>
    {!quotes.length && <Empty>هنوز نقل‌قولی در این جامعه ثبت نشده است.</Empty>}
  </div>;
}

function QuotesPage({ quotes, communities, user, onChanged, onError, selectedCommunity, setSelectedCommunity }) {
  const [form, setForm] = useState({ text: "", reference: "", character: "", tags: "" });
  const [posting, setPosting] = useState(false);
  async function create(event) {
    event.preventDefault();
    if (!selectedCommunity) return onError("برای ثبت نقل‌قول ابتدا یک جامعه انتخاب کنید.");
    setPosting(true);
    try {
      await api.post("/communities/" + selectedCommunity + "/quotes", { ...form, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
      setForm({ text: "", reference: "", character: "", tags: "" });
      await onChanged();
    } catch (error) { onError(error.message); } finally { setPosting(false); }
  }
  return <div className="content-layout">
    <div className="section-heading"><div><span className="eyebrow">جمله‌هایی که می‌مانند</span><h2>نقل‌قول‌ها</h2></div><span className="count-pill">{quotes.length} نقل‌قول</span></div>
    {user && <Panel><h3>نقل‌قولی به یاد داری؟</h3><form className="quote-form" onSubmit={create}>
      <label>جامعه<select required value={selectedCommunity} onChange={(e) => setSelectedCommunity(e.target.value)}><option value="">انتخاب جامعه</option>{communities.map((item) => <option value={item.slug} key={item.id}>{item.name}{item.is_member ? " · عضو" : ""}</option>)}</select></label>
      <label>متن نقل‌قول<textarea required maxLength="2000" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="جمله‌ای که دوست داری با بقیه به اشتراک بگذاری…" /></label>
      <div className="form-row"><label>کتاب یا منبع<input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="نام کتاب" /></label><label>شخصیت<input value={form.character} onChange={(e) => setForm({ ...form, character: e.target.value })} placeholder="نام شخصیت" /></label></div>
      <label>برچسب‌ها<input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="امید، دوستی، سفر" /></label>
      <Button type="submit" disabled={posting}><Plus size={17} /> ثبت نقل‌قول</Button>
    </form></Panel>}
    <div className="stack-list">{quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} user={user} onChanged={onChanged} onError={onError} />)}</div>
    {!quotes.length && <Empty>برای دیدن نقل‌قول‌ها عضو یک جامعه شوید یا اولین نقل‌قول را ثبت کنید.</Empty>}
  </div>;
}

function StorePage({ books, communities, user, onChanged, onError }) {
  const [form, setForm] = useState({ title: "", author: "", genre: "", price: 50, description: "", community_slug: "" });
  const [busy, setBusy] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(100);
  async function listBook(event) {
    event.preventDefault();
    setBusy(true);
    try { await api.post("/books", { ...form, price: Number(form.price) }); setForm({ title: "", author: "", genre: "", price: 50, description: "", community_slug: "" }); await onChanged(); }
    catch (error) { onError(error.message); } finally { setBusy(false); }
  }
  async function addCredit() {
    try { await api.post("/credits/demo", { amount: Number(balanceAmount) }); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  return <div className="content-layout">
    <div className="section-heading"><div><span className="eyebrow">کتاب دست‌دوم، قصه‌ی تازه</span><h2>بازار کتاب</h2></div>{user && <span className="credit-pill"><CreditCard size={17} /> {user.credit_balance} سکه</span>}</div>
    {user && <div className="two-column-panels">
      <Panel><h3>یک کتاب برای فروش بگذار</h3><form className="stack-form compact-form" onSubmit={listBook}>
        <label>جامعه<select required value={form.community_slug} onChange={(e) => setForm({ ...form, community_slug: e.target.value })}><option value="">انتخاب جامعه</option>{communities.filter((item) => item.is_member).map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
        <div className="form-row"><label>نام کتاب<input required maxLength="180" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label>نویسنده<input required maxLength="160" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></label></div>
        <div className="form-row"><label>ژانر<input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} /></label><label>قیمت به سکه<input type="number" min="0" max="100000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label></div>
        <label>توضیح<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <Button type="submit" disabled={busy}>ثبت آگهی</Button>
      </form></Panel>
      <Panel><span className="eyebrow">برای کتاب‌خانه‌ی بعدی</span><h3>سکه‌های کتاب‌خوانی</h3><p className="muted">با سکه‌های کتاب‌خوانی، خرید کتاب‌ها را در بازار ثبت کن.</p><div className="inline-form"><input aria-label="تعداد سکه" type="number" min="1" max="500" value={balanceAmount} onChange={(e) => setBalanceAmount(e.target.value)} /><Button kind="soft" onClick={addCredit}>افزودن سکه</Button></div></Panel>
    </div>}
    <div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} user={user} onChanged={onChanged} onError={onError} />)}</div>
    {!books.length && <Empty>در حال حاضر کتابی برای نمایش نیست.</Empty>}
  </div>;
}

function GroupsPage({ groups, user, onChanged, onError, onChoose }) {
  const [name, setName] = useState("");
  const [community, setCommunity] = useState("");
  const [communities, setCommunities] = useState([]);
  useEffect(() => { api.get("/communities").then((data) => setCommunities(data.items || [])).catch(() => {}); }, []);
  async function create(event) {
    event.preventDefault();
    try { await api.post("/groups", { name, community_slug: community }); setName(""); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  async function join(group) {
    try { await api.post("/groups/" + group.id + "/join"); await onChanged(); onChoose(group); }
    catch (error) { onError(error.message); }
  }
  return <div className="content-layout">
    <div className="section-heading"><div><span className="eyebrow">گفت‌وگوی کوچک‌تر</span><h2>گروه‌های کتاب‌خوانی</h2></div></div>
    {user && <Panel><h3>گروه تازه بساز</h3><form className="inline-form" onSubmit={create}><input aria-label="نام گروه" required placeholder="نام گروه" value={name} onChange={(e) => setName(e.target.value)} /><select aria-label="جامعه‌ی گروه" value={community} onChange={(e) => setCommunity(e.target.value)}><option value="">گروه آزاد</option>{communities.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select><Button type="submit" disabled={!name.trim()}><Plus size={16} /> ساخت</Button></form></Panel>}
    <div className="community-grid">{groups.map((group) => <article className="community-card group-card" key={group.id}><span className="community-monogram"><MessageCircle size={20} /></span><h3>{group.name}</h3><p>{group.community || "گفت‌وگوی آزاد"} · {group.member_count} عضو</p><div className="card-actions"><Button kind="soft" onClick={() => join(group)}>پیوستن و دیدن پیام‌ها</Button><Button kind="small" onClick={() => onChoose(group)}>گفت‌وگو</Button></div></article>)}</div>
    {!groups.length && <Empty>هنوز گروهی ساخته نشده است.</Empty>}
  </div>;
}

function GroupChat({ group, onBack, onError }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const reload = useCallback(() => api.get("/groups/" + group.id + "/messages").then(setMessages).catch((error) => onError(error.message)), [group.id, onError]);
  useEffect(() => { reload(); }, [reload]);
  async function send(event) {
    event.preventDefault();
    if (!text.trim()) return;
    try { await api.post("/groups/" + group.id + "/messages", { body: text }); setText(""); await reload(); }
    catch (error) { onError(error.message); }
  }
  return <div className="content-layout"><button className="back-link" onClick={onBack}><ChevronLeft size={18} /> بازگشت به گروه‌ها</button><Panel className="chat-panel"><div className="section-heading"><div><span className="eyebrow">گفت‌وگوی گروهی</span><h2>{group.name}</h2></div><MessageCircle size={20} /></div><div className="message-list">{messages.map((message) => <div className="message-row" key={message.id}><b>{message.sender}</b><p>{message.body}</p><time>{formatDate(message.created_at)}</time></div>)}</div><form className="reply-form" onSubmit={send}><input aria-label="پیام گروه" placeholder="پیامی برای گروه بنویس…" value={text} onChange={(e) => setText(e.target.value)} /><Button type="submit" kind="small" disabled={!text.trim()} aria-label="ارسال پیام"><Send size={16} /></Button></form></Panel></div>;
}

function ChatPage({ user, onError }) {
  const [recipient, setRecipient] = useState("sara_books");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const reload = useCallback(() => api.get("/chat/messages?with=" + encodeURIComponent(recipient)).then(setMessages).catch((error) => setMessages(error.status === 404 ? [] : [])), [recipient]);
  useEffect(() => { if (recipient) reload(); }, [recipient, reload]);
  async function send(event) {
    event.preventDefault();
    if (!text.trim()) return;
    try { await api.post("/chat/messages", { to: recipient, body: text }); setText(""); await reload(); }
    catch (error) { onError(error.message); }
  }
  return <div className="content-layout"><Panel className="chat-panel"><div className="section-heading"><div><span className="eyebrow">پیام مستقیم</span><h2>گفت‌وگو با خواننده‌ها</h2></div><Mail size={20} /></div><label className="recipient-field">نام کاربری خواننده<input aria-label="نام کاربری گیرنده" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="مثلاً sara_books" /></label><div className="message-list">{messages.map((message) => <div className={message.sender === user?.username ? "message-row message-own" : "message-row"} key={message.id}><b>{message.sender}</b><p>{message.body}</p><time>{formatDate(message.created_at)}</time></div>)}</div><form className="reply-form" onSubmit={send}><input aria-label="پیام خصوصی" placeholder="پیام تازه…" value={text} onChange={(e) => setText(e.target.value)} /><Button type="submit" kind="small" disabled={!text.trim()} aria-label="ارسال پیام"><Send size={16} /></Button></form></Panel></div>;
}

function NotificationsPage({ notifications, onChanged, onError }) {
  async function markRead(item) {
    try { await api.put("/notifications/" + item.id + "/read"); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  async function clear() {
    try { await api.delete("/notifications"); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  return <div className="content-layout"><div className="section-heading"><div><span className="eyebrow">خبرهای جامعه‌ها</span><h2>اعلان‌ها</h2></div><Button kind="quiet" onClick={clear}><Trash2 size={16} /> پاک‌کردن خوانده‌شده‌ها</Button></div><div className="notification-list">{notifications.map((item) => <article className={item.read ? "notification read" : "notification"} key={item.id}><span className="notification-icon"><Bell size={18} /></span><div><b>{item.title}</b><p>{item.body}</p><time>{formatDate(item.created_at)}</time></div>{!item.read && <button className="icon-button" aria-label="خوانده شد" onClick={() => markRead(item)}><Check size={18} /></button>}</article>)}</div>{!notifications.length && <Empty>اعلان تازه‌ای ندارید.</Empty>}</div>;
}

function SearchPage({ onError, onOpenCommunity }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ communities: [], quotes: [], books: [] });
  const [suggestions, setSuggestions] = useState([]);
  async function search(event) {
    event?.preventDefault();
    if (query.trim().length < 2) return;
    try {
      const [result, hints] = await Promise.all([api.get("/search?q=" + encodeURIComponent(query)), api.get("/search/suggestions?q=" + encodeURIComponent(query))]);
      setResults(result);
      setSuggestions(hints);
    } catch (error) { onError(error.message); }
  }
  return <div className="content-layout"><div className="section-heading"><div><span className="eyebrow">یک جمله یا کتاب یادت مانده؟</span><h2>جست‌وجو</h2></div><Search size={20} /></div><Panel><form className="search-form" onSubmit={search}><input autoFocus aria-label="جست‌وجوی کتاب و نقل‌قول" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="نام کتاب، شخصیت یا بخشی از جمله…" /><Button type="submit"><Search size={17} /> جست‌وجو</Button></form><div className="suggestions">{suggestions.map((item, index) => <button key={index} className="tag" onClick={() => { setQuery(item.text); }}>{item.text}</button>)}</div></Panel>
    {results.communities?.length > 0 && <><h3>جامعه‌ها</h3><div className="community-grid">{results.communities.map((item) => <button className="search-result-card" key={item.id} onClick={() => onOpenCommunity(item)}><b>{item.name}</b><small>{item.description}</small></button>)}</div></>}
    {results.quotes?.length > 0 && <><h3>نقل‌قول‌ها</h3><div className="stack-list">{results.quotes.map((item) => <article className="quote-card search-quote" key={item.id}><p className="quote-text">{item.text}</p><small>{item.reference} · {item.community?.name}</small></article>)}</div></>}
    {results.books?.length > 0 && <><h3>کتاب‌ها</h3><div className="book-grid">{results.books.map((item) => <article className="search-result-card" key={item.id}><b>{item.title}</b><small>{item.author} · {item.price} اعتبار</small></article>)}</div></>}
  </div>;
}

function ProfilePage({ user, onUser, onChanged, onError }) {
  const [form, setForm] = useState({ display_name: user.display_name, bio: user.bio || "", date_of_birth: user.date_of_birth || "" });
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "" });
  const [discount, setDiscount] = useState({ code: "", percent: 10 });
  const [announceCode, setAnnounceCode] = useState("KETAB10");
  async function saveProfile(event) {
    event.preventDefault();
    try { const updated = await api.patch("/me", form); onUser(updated); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  async function changePassword(event) {
    event.preventDefault();
    try { await api.post("/me/password", passwords); setPasswords({ old_password: "", new_password: "" }); onError("گذرواژه تغییر کرد."); }
    catch (error) { onError(error.message); }
  }
  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try { await api.upload("/me/avatar", file); await onChanged(); }
    catch (error) { onError(error.message); }
  }
  async function createDiscount(event) {
    event.preventDefault();
    try { await api.post("/discounts", { code: discount.code, percent: Number(discount.percent) }); setDiscount({ code: "", percent: 10 }); onError("کد تخفیف ساخته شد."); }
    catch (error) { onError(error.message); }
  }
  async function announce(event) {
    event.preventDefault();
    try { const data = await api.post("/discounts/email-top-users", { code: announceCode }); onError(data.queued + " اعلان برای خواننده‌ها در صف قرار گرفت."); }
    catch (error) { onError(error.message); }
  }
  return <div className="content-layout">
    <div className="section-heading"><div><span className="eyebrow">اطلاعات خواننده</span><h2>حساب من</h2></div><span className="credit-pill"><CreditCard size={16} /> {user.credit_balance} سکه</span></div>
    <div className="profile-banner"><Avatar user={user} size="large" /><div><h3>{user.display_name}</h3><p>@{user.username}</p><label className="upload-button">تغییر تصویر<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadAvatar} /></label></div></div>
    <div className="two-column-panels">
      <Panel><h3>اطلاعات پروفایل</h3><form className="stack-form compact-form" onSubmit={saveProfile}><label>نام نمایشی<input required value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></label><label>درباره‌ی من<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></label><label>تاریخ تولد<input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></label><Button type="submit">ذخیره‌ی پروفایل</Button></form></Panel>
      <Panel><h3>تغییر گذرواژه</h3><form className="stack-form compact-form" onSubmit={changePassword}><label>گذرواژه‌ی فعلی<input required type="password" value={passwords.old_password} onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })} /></label><label>گذرواژه‌ی تازه<input required minLength="10" type="password" value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} /></label><Button type="submit">تغییر گذرواژه</Button></form></Panel>
    </div>
    {user.is_admin && <div className="two-column-panels"><Panel><div className="section-heading"><div><span className="eyebrow">مدیریت تخفیف</span><h3>ساخت کد</h3></div><ShieldCheck size={18} /></div><form className="inline-form" onSubmit={createDiscount}><input aria-label="کد تخفیف" required value={discount.code} onChange={(e) => setDiscount({ ...discount, code: e.target.value.toUpperCase() })} placeholder="مثلاً KETAB15" /><input aria-label="درصد تخفیف" type="number" min="1" max="90" value={discount.percent} onChange={(e) => setDiscount({ ...discount, percent: e.target.value })} /><Button type="submit">ساخت</Button></form></Panel><Panel><h3>ارسال خبرنامه‌ی تخفیف</h3><form className="inline-form" onSubmit={announce}><input aria-label="کد برای اعلام" value={announceCode} onChange={(e) => setAnnounceCode(e.target.value.toUpperCase())} /><Button type="submit"><Mail size={15} /> اعلام به خواننده‌ها</Button></form><small className="muted">حالت محلی، ایمیل‌ها را در صف خروجی ذخیره می‌کند و ایمیل واقعی نمی‌فرستد.</small></Panel></div>}
  </div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [ready, setReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const [daily, setDaily] = useState(null);
  const [popular, setPopular] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [topCommunities, setTopCommunities] = useState([]);
  const [books, setBooks] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [openedCommunity, setOpenedCommunity] = useState(null);
  const [openedGroup, setOpenedGroup] = useState(null);

  const announce = useCallback((message) => {
    setNotice(message);
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => setNotice(""), 3800);
  }, []);

  const refresh = useCallback(async () => {
    const safe = (promise, fallback) => promise.catch(() => fallback);
    const [dailyData, popularData, communityData, topCommunityData, bookData, quoteData, groupData, notificationData] = await Promise.all([
      safe(api.get("/quotes/daily"), { quote: null }),
      safe(api.get("/quotes/popular?per_page=8"), { items: [] }),
      safe(api.get("/communities?per_page=50"), { items: [] }),
      safe(api.get("/communities/top"), []),
      safe(api.get("/books?per_page=50"), { items: [] }),
      safe(api.get("/quotes?per_page=30" + (selectedCommunity ? "&community=" + encodeURIComponent(selectedCommunity) : "")), { items: [] }),
      safe(api.get("/groups"), []),
      safe(api.get("/notifications"), []),
    ]);
    setDaily(dailyData);
    setPopular(popularData.items || []);
    setCommunities(communityData.items || []);
    setTopCommunities(topCommunityData || []);
    setBooks(bookData.items || []);
    setQuotes(quoteData.items || []);
    setGroups(groupData || []);
    setNotifications(notificationData || []);
    if (user) {
      const updated = await safe(api.get("/auth/me"), null);
      setUser(updated);
    }
  }, [selectedCommunity, user]);

  useEffect(() => {
    let active = true;
    api.session().then((current) => { if (active) setUser(current); }).catch(() => {}).finally(async () => {
      if (!active) return;
      setReady(true);
      await refresh();
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onOpen = (event) => {
      const found = communities.find((item) => item.slug === event.detail);
      if (found) openCommunity(found);
    };
    window.addEventListener("paragrapher-community", onOpen);
    return () => window.removeEventListener("paragrapher-community", onOpen);
  }, [communities]);

  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  async function signIn(form, registering) {
    setAuthBusy(true);
    setAuthError("");
    try {
      const nextUser = registering ? await api.register(form) : await api.login(form);
      setUser(nextUser);
      setPage("home");
      await refresh();
    } catch (error) { setAuthError(error.message); } finally { setAuthBusy(false); }
  }

  async function signOut() {
    try { await api.logout(); } catch (error) { announce(error.message); }
    setUser(null);
    setPage("home");
    await api.session().catch(() => {});
    await refresh();
  }

  function openCommunity(community) {
    setOpenedCommunity(community);
    setSelectedCommunity(community.slug);
    setPage("communities");
  }

  function chooseQuoteCommunity(slug) {
    if (slug) setSelectedCommunity(slug);
    setOpenedCommunity(null);
    setPage("quotes");
  }

  function changePage(next) {
    setOpenedCommunity(null);
    setOpenedGroup(null);
    setPage(next);
  }

  async function communityCreated() {
    await refresh();
    changePage("communities");
    announce("جامعه‌ی تازه ساخته شد.");
  }

  if (!ready) return <main className="loading-screen"><BrandMark /><p>پاراگراف در حال آماده‌شدن است…</p></main>;
  if (!user) return <AuthScreen onSignIn={signIn} busy={authBusy} error={authError} />;

  let content;
  if (openedCommunity && page === "communities") {
    const communityQuotes = quotes.filter((item) => item.community?.slug === openedCommunity.slug);
    content = <CommunityDetail community={openedCommunity} user={user} quotes={communityQuotes} onBack={() => setOpenedCommunity(null)} onChanged={refresh} onError={announce} onSelect={chooseQuoteCommunity} />;
  } else if (openedGroup && page === "groups") {
    content = <GroupChat group={openedGroup} onBack={() => setOpenedGroup(null)} onError={announce} />;
  } else {
    switch (page) {
      case "communities": content = <CommunitiesPage communities={communities} user={user} onChanged={refresh} onOpen={openCommunity} onCreate={() => changePage("communityCreate")} onError={announce} />; break;
      case "communityCreate": content = <CommunityCreatePage onBack={() => changePage("communities")} onCreated={communityCreated} onError={announce} />; break;
      case "quotes": content = <QuotesPage quotes={quotes} communities={communities} user={user} onChanged={refresh} onError={announce} selectedCommunity={selectedCommunity} setSelectedCommunity={setSelectedCommunity} />; break;
      case "store": content = <StorePage books={books} communities={communities} user={user} onChanged={refresh} onError={announce} />; break;
      case "groups": content = <GroupsPage groups={groups} user={user} onChanged={refresh} onError={announce} onChoose={setOpenedGroup} />; break;
      case "chat": content = <ChatPage user={user} onError={announce} />; break;
      case "notifications": content = <NotificationsPage notifications={notifications} onChanged={refresh} onError={announce} />; break;
      case "search": content = <SearchPage onError={announce} onOpenCommunity={openCommunity} />; break;
      case "profile": content = <ProfilePage user={user} onUser={setUser} onChanged={refresh} onError={announce} />; break;
      default: content = <HomePage daily={daily} popular={popular} communities={communities} topCommunities={topCommunities} books={books} user={user} onChanged={refresh} onError={announce} go={changePage} />;
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => changePage("home")}><BrandMark /><span><b>پاراگراف</b><small>جامعه‌ی دوستداران کتاب</small></span></button>
      <div className="sidebar-caption">کتاب‌خانه‌ی تو</div>
      <nav className="side-nav">{navItems.map((item) => {
        const Icon = item.icon;
        return <button key={item.id} className={page === item.id ? "nav-item active" : "nav-item"} onClick={() => changePage(item.id)}><Icon size={18} /><span>{item.label}</span>{item.id === "notifications" && unread > 0 && <i>{unread}</i>}</button>;
      })}</nav>
      <div className="sidebar-bottom"><button className="sidebar-user" onClick={() => changePage("profile")} aria-label="رفتن به پروفایل"><Avatar user={user} /><span><b>{user.display_name}</b><small>@{user.username}</small></span></button><button className="signout-button" onClick={signOut} aria-label="خروج"><LogOut size={18} /></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div><span className="breadcrumb">پاراگراف</span><ChevronLeft size={14} /><b>{pageTitles[page] || "خانه"}</b></div><div className="topbar-actions"><button className="top-search" aria-label="جست‌وجو" onClick={() => changePage("search")}><Search size={17} /><span>جست‌وجوی کتاب یا جمله</span><kbd>⌘ K</kbd></button><button className="top-icon-button" aria-label="اعلان‌ها" onClick={() => changePage("notifications")}><Bell size={19} />{unread > 0 && <i>{unread}</i>}</button><button className="profile-shortcut" onClick={() => changePage("profile")} aria-label="رفتن به پروفایل"><Avatar user={user} size="small" /><span>پروفایل</span></button></div></header>
      <div className="page-content">{content}</div>
      <footer className="app-footer"><span>پاراگراف</span><span>برای جمله‌هایی که ارزش نگه‌داشتن دارند</span><button onClick={() => changePage("profile")}>پروفایل</button></footer>
    </main>
    <nav className="mobile-nav">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => changePage(item.id)}><Icon size={18} /><span>{item.label}</span></button>; })}</nav>
    {notice && <div className="toast" role="status"><Check size={17} />{notice}<button aria-label="بستن پیام" onClick={() => setNotice("")}><X size={15} /></button></div>}
  </div>;
}

export default App;
