import './style.css';
import { initCalculators } from './js/calculators.js';

document.addEventListener('DOMContentLoaded', function () {
  initCalculators();

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  var form = document.getElementById('contactForm');
  var note = document.getElementById('contactNote');
  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.textContent = 'پیام شما ثبت شد؛ همکاران ما به‌زودی با شما تماس می‌گیرند.';
      note.classList.add('show');
      form.reset();
    });
  }
});
