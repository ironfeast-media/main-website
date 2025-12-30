// Minimal client JS for small interactive behaviors
document.addEventListener('DOMContentLoaded',()=>{
  // simple: highlight CTA on hover (visual polish placeholder)
  document.querySelectorAll('.cta').forEach(el=>{
    el.addEventListener('mouseenter',()=>el.style.transform='translateY(-2px)')
    el.addEventListener('mouseleave',()=>el.style.transform='translateY(0)')
  })
})
