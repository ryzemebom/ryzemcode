const html = document.getElementById('html');
const css = document.getElementById('css');
const js = document.getElementById('js');
const preview = document.getElementById('preview');
const fileList = document.getElementById('file-list');
const createFileBtn = document.getElementById('create-file');
const toggleSidebar = document.getElementById('toggle-sidebar');
const saveBtn = document.getElementById('save');
const clearBtn = document.getElementById('clear');
const exportBtn = document.getElementById('export');
const runBtn = document.getElementById('run');

let currentFile = 'html';

window.addEventListener('DOMContentLoaded', () => {
  html.value = localStorage.getItem('html') || '';
  css.value = localStorage.getItem('css') || '';
  js.value = localStorage.getItem('js') || '';
  updateEditor();
  setupEditor('html', 'html-lines');
  setupEditor('css', 'css-lines');
  setupEditor('js', 'js-lines');
  setupAutoCloseTags(html);
  setupAutoCloseTags(css);
  setupAutoCloseTags(js);
});
saveBtn.addEventListener('click', () => {
try {
localStorage.setItem('html', html.value);
localStorage.setItem('css', css.value);
localStorage.setItem('js', js.value);
alert('✅ Código salvo com sucesso!');
} catch (e) {
console.error('Erro ao salvar:', e);
alert('❌ Erro ao salvar o código.');
}
});
clearBtn.addEventListener('click', () => {
if (confirm('Tem certeza que deseja limpar tudo?')) {
html.value = '';
css.value = '';
js.value = '';

alert('🧹 Código limpo com sucesso!');
}
});

runBtn.addEventListener('click', () => {
  const code = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>${css.value}</style>
    </head>
    <body>
      ${html.value}
      <script>${js.value}<\/script>
    </body>
    </html>
  `;
  preview.srcdoc = code;
});
downloadBtn.addEventListener('click', () => {
const htmlContent = html.value;
const cssContent = `<style>${css.value}</style>`;
const jsContent = `<script>${js.value}<\/script>`;

const fullPage = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projeto</title>
  ${cssContent}
</head>
<body>
  ${htmlContent}
  ${jsContent}
</body>
</html>
`;

const blob = new Blob([fullPage], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'pagina.html';
a.click();
URL.revokeObjectURL(url);
});

function selectFile(fileType) {
  currentFile = fileType;
  document.querySelectorAll('#file-list li').forEach(li => li.classList.remove('active'));
  document.querySelector(`li[data-type="${fileType}"]`).classList.add('active');
  updateEditor();
}

function updateEditor() {
  document.querySelectorAll('.editor').forEach(e => e.classList.remove('active'));
  if (currentFile === 'html') {
    document.getElementById('html-editor').classList.add('active');
  } else if (currentFile === 'css') {
    document.getElementById('css-editor').classList.add('active');
  } else {
    document.getElementById('js-editor').classList.add('active');
  }
}
downloadBtn.addEventListener('click', () => {
const htmlContent = html.value;
const cssContent = `<style>${css.value}</style>`;
const jsContent = `<script>${js.value}<\/script>`;

const fullPage = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projeto</title>
  ${cssContent}
</head>
<body>
  ${htmlContent}
  ${jsContent}
</body>
</html>
`;

const blob = new Blob([fullPage], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'pagina.html';
a.click();
URL.revokeObjectURL(url);
});

createFileBtn.addEventListener('click', () => {
  const fileName = prompt('Nome do novo arquivo (ex: novo.html):');
  if (fileName) {
    const fileType = fileName.split('.').pop();
    const li = document.createElement('li');
    li.textContent = fileName;
    li.dataset.type = fileType;
    li.addEventListener('click', () => selectFile(fileType));
    fileList.appendChild(li);
  }
});

toggleSidebar.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

saveBtn.addEventListener('click', () => {
  try {
    localStorage.setItem('html', html.value);
    localStorage.setItem('css', css.value);
    localStorage.setItem('js', js.value);
    alert('✅ Código salvo com sucesso!');
  } catch (e) {
    console.error('Erro ao salvar:', e);
    alert('❌ Erro ao salvar');
  }
});

clearBtn.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar tudo?')) {
    html.value = '';
    css.value = '';
    js.value = '';
  }
});

exportBtn.addEventListener('click', () => {
  const content = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Exported Page</title>
      <style>${css.value}</style>
    </head>
    <body>
      ${html.value}
      <script>${js.value}<\/script>
    </body>
    </html>
  `;
  const blob = new Blob([content], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pagina-exportada.html';
  a.click();
});

function setupAutoCloseTags(textarea) {
  textarea.addEventListener('keydown', function (e) {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const value = this.value;

    if (e.key === '>') {
      const before = value.slice(0, start);
      const match = before.match(/<(\w+)$/);
      const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];

      if (match && !selfClosing.includes(match[1].toLowerCase())) {
        e.preventDefault();
        const tag = match[1];
        const closeTag = `></${tag}>`;
        this.value = before + closeTag + value.slice(end);
        this.setSelectionRange(start + 1, start + 1);
      }
    }

    const pairs = { '"': '"', "'": "'", '(': ')', '[': ']', '{': '}' };
    if (pairs[e.key]) {
      e.preventDefault();
      const open = e.key;
      const close = pairs[e.key];
      this.value = value.slice(0, start) + open + close + value.slice(end);
      this.setSelectionRange(start + 1, start + 1);
    }
  });
}

function updateLineNumbers(textarea, lineElement) {
  const lines = textarea.value.split('\n').length;
  lineElement.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

function setupEditor(textareaId, lineId) {
  const textarea = document.getElementById(textareaId);
  const lineNumbers = document.getElementById(lineId);

  textarea.addEventListener('input', () => updateLineNumbers(textarea, lineNumbers));
  textarea.addEventListener('scroll', () => {
    lineNumbers.scrollTop = textarea.scrollTop;
  });

  updateLineNumbers(textarea, lineNumbers);
}
function runCode() {
const html = document.getElementById("html-editor").value;
const css = document.getElementById("css-editor").value;
const js = document.getElementById("js-editor").value;

const output = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>
`;

const iframe = document.getElementById("output-frame");
iframe.srcdoc = output;
}
window.addEventListener("DOMContentLoaded", function () {
document.addEventListener('keydown', function(e) {
if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
  e.preventDefault();
  runCode();
}
});
});

