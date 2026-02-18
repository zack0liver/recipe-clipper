/* ============================================================
   Recipe Clipper — app.js
   ES5 only (iPad 2 / iOS 9.3.5 compatible)
   ============================================================ */

// ---- Firebase Config (REPLACE THESE) ----
var FIREBASE_API_KEY = 'AIzaSyAURvS42JtzNHlbdK-SXgXNq-b_-3PZ8wk';
var FIREBASE_PROJECT_ID = 'recipe-clipper-app';

var AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1';
var FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/' + FIREBASE_PROJECT_ID + '/databases/(default)/documents';
var TOKEN_REFRESH_URL = 'https://securetoken.googleapis.com/v1/token?key=' + FIREBASE_API_KEY;

// ---- State ----
var currentUser = null;   // { uid, email, idToken, refreshToken, expiresAt }
var recipes = [];         // in-memory cache
var currentRecipeId = null;
var editingRecipeId = null;
var authMode = 'signin';  // 'signin' or 'signup'
var currentView = 'list';

// ---- Init ----
(function init() {
  var saved = localStorage.getItem('rc_user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
    } catch (e) {
      currentUser = null;
    }
  }

  // Restore theme preference
  if (localStorage.getItem('rc_theme') === 'light') {
    document.body.className = 'light-mode';
    document.documentElement.style.background = '#f4f4ee';
    document.getElementById('btn-theme').textContent = 'Dark';
  }

  updateAuthUI();
  showView('list');
  if (currentUser) {
    refreshTokenIfNeeded(function() {
      loadRecipes();
    });
  }
})();

// ============================================================
// VIEW MANAGEMENT
// ============================================================

function showView(name) {
  var views = ['auth', 'list', 'edit', 'detail'];
  for (var i = 0; i < views.length; i++) {
    var el = document.getElementById('view-' + views[i]);
    if (el) el.style.display = (views[i] === name) ? 'block' : 'none';
  }
  currentView = name;
  window.scrollTo(0, 0);

  if (name === 'list') {
    renderRecipeList();
    var fab = document.getElementById('btn-add');
    if (fab) fab.style.display = currentUser ? 'block' : 'none';
  }
}

// ============================================================
// AUTH
// ============================================================

function toggleAuthMode() {
  if (authMode === 'signin') {
    authMode = 'signup';
    document.getElementById('auth-heading').textContent = 'Create Account';
    document.getElementById('btn-auth-submit').textContent = 'Create Account';
    document.getElementById('auth-toggle-text').textContent = 'Already have an account?';
    document.getElementById('btn-auth-toggle').textContent = 'Sign in';
  } else {
    authMode = 'signin';
    document.getElementById('auth-heading').textContent = 'Sign In';
    document.getElementById('btn-auth-submit').textContent = 'Sign In';
    document.getElementById('auth-toggle-text').textContent = 'No account?';
    document.getElementById('btn-auth-toggle').textContent = 'Create one';
  }
  document.getElementById('auth-error').textContent = '';
}

function submitAuth() {
  var email = document.getElementById('auth-email').value.trim();
  var password = document.getElementById('auth-password').value;
  var errorEl = document.getElementById('auth-error');
  errorEl.textContent = '';

  if (!email || !password) {
    errorEl.textContent = 'Please enter email and password.';
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters.';
    return;
  }

  var url;
  if (authMode === 'signup') {
    url = AUTH_BASE + '/accounts:signUp?key=' + FIREBASE_API_KEY;
  } else {
    url = AUTH_BASE + '/accounts:signInWithPassword?key=' + FIREBASE_API_KEY;
  }

  var body = JSON.stringify({
    email: email,
    password: password,
    returnSecureToken: true
  });

  document.getElementById('btn-auth-submit').disabled = true;
  document.getElementById('btn-auth-submit').textContent = 'Please wait...';

  xhrPost(url, body, function(err, data) {
    document.getElementById('btn-auth-submit').disabled = false;
    document.getElementById('btn-auth-submit').textContent = (authMode === 'signup') ? 'Create Account' : 'Sign In';

    if (err || !data || !data.idToken) {
      var msg = 'Authentication failed.';
      if (data && data.error && data.error.message) {
        var code = data.error.message;
        if (code === 'EMAIL_EXISTS') msg = 'An account with that email already exists.';
        else if (code === 'EMAIL_NOT_FOUND') msg = 'No account found with that email.';
        else if (code === 'INVALID_PASSWORD') msg = 'Incorrect password.';
        else if (code === 'INVALID_LOGIN_CREDENTIALS') msg = 'Invalid email or password.';
        else if (code === 'WEAK_PASSWORD : Password should be at least 6 characters') msg = 'Password must be at least 6 characters.';
        else msg = code;
      }
      errorEl.textContent = msg;
      return;
    }

    currentUser = {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + (parseInt(data.expiresIn, 10) * 1000)
    };
    localStorage.setItem('rc_user', JSON.stringify(currentUser));
    updateAuthUI();
    showView('list');
    loadRecipes();
    showToast('Signed in as ' + currentUser.email);
  });
}

