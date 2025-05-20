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
  const value = document.getElementById("canvas-editor").value;
  const category = document.getElementById("canvas-category").value || 'Uncategorized';

  localStorage.setItem('canvas_' + id, value);
  localStorage.setItem('category_' + id, category); // ←カテゴリ保存

  alert('Saved!');
  listSavedCanvases();  // ← ✅ これを最後に追加！
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


function listSavedCanvases() {
  const listEl = document.getElementById('canvas-list');
  listEl.innerHTML = '';

  const filter = document.getElementById("search-canvas")?.value.toLowerCase() || '';

  const grouped = {};

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('canvas_')) {
      const id = key.replace('canvas_', '');
      const category = localStorage.getItem('category_' + id) || 'Uncategorized';

      // 🔍 完全一致 or 部分一致しない場合はスキップ
      if (!id.toLowerCase().includes(filter)) return;

      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(id);
    }
  });

  // カテゴリごとに出力（該当キャンバスだけが残っている）
  Object.keys(grouped).forEach(category => {
    const h4 = document.createElement('h4');
    h4.innerText = `📁 ${category}`;
    listEl.appendChild(h4);

    const ul = document.createElement('ul');

    grouped[category].forEach(id => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `?canvas=${id}`;
      link.innerText = id;
      li.appendChild(link);

      const del = document.createElement('button');
      del.innerText = '🗑';
      del.style.marginLeft = '10px';
      del.onclick = () => {
        if (confirm(`Delete canvas "${id}"?`)) {
          localStorage.removeItem('canvas_' + id);
          localStorage.removeItem('category_' + id);
          listSavedCanvases();
        }
      };

      li.appendChild(del);
      ul.appendChild(li);
    });

    listEl.appendChild(ul);
  });
}




// 起動時に表示
window.onload = () => {
  const id = getCanvasID();
  loadCanvas(id);
  listSavedCanvases();
};
function saveSnapshot() {
  const id = getCanvasID();
  const content = document.getElementById("canvas-editor").value;
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 16); // YYYY-MM-DDTHH-MM
  const filename = `${id}_${timestamp}.txt`;

  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
