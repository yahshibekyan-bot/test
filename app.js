const directions = [
  "Здоровье",
  "Карьера",
  "Финансы",
  "Отношения",
  "Семья",
  "Друзья",
  "Саморазвитие",
  "Отдых",
  "Духовность",
  "Творчество",
];

const statuses = [
  { id: "idea", label: "Идея" },
  { id: "progress", label: "В процессе" },
  { id: "done", label: "Готово" },
];

const state = {
  cards: [],
};

const board = document.getElementById("board");
const form = document.getElementById("card-form");
const directionSelect = form.querySelector("select[name='direction']");
const statusSelect = form.querySelector("select[name='status']");
const cardTemplate = document.getElementById("card-template");

const createOption = (value, text) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
};

const populateSelects = () => {
  directions.forEach((direction) => {
    directionSelect.appendChild(createOption(direction, direction));
  });

  statuses.forEach((status) => {
    statusSelect.appendChild(createOption(status.id, status.label));
  });
};

const createCard = ({ title, details, direction, status }) => ({
  id: crypto.randomUUID(),
  title,
  details,
  direction,
  status,
});

const renderBoard = () => {
  board.innerHTML = "";

  directions.forEach((direction) => {
    const section = document.createElement("section");
    section.className = "direction-section";

    const header = document.createElement("div");
    header.className = "direction-header";
    const title = document.createElement("h3");
    title.textContent = direction;
    const summary = document.createElement("span");
    const count = state.cards.filter((card) => card.direction === direction).length;
    summary.textContent = `Карточек: ${count}`;

    header.append(title, summary);

    const columns = document.createElement("div");
    columns.className = "status-columns";

    statuses.forEach((status) => {
      const column = document.createElement("div");
      column.className = "status-column";
      column.dataset.direction = direction;
      column.dataset.status = status.id;

      const columnTitle = document.createElement("h4");
      columnTitle.textContent = status.label;
      column.appendChild(columnTitle);

      const cards = state.cards.filter(
        (card) => card.direction === direction && card.status === status.id,
      );

      cards.forEach((card) => {
        column.appendChild(renderCard(card));
      });

      columns.appendChild(column);
    });

    section.append(header, columns);
    board.appendChild(section);
  });
};

const renderCard = (card) => {
  const fragment = cardTemplate.content.cloneNode(true);
  const cardEl = fragment.querySelector(".card");
  const title = fragment.querySelector(".card-title");
  const details = fragment.querySelector(".card-details");
  const statusLabel = fragment.querySelector(".card-status-label");

  cardEl.dataset.id = card.id;
  title.textContent = card.title;
  details.textContent = card.details || "Без описания";

  const statusText = statuses.find((item) => item.id === card.status)?.label ?? "";
  statusLabel.textContent = statusText;

  const editButton = fragment.querySelector("[data-action='edit']");
  const moveLeft = fragment.querySelector("[data-action='move-left']");
  const moveRight = fragment.querySelector("[data-action='move-right']");

  editButton.addEventListener("click", () => startEditCard(card.id, cardEl));
  moveLeft.addEventListener("click", () => moveCard(card.id, -1));
  moveRight.addEventListener("click", () => moveCard(card.id, 1));

  return fragment;
};

const moveCard = (cardId, direction) => {
  const index = state.cards.findIndex((card) => card.id === cardId);
  if (index === -1) return;

  const statusIndex = statuses.findIndex((status) => status.id === state.cards[index].status);
  const nextIndex = statusIndex + direction;
  if (nextIndex < 0 || nextIndex >= statuses.length) return;

  state.cards[index].status = statuses[nextIndex].id;
  renderBoard();
};

const startEditCard = (cardId, cardEl) => {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;

  cardEl.innerHTML = "";
  const form = document.createElement("form");
  form.className = "edit-form";

  const titleInput = document.createElement("input");
  titleInput.value = card.title;

  const detailsInput = document.createElement("textarea");
  detailsInput.rows = 2;
  detailsInput.value = card.details;

  const actions = document.createElement("div");
  actions.className = "edit-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.className = "save";
  saveButton.textContent = "Сохранить";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "cancel";
  cancelButton.textContent = "Отмена";

  actions.append(saveButton, cancelButton);
  form.append(titleInput, detailsInput, actions);
  cardEl.appendChild(form);

  cancelButton.addEventListener("click", () => renderBoard());
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    card.title = titleInput.value.trim() || "Без названия";
    card.details = detailsInput.value.trim();
    renderBoard();
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const title = formData.get("title").toString().trim();
  const details = formData.get("details").toString().trim();
  const direction = formData.get("direction").toString();
  const status = formData.get("status").toString();

  if (!title) return;

  state.cards.push(
    createCard({
      title,
      details,
      direction,
      status,
    }),
  );

  form.reset();
  renderBoard();
});

populateSelects();
renderBoard();