function signOut() {
  currentUser = null;
  recipes = [];
  localStorage.removeItem('rc_user');
  updateAuthUI();
  showView('list');
  showToast('Signed out');
}

function toggleTheme() {
  var body = document.body;
  var btn = document.getElementById('btn-theme');
  if (body.className.indexOf('light-mode') !== -1) {
    body.className = body.className.replace('light-mode', '').replace(/^\s+|\s+$/g, '');
    document.documentElement.style.background = '#0f0f13';
    localStorage.setItem('rc_theme', 'dark');
    btn.textContent = 'Light';
  } else {
    body.className = (body.className ? body.className + ' ' : '') + 'light-mode';
    document.documentElement.style.background = '#f4f4ee';
    localStorage.setItem('rc_theme', 'light');
    btn.textContent = 'Dark';
  }
}

function updateAuthUI() {
  var signInBtn = document.getElementById('btn-header-sign-in');
  var signedInArea = document.getElementById('signed-in-header');
  var emptyAuthMsg = document.getElementById('empty-auth-msg');
  var fab = document.getElementById('btn-add');

  if (currentUser) {
    signInBtn.style.display = 'none';
    signedInArea.style.display = 'inline';
    if (emptyAuthMsg) emptyAuthMsg.style.display = 'none';
    if (fab) fab.style.display = 'block';
  } else {
    signInBtn.style.display = 'inline';
    signedInArea.style.display = 'none';
    if (emptyAuthMsg) emptyAuthMsg.style.display = 'block';
    if (fab) fab.style.display = 'none';
  }
}

function refreshTokenIfNeeded(callback) {
  if (!currentUser) { callback(); return; }
  if (Date.now() < currentUser.expiresAt - 60000) {
    callback();
    return;
  }

  var body = 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(currentUser.refreshToken);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', TOKEN_REFRESH_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        currentUser.idToken = data.id_token;
        currentUser.refreshToken = data.refresh_token;
        currentUser.expiresAt = Date.now() + (parseInt(data.expires_in, 10) * 1000);
        localStorage.setItem('rc_user', JSON.stringify(currentUser));
      } catch (e) { /* ignore parse errors */ }
    }
    callback();
  };
  xhr.send(body);
}

// ============================================================
// FIRESTORE CRUD (REST API)
// ============================================================

function recipesPath() {
  return FIRESTORE_BASE + '/users/' + currentUser.uid + '/recipes';
}

function loadRecipes() {
  if (!currentUser) return;
  refreshTokenIfNeeded(function() {
    var url = recipesPath() + '?pageSize=500';
    xhrGet(url, currentUser.idToken, function(err, data) {
      recipes = [];
      if (data && data.documents) {
        for (var i = 0; i < data.documents.length; i++) {
          var doc = data.documents[i];
          var r = firestoreDocToRecipe(doc);
          if (r) recipes.push(r);
        }
      }
      recipes.sort(function(a, b) { return b.createdAt - a.createdAt; });
      renderRecipeList();
    });
  });
}

