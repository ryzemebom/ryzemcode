// Seleção dos elementos
const fileList = document.getElementById('file-list');
const fileItems = fileList.querySelectorAll('li');
const editors = document.querySelectorAll('.editor');
const htmlEditor = document.getElementById('html');
const cssEditor = document.getElementById('css');
const jsEditor = document.getElementById('js');
const htmlLines = document.getElementById('html-lines');
const cssLines = document.getElementById('css-lines');
const jsLines = document.getElementById('js-lines');
const preview = document.getElementById('preview');

const runBtn = document.getElementById('run');
const saveBtn = document.getElementById('save');
const clearBtn = document.getElementById('clear');
const exportBtn = document.getElementById('export');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.container'); // container principal

// Função para alternar editores
function selectFile(type) {
  editors.forEach(ed => ed.classList.remove('active'));
  fileItems.forEach(item => item.classList.remove('active'));

  const editor = document.getElementById(type + '-editor');
  if (editor) editor.classList.add('active');

  const selectedItem = Array.from(fileItems).find(item => item.dataset.type === type);
  if (selectedItem) selectedItem.classList.add('active');
}

// Atualiza linhas numeradas para um editor
function updateLineNumbers(textarea, linesContainer) {
  const linesCount = textarea.value.split('\n').length;
  let linesHTML = '';
  for (let i = 1; i <= linesCount; i++) {
    linesHTML += i + '\n';
  }
  linesContainer.textContent = linesHTML;
}

// Inicializa linhas para todos os editores
function initLineNumbers() {
  updateLineNumbers(htmlEditor, htmlLines);
  updateLineNumbers(cssEditor, cssLines);
  updateLineNumbers(jsEditor, jsLines);
}

// Atualiza preview iframe com código completo
function updatePreview() {
  const html = htmlEditor.value;
  const css = cssEditor.value;
  const js = jsEditor.value;

  const srcDoc = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;

  preview.srcdoc = srcDoc;
}

// Função executar (atualiza preview)
function runCode() {
  updatePreview();
}

// Função salvar no localStorage
function saveCode() {
  localStorage.setItem('miniVS_html', htmlEditor.value);
  localStorage.setItem('miniVS_css', cssEditor.value);
  localStorage.setItem('miniVS_js', jsEditor.value);
  alert('Código salvo localmente!');
}

// Função limpar editores
function clearCode() {
  if (confirm('Tem certeza que deseja limpar todo o código?')) {
    htmlEditor.value = '';
    cssEditor.value = '';
    jsEditor.value = '';
    initLineNumbers();
    updatePreview();
  }
}

// Função exportar código HTML completo para download
function exportHTML() {
  const html = htmlEditor.value;
  const css = cssEditor.value;
  const js = jsEditor.value;

  const content = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Exportado pelo Mini VS Code</title>
<style>
${css}
</style>
</head>
<body>
${html}
<script>
${js}
<\/script>
</body>
</html>`.trim();

  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'meu-projeto.html';
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Toggle sidebar visibilidade
function toggleSidebar() {
  sidebar.classList.toggle('hidden');
}

// Event listeners para troca de arquivos
fileItems.forEach(item => {
  item.addEventListener('click', () => {
    selectFile(item.dataset.type);
  });
});

// Event listeners para textarea input - atualizar linhas numeradas em tempo real
htmlEditor.addEventListener('input', () => updateLineNumbers(htmlEditor, htmlLines));
cssEditor.addEventListener('input', () => updateLineNumbers(cssEditor, cssLines));
jsEditor.addEventListener('input', () => updateLineNumbers(jsEditor, jsLines));

// Botões
runBtn.addEventListener('click', runCode);
saveBtn.addEventListener('click', saveCode);
clearBtn.addEventListener('click', clearCode);
exportBtn.addEventListener('click', exportHTML);
toggleSidebarBtn.addEventListener('click', toggleSidebar);

// Ao carregar, inicia linhas numeradas e carrega código salvo se existir
window.addEventListener('load', () => {
  if(localStorage.getItem('miniVS_html')) htmlEditor.value = localStorage.getItem('miniVS_html');
  if(localStorage.getItem('miniVS_css')) cssEditor.value = localStorage.getItem('miniVS_css');
  if(localStorage.getItem('miniVS_js')) jsEditor.value = localStorage.getItem('miniVS_js');

  initLineNumbers();
  updatePreview();
  selectFile('html'); // abre HTML por padrão
});
