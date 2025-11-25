const input = document.getElementById("typeahead");
const suggestionsList = document.getElementById("suggestions-list");

let timeoutId = null;
let controller = null;

const isCypress = window.Cypress !== undefined;

input.addEventListener("input", () => {
  const text = input.value.trim();

  if (timeoutId) clearTimeout(timeoutId);

  if (text === "") {
    clearSuggestions();
    return;
  }

  timeoutId = setTimeout(() => {
    fetchSuggestions(text);
  }, 500);
});

function fetchSuggestions(text) {
  if (!isCypress && controller) controller.abort();

  controller = new AbortController();

  const url = `https://api.frontendexpert.io/api/fe/glossary-suggestions?text=${encodeURIComponent(
    text
  )}`;

  fetch(url, { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => {
      renderSuggestions(data);
    })
    .catch((err) => {
      if (err.name !== "AbortError") console.error(err);
    });
}

function renderSuggestions(items) {
  clearSuggestions();
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;

    li.addEventListener("click", () => {
      input.value = item;
      clearSuggestions();
    });

    suggestionsList.appendChild(li);
  });
}

function clearSuggestions() {
  suggestionsList.innerHTML = "";
}