function saveRecipe() {
  if (!currentUser) {
    showToast('Please sign in first');
    showView('auth');
    return;
  }

  var title = document.getElementById('edit-title').value.trim();
  if (!title) {
    showToast('Title is required');
    return;
  }

  var ingredientsRaw = document.getElementById('edit-ingredients').value.trim();
  var instructionsRaw = document.getElementById('edit-instructions').value.trim();
  var tagsRaw = document.getElementById('edit-tags').value.trim();

  var ingredients = ingredientsRaw ? ingredientsRaw.split('\n') : [];
  var instructions = instructionsRaw ? instructionsRaw.split('\n') : [];
  var tags = [];
  if (tagsRaw) {
    var tagParts = tagsRaw.split(',');
    for (var i = 0; i < tagParts.length; i++) {
      var t = tagParts[i].replace(/^\s+|\s+$/g, '');
      if (t) tags.push(t);
    }
  }

  // Clean empty lines from ingredients/instructions
  var cleanIngredients = [];
  for (var i = 0; i < ingredients.length; i++) {
    var line = ingredients[i].replace(/^\s+|\s+$/g, '');
    if (line) cleanIngredients.push(line);
  }
  var cleanInstructions = [];
  for (var i = 0; i < instructions.length; i++) {
    var line = instructions[i].replace(/^\s+|\s+$/g, '');
    if (line) cleanInstructions.push(line);
  }

  var now = Date.now();
  var recipeData = {
    title: title,
    ingredients: cleanIngredients,
    instructions: cleanInstructions,
    servings: document.getElementById('edit-servings').value.trim(),
    prepTime: document.getElementById('edit-prep').value.trim(),
    cookTime: document.getElementById('edit-cook').value.trim(),
    sourceUrl: document.getElementById('edit-source').value.trim(),
    tags: tags,
    notes: document.getElementById('edit-notes').value.trim(),
    updatedAt: now
  };

  var firestoreDoc = recipeToFirestoreFields(recipeData);

  refreshTokenIfNeeded(function() {
    if (editingRecipeId) {
      // Update existing
      var url = recipesPath() + '/' + editingRecipeId;
      xhrPatch(url, JSON.stringify({ fields: firestoreDoc }), currentUser.idToken, function(err, data) {
        if (err) {
          showToast('Save failed — try again');
          return;
        }
        // Update local cache
        for (var i = 0; i < recipes.length; i++) {
          if (recipes[i].id === editingRecipeId) {
            recipeData.id = editingRecipeId;
            recipeData.createdAt = recipes[i].createdAt;
            recipes[i] = recipeData;
            break;
          }
        }
        editingRecipeId = null;
        showToast('Recipe updated');
        showView('list');
      });
    } else {
      // Create new
      recipeData.createdAt = now;
      var createDoc = recipeToFirestoreFields(recipeData);
      xhrPost(recipesPath(), JSON.stringify({ fields: createDoc }), function(err, data) {
        if (err || !data || !data.name) {
          showToast('Save failed — try again');
          return;
        }
        var parts = data.name.split('/');
        recipeData.id = parts[parts.length - 1];
        recipes.unshift(recipeData);
        showToast('Recipe saved!');
        showView('list');
      }, currentUser.idToken);
    }
  });
}

function deleteRecipe(recipeId) {
  if (!confirm('Delete this recipe?')) return;
  refreshTokenIfNeeded(function() {
    var url = recipesPath() + '/' + recipeId;
    xhrDelete(url, currentUser.idToken, function() {
      for (var i = 0; i < recipes.length; i++) {
        if (recipes[i].id === recipeId) {
          recipes.splice(i, 1);
          break;
        }
      }
      showToast('Recipe deleted');
      showView('list');
    });
  });
}

// ============================================================
// FIRESTORE DATA CONVERSION
// ============================================================

