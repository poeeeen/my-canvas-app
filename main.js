function getCanvasID() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('canvas') || 'default';
}

function loadCanvas(id) {
  const saved = localStorage.getItem('canvas_' + id);
  if (saved) {
    document.getElementById('canvas-editor').value = saved;
  }
  document.getElementById('canvas-title').innerText = `🗂 Canvas ID: ${id}`;
}

function save() {
  const id = getCanvasID();
  const value = document.getElementById('canvas-editor').value;
  localStorage.setItem('canvas_' + id, value);
  alert('Saved!');
}

function copyURL() {
  const id = getCanvasID();
  const url = `${window.location.origin}${window.location.pathname}?canvas=${id}`;
  navigator.clipboard.writeText(url);
  alert("URL copied to clipboard: " + url);
}

function exportToTxt() {
  const id = getCanvasID();
  const content = document.getElementById("canvas-editor").value;
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = id + ".txt";
  a.click();
}

function importFromTxt() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById("canvas-editor").value = e.target.result;
    save(); // 自動保存
  };
  reader.readAsText(file);
}

window.onload = () => {
  const id = getCanvasID();
  loadCanvas(id);
};
