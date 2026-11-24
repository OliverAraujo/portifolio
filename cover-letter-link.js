// Compatibility entry point for the currently deployed build.
// Future Vite builds render this link directly from src/app.jsx.
const labels={'pt-BR':'Carta de apresentação',en:'Cover letter',es:'Carta de presentación'};
function updateLetterLink(){
 const actions=document.querySelector('.hero .actions');if(!actions)return false;
 let link=actions.querySelector('[data-cover-letter]');
 if(!link){link=document.createElement('a');link.className='button';link.dataset.coverLetter='';actions.append(link);}
 const lang=Object.hasOwn(labels,document.documentElement.lang)?document.documentElement.lang:'pt-BR';
 link.textContent=labels[lang];link.href='./cover-letter.html?lang='+encodeURIComponent(lang);return true;
}
const ready=new MutationObserver(()=>{if(updateLetterLink())ready.disconnect();});
if(!updateLetterLink())ready.observe(document.getElementById('root'),{childList:true,subtree:true});
new MutationObserver(updateLetterLink).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