function recipeToFirestoreFields(r) {
  var fields = {};
  fields.title = { stringValue: r.title || '' };
  fields.servings = { stringValue: r.servings || '' };
  fields.prepTime = { stringValue: r.prepTime || '' };
  fields.cookTime = { stringValue: r.cookTime || '' };
  fields.sourceUrl = { stringValue: r.sourceUrl || '' };
  fields.notes = { stringValue: r.notes || '' };
  fields.createdAt = { integerValue: String(r.createdAt || Date.now()) };
  fields.updatedAt = { integerValue: String(r.updatedAt || Date.now()) };

  // Arrays
  var ingValues = [];
  var ingredients = r.ingredients || [];
  for (var i = 0; i < ingredients.length; i++) {
    ingValues.push({ stringValue: ingredients[i] });
  }
  fields.ingredients = { arrayValue: { values: ingValues.length ? ingValues : [] } };

  var instValues = [];
  var instructions = r.instructions || [];
  for (var i = 0; i < instructions.length; i++) {
    instValues.push({ stringValue: instructions[i] });
  }
  fields.instructions = { arrayValue: { values: instValues.length ? instValues : [] } };

  var tagValues = [];
  var tags = r.tags || [];
  for (var i = 0; i < tags.length; i++) {
    tagValues.push({ stringValue: tags[i] });
  }
  fields.tags = { arrayValue: { values: tagValues.length ? tagValues : [] } };

  return fields;
}

function firestoreDocToRecipe(doc) {
  if (!doc || !doc.fields) return null;
  var f = doc.fields;
  var parts = doc.name.split('/');
  return {
    id: parts[parts.length - 1],
    title: fsStr(f.title),
    servings: fsStr(f.servings),
    prepTime: fsStr(f.prepTime),
    cookTime: fsStr(f.cookTime),
    sourceUrl: fsStr(f.sourceUrl),
    notes: fsStr(f.notes),
    createdAt: fsInt(f.createdAt),
    updatedAt: fsInt(f.updatedAt),
    ingredients: fsArr(f.ingredients),
    instructions: fsArr(f.instructions),
    tags: fsArr(f.tags)
  };
}

function fsStr(val) {
  return (val && val.stringValue) ? val.stringValue : '';
}

function fsInt(val) {
  if (val && val.integerValue) return parseInt(val.integerValue, 10);
  return 0;
}

function fsArr(val) {
  var result = [];
  if (val && val.arrayValue && val.arrayValue.values) {
    var values = val.arrayValue.values;
    for (var i = 0; i < values.length; i++) {
      if (values[i].stringValue !== undefined) {
        result.push(values[i].stringValue);
      }
    }
  }
  return result;
}

// ============================================================
// RECIPE EXTRACTION
// ============================================================

function extractRecipe() {
  var urlInput = document.getElementById('extract-url');
  var url = urlInput.value.trim();
  var statusEl = document.getElementById('extract-status');

  if (!url) {
    statusEl.textContent = 'Please paste a URL first.';
    return;
  }

  statusEl.textContent = 'Extracting recipe...';
  document.getElementById('btn-extract').disabled = true;

  fetchWithFallback(url, function(html) {
    document.getElementById('btn-extract').disabled = false;
    if (!html) {
      statusEl.textContent = 'This site blocks recipe extraction. Please fill in the form manually below.';
      return;
    }
    var recipe = parseRecipeFromHTML(html);
    if (recipe) {
      populateEditForm(recipe);
      document.getElementById('edit-source').value = url;
      statusEl.textContent = 'Recipe extracted! Review and edit below.';
    } else {
      statusEl.textContent = 'No structured recipe data found on this page. Please fill in the form manually below.';
    }
  });
}

function fetchWithFallback(url, callback) {
  // Try corsproxy.io first
  var xhr1 = new XMLHttpRequest();
  xhr1.open('GET', 'https://corsproxy.io/?' + encodeURIComponent(url), true);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState !== 4) return;
    if (xhr1.status >= 200 && xhr1.status < 400 && xhr1.responseText) {
      callback(xhr1.responseText);
      return;
    }
    // Fall back to allorigins.win
    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'https://api.allorigins.win/get?url=' + encodeURIComponent(url), true);
    xhr2.onreadystatechange = function() {
      if (xhr2.readyState !== 4) return;
      if (xhr2.status >= 200 && xhr2.status < 400) {
        try {
          var data = JSON.parse(xhr2.responseText);
          callback(data.contents || null);
        } catch (e) {
          callback(null);
        }
      } else {
        callback(null);
      }
    };
    xhr2.send();
  };
  xhr1.send();
}

