console.log('script.js cargado');

const cont = document.getElementById('contenedor');
let malla = [];
const aprob = JSON.parse(localStorage.getItem('aprobados') || '[]');

function save() {
  localStorage.setItem('aprobados', JSON.stringify(aprob));
}

function canView(c) {
  const r = malla.flatMap(s => s.ramos).find(x => x.codigo === c);
  return r.prerrequisitos.every(p => aprob.includes(p));
}

function render() {
  cont.innerHTML = '';
  malla.forEach(({ semestre, ramos }) => {
    const sec = document.createElement('section');
    sec.className = 'semestre';
    sec.innerHTML = `<h2>Semestre ${semestre}</h2>`;
    ramos.forEach(r => {
      const div = document.createElement('div');
      const v = canView(r.codigo), a = aprob.includes(r.codigo);
      div.className = 'ramo' + (v ? '' : ' locked') + (a ? ' aprobado' : '');
      div.setAttribute('data-cat', r.categoria);
      div.innerHTML = `<label for="${r.codigo}">${r.nombre}<br>${r.creditos}cr</label>
        <input type="checkbox" id="${r.codigo}" ${a ? 'checked' : ''} ${v ? '' : 'disabled'}>`;
      div.querySelector('input').addEventListener('change', e => {
        const i = aprob.indexOf(r.codigo);
        if (e.target.checked && i === -1) aprob.push(r.codigo);
        if (!e.target.checked && i !== -1) aprob.splice(i, 1);
        save();
        render();
        if (e.target.checked) {
          div.classList.add('aprobado-anim');
          setTimeout(() => div.classList.remove('aprobado-anim'), 500);
        }
      });
      sec.appendChild(div);
    });
    cont.appendChild(sec);
  });
}

fetch('malla.json')
  .then(r => r.json()).then(d => { malla = d; render(); })
  .catch(e => { console.error(e); cont.innerHTML = '<p>Error cargando malla</p>'; });