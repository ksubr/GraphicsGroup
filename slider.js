document.addEventListener('DOMContentLoaded', () => {
  const sliderEl = document.getElementById('slider');
  let slides = [];
  let current = 0;
  const intervalMs = 5000;
  let intervalId = null;

  fetch('slides/data.json', {cache:'no-store'})
    .then(res => res.json())
    .then(json => {
      slides = json.slides;
      if (!slides || slides.length === 0) throw new Error('No slides found');
      createSlider();
      startAuto();
    })
    .catch(err => {
      sliderEl.innerHTML = `<p style="color:red; text-align:center;">Failed to load slides: ${err.message}</p>`;
      console.error(err);
    });

  function createSlider() {
    slides.forEach((s, idx) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'slide';
      if (idx === 0) slideDiv.classList.add('active');

      const link = document.createElement('a');
      link.href = s.link || '#';
      link.target = '_blank';
      link.style.display = 'block'; link.style.width='100%'; link.style.height='100%'; link.style.textDecoration='none';

      const img = document.createElement('img');
      img.src = 'slides/' + s.image;
      img.alt = s.text || 'Slide';
      img.loading = 'lazy';
      link.appendChild(img);

      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.textContent = s.text;
      link.appendChild(caption);

      slideDiv.appendChild(link);
      sliderEl.appendChild(slideDiv);
    });

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'dots';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i===0?' active':'');
      dot.addEventListener('click', ()=>goToSlide(i));
      dotsWrap.appendChild(dot);
    });
    sliderEl.appendChild(dotsWrap);

    const left = document.createElement('div');
    left.className = 'arrow left'; left.innerHTML = '&#9664;'; left.addEventListener('click', prevSlide);
    const right = document.createElement('div');
    right.className = 'arrow right'; right.innerHTML = '&#9654;'; right.addEventListener('click', nextSlide);
    sliderEl.appendChild(left); sliderEl.appendChild(right);

    let startX=null;
    sliderEl.addEventListener('touchstart', e=>startX=e.touches[0].clientX,{passive:true});
    sliderEl.addEventListener('touchend', e=>{
      if(startX==null) return;
      const endX=e.changedTouches[0].clientX;
      if(endX-startX>50) prevSlide();
      else if(startX-endX>50) nextSlide();
      startX=null;
    },{passive:true});

    sliderEl.addEventListener('mouseenter', pauseAuto);
    sliderEl.addEventListener('mouseleave', startAuto);
  }

  function updateActive(){
    const slidesEl=sliderEl.querySelectorAll('.slide');
    const dots=sliderEl.querySelectorAll('.dot');
    slidesEl.forEach((s,i)=>s.classList.toggle('active', i===current));
    dots.forEach((d,i)=>d.classList.toggle('active', i===current));
  }

  function nextSlide(){ current=(current+1)%slides.length; updateActive(); }
  function prevSlide(){ current=(current-1+slides.length)%slides.length; updateActive(); }
  function goToSlide(i){ current=i; updateActive(); }
  function startAuto(){ intervalId=setInterval(nextSlide,intervalMs); }
  function pauseAuto(){ clearInterval(intervalId); }
});

window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('people-grid');
    const people = Array.from(grid.getElementsByClassName('person'));

    // Sort people by name
    people.sort((a, b) => {
      const nameA = a.querySelector('p').textContent.toUpperCase();
      const nameB = b.querySelector('p').textContent.toUpperCase();
      return nameA.localeCompare(nameB);
    });

    // Re-append sorted elements to the grid
    people.forEach(person => grid.appendChild(person));
  });