function parseRecipeFromHTML(html) {
  try {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var scripts = doc.querySelectorAll('script[type="application/ld+json"]');

    for (var i = 0; i < scripts.length; i++) {
      try {
        var json = JSON.parse(scripts[i].textContent);
        var recipe = findRecipeInJSON(json);
        if (recipe) return recipe;
      } catch (e) { /* skip bad JSON */ }
    }
  } catch (e) { /* DOMParser failed */ }
  return null;
}

function findRecipeInJSON(obj) {
  if (!obj) return null;

  // Direct Recipe object
  if (obj['@type'] === 'Recipe' || (typeof obj['@type'] === 'object' && obj['@type'].indexOf && obj['@type'].indexOf('Recipe') !== -1)) {
    return extractSchemaRecipe(obj);
  }

  // Array (could be @graph or top-level array)
  if (obj instanceof Array) {
    for (var i = 0; i < obj.length; i++) {
      var result = findRecipeInJSON(obj[i]);
      if (result) return result;
    }
  }

  // @graph
  if (obj['@graph']) {
    return findRecipeInJSON(obj['@graph']);
  }

  return null;
}

function extractSchemaRecipe(s) {
  var r = {};
  r.title = s.name || '';

  // Ingredients
  r.ingredients = [];
  if (s.recipeIngredient) {
    for (var i = 0; i < s.recipeIngredient.length; i++) {
      r.ingredients.push(s.recipeIngredient[i]);
    }
  }

  // Instructions
  r.instructions = [];
  if (s.recipeInstructions) {
    for (var i = 0; i < s.recipeInstructions.length; i++) {
      var step = s.recipeInstructions[i];
      if (typeof step === 'string') {
        r.instructions.push(step);
      } else if (step.itemListElement) {
        // HowToSection — check before .name to avoid grabbing section title
        for (var j = 0; j < step.itemListElement.length; j++) {
          var sub = step.itemListElement[j];
          if (typeof sub === 'string') r.instructions.push(sub);
          else if (sub.text) r.instructions.push(sub.text);
          else if (sub.name) r.instructions.push(sub.name);
        }
      } else if (step.text) {
        r.instructions.push(step.text);
      } else if (step.name) {
        r.instructions.push(step.name);
      }
    }
  }

  r.servings = '';
  if (s.recipeYield) {
    if (typeof s.recipeYield === 'string') {
      r.servings = s.recipeYield;
    } else if (s.recipeYield instanceof Array) {
      r.servings = s.recipeYield[0] || '';
    }
  }

  r.prepTime = parseDuration(s.prepTime);
  r.cookTime = parseDuration(s.cookTime);
  r.image = '';
  if (s.image) {
    if (typeof s.image === 'string') r.image = s.image;
    else if (s.image instanceof Array) r.image = s.image[0] || '';
    else if (s.image.url) r.image = s.image.url;
  }

  return r;
}

function parseDuration(iso) {
  if (!iso || typeof iso !== 'string') return '';
  var match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  var parts = [];
  if (match[1]) parts.push(match[1] + ' hr');
  if (match[2]) parts.push(match[2] + ' min');
  return parts.join(' ') || iso;
}

function populateEditForm(r) {
  document.getElementById('edit-title').value = r.title || '';
  document.getElementById('edit-servings').value = r.servings || '';
  document.getElementById('edit-prep').value = r.prepTime || '';
  document.getElementById('edit-cook').value = r.cookTime || '';
  document.getElementById('edit-ingredients').value = (r.ingredients || []).join('\n');
  document.getElementById('edit-instructions').value = (r.instructions || []).join('\n');
  document.getElementById('edit-tags').value = '';
  document.getElementById('edit-notes').value = '';
}

