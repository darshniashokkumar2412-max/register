(() => {
  const form = document.getElementById('regForm');
  const success = document.getElementById('success');
  const fields = [...form.querySelectorAll('[required]')];

  const rules = {
    fullName: v => v.trim().length >= 3 || 'Enter your full name (at least 3 characters).',
    dob: v => {
      if (!v) return 'Choose your date of birth.';
      const d = new Date(v), now = new Date();
      let age = now.getFullYear() - d.getFullYear();
      if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age--;
      return (age >= 15 && age <= 60) || 'Age must be between 15 and 60.';
    },
    gender: v => !!v || 'Select an option.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email, like name@example.com.',
    phone: v => /^\d{10}$/.test(v) || 'Enter a 10-digit phone number, digits only.',
    course: v => !!v || 'Select a department.',
    year: v => !!v || 'Select your year of study.',
    address: v => v.trim().length >= 10 || 'Enter your full address (at least 10 characters).',
    guardian: v => v.trim().length >= 3 || "Enter your guardian's name.",
    guardianPhone: v => /^\d{10}$/.test(v) || 'Enter a 10-digit phone number, digits only.',
    agree: (v, el) => el.checked || 'Tick the box to confirm your details.'
  };

  function check(el) {
    const wrap = el.closest('.field');
    const result = rules[el.name](el.value, el);
    const ok = result === true;
    wrap.classList.toggle('invalid', !ok);
    wrap.classList.toggle('valid', ok && el.type !== 'checkbox');
    wrap.querySelector('.err').textContent = ok ? '' : result;
    return ok;
  }

  // Live card preview + progress
  const $ = id => document.getElementById(id);
  function updatePreview() {
    const name = form.fullName.value.trim();
    $('pvName').textContent = name || 'Your name';
    $('pvAvatar').textContent = name ? name[0].toUpperCase() : '?';
    $('pvCourse').textContent = form.course.value || 'Course not selected';
    $('pvYear').textContent = form.year.value ? 'Year ' + form.year.value : 'Year –';
    $('pvEmail').textContent = form.email.value || '–';
    $('pvPhone').textContent = form.phone.value || '–';
    const done = fields.filter(el => rules[el.name](el.value, el) === true).length;
    $('barFill').style.width = (done / fields.length * 100) + '%';
    $('barText').textContent = `${done} of ${fields.length} required fields done`;
  }

  // Digits only for phone fields
  ['phone', 'guardianPhone'].forEach(n => {
    form[n].addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  });

  form.addEventListener('input', e => {
    if (e.target.closest('.field').classList.contains('invalid')) check(e.target);
    updatePreview();
  });
  form.addEventListener('change', e => { check(e.target); updatePreview(); });
  fields.forEach(el => el.addEventListener('blur', () => check(el)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const results = fields.map(check);
    const firstBad = fields[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); return; }

    const data = Object.fromEntries(new FormData(form));
    const regNo = 'NC' + new Date().getFullYear() + String(Math.floor(Math.random() * 90000) + 10000);
    data.regNo = regNo;
    console.log('Student registered:', data); // Replace with fetch() to your server.

    $('regNo').textContent = regNo;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      form.querySelectorAll('.field').forEach(f => {
        f.classList.remove('valid', 'invalid');
        f.querySelector('.err').textContent = '';
      });
      updatePreview();
    });
  });

  $('newBtn').addEventListener('click', () => {
    form.reset();
    success.hidden = true;
    form.hidden = false;
    form.fullName.focus();
  });

  updatePreview();
})();