// ============================================================
// UI RENDERING
// ============================================================

function renderRecipeList() {
  var listEl = document.getElementById('recipe-list');
  var emptyEl = document.getElementById('empty-state');
  var searchVal = document.getElementById('search-input').value.toLowerCase();

  var filtered = [];
  for (var i = 0; i < recipes.length; i++) {
    var r = recipes[i];
    if (searchVal) {
      var match = false;
      if (r.title.toLowerCase().indexOf(searchVal) !== -1) match = true;
      if (!match && r.tags) {
        for (var j = 0; j < r.tags.length; j++) {
          if (r.tags[j].toLowerCase().indexOf(searchVal) !== -1) { match = true; break; }
        }
      }
      if (!match) continue;
    }
    filtered.push(r);
  }

  // Clear existing cards (keep empty state)
  var cards = listEl.querySelectorAll('.recipe-card');
  for (var i = 0; i < cards.length; i++) {
    listEl.removeChild(cards[i]);
  }

  if (filtered.length === 0 && recipes.length === 0) {
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  if (filtered.length === 0 && searchVal) {
    var noMatch = document.createElement('div');
    noMatch.className = 'recipe-card';
    noMatch.innerHTML = '<div class="recipe-card-title">No matches</div><div class="recipe-card-meta">Try a different search term</div>';
    listEl.appendChild(noMatch);
    return;
  }

  for (var i = 0; i < filtered.length; i++) {
    var r = filtered[i];
    var card = document.createElement('div');
    card.className = 'recipe-card';
    card.setAttribute('data-id', r.id);

    var metaParts = [];
    if (r.cookTime) metaParts.push(r.cookTime);
    if (r.servings) metaParts.push(r.servings + ' servings');

    var html = '<div class="recipe-card-title">' + escapeHtml(r.title) + '</div>';
    if (metaParts.length) {
      html += '<div class="recipe-card-meta">' + escapeHtml(metaParts.join(' · ')) + '</div>';
    }
    if (r.tags && r.tags.length) {
      html += '<div class="recipe-card-tags">' + escapeHtml(r.tags.join(', ')) + '</div>';
    }
    card.innerHTML = html;

    (function(recipeId) {
      card.onclick = function() { showRecipeDetail(recipeId); };
    })(r.id);

    listEl.appendChild(card);
  }
}

function filterRecipes() {
  renderRecipeList();
}

function showRecipeDetail(recipeId) {
  var recipe = null;
  for (var i = 0; i < recipes.length; i++) {
    if (recipes[i].id === recipeId) { recipe = recipes[i]; break; }
  }
  if (!recipe) return;

  currentRecipeId = recipeId;

  document.getElementById('detail-title').textContent = recipe.title;

  // Meta
  var meta = [];
  if (recipe.prepTime) meta.push('Prep: ' + recipe.prepTime);
  if (recipe.cookTime) meta.push('Cook: ' + recipe.cookTime);
  if (recipe.servings) meta.push('Servings: ' + recipe.servings);
  document.getElementById('detail-meta').textContent = meta.join(' · ');

  // Tags
  var tagsEl = document.getElementById('detail-tags');
  tagsEl.innerHTML = '';
  if (recipe.tags && recipe.tags.length) {
    for (var i = 0; i < recipe.tags.length; i++) {
      var span = document.createElement('span');
      span.textContent = recipe.tags[i];
      tagsEl.appendChild(span);
    }
  }

  // Ingredients
  var ingEl = document.getElementById('detail-ingredients');
  ingEl.innerHTML = '';
  for (var i = 0; i < recipe.ingredients.length; i++) {
    var li = document.createElement('li');
    li.textContent = recipe.ingredients[i];
    ingEl.appendChild(li);
  }

  // Instructions
  var instEl = document.getElementById('detail-instructions');
  instEl.innerHTML = '';
  for (var i = 0; i < recipe.instructions.length; i++) {
    var li = document.createElement('li');
    li.textContent = recipe.instructions[i];
    instEl.appendChild(li);
  }

  // Notes
  var notesSection = document.getElementById('detail-notes-section');
  if (recipe.notes) {
    document.getElementById('detail-notes').textContent = recipe.notes;
    notesSection.style.display = 'block';
  } else {
    notesSection.style.display = 'none';
  }

  // Source
  var sourceSection = document.getElementById('detail-source-section');
  if (recipe.sourceUrl) {
    document.getElementById('detail-source').href = recipe.sourceUrl;
    sourceSection.style.display = 'block';
  } else {
    sourceSection.style.display = 'none';
  }

  showView('detail');
}

function startAddRecipe() {
  if (!currentUser) {
    showToast('Please sign in first');
    showView('auth');
    return;
  }
  editingRecipeId = null;
  document.getElementById('edit-heading').textContent = 'Add Recipe';
  clearEditForm();
  showView('edit');
}

function editCurrentRecipe() {
  var recipe = null;
  for (var i = 0; i < recipes.length; i++) {
    if (recipes[i].id === currentRecipeId) { recipe = recipes[i]; break; }
  }
  if (!recipe) return;

  editingRecipeId = currentRecipeId;
  document.getElementById('edit-heading').textContent = 'Edit Recipe';
  document.getElementById('edit-title').value = recipe.title || '';
  document.getElementById('edit-servings').value = recipe.servings || '';
  document.getElementById('edit-prep').value = recipe.prepTime || '';
  document.getElementById('edit-cook').value = recipe.cookTime || '';
  document.getElementById('edit-ingredients').value = (recipe.ingredients || []).join('\n');
  document.getElementById('edit-instructions').value = (recipe.instructions || []).join('\n');
  document.getElementById('edit-tags').value = (recipe.tags || []).join(', ');
  document.getElementById('edit-notes').value = recipe.notes || '';
  document.getElementById('edit-source').value = recipe.sourceUrl || '';
  document.getElementById('extract-url').value = '';
  document.getElementById('extract-status').textContent = '';

  showView('edit');
}

function deleteCurrentRecipe() {
  if (currentRecipeId) {
    deleteRecipe(currentRecipeId);
  }
}

function cancelEdit() {
  editingRecipeId = null;
  if (currentRecipeId && currentView === 'edit') {
    showView('detail');
  } else {
    showView('list');
  }
}

function clearEditForm() {
  document.getElementById('edit-title').value = '';
  document.getElementById('edit-servings').value = '';
  document.getElementById('edit-prep').value = '';
  document.getElementById('edit-cook').value = '';
  document.getElementById('edit-ingredients').value = '';
  document.getElementById('edit-instructions').value = '';
  document.getElementById('edit-tags').value = '';
  document.getElementById('edit-notes').value = '';
  document.getElementById('edit-source').value = '';
  document.getElementById('extract-url').value = '';
  document.getElementById('extract-status').textContent = '';
}

// ============================================================
// TOAST
// ============================================================

var toastTimer = null;
function showToast(msg) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show';
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    el.className = 'toast';
  }, 2500);
}

// ============================================================
// XHR HELPERS
// ============================================================

function xhrPost(url, body, callback, authToken) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  if (authToken) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    var data = null;
    try { data = JSON.parse(xhr.responseText); } catch(e) {}
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, data);
    } else {
      callback(new Error('HTTP ' + xhr.status), data);
    }
  };
  xhr.send(body);
}

function xhrGet(url, authToken, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  if (authToken) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    var data = null;
    try { data = JSON.parse(xhr.responseText); } catch(e) {}
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, data);
    } else {
      callback(new Error('HTTP ' + xhr.status), data);
    }
  };
  xhr.send();
}

function xhrPatch(url, body, authToken, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('PATCH', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  if (authToken) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    var data = null;
    try { data = JSON.parse(xhr.responseText); } catch(e) {}
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, data);
    } else {
      callback(new Error('HTTP ' + xhr.status), data);
    }
  };
  xhr.send(body);
}

function xhrDelete(url, authToken, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', url, true);
  if (authToken) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    callback(null);
  };
  xhr.send();
}

// ============================================================
// UTILITY
// ============================================================

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